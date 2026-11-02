import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import Settings from '@/models/Settings';
import { getSessionFromCookies } from '@/lib/auth';

// =============================================
// CREATE ORDER API Route â€” POST /api/orders/create
// =============================================
// Creates a new purchase order when a user wants to buy a course.
// Handles:
// - Coupon discount calculation
// - Points redemption
// - Final price calculation
// - Order record creation

export async function POST(req) {
  try {
    // User must be logged in to purchase
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please login to purchase courses' },
        { status: 401 }
      );
    }

    const { guideId, couponCode, redeemPoints, paymentGateway = 'test' } = await req.json();

    if (!guideId) {
      return NextResponse.json(
        { success: false, error: 'Guide ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Administrators have master DRM access and should not generate customer orders/leads
    if (user.role === 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Administrator accounts have full master access to all guides and cannot create consumer purchase orders.',
        },
        { status: 400 }
      );
    }

    // Find the course guide
    const guide = await Guide.findById(guideId);
    if (!guide || !guide.isActive) {
      return NextResponse.json({ success: false, error: 'Course guide is unavailable' }, { status: 404 });
    }

    // Check if user already owns this course
    const alreadyOwns = user.purchasedGuides.some(
      (p) => p.guideId.toString() === guide._id.toString()
    );
    if (alreadyOwns) {
      return NextResponse.json(
        { success: false, error: 'You already own this course guide' },
        { status: 400 }
      );
    }

    // Get platform settings (for points rates)
    const settings = await Settings.findOne() || {
      pointsEarnRate: 10,
      pointsRedeemRate: 0.5,
    };

    let totalAmount = guide.price;
    let discountAmount = 0;
    let pointsDiscount = 0;
    let pointsToRedeem = 0;

    // ---- Step 1: Apply Coupon Discount ----
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });

      if (coupon) {
        let isEligible = true;

        // Check if coupon is expired
        if (coupon.expiresAt && new Date() > coupon.expiresAt) isEligible = false;
        // Check if usage limit is reached
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) isEligible = false;
        // Check minimum order amount
        if (totalAmount < coupon.minOrderAmount) isEligible = false;

        if (isEligible) {
          if (coupon.discountType === 'percentage') {
            let disc = (totalAmount * coupon.discountValue) / 100;
            // Cap the discount at maxDiscount if set
            if (coupon.maxDiscount && disc > coupon.maxDiscount) {
              disc = coupon.maxDiscount;
            }
            discountAmount = Math.round(disc);
          } else {
            // Flat discount
            discountAmount = Math.min(coupon.discountValue, totalAmount);
          }
        }
      }
    }

    let remainingAfterCoupon = Math.max(0, totalAmount - discountAmount);

    // ---- Step 2: Apply Points Redemption ----
    if (redeemPoints && redeemPoints > 0) {
      const availableUserPoints = user.points || 0;
      pointsToRedeem = Math.min(redeemPoints, availableUserPoints);

      // Calculate how much â‚¹ discount the points give
      const potentialCashDiscount = pointsToRedeem * (settings.pointsRedeemRate || 0.5);
      pointsDiscount = Math.min(potentialCashDiscount, remainingAfterCoupon);

      // Adjust actual points needed (if order is already â‚¹0)
      pointsToRedeem = Math.ceil(pointsDiscount / (settings.pointsRedeemRate || 0.5));
    }

    // ---- Step 3: Calculate Final Amount ----
    const finalPayableAmount = Math.max(0, Math.round(remainingAfterCoupon - pointsDiscount));

    // Points earned on the amount actually paid
    const pointsEarned = Math.round((finalPayableAmount * (settings.pointsEarnRate || 10)) / 100);

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check Razorpay Configuration
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || settings.razorpayKeyId || '';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || settings.razorpayKeySecret || '';
    let razorpayOrderId = null;

    if (paymentGateway === 'razorpay' && razorpayKeyId && razorpayKeySecret && finalPayableAmount > 0) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({
            amount: finalPayableAmount * 100, // paise (₹99 -> 9900 paise)
            currency: 'INR',
            receipt: orderNumber,
            notes: {
              guideTitle: guide.title,
              customerEmail: user.email,
            },
          }),
        });

        const rzpData = await rzpRes.json();
        if (rzpData && rzpData.id) {
          razorpayOrderId = rzpData.id;
        } else {
          console.error('Razorpay order creation response:', rzpData);
        }
      } catch (rzpErr) {
        console.error('Razorpay API request error:', rzpErr);
      }
    }

    // ---- Step 4: Create Order Record ----
    const order = await Order.create({
      orderNumber,
      userId: user._id,
      guideId: guide._id,
      guideTitle: guide.title,
      guideCover: guide.coverImage,
      amount: finalPayableAmount,
      originalPrice: guide.price,
      discountAmount: discountAmount + pointsDiscount,
      pointsRedeemed: pointsToRedeem,
      pointsEarned,
      couponCode: couponCode || '',
      paymentGateway,
      paymentGatewayOrderId: razorpayOrderId || `${paymentGateway.toUpperCase()}_ORDER_${Date.now()}`,
      status: 'pending',
      customerDetails: {
        name: user.name,
        email: user.email,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        guideTitle: guide.title,
        originalPrice: guide.price,
        couponDiscount: discountAmount,
        pointsDiscount,
        pointsRedeemed: pointsToRedeem,
        pointsEarned,
        amount: finalPayableAmount,
        paymentGateway,
        paymentGatewayOrderId: order.paymentGatewayOrderId,
        razorpayOrderId,
        razorpayKeyId: razorpayKeyId || '',
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
