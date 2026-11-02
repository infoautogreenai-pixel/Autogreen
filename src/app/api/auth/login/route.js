import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';

// Helper to create JSON response with Set-Cookie header directly attached
function createAuthResponse(payload, userObj) {
  const token = signToken(payload);
  const response = NextResponse.json({
    success: true,
    user: userObj,
  });

  // Explicitly set cookie on NextResponse so browser receives Set-Cookie header
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: false, // Works on localhost and live HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}

// =============================================
// LOGIN API Route — POST /api/auth/login
// =============================================
// Strictly authenticates user / admin credentials directly from MongoDB database.
// No hardcoded emails and no hardcoded fallback passwords.
export async function POST(req) {
  try {
    const body = await req.json();
    const identifier = (body.email || body.username || '').toString().trim();
    const password = (body.password || '').toString().trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Username and password are required' },
        { status: 400 }
      );
    }

    const normalizedIdentifier = identifier.toLowerCase();

    // 1. Connect to MongoDB database
    await connectToDatabase();

    // 2. Find user in MongoDB database
    // Matches by email (case-insensitive) or by role if "admin" keyword entered
    let dbUser = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { email: { $regex: new RegExp(`^${normalizedIdentifier}$`, 'i') } },
        ...(normalizedIdentifier === 'admin' || normalizedIdentifier === 'autogreenai.com' ? [{ role: 'admin' }] : []),
      ],
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    // 3. Verify password hash directly from MongoDB
    if (!dbUser.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Password hash not configured in database' },
        { status: 401 }
      );
    }

    const isPasswordMatch = await comparePassword(password, dbUser.passwordHash);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    // 4. Password matches database record! Generate authenticated session
    const tokenPayload = {
      userId: dbUser._id.toString(),
      email: dbUser.email,
      role: dbUser.role || 'user',
      name: dbUser.name || 'User',
    };

    return createAuthResponse(tokenPayload, {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      points: dbUser.points || 0,
    });
  } catch (error) {
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
