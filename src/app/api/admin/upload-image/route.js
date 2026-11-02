import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { savePublicImage } from '@/lib/storage';

export async function POST(req) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const validImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    const isImage = validImageTypes.includes(file.type) || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name || '');
    if (!isImage) {
      return NextResponse.json({ success: false, error: 'Only image files (PNG, JPG, WEBP, GIF, SVG) are permitted' }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'Image size exceeds maximum 10MB limit' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saved = await savePublicImage(buffer, file.name);

    return NextResponse.json({
      success: true,
      url: saved.url,
      fileName: saved.fileName,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    const msg = error instanceof Error ? error.message : 'Image upload failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

