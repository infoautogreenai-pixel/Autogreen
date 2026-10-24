import mongoose, { Schema } from 'mongoose';

// =============================================
// Guide (Course) Model (Database Schema)
// =============================================
// This model defines how course guides are stored in MongoDB.
// Each guide represents a digital course that users can purchase
// and read as a PDF.
//
// Key concepts:
// - pdfFiles: Array of PDF files attached to this course (stored securely)
// - previewPages: How many pages free users can see before buying
// - slug: URL-friendly version of the title (e.g., "nextjs-handbook")

// Sub-schema for PDF file metadata
const PdfFileSchema = new Schema({
  fileName: { type: String, required: true },   // Original file name
  fileKey: { type: String, required: true },     // Secure storage identifier (NOT a public URL!)
  fileSize: { type: Number, default: 0 },        // File size in bytes
  pageCount: { type: Number, default: 1 },       // Number of pages in the PDF
  order: { type: Number, default: 0 },           // Display order (for multiple PDFs)
});

// Main schema for course guides
const GuideSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },                    // Course title
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // URL-friendly name
    description: { type: String, required: true },                          // Full description
    shortDescription: { type: String, required: true },                     // Brief summary for cards
    coverImage: { type: String, required: true },                           // Cover image URL
    price: { type: Number, required: true, min: 0 },                       // Selling price (₹)
    originalPrice: { type: Number, min: 0 },                                // Original price (for showing discount)
    category: { type: String, required: true, index: true },                // e.g., "Web Development"
    tags: [{ type: String, trim: true }],                                   // Tags for search/filter
    previewPages: { type: Number, default: 2 },                             // Free preview pages count
    pdfFiles: [PdfFileSchema],                                              // Array of PDF files
    isActive: { type: Boolean, default: true, index: true },                // Is course published?
    isFeatured: { type: Boolean, default: false, index: true },             // Show on homepage?
    rating: { type: Number, default: 4.8 },                                 // Average rating (out of 5)
    reviewsCount: { type: Number, default: 0 },                             // Total reviews
    salesCount: { type: Number, default: 0 },                               // Total sales
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
    highlights: [{ type: String }],                                         // Key selling points
    badge: { type: String, default: '' },                                   // e.g. "LEARN AI", "EXECUTE WITH AI"
    topBadge: { type: String, default: '' },                                // e.g. "Most Powerful"
    ctaText: { type: String, default: '' },                                 // e.g. "Start with Starter →"
    dotColor: { type: String, default: 'emerald' },                         // "emerald", "amber", "rose"
    popular: { type: Boolean, default: false },                             // Highlight card as most powerful
    orderIndex: { type: Number, default: 0 },                               // Sort order for homepage display
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create the model (or reuse if already exists)
const Guide = mongoose.models.Guide || mongoose.model('Guide', GuideSchema);

export default Guide;
