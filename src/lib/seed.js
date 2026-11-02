import connectToDatabase from './db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import Coupon from '@/models/Coupon';
import Settings from '@/models/Settings';
import { hashPassword } from './auth';
import { ensureAiMarketerKits } from './kits-init';

// =============================================
// Database Seeder
// =============================================
// Creates essential baseline configuration:
// 1. Platform settings (Razorpay live configuration)
// 2. Discount coupons (WELCOME50, PRO20, MEGA50)
// 3. Admin user account (admin@autogreenai.com)
// 4. Core AI Marketer Kits (Starter ₹99, Pro ₹599, Expert ₹1,299)

export async function seedDatabase() {
  await connectToDatabase();
  console.log('--- Starting Database Seeding ---');

  // ==========================================
  // Step 1: Create Platform Settings
  // ==========================================
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      platformName: 'AutoGreen AI',
      pointsEarnRate: 10,
      pointsRedeemRate: 0.5,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_TvPpdFfoOWK8Zu',
      razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'k0Bog8dI8VqBCBUmNLIt1UmH',
      razorpayEnabled: true,
      testGatewayEnabled: true,
      supportEmail: 'admin@autogreenai.com',
    });
    console.log('Created Platform Settings');
  }

  // ==========================================
  // Step 2: Create Discount Coupons
  // ==========================================
  const defaultCoupons = [
    {
      code: 'WELCOME50',
      discountType: 'flat',
      discountValue: 50,
      minOrderAmount: 299,
      isActive: true,
      usageLimit: 5000,
    },
    {
      code: 'PRO20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 399,
      maxDiscount: 200,
      isActive: true,
      usageLimit: 1000,
    },
    {
      code: 'MEGA50',
      discountType: 'percentage',
      discountValue: 50,
      minOrderAmount: 599,
      maxDiscount: 350,
      isActive: true,
      usageLimit: 500,
    },
  ];

  for (const c of defaultCoupons) {
    const exists = await Coupon.findOne({ code: c.code });
    if (!exists) {
      await Coupon.create(c);
      console.log(`Created Coupon: ${c.code}`);
    }
  }

  // ==========================================
  // Step 3: Create Admin User (if not exists)
  // ==========================================
  let admin = await User.findOne({ role: 'admin' });
  const adminPassHash = await hashPassword('Autogreen@2026');
  if (!admin) {
    admin = await User.create({
      name: 'AutoGreen Admin',
      email: 'admin@autogreenai.com',
      passwordHash: adminPassHash,
      role: 'admin',
      points: 1000,
      pointsHistory: [
        { type: 'earned', amount: 1000, reason: 'Initial Admin Bonus', date: new Date() },
      ],
      purchasedGuides: [],
    });
    console.log('Created Admin: admin@autogreenai.com');
  }

  // ==========================================
  // Step 4: Ensure Core AI Marketer Kits (₹99, ₹599, ₹1,299)
  // ==========================================
  await ensureAiMarketerKits();

  console.log('--- Database Seeding Complete ---');
  return { success: true };
}
