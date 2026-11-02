import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Guide from '@/models/Guide';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// ADMIN STATS API Route — GET /api/admin/stats
// =============================================
// Returns live, real dynamic dashboard statistics for the admin panel:
// - Total genuine customer revenue, today's revenue, monthly revenue
// - Registered customer leads/users (excludes admins)
// - Total guides, active guides
// - Category-wise sales distribution
// - Real daily revenue chart data (last 14 days)
// - Recent real customer orders

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    // ---- 1. Customer Leads / Registered Users (Exclude Admins) ----
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalGuides = await Guide.countDocuments();
    const activeGuides = await Guide.countDocuments({ isActive: true });

    // Exclude any internal admin email orders if any exist
    const adminFilter = {
      'customerDetails.email': { $nin: ['admin@autogreenai.com', 'admin@example.com'] },
    };

    // Customer Orders & Real Revenue
    const totalOrders = await Order.countDocuments({
      ...adminFilter,
      status: 'success',
    });

    const successfulOrders = await Order.find({
      ...adminFilter,
      status: 'success',
    });

    // Calculate total revenue and points distributed
    const totalRevenue = successfulOrders.reduce((sum, ord) => sum + (ord.amount || 0), 0);
    const totalPointsDistributed = successfulOrders.reduce((sum, ord) => sum + (ord.pointsEarned || 0), 0);

    // ---- 2. Today and this month revenue ----
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayOrders = successfulOrders.filter((o) => new Date(o.createdAt) >= startOfToday);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const monthOrders = successfulOrders.filter((o) => new Date(o.createdAt) >= startOfMonth);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    // ---- 3. Category-wise sales distribution ----
    const categoryStats = await Guide.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalSales: { $sum: '$salesCount' } } },
      { $sort: { totalSales: -1 } },
    ]);

    // ---- 4. Last 14 days dynamic revenue chart data ----
    const dailyRevenueMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyRevenueMap[key] = 0;
    }

    successfulOrders.forEach((ord) => {
      const d = new Date(ord.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in dailyRevenueMap) {
        dailyRevenueMap[key] += ord.amount || 0;
      }
    });

    const revenueChartData = Object.entries(dailyRevenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    // ---- 5. Recent 5 genuine customer orders ----
    const recentOrders = await Order.find(adminFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        monthRevenue,
        totalOrders,
        totalUsers,
        totalGuides,
        activeGuides,
        totalPointsDistributed,
      },
      categoryStats,
      revenueChartData,
      recentOrders,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch admin stats';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
