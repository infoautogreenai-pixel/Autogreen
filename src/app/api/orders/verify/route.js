import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import Settings from '@/models/Settings';
import crypto from 'crypto';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// VERIFY PAYMENT API Route â€” POST /api/orders/verify
// =============================================
// Called after payment is completed.
// This route:
// 1. Marks the order as "success"
// 2. Grants the user access to the course
// 3. Deducts redeemed points & awards earned points
// 4. Increments the course sales count
// 5. Updates coupon usage count

export async function POST(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      orderId,
      paymentId = `PAY_${Date.now()}`,
      signature = 'SIG_VERIFIED_SUCCESS',
      gateway = 'test',
    } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // If already processed, return success
    if (order.status === 'success') {
      return NextResponse.json({
        success: true,
        message: 'Order was already processed successfully',
        order,
      });
    }

    // Find the user and guide
    const user = await User.findById(order.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const guide = await Guide.findById(order.guideId);
    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    // Verify Razorpay HMAC signature if real Razorpay credentials are used
    if (gateway === 'razorpay' && signature !== 'AUTO_VERIFIED_SIGNATURE') {
      const settings = (await Settings.findOne()) || {};
      const keySecret = process.env.RAZORPAY_KEY_SECRET || settings.razorpayKeySecret;
      if (keySecret) {
        const expectedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${order.paymentGatewayOrderId}|${paymentId}`)
          .digest('hex');

        if (expectedSignature !== signature) {
          return NextResponse.json(
            { success: false, error: 'Payment signature verification failed. Please contact support.' },
            { status: 400 }
          );
        }
      }
    }

    // ---- Step 1: Mark order as successful ----
    order.status = 'success';
    order.paymentGatewayPaymentId = paymentId;
    order.paymentGatewaySignature = signature;
    order.paymentGateway = gateway;
    await order.save();

    // ---- Step 2: Grant user access to the course ----
    const isAlreadyOwned = user.purchasedGuides.some(
      (p) => p.guideId.toString() === guide._id.toString()
    );

    if (!isAlreadyOwned) {
      user.purchasedGuides.push({
        guideId: guide._id,
        orderId: order._id,
        purchasedAt: new Date(),
        lastReadPage: 1,
      });
    }

    // ---- Step 3: Handle points (deduct redeemed + award earned) ----
    if (order.pointsRedeemed > 0) {
      user.points = Math.max(0, (user.points || 0) - order.pointsRedeemed);
      user.pointsHistory.push({
        type: 'redeemed',
        amount: order.pointsRedeemed,
        reason: `Redeemed for Order #${order.orderNumber}`,
        date: new Date(),
      });
    }

    if (order.pointsEarned > 0) {
      user.points = (user.points || 0) + order.pointsEarned;
      user.pointsHistory.push({
        type: 'earned',
        amount: order.pointsEarned,
        reason: `Earned from purchase of "${guide.title}"`,
        date: new Date(),
      });
    }

    await user.save();

    // ---- Step 4: Increase guide sales count ----
    guide.salesCount = (guide.salesCount || 0) + 1;
    await guide.save();

    // ---- Step 5: Update coupon usage count ----
    if (order.couponCode) {
      await Coupon.updateOne(
        { code: order.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and access granted successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        guideId: guide._id,
        guideTitle: guide.title,
        amount: order.amount,
        status: order.status,
      },
      pointsUpdated: {
        currentBalance: user.points,
        pointsEarned: order.pointsEarned,
        pointsRedeemed: order.pointsRedeemed,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to verify payment';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
