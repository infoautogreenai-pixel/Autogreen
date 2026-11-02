'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  FileText,
  Upload,
  X,
  ShieldCheck,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  // Quick PDF direct upload state
  const [quickUploadingId, setQuickUploadingId] = useState(null);
  const quickPdfInputRef = useRef(null);
  const [quickUploadTargetGuide, setQuickUploadTargetGuide] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [formError, setFormError] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI Marketing Toolkits');
  const [price, setPrice] = useState(99);
  const [originalPrice, setOriginalPrice] = useState(299);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  );
  const [level, setLevel] = useState('Beginner');
  const [badge, setBadge] = useState('LEARN AI');
  const [topBadge, setTopBadge] = useState('');
  const [ctaText, setCtaText] = useState('Start with Starter →');
  const [previewPages, setPreviewPages] = useState(2);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [tags, setTags] = useState('AI Tools, Prompts, Starter');
  const [highlights, setHighlights] = useState(
    '200+ AI tools\n100+ prompts\nClaude Skills\nBeginner workflows\nClaude walkthroughs\nNotion Starter System\nn8n introduction\nAI Marketer Community'
  );
  const [pdfFiles, setPdfFiles] = useState([]);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/guides');
      const data = await res.json();
      if (data.success && data.guides) {
        setGuides(data.guides);
      }
    } catch (err) {
      console.error('Error fetching admin guides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // Quick Direct PDF Upload for any guide
  const triggerQuickPdfUpload = (guide) => {
    setQuickUploadTargetGuide(guide);
    if (quickPdfInputRef.current) {
      quickPdfInputRef.current.value = '';
      quickPdfInputRef.current.click();
    }
  };

  const handleQuickPdfSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !quickUploadTargetGuide) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    setQuickUploadingId(quickUploadTargetGuide._id);
    setStatusMessage({ type: 'info', text: `Uploading and securing PDF for "${quickUploadTargetGuide.title}"...` });

    try {
      // 1. Upload the PDF file to secure storage
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/admin/guides/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload PDF file');
      }

      // 2. Attach new PDF to the guide in MongoDB
      const newPdfFile = {
        fileName: uploadData.file.fileName,
        fileKey: uploadData.file.fileKey,
        fileSize: uploadData.file.fileSize,
        pageCount: uploadData.file.pageCount || 1,
        order: 0,
      };

      const updateRes = await fetch(`/api/admin/guides/${quickUploadTargetGuide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfFiles: [newPdfFile],
        }),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok || !updateData.success) {
        throw new Error(updateData.error || 'Failed to attach PDF to guide in database');
      }

      setStatusMessage({
        type: 'success',
        text: `Successfully uploaded and secured "${uploadData.file.fileName}" for ${quickUploadTargetGuide.title}! It is now active for buyers.`,
      });
      await fetchGuides();
    } catch (err) {
      console.error('Quick PDF upload error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Error uploading PDF file' });
    } finally {
      setQuickUploadingId(null);
      setQuickUploadTargetGuide(null);
    }
  };

  const openCreateModal = () => {
    setEditingGuide(null);
    setTitle('');
    setCategory('AI Marketing Toolkits');
    setPrice(99);
    setOriginalPrice(299);
    setShortDescription('');
    setDescription('');
    setCoverImage(
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    );
    setLevel('Beginner');
    setBadge('LEARN AI');
    setTopBadge('');
    setCtaText('Start with Starter →');
    setPreviewPages(2);
    setIsActive(true);
    setIsFeatured(true);
    setTags('AI Tools, Prompts, Starter');
    setHighlights(
      '200+ AI tools\n100+ prompts\nClaude Skills\nBeginner workflows\nClaude walkthroughs\nNotion Starter System\nn8n introduction\nAI Marketer Community'
    );
    setPdfFiles([]);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (g) => {
    setEditingGuide(g);
    setTitle(g.title);
    setCategory(g.category);
    setPrice(g.price);
    setOriginalPrice(g.originalPrice || g.price * 2);
    setShortDescription(g.shortDescription || '');
    setDescription(g.description || '');
    setCoverImage(g.coverImage || '');
    setLevel(g.level || 'Beginner');
    setBadge(g.badge || '');
    setTopBadge(g.topBadge || '');
    setCtaText(g.ctaText || '');
    setPreviewPages(g.previewPages ?? 2);
    setIsActive(g.isActive ?? true);
    setIsFeatured(g.isFeatured ?? false);
    setTags(Array.isArray(g.tags) ? g.tags.join(', ') : '');
    setHighlights(Array.isArray(g.highlights) ? g.highlights.join('\n') : '');
    setPdfFiles(g.pdfFiles || []);
    setFormError(null);
    setModalOpen(true);
  };

  // Upload image file
  const uploadImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && !/\.(png|jpe?g|webp|gif|svg)$/i.test(file.name)) {
      setFormError('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG)');
      return;
    }
    setUploadingCover(true);
    setFormError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }
      setCoverImage(data.url);
    } catch (err) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadImageFile(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadImageFile(file);
  };

  // Upload PDF inside modal
  const uploadPdfFile = async (file) => {
    if (!file) return;
    if (!file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFormError('Please select a valid PDF file');
      return;
    }
    setUploadingPdf(true);
    setFormError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/guides/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload PDF');
      }
      setPdfFiles((prev) => [
        ...prev,
        {
          fileName: data.file.fileName,
          fileKey: data.file.fileKey,
          fileSize: data.file.fileSize,
          pageCount: data.file.pageCount || 1,
          order: prev.length,
        },
      ]);
    } catch (err) {
      setFormError(err.message || 'PDF upload failed');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadPdfFile(file);
  };

  const handlePdfDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPdf(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadPdfFile(file);
  };

  const handleRemovePdfFile = (index) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGuide = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      title,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice),
      shortDescription,
      description,
      coverImage,
      level,
      badge,
      topBadge,
      ctaText,
      previewPages: Number(previewPages),
      isActive,
      isFeatured,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      highlights: highlights.split('\n').map((h) => h.trim()).filter(Boolean),
      pdfFiles,
    };

    try {
      const url = editingGuide ? `/api/admin/guides/${editingGuide._id}` : '/api/admin/guides';
      const method = editingGuide ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save guide');
      }
      setModalOpen(false);
      setStatusMessage({
        type: 'success',
        text: `"${title}" has been saved successfully!`,
      });
      fetchGuides();
    } catch (err) {
      setFormError(err.message || 'Error saving guide');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGuide = async (id, guideTitle) => {
    if (
      !confirm(
        `Are you sure you want to delete "${guideTitle}"? This will remove all attached protected PDF files.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'info', text: `"${guideTitle}" deleted.` });
        fetchGuides();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Identify the 3 Core Selling Tiers
  const starterGuide =
    guides.find((g) => g.slug === 'ai-marketer-starter-kit') ||
    guides.find((g) => g._id?.toString() === '6adc8def486c185f0a88bdd2') ||
    guides.find((g) => g.title.toLowerCase().includes('starter')) ||
    guides.find((g) => Number(g.price) === 99);

  const proGuide =
    guides.find((g) => g.slug === 'ai-marketer-pro-kit') ||
    guides.find((g) => g._id?.toString() === '6adc8def486c185f0a88bdd5') ||
    guides.find((g) => g.title.toLowerCase().includes('pro') && !g.title.toLowerCase().includes('micro')) ||
    guides.find((g) => Number(g.price) === 599);

  const expertGuide =
    guides.find((g) => g.slug === 'ai-marketer-expert-stack') ||
    guides.find((g) => g._id?.toString() === '6adc8def486c185f0a88bdd8') ||
    guides.find((g) => g.title.toLowerCase().includes('expert')) ||
    guides.find((g) => Number(g.price) === 1299);

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Hidden global input for 1-click PDF uploads */}
      <input
        ref={quickPdfInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleQuickPdfSelected}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              PDF Monetization & DRM Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Kits & PDF Sales Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Upload custom PDFs to the ₹99, ₹599, and ₹1,299 tiers, set dynamic pricing, and monitor DRM reader delivery for buyers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGuides}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all border border-slate-800"
            title="Refresh from MongoDB"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Guide</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`rounded-xl p-4 text-xs flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-950/70 border-rose-800/80 text-rose-200'
              : 'bg-cyan-950/70 border-cyan-800/80 text-cyan-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            ) : (
              <Loader2 className="h-4 w-4 text-cyan-400 animate-spin shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. THREE CORE MONETIZATION TIERS SHOWCASE (₹99, ₹599, ₹1,299)              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Core Monetization Tiers</span>
            </h2>
            <p className="text-xs text-slate-400">
              Directly attach your custom digital PDFs and sell them to customers instantly
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Starter Kit (₹99) */}
          {starterGuide ? (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 space-y-4 transition-all relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                    {starterGuide.badge || 'LEARN AI'}
                  </span>
                  <span className="font-mono text-xs text-slate-400">Starter Tier</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base line-clamp-1">{starterGuide.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white font-mono">₹{starterGuide.price}</span>
                    <span className="text-xs text-slate-500 line-through">₹{starterGuide.originalPrice || 299}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between">
                  <span className="text-slate-400">Protected PDF:</span>
                  {starterGuide.pdfFiles?.length > 0 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate max-w-[170px]">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span className="truncate">{starterGuide.pdfFiles[0].fileName}</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>No PDF Attached</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => triggerQuickPdfUpload(starterGuide)}
                  disabled={quickUploadingId === starterGuide._id}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{quickUploadingId === starterGuide._id ? 'Uploading...' : 'Quick Attach PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(starterGuide)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit Settings"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <Link
                  href={`/dashboard/reader/${starterGuide._id}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open DRM Reader"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs text-slate-400">Starter Tier (₹99) not found</span>
              <button
                onClick={openCreateModal}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
              >
                + Create ₹99 Tier
              </button>
            </div>
          )}

          {/* Pro Kit (₹599) */}
          {proGuide ? (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 space-y-4 transition-all relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                    {proGuide.badge || 'EXECUTE WITH AI'}
                  </span>
                  <span className="font-mono text-xs text-slate-400">Pro Tier</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base line-clamp-1">{proGuide.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white font-mono">₹{proGuide.price}</span>
                    <span className="text-xs text-slate-500 line-through">₹{proGuide.originalPrice || 1499}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between">
                  <span className="text-slate-400">Protected PDF:</span>
                  {proGuide.pdfFiles?.length > 0 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate max-w-[170px]">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span className="truncate">{proGuide.pdfFiles[0].fileName}</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>No PDF Attached</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => triggerQuickPdfUpload(proGuide)}
                  disabled={quickUploadingId === proGuide._id}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{quickUploadingId === proGuide._id ? 'Uploading...' : 'Quick Attach PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(proGuide)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit Settings"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <Link
                  href={`/dashboard/reader/${proGuide._id}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open DRM Reader"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs text-slate-400">Pro Tier (₹599) not found</span>
              <button
                onClick={openCreateModal}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
              >
                + Create ₹599 Tier
              </button>
            </div>
          )}

          {/* Expert Stack (₹1,299) */}
          {expertGuide ? (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 space-y-4 transition-all relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                    {expertGuide.badge || 'BUILD WITH AI'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 uppercase">
                    BEST VALUE
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base line-clamp-1">{expertGuide.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white font-mono">₹{expertGuide.price}</span>
                    <span className="text-xs text-slate-500 line-through">₹{expertGuide.originalPrice || 2999}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between">
                  <span className="text-slate-400">Protected PDF:</span>
                  {expertGuide.pdfFiles?.length > 0 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate max-w-[170px]">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span className="truncate">{expertGuide.pdfFiles[0].fileName}</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>No PDF Attached</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => triggerQuickPdfUpload(expertGuide)}
                  disabled={quickUploadingId === expertGuide._id}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{quickUploadingId === expertGuide._id ? 'Uploading...' : 'Quick Attach PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(expertGuide)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit Settings"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <Link
                  href={`/dashboard/reader/${expertGuide._id}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open DRM Reader"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs text-slate-400">Expert Tier (₹1,299) not found</span>
              <button
                onClick={openCreateModal}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
              >
                + Create ₹1,299 Tier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & ALL GUIDES / COURSES CATALOG                                   */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 max-w-md w-full text-xs">
            <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Filter courses by title, slug, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-white">{filteredGuides.length}</strong> of {guides.length} Guides in Catalog
          </span>
        </div>

        {/* Guides Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <span className="text-xs font-mono text-slate-400">Loading Course Guides...</span>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-12 text-center text-xs text-slate-400 space-y-3">
            <BookOpen className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-200 text-sm">No course guides found</p>
            <p className="text-slate-500 max-w-sm mx-auto">
              {search
                ? 'No results matched your search query.'
                : 'Click "+ Add New Guide" above to upload your first course guide and attach a PDF.'}
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Guide</span>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Course / Kit Title</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 font-semibold">Protected PDF Status</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredGuides.map((g) => (
                    <tr key={g._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              g.coverImage ||
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={g.title}
                            className="h-10 w-14 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                          />
                          <div className="min-w-0">
                            <span className="line-clamp-1 text-xs font-bold text-white">{g.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">/{g.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-700/50">
                          {g.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono">
                          <span className="font-bold text-white text-sm">₹{g.price}</span>
                          {g.originalPrice && g.originalPrice > g.price && (
                            <span className="text-[10px] text-slate-500 line-through ml-1.5">
                              ₹{g.originalPrice}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {g.pdfFiles?.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg w-fit">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate max-w-[150px] font-medium">{g.pdfFiles[0].fileName}</span>
                            <span className="text-[10px] text-emerald-500 font-mono">
                              ({(g.pdfFiles[0].fileSize / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => triggerQuickPdfUpload(g)}
                            className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/40 hover:bg-amber-900/50 px-2.5 py-1 rounded-lg transition-colors font-medium"
                          >
                            <Upload className="h-3 w-3 text-amber-400" />
                            <span>Attach PDF</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            g.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {g.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => triggerQuickPdfUpload(g)}
                            disabled={quickUploadingId === g._id}
                            className="p-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-800/40 transition-colors"
                            title="Quick Attach / Replace PDF"
                          >
                            <Upload className="h-3.5 w-3.5" />
                          </button>
                          <Link
                            href={`/dashboard/reader/${g._id}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Preview DRM Reader"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(g)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Guide"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGuide(g._id, g.title)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors"
                            title="Delete Guide"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD / EDIT GUIDE COMPREHENSIVE MODAL (POPUP)                            */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-hidden">
          <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#090f1d] border border-slate-700 shadow-2xl text-slate-200 overflow-hidden">
            {/* 1. FIXED MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {editingGuide ? `Edit: ${editingGuide.title}` : 'Create New Guide / Kit'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configure pricing, DRM-protected PDFs, badges, and marketing highlights
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message if any */}
            {formError && (
              <div className="mx-6 mt-4 rounded-xl bg-rose-950/70 border border-rose-800 p-3 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* 2. SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveGuide} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar">
              {/* SECTION A: Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                    1
                  </span>
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Basic Info & Classification
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Course / Kit Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI Marketer Starter Kit (PDF Edition)"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Category</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. AI Marketing Toolkits"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Target Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Beginner">Beginner (Starter)</option>
                      <option value="Intermediate">Intermediate (Pro)</option>
                      <option value="Advanced">Advanced (Expert)</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION B: Pricing & Badges */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                    2
                  </span>
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Pricing, Badges & Call to Action
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Original / Strike Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="299"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-slate-400 font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Badge Label (e.g. LEARN AI)</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="LEARN AI, EXECUTE WITH AI, BUILD WITH AI"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Top Floating Badge (Optional)</label>
                    <input
                      type="text"
                      value={topBadge}
                      onChange={(e) => setTopBadge(e.target.value)}
                      placeholder="e.g. Most Powerful, Best Value"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Button CTA Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Start with Starter →, Go Pro →, Become an AI Operator →"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* SECTION C: Descriptions & Highlights */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                    3
                  </span>
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Descriptions & Highlights
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Short Summary</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Essential starter toolkit for AI marketing..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Full Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="In-depth overview of what is taught and included..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-300">Card Highlights / Features (One per line)</label>
                    <span className="text-[10px] text-slate-500">Rendered on kit card</span>
                  </div>
                  <textarea
                    rows={4}
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    placeholder="200+ AI tools&#10;100+ prompts&#10;Claude Skills"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="AI Tools, Prompts, Starter"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* SECTION D: Media Assets & Protected PDF */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                    4
                  </span>
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Cover Image & DRM Protected PDF
                  </span>
                </div>

                {/* Cover Image */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={handleImageDrop}
                  className={`p-4 rounded-xl bg-slate-950 border transition-all space-y-3 ${
                    isDraggingImage
                      ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-emerald-400" />
                      <span>Cover Image (Drag & Drop or URL)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>

                  {coverImage && (
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImage} alt="Cover preview" className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 rounded-lg bg-slate-900 border border-slate-800 py-1.5 px-3 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0">
                      {uploadingCover ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      <span>Upload</span>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        disabled={uploadingCover}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* PDF Protected Files */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(true);
                  }}
                  onDragLeave={() => setIsDraggingPdf(false)}
                  onDrop={handlePdfDrop}
                  className={`p-4 rounded-xl bg-slate-950 border transition-all space-y-3 ${
                    isDraggingPdf
                      ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="font-bold text-white">
                        Protected PDF Documents ({pdfFiles.length})
                      </span>
                    </div>
                    <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md">
                      {uploadingPdf ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      <span>Upload PDF</span>
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfUpload}
                        disabled={uploadingPdf}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {pdfFiles.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">
                      No PDF file attached yet. Upload a .pdf document (it will be stored strictly in private encrypted storage).
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pdfFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="font-medium text-white truncate">{file.fileName}</span>
                            <span className="text-[10px] text-slate-500 shrink-0">
                              ({(file.fileSize / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePdfFile(idx)}
                            className="text-rose-400 hover:underline text-[11px] ml-2 shrink-0 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION E: Switches */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-white font-medium">Published (Visible in store)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-white font-medium">Featured Product</span>
                </label>
              </div>
            </form>

            {/* 3. FIXED MODAL FOOTER */}
            <div className="border-t border-slate-800 px-6 py-4 bg-slate-900/90 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                {pdfFiles.length > 0 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{pdfFiles.length} Protected PDF attached</span>
                  </span>
                ) : (
                  <span className="text-amber-400">⚠️ No PDF attached yet</span>
                )}
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGuide}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
