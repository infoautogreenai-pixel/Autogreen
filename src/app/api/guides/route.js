import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';
import { seedDatabase } from '@/lib/seed';
import { ensureAiMarketerKits } from '@/lib/kits-init';

// =============================================
// LIST GUIDES API Route — GET /api/guides
// =============================================
// Returns all active course guides.
// Supports filtering by: category, level, search text, sort order.
// If no guides exist yet, automatically seeds the database with demo data.

export async function GET(req) {
  try {
    await connectToDatabase();

    // Ensure core AI Marketer tiers (Starter ₹99, Pro ₹599, Expert ₹1,299) exist in DB
    try {
      await ensureAiMarketerKits();
    } catch (kitInitErr) {
      console.warn('Kit initialization notice:', kitInitErr.message);
    }

    // Auto-seed if database is empty (first time setup)
    const count = await Guide.countDocuments();
    if (count === 0) {
      console.log('No guides found in DB, auto-seeding sample courses...');
      await seedDatabase();
    }

    // Read query parameters from the URL
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const level = searchParams.get('level');
    const sort = searchParams.get('sort') || 'featured';

    // Build the filter object for MongoDB query
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (level && level !== 'All') {
      filter.level = level;
    }

    // Search in title, description, and tags
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },             // Case-insensitive search
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Query the database (hide the secure fileKey from response!)
    let query = Guide.find(filter).select('-pdfFiles.fileKey');

    // Apply sorting
    if (sort === 'price-low') {
      query = query.sort({ price: 1 });                          // Cheapest first
    } else if (sort === 'price-high') {
      query = query.sort({ price: -1 });                         // Most expensive first
    } else if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });                     // Newest first
    } else if (sort === 'popular') {
      query = query.sort({ salesCount: -1, rating: -1 });        // Most popular first
    } else {
      // Default: AI Marketer core kits first (orderIndex: 1, 2, 3), then featured, then newest
      query = query.sort({ orderIndex: 1, isFeatured: -1, rating: -1, createdAt: -1 });
    }

    const guides = await query.exec();

    // Get all unique categories for the filter dropdown
    const categories = await Guide.distinct('category', { isActive: true });

    return NextResponse.json({
      success: true,
      guides,
      categories: ['All', ...categories],
    });
  } catch (error) {
    console.error('Fetch guides error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch guides' }, { status: 500 });
  }
}
