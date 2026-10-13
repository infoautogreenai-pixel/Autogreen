import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { comparePassword, setAuthCookie } from '@/lib/auth';

// =============================================
// LOGIN API Route — POST /api/auth/login
// =============================================
// This handles user login.
// Steps:
// 1. Get email and password from the request body
// 2. Check if it matches demo credentials (for testing)
// 3. If not demo, look up user in database
// 4. Compare password with stored hash
// 5. If match, create JWT token and set cookie
// 6. Return user info

export async function POST(req) {
  try {
    // Get email and password from request body
    const { email, password } = await req.json();

    // Check: both fields are required
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Clean up the email (lowercase, remove spaces)
    const normalizedEmail = email.toLowerCase().trim();

    // ----- Admin Login (Fast Bypass / Fallback) -----
    const isAdminEmail = [
      'autogreenai.com',
      'admin@autogreenai.com',
      'admin@example.com',
      'admin@autogreen.ai'
    ].includes(normalizedEmail);

    if (isAdminEmail && (password === 'Autogreen@2026' || password === 'admin123')) {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'AutoGreen Admin',
        email: normalizedEmail,
        role: 'admin',
        points: 500,
      };

      // Create token and set cookie
      await setAuthCookie({
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
        },
      });
    }

    // ----- Demo Student Login (for testing without database) -----
    if ((normalizedEmail === 'student@example.com' || normalizedEmail === 'user@example.com' || normalizedEmail === 'student@autogreen.ai') && password === 'student123') {
      const user = {
        _id: '507f1f77bcf86cd799439012',
        name: 'Demo Student / Operator',
        email: normalizedEmail,
        role: 'user',
        points: 250,
      };

      await setAuthCookie({
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
        },
      });
    }

    // ----- Real Database Login -----
    let user = null;
    try {
      await connectToDatabase();
      user = await User.findOne({ email: normalizedEmail });
    } catch (dbErr) {
      console.warn('Database connection unavailable:', dbErr);
    }

    // User not found in database
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    } else {
      // Compare the entered password with the stored hash
      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Password matches! Create token and set cookie
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    await setAuthCookie(tokenPayload);

    // Return success with user info
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
