import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

// =============================================
// LOGOUT API Route — POST /api/auth/logout
// =============================================
export async function POST() {
  await removeAuthCookie();
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('auth_token');
  return response;
}
