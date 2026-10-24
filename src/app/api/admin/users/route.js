import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// ADMIN USERS API Route — GET /api/admin/users
// =============================================
// Returns all users for the admin panel.
// Supports search by name or email.
// Also returns all active guides (for granting access).

export async function GET(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Get users (without password hash) and populate their purchased guides info
    const users = await User.find(filter)
      .select('-passwordHash')                                          // Don't send passwords!
      .populate('purchasedGuides.guideId', 'title slug price coverImage') // Get guide details
      .sort({ createdAt: -1 })
      .exec();

    // Get all active guides (for the "grant access" dropdown)
    const allGuides = await Guide.find({ isActive: true }).select('title _id price slug').exec();

    return NextResponse.json({
      success: true,
      users,
      allGuides,
    });
  } catch (error) {
    console.error('Admin fetch users error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Create a new user (admin or regular user)
export async function POST(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { name, email, password, role = 'user' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const { hashPassword } = await import('@/lib/auth');
    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'user',
      points: 100,
      pointsHistory: [
        {
          type: 'earned',
          amount: 100,
          reason: 'Initial Admin Welcome Bonus',
          date: new Date(),
        },
      ],
      purchasedGuides: [],
    });

    return NextResponse.json({
      success: true,
      message: `User created successfully with role: ${newUser.role}`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PATCH: Toggle or update user role (admin <-> user)
export async function PATCH(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'User ID and new role are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    user.role = role === 'admin' ? 'admin' : 'user';
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Role for ${user.email} updated to ${user.role}`,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin update role error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update role';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Delete a user
export async function DELETE(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (userId === session.userId) {
      return NextResponse.json({ success: false, error: 'Cannot delete yourself' }, { status: 400 });
    }

    await connectToDatabase();
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to delete user';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
