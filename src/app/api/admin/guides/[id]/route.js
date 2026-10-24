import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Guide from '@/models/Guide';
import { getSessionFromCookies } from '@/lib/auth';
import { deletePdfFile } from '@/lib/storage';

// =============================================
// ADMIN SINGLE GUIDE API Route — /api/admin/guides/[id]
// =============================================
// Admin-only routes for a specific guide.
// GET = Get guide details
// PUT = Update guide
// DELETE = Delete guide (and its PDF files)

// ----- GET: Get single guide details -----
export async function GET(req, { params }) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();
    const guide = await Guide.findById(id);

    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, guide });
  } catch (error) {
    console.error('Admin get guide error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to fetch guide';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ----- PUT: Update an existing guide -----
export async function PUT(req, { params }) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const updates = await req.json();

    await connectToDatabase();
    const guide = await Guide.findById(id);

    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    // Update only the fields that were sent
    if (updates.title) guide.title = updates.title.trim();
    if (updates.description) guide.description = updates.description.trim();
    if (updates.shortDescription) guide.shortDescription = updates.shortDescription.trim();
    if (updates.coverImage) guide.coverImage = updates.coverImage;
    if (updates.price !== undefined) guide.price = Number(updates.price);
    if (updates.originalPrice !== undefined) guide.originalPrice = Number(updates.originalPrice) || undefined;
    if (updates.category) guide.category = updates.category.trim();
    if (updates.level) guide.level = updates.level;
    if (updates.previewPages !== undefined) guide.previewPages = Number(updates.previewPages);
    if (updates.isActive !== undefined) guide.isActive = Boolean(updates.isActive);
    if (updates.isFeatured !== undefined) guide.isFeatured = Boolean(updates.isFeatured);
    if (updates.tags) guide.tags = Array.isArray(updates.tags) ? updates.tags : updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (updates.pdfFiles) guide.pdfFiles = updates.pdfFiles;
    if (updates.highlights) guide.highlights = Array.isArray(updates.highlights) ? updates.highlights : [];
    if (updates.badge !== undefined) guide.badge = updates.badge;
    if (updates.topBadge !== undefined) guide.topBadge = updates.topBadge;
    if (updates.ctaText !== undefined) guide.ctaText = updates.ctaText;
    if (updates.dotColor !== undefined) guide.dotColor = updates.dotColor;
    if (updates.popular !== undefined) guide.popular = Boolean(updates.popular);
    if (updates.orderIndex !== undefined) guide.orderIndex = Number(updates.orderIndex);

    await guide.save();

    return NextResponse.json({ success: true, guide });
  } catch (error) {
    console.error('Admin update guide error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update guide';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// ----- DELETE: Delete a guide and its PDF files -----
export async function DELETE(req, { params }) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();
    const guide = await Guide.findById(id);

    if (!guide) {
      return NextResponse.json({ success: false, error: 'Guide not found' }, { status: 404 });
    }

    // Delete the physical PDF files from storage
    for (const file of guide.pdfFiles) {
      if (file.fileKey) {
        await deletePdfFile(file.fileKey);
      }
    }

    // Delete the guide from database
    await Guide.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Guide deleted successfully' });
  } catch (error) {
    console.error('Admin delete guide error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to delete guide';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
