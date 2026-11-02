import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getSessionFromCookies, verifyToken } from '@/lib/auth';

// =============================================
// GET CURRENT USER API Route — GET /api/auth/me
// =============================================
export async function GET(req) {
  try {
    // 1. Try reading cookie from incoming request headers
    let session = null;
    const reqToken = req?.cookies?.get?.('auth_token')?.value;
    if (reqToken) {
      session = verifyToken(reqToken);
    }

    // 2. Fallback to Next.js cookies() store
    if (!session) {
      session = await getSessionFromCookies();
    }

    if (!session) {
      return NextResponse.json({ success: false, user: null });
    }

    // 3. Query MongoDB for latest user data
    let user = null;
    try {
      await connectToDatabase();
      if (session.userId) {
        user = await User.findById(session.userId).select('-passwordHash');
      }
      if (!user && session.email) {
        user = await User.findOne({ email: session.email }).select('-passwordHash');
      }
    } catch (dbErr) {
      console.warn('Database query error in /api/auth/me route, using session payload:', dbErr.message || dbErr);
    }

    // Return MongoDB user data if found
    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || null,
          points: user.points || 0,
          pointsHistory: user.pointsHistory || [],
          purchasedGuides: user.purchasedGuides || [],
          createdAt: user.createdAt,
        },
      });
    }

    // Fallback if not found in MongoDB or offline
    if (session.role === 'admin') {
      return NextResponse.json({
        success: true,
        user: {
          id: session.userId || '6acdefda1f8707853716aa51',
          name: session.name || 'AutoGreen Admin',
          email: session.email || 'admin@autogreenai.com',
          role: 'admin',
          avatar: null,
          points: 1000,
          pointsHistory: [],
          purchasedGuides: [],
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        name: session.name || 'Member',
        email: session.email,
        role: session.role || 'user',
        avatar: null,
        points: 250,
        pointsHistory: [],
        purchasedGuides: [],
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Session me error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
