'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Tag,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Coins,
  BookOpen,
  Briefcase,
  Zap,
  Check,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();

  const guideIdParam = searchParams.get('guideId') || searchParams.get('id');
  const tierParam = searchParams.get('tier');
  const priceParam = searchParams.get('price');

  const [guide, setGuide] = useState(null);
  const [allKits, setAllKits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checkout inputs
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [usePoints, setUsePoints] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  // Fetch available guides / kits
  useEffect(() => {
    async function fetchCheckoutData() {
      setLoading(true);
      try {
        // Fetch all guides to match
        const res = await fetch('/api/guides');
        const data = await res.json();
        const guides = data.guides || [];
        setAllKits(guides);

        let selected = null;

        // 1. Try guideId or id param
        if (guideIdParam) {
          selected = guides.find(
            (g) =>
              (g.id && g.id.toString() === guideIdParam.toString()) ||
              (g._id && g._id.toString() === guideIdParam.toString()) ||
              g.slug === guideIdParam
          );
        }

        // 2. Try matching by tierParam (e.g. starter, 99, pro, 599, expert, 1299)
        if (!selected && tierParam) {
          const norm = tierParam.toLowerCase().trim();
          selected =
            guides.find(
              (g) =>
                (norm === 'starter' || norm === '99') &&
                (g.slug === 'ai-marketer-starter-kit' ||
                  Number(g.price) === 99 ||
                  g.title.toLowerCase().includes('starter'))
            ) ||
            guides.find(
              (g) =>
                (norm === 'pro' || norm === '599') &&
                (g.slug === 'ai-marketer-pro-kit' ||
                  Number(g.price) === 599 ||
                  g.title.toLowerCase().includes('pro'))
            ) ||
            guides.find(
              (g) =>
                (norm === 'expert' || norm === '1299') &&
                (g.slug === 'ai-marketer-expert-stack' ||
                  Number(g.price) === 1299 ||
                  g.title.toLowerCase().includes('expert'))
            ) ||
            guides.find(
              (g) =>
                g.title.toLowerCase().includes(norm) ||
                g.slug.toLowerCase().includes(norm) ||
                String(g.price) === norm
            );
        }

        // 3. Try priceParam (e.g. price=99 or price=599 or price=1299)
        if (!selected && priceParam) {
          const numPrice = Number(priceParam);
          selected = guides.find((g) => Number(g.price) === numPrice);
        }

        // 4. Default Fallback: ALWAYS default to AI Marketer Starter (₹99) first!
        if (!selected) {
          selected =
            guides.find(
              (g) =>
                g.slug === 'ai-marketer-starter-kit' ||
                Number(g.price) === 99 ||
                g.title.toLowerCase().includes('starter')
            ) ||
            guides.find(
              (g) =>
                g.slug === 'ai-marketer-pro-kit' ||
                Number(g.price) === 599 ||
                g.title.toLowerCase().includes('pro')
            ) ||
            guides.find(
              (g) =>
                g.slug === 'ai-marketer-expert-stack' ||
                Number(g.price) === 1299 ||
                g.title.toLowerCase().includes('expert')
            ) ||
            guides[0];
        }

        setGuide(selected);
      } catch (err) {
        console.error('Error loading checkout guide:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCheckoutData();
  }, [guideIdParam, tierParam, priceParam]);

  // Check if user already owns this guide
  const isAlreadyOwned =
    user?.purchasedGuides?.some(
      (p) =>
        guide &&
        (p.guideId?._id?.toString() === (guide._id || guide.id)?.toString() ||
          p.guideId?.toString() === (guide._id || guide.id)?.toString())
    ) || false;

  // Coupon handling
  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !guide) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: guide.price,
        }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        setCouponError(null);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Error validating coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  // Price calculations
  const basePrice = guide?.price || 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const priceAfterCoupon = Math.max(0, basePrice - couponDiscount);

  // Points redemption (100 pts = ₹50 or $50 equiv)
  const userPoints = user?.points || 0;
  const pointsRedeemRate = 0.5; // each point = 0.5 unit discount
  const maxPointsToRedeem = Math.min(
    userPoints,
    Math.ceil(priceAfterCoupon / pointsRedeemRate)
  );
  const pointsDiscount = usePoints
    ? Math.min(priceAfterCoupon, maxPointsToRedeem * pointsRedeemRate)
    : 0;

  const finalPayable = Math.max(0, Math.round(priceAfterCoupon - pointsDiscount));

  // Payment Execution
  const handleCompletePayment = async () => {
    if (!user) {
      // User is not logged in: send them to login with return redirect
      const currentUrl = `/checkout?guideId=${guide?._id || guide?.id}&tier=${encodeURIComponent(
        guide?.title || ''
      )}`;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (isAlreadyOwned) {
      router.push(`/dashboard/reader/${guide._id || guide.id}`);
      return;
    }

    // Admin protection: admins should not create customer leads or orders
    if (user?.role === 'admin') {
      setCheckoutError('Administrator accounts have master access to all materials and do not create customer purchase leads.');
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      // 1. Create order
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide._id || guide.id,
          couponCode: appliedCoupon?.code || '',
          redeemPoints: usePoints ? maxPointsToRedeem : 0,
          paymentGateway: selectedGateway,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize order');
      }

      // Helper to dynamically load Razorpay Checkout script
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if (typeof window !== 'undefined' && window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      // 2. If Razorpay is selected and live order generated, open Razorpay Modal
      if (
        selectedGateway === 'razorpay' &&
        orderData.order.razorpayOrderId &&
        orderData.order.razorpayKeyId
      ) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Unable to load Razorpay Checkout. Please check your internet connection.');
        }

        const options = {
          key: orderData.order.razorpayKeyId,
          amount: orderData.order.amount * 100,
          currency: 'INR',
          name: 'AutoGreen AI',
          description: guide.title,
          image: guide.coverImage || 'https://autogreenai.com/favicon.ico',
          order_id: orderData.order.razorpayOrderId,
          prefill: {
            name: user.name || '',
            email: user.email || '',
          },
          theme: {
            color: '#059669', // Emerald brand
          },
          handler: async function (response) {
            setIsProcessing(true);
            try {
              const verifyRes = await fetch('/api/orders/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: orderData.order.id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  gateway: 'razorpay',
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyData.success) {
                throw new Error(verifyData.error || 'Payment confirmation failed');
              }

              confetti({
                particleCount: 130,
                spread: 90,
                origin: { y: 0.6 },
              });

              setPaymentSuccess(verifyData.order);
              await refreshUser();
            } catch (err) {
              setCheckoutError(err.message || 'Payment execution failed');
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setCheckoutError(resp?.error?.description || 'Payment was declined or failed.');
          setIsProcessing(false);
        });
        rzp.open();
        return;
      }

      // 3. Fallback / Test Sandbox Instant Activation
      const verifyRes = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.order.id,
          paymentId: `PAY_${Date.now()}_${selectedGateway.toUpperCase()}`,
          signature: 'AUTO_VERIFIED_SIGNATURE',
          gateway: selectedGateway,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error || 'Payment confirmation failed');
      }

      // 3. Trigger Confetti
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.6 },
      });

      setPaymentSuccess(verifyData.order);
      await refreshUser();
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Payment execution failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-xs font-mono text-emerald-400">Loading Secure Checkout...</p>
        </div>
      </div>
    );
  }

  // SUCCESS CONFIRMATION SCREEN
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white py-16 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-xl w-full rounded-3xl bg-slate-900/90 border border-emerald-900/60 p-8 sm:p-10 text-center shadow-2xl relative z-10 space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 mx-auto">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
              Order Confirmed & Activated
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              You Now Own {guide?.title}!
            </h1>
            <p className="text-xs text-slate-300 mt-2">
              Your digital license, DRM streaming access, and course materials are now permanently linked to your account.
            </p>
          </div>

          {/* Receipt Breakdown */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between text-slate-400">
              <span>Order Number</span>
              <span className="font-mono text-white">{paymentSuccess.orderNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Customer Account</span>
              <span className="text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Amount Paid</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                ₹{paymentSuccess.amount}
              </span>
            </div>
            {paymentSuccess.pointsEarned > 0 && (
              <div className="flex justify-between text-amber-400 pt-2 border-t border-slate-800 font-medium">
                <span className="flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5" />
                  <span>Cashback Points Earned</span>
                </span>
                <span className="font-mono">+{paymentSuccess.pointsEarned} pts</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-3">
            <Link
              href={`/dashboard/reader/${guide?._id || guide?.id}`}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <BookOpen className="h-4 w-4" />
              <span>Open DRM Reader & Start Reading</span>
            </Link>

            <div className="flex items-center justify-center gap-4 text-xs">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                View My Library
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/dashboard/orders" className="text-slate-400 hover:text-white transition-colors">
                View Invoices & Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 sm:py-14 px-4 sm:px-6 lg:px-8 relative selection:bg-emerald-500 selection:text-black">
      {/* Background glow */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/#kits"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Kits & Courses</span>
          </Link>
        </div>

        {/* ======================================================== */}
        {/* User Login Notification Banner (if not logged in)       */}
        {/* ======================================================== */}
        {!user && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Login Required to Complete Purchase
                </h3>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Sign in or create a free account so your purchased kit can be stored in your DRM library. Multiple users supported!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href={`/login?redirect=${encodeURIComponent(
                  `/checkout?guideId=${guide?._id || guide?.id}&tier=${encodeURIComponent(
                    guide?.title || ''
                  )}`
                )}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Log In Now
              </Link>
              <Link
                href={`/signup?redirect=${encodeURIComponent(
                  `/checkout?guideId=${guide?._id || guide?.id}&tier=${encodeURIComponent(
                    guide?.title || ''
                  )}`
                )}`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT: Item Details & Tier Selector                      */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Selected Item Card */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>{guide?.category || 'AI Toolkit'}</span>
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>DRM Secured</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {guide?.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {guide?.description || guide?.shortDescription}
                </p>
              </div>

              {/* What is Included Checklist */}
              {guide?.highlights?.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-2.5">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    What You Will Receive Instantly:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {guide.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Already Owned Alert */}
              {isAlreadyOwned && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>You already own this course kit!</span>
                  </div>
                  <Link
                    href={`/dashboard/reader/${guide._id || guide.id}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Open Reader â†’
                  </Link>
                </div>
              )}
            </div>

            
          </div>

          {/* ======================================================== */}
          {/* RIGHT: Price Summary, Coupon & Purchase CTA             */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                <span>Order Summary</span>
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs border-b border-slate-800 pb-5">
                <div className="flex justify-between text-slate-400">
                  <span>Regular Price</span>
                  <span className="line-through">
                    ₹{(guide?.originalPrice || (guide?.price ? guide.price * 2 : 299))?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Base Price</span>
                  <span className="font-mono text-white font-bold">
                    ₹{basePrice?.toLocaleString('en-IN')}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      <span>Promo ({appliedCoupon.code})</span>
                    </span>
                    <span className="font-mono">-₹{couponDiscount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {usePoints && pointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span className="flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5" />
                      <span>Points Discount ({maxPointsToRedeem} pts)</span>
                    </span>
                    <span className="font-mono">-₹{pointsDiscount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Final Payable</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                      ₹{finalPayable?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">one-time payment</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Have a Promo / Coupon Code?
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{appliedCoupon.code} applied (-₹{couponDiscount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME50 or PRO20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white uppercase placeholder:normal-case placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      disabled={couponLoading || !couponCode.trim()}
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs disabled:opacity-50 transition-colors"
                    >
                      {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Reward Points Redemption (if logged in and has points) */}
              {user && userPoints > 0 && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Coins className="h-4 w-4 text-amber-400" />
                      <span>Available Points: {userPoints} pts</span>
                    </span>
                    <input
                      type="checkbox"
                      id="usePointsCheck"
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.target.checked)}
                      className="h-4 w-4 rounded accent-emerald-500"
                    />
                  </div>
                  <label htmlFor="usePointsCheck" className="text-[11px] text-slate-400 block cursor-pointer">
                    Redeem up to {maxPointsToRedeem} points for extra discount
                  </label>
                </div>
              )}

              {/* Payment Gateway Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Select Payment Method
                </label>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('razorpay')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      selectedGateway === 'razorpay'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="h-4 w-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-white flex items-center gap-2">
                          <span>UPI, Cards & Netbanking (Razorpay)</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold uppercase tracking-wider">
                            Active
                          </span>
                        </span>
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                          Google Pay, PhonePe, Paytm, QR Code, Cards & Netbanking
                        </span>
                      </div>
                    </div>
                    {selectedGateway === 'razorpay' && (
                      <Check className="h-4 w-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('test')}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      selectedGateway === 'test'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <div>
                        <span>⚡ Sandbox Demo Mode (1-Click Test)</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Instant access for testing without entering test cards
                        </span>
                      </div>
                    </div>
                    {selectedGateway === 'test' && (
                      <Check className="h-4 w-4 text-emerald-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {checkoutError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* MAIN CTA BUTTON */}
              {user?.role === 'admin' ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Administrator Account Detected</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      You are logged in with administrator privileges. Admins have direct access to all guides without placing orders or generating leads.
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/reader/${guide?._id || guide?.id || guide?.slug}`}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Open in DRM Reader (Full Admin Access)</span>
                  </Link>
                </div>
              ) : user ? (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleCompletePayment}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Activating Digital Access...</span>
                    </>
                  ) : isAlreadyOwned ? (
                    <>
                      <BookOpen className="h-4 w-4" />
                      <span>Already Owned • Open Reader</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Purchase & Access Kit (₹{finalPayable?.toLocaleString('en-IN') || finalPayable})</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(
                    `/checkout?guideId=${guide?._id || guide?.id}&tier=${encodeURIComponent(
                      guide?.title || ''
                    )}`
                  )}`}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Log In to Complete Purchase (₹{finalPayable?.toLocaleString('en-IN') || finalPayable})</span>
                </Link>
              )}

              <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted • Lifetime Cloud Access</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
