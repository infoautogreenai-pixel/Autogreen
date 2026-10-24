import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';

// =============================================
// AI MARKETER KITS API ROUTE — GET /api/kits
// =============================================
// Returns the 3 dynamic AI Marketer Kit tiers for the homepage
// and anywhere pricing is rendered.

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    // Query the 3 kits by category or IDs
    const kitIds = [
      '6adc8def486c185f0a88bdd2',
      '6adc8def486c185f0a88bdd5',
      '6adc8def486c185f0a88bdd8',
    ];

    let guides = await Guide.find({
      $or: [
        { _id: { $in: kitIds } },
        { category: 'AI Marketing Toolkits' },
        { slug: { $in: ['ai-marketer-starter-kit', 'ai-marketer-pro-kit', 'ai-marketer-community-kit', 'ai-marketer-expert-stack'] } }
      ]
    })
      .select('-pdfFiles.fileKey')
      .sort({ orderIndex: 1, price: 1 })
      .lean();

    // Format for the UI
    const tiers = guides.map((g) => {
      const isExpert = g.title.toLowerCase().includes('expert') || g.popular || g.slug.includes('expert');
      const isPro = g.title.toLowerCase().includes('pro') || g.title.toLowerCase().includes('community') || g.slug.includes('pro');

      return {
        id: g._id.toString(),
        guideId: g._id.toString(),
        name: g.title,
        slug: g.slug,
        badge: g.badge || (isExpert ? 'BUILD WITH AI' : isPro ? 'EXECUTE WITH AI' : 'LEARN AI'),
        topBadge: g.topBadge || (isExpert ? 'Most Powerful' : ''),
        dotColor: g.dotColor || (isExpert ? 'rose' : isPro ? 'amber' : 'emerald'),
        price: `₹${Number(g.price).toLocaleString('en-IN')}`,
        numericPrice: Number(g.price),
        originalPrice: g.originalPrice ? `₹${Number(g.originalPrice).toLocaleString('en-IN')}` : null,
        description: g.description,
        features: g.highlights && g.highlights.length > 0 ? g.highlights : [
          '200+ AI tools',
          '100+ prompts',
          'Claude Skills',
          'Beginner workflows',
          'Claude walkthroughs',
          'Notion Starter System',
          'n8n introduction',
          'AI Marketer Community'
        ],
        cta: g.ctaText || (isExpert ? 'Become an AI Operator →' : isPro ? 'Go Pro →' : 'Start with Starter →'),
        popular: Boolean(g.popular || isExpert),
      };
    });

    return NextResponse.json({
      success: true,
      count: tiers.length,
      tiers,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error('Fetch kits error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch kits' },
      { status: 500 }
    );
  }
}
