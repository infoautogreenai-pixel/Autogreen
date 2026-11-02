import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams?.filename;
    if (!filename) {
      return new NextResponse('File not found', { status: 404 });
    }

    const safeName = path.basename(filename);
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeName);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

