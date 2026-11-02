import fs from 'fs';
import path from 'path';

// =============================================
// Secure PDF & Public Uploads Storage Helper
// =============================================
// This file handles saving, reading, and deleting files
// on the server's file system.

// Path to the secure storage folder (outside of /public for security)
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'secure_pdfs');

// Path to public uploads folder (for public assets like cover images)
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Make sure the storage folder exists.
 * If it doesn't exist, create it automatically.
 */
export function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Make sure the public uploads folder exists.
 */
export function ensurePublicUploadsDir() {
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Save a PDF file to secure storage.
 * 
 * @param {Buffer} buffer - The PDF file data (binary content)
 * @param {string} fileName - Original name of the file
 * @returns {Promise<Object>} - { fileKey: unique file name, fileSize: size in bytes }
 */
export async function savePdfFile(buffer, fileName) {
  ensureStorageDir();

  const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(STORAGE_DIR, safeName);

  await fs.promises.writeFile(filePath, buffer);
  const stats = await fs.promises.stat(filePath);

  return {
    fileKey: safeName,
    fileSize: stats.size,
  };
}

/**
 * Save an image file to public uploads.
 * 
 * @param {Buffer} buffer - Image file data
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} - { fileName: unique file name, url: public path }
 */
export async function savePublicImage(buffer, fileName) {
  ensurePublicUploadsDir();

  const ext = path.extname(fileName).toLowerCase() || '.png';
  const baseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = `${Date.now()}_${baseName}${ext}`;
  const filePath = path.join(PUBLIC_UPLOADS_DIR, safeName);

  await fs.promises.writeFile(filePath, buffer);

  return {
    fileName: safeName,
    url: `/uploads/${safeName}`,
  };
}

/**
 * Read a PDF file from secure storage and return its data.
 * 
 * @param {string} fileKey - The unique file identifier (from savePdfFile)
 * @returns {Promise<Buffer|null>} - File data as Buffer, or null if not found
 */
export async function getPdfBuffer(fileKey) {
  ensureStorageDir();

  const safeKey = path.basename(fileKey);
  const filePath = path.join(STORAGE_DIR, safeKey);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.promises.readFile(filePath);
}

/**
 * Delete a PDF file from secure storage.
 * 
 * @param {string} fileKey - The unique file identifier
 * @returns {Promise<boolean>} - true if deleted successfully, false otherwise
 */
export async function deletePdfFile(fileKey) {
  try {
    ensureStorageDir();
    const safeKey = path.basename(fileKey);
    const filePath = path.join(STORAGE_DIR, safeKey);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (err) {
    console.error('Error deleting PDF file:', err);
  }
  return false;
}
