import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

// =============================================
// Authentication Helper Functions
// =============================================
// This file handles everything related to user login/security:
// - Creating JWT tokens (like a digital ID card)
// - Checking JWT tokens
// - Hashing passwords (converting password to unreadable text for safety)
// - Managing cookies (small data stored in browser)
// - Getting the currently logged-in user info

// Secret key used to create and verify JWT tokens
// In production, this should be a strong random string stored in .env
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-pdf-course-secret-jwt-key-2026';

// Name of the cookie where we store the auth token
const TOKEN_COOKIE_NAME = 'auth_token';

/**
 * Create a JWT token for a user.
 * Think of it like creating a digital ID card with user info inside.
 * 
 * @param {Object} payload - User info to put in the token { userId, email, role, name }
 * @returns {string} - The generated JWT token string
 */
export function signToken(payload) {
  // Token expires in 7 days — user will need to login again after that
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode a JWT token.
 * Like checking if a digital ID card is real and not expired.
 * 
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} - User info if token is valid, null if invalid/expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Hash a password (convert it to unreadable text for safe storage).
 * We NEVER store plain passwords in the database!
 * 
 * Example: "mypassword123" → "$2a$10$xK8f..." (unreadable)
 * 
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(password) {
  // Salt = random extra text added before hashing (makes it more secure)
  // 10 = number of rounds (higher = more secure but slower)
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain password with a hashed one.
 * Used during login to check if the entered password matches.
 * 
 * @param {string} password - Plain text password (user entered)
 * @param {string} hash - Hashed password (from database)
 * @returns {Promise<boolean>} - true if passwords match, false if not
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Set the auth cookie in the user's browser.
 * Called after successful login/signup.
 * 
 * @param {Object} payload - User info { userId, email, role, name }
 * @returns {string} - The generated token
 */
export async function setAuthCookie(payload) {
  const token = signToken(payload);
  const cookieStore = await cookies();

  // In localhost/dev or non-HTTPS, secure must be false so browsers don't reject the cookie over HTTP
  const isHttps = process.env.NODE_ENV === 'production' &&
                  Boolean(process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT || process.env.RENDER) &&
                  !process.env.NEXT_PUBLIC_APP_URL?.includes('localhost');

  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return token;
}

/**
 * Remove the auth cookie (used for logout).
 */
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

/**
 * Get the logged-in user's session data from cookies.
 * Returns null if user is not logged in.
 * 
 * @returns {Promise<Object|null>} - User session data or null
 */
export async function getSessionFromCookies() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    // No token found = user is not logged in
    if (!token) return null;

    // Verify and return the token data
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Get the full user document from database for the currently logged-in user.
 * 
 * @returns {Promise<Object|null>} - Full user data from DB, or null if not logged in
 */
export async function getCurrentUser() {
  const session = await getSessionFromCookies();
  if (!session) return null;

  await connectToDatabase();
  const user = await User.findById(session.userId);
  return user;
}

/**
 * Extract session from an API request (checks cookie or Authorization header).
 * Useful for API routes that need to verify who is making the request.
 * 
 * @param {Request} req - The incoming request object
 * @returns {Object|null} - Session data or null
 */
export function extractSessionFromRequest(req) {
  // Check cookie first, then check Authorization header (Bearer token)
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value ||
                req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return null;
  return verifyToken(token);
}
