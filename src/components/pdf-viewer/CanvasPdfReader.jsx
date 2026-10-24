'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReaderToolbar from './ReaderToolbar';
import WatermarkOverlay from './WatermarkOverlay';
import { Lock, ShieldAlert, Sparkles, Loader2, AlertCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
export default function CanvasPdfReader({ guideId, guideTitle, userEmail, userName, userId, initialPage = 1, isPreview = false, previewPagesLimit = 2, guidePrice, }) {
    const router = useRouter();
    const containerRef = useRef(null);
    const canvasRefs = useRef({});
    // Viewer state
    const [pdfDoc, setPdfDoc] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [zoom, setZoom] = useState(100);
    const [theme, setTheme] = useState('light');
    const [viewMode, setViewMode] = useState('single');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showThumbnails, setShowThumbnails] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [securityWarning, setSecurityWarning] = useState(null);

    // Load saved reader theme if previously set, otherwise default is 'light'
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('autogreen_reader_theme');
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'sepia')) {
                setTheme(savedTheme);
            }
        } catch {
            // ignore localStorage errors
        }
    }, []);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        try {
            localStorage.setItem('autogreen_reader_theme', newTheme);
        } catch {
            // ignore
        }
    };
    // 1. Fetch protected PDF stream and load into PDF.js
    useEffect(() => {
        let isMounted = true;
        async function loadPdfStream() {
            setLoading(true);
            setError(null);
            try {
                // Fetch raw binary buffer from authenticated stream
                const streamUrl = `/api/guides/${guideId}/pdf?fileIndex=0${isPreview ? '&preview=true' : ''}`;
                const response = await fetch(streamUrl);
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('Access Denied: You must purchase this course guide to read the full document.');
                    }
                    throw new Error(`Failed to load document stream (HTTP ${response.status})`);
                }
                const arrayBuffer = await response.arrayBuffer();
                // Import pdfjs-dist dynamically in client
                const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
                const loadingTask = pdfjsLib.getDocument({
                    data: new Uint8Array(arrayBuffer),
                    cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
                    cMapPacked: true,
                });
                const loadedDoc = await loadingTask.promise;
                if (isMounted) {
                    setPdfDoc(loadedDoc);
                    setTotalPages(loadedDoc.numPages);
                    setLoading(false);
                }
            }
            catch (err) {
                console.error('Error loading PDF document:', err);
                if (isMounted) {
                    setError(err.message || 'Error loading document');
                    setLoading(false);
                }
            }
        }
        loadPdfStream();
        return () => {
            isMounted = false;
        };
    }, [guideId, isPreview]);
    // 2. Render Page to Canvas
    const renderPage = useCallback(async (pageNum, canvas) => {
        if (!pdfDoc || !canvas)
            return;
        try {
            const page = await pdfDoc.getPage(pageNum);
            const pixelRatio = window.devicePixelRatio || 1;
            const scale = (zoom / 100) * 1.35 * pixelRatio;
            const viewport = page.getViewport({ scale });
            const context = canvas.getContext('2d');
            if (!context)
                return;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.width = `${viewport.width / pixelRatio}px`;
            canvas.style.height = `${viewport.height / pixelRatio}px`;
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;
        }
        catch (err) {
            console.error(`Error rendering page ${pageNum}:`, err);
        }
    }, [pdfDoc, zoom]);
    // Re-render current page(s) when zoom or page changes
    useEffect(() => {
        if (!pdfDoc)
            return;
        if (viewMode === 'single') {
            const canvas = canvasRefs.current[currentPage];
            if (canvas) {
                renderPage(currentPage, canvas);
            }
        }
        else {
            // Render all visible pages in continuous mode
            const renderLimit = isPreview ? Math.min(totalPages, previewPagesLimit) : totalPages;
            for (let i = 1; i <= renderLimit; i++) {
                const canvas = canvasRefs.current[i];
                if (canvas) {
                    renderPage(i, canvas);
                }
            }
        }
    }, [pdfDoc, currentPage, zoom, viewMode, renderPage, isPreview, totalPages, previewPagesLimit]);
    // 3. DRM Security: Intercept Right-Click, Print, Save, Screen Capture Keys
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
            triggerSecurityWarning('Right-click is disabled to protect copyrighted content.');
            return false;
        };
        const handleKeyDown = (e) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;
            // Intercept Print (Ctrl+P / Cmd+P)
            if (isCtrlOrCmd && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                e.stopPropagation();
                triggerSecurityWarning('Printing is strictly prohibited by Digital Rights Management.');
                return false;
            }
            // Intercept Save (Ctrl+S / Cmd+S)
            if (isCtrlOrCmd && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                e.stopPropagation();
                triggerSecurityWarning('Saving the raw PDF file is disabled. Read online only.');
                return false;
            }
            // Intercept Copy (Ctrl+C / Cmd+C)
            if (isCtrlOrCmd && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                triggerSecurityWarning('Text selection and copying are disabled.');
                return false;
            }
            // Intercept View Source (Ctrl+U)
            if (isCtrlOrCmd && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                return false;
            }
            // Arrow keys for page turn
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                }
            }
            else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                }
            }
        };
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown, true);
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [currentPage, totalPages]);
    const triggerSecurityWarning = (msg) => {
        setSecurityWarning(msg);
        setTimeout(() => {
            setSecurityWarning(null);
        }, 4000);
    };
    // 4. Reading Progress Sync (Auto-save last read page)
    const handlePageChange = async (newPage) => {
        if (isPreview && newPage > previewPagesLimit) {
            return; // restricted in preview
        }
        setCurrentPage(newPage);
        // Save reading progress in background
        if (!isPreview) {
            try {
                await fetch(`/api/guides/${guideId}/progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page: newPage }),
                });
            }
            catch (err) {
                console.error('Failed to sync reading progress:', err);
            }
        }
    };
    // 5. Fullscreen Toggle
    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch((err) => {
                console.error('Error enabling fullscreen:', err);
            });
            setIsFullscreen(true);
        }
        else {
            document.exitFullscreen().catch(() => { });
            setIsFullscreen(false);
        }
    };
    // Theme filter styling
    const getThemeFilterClass = () => {
        if (theme === 'dark') {
            return 'bg-[#0f172a] text-slate-100';
        }
        if (theme === 'sepia') {
            return 'bg-[#f4ecd8] text-[#433422] brightness-95';
        }
        return 'bg-slate-100 text-slate-900';
    };
    const getCanvasFilter = () => {
        if (theme === 'dark') {
            // Inverts colors gently for night reading
            return 'invert(0.88) hue-rotate(180deg) brightness(0.95)';
        }
        if (theme === 'sepia') {
            return 'sepia(0.25) contrast(0.95)';
        }
        return 'none';
    };
    return (<div ref={containerRef} className={`relative flex h-screen w-full flex-col overflow-hidden select-none no-select ${theme === 'dark' ? 'bg-[#090d16]' : theme === 'sepia' ? 'bg-[#eadecc]' : 'bg-[#f8fafc]'}`} onContextMenu={(e) => e.preventDefault()}>
      {/* Top Controls Toolbar */}
      <ReaderToolbar title={guideTitle} currentPage={currentPage} totalPages={totalPages} zoom={zoom} theme={theme} viewMode={viewMode} isFullscreen={isFullscreen} isPreview={isPreview} onPageChange={handlePageChange} onZoomChange={setZoom} onThemeChange={handleThemeChange} onViewModeChange={setViewMode} onToggleFullscreen={handleToggleFullscreen} onToggleThumbnails={() => setShowThumbnails(!showThumbnails)} showThumbnails={showThumbnails}/>

      {/* Floating Security Alert Toast */}
      {securityWarning && (<div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-xl bg-rose-950/90 border border-rose-500/50 px-4 py-2.5 text-xs font-semibold text-rose-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
          <ShieldAlert className="h-4 w-4 text-rose-400 animate-bounce"/>
          <span>{securityWarning}</span>
        </div>)}

      {/* Main Reader Viewport */}
      <div className="relative flex flex-1 overflow-hidden">
        
        {/* Optional Page Thumbnails Drawer */}
        {showThumbnails && (<aside className={`w-56 shrink-0 border-r p-3 overflow-y-auto space-y-3 z-30 transition-colors ${
            theme === 'light' ? 'border-slate-200 bg-white/95 text-slate-800 shadow-sm' : 'border-slate-800 bg-slate-950/90 text-slate-300'
          }`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Page Thumbnails</h4>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                const isLocked = isPreview && pNum > previewPagesLimit;
                return (<button key={pNum} disabled={isLocked} onClick={() => handlePageChange(pNum)} className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all ${currentPage === pNum
                        ? 'bg-emerald-600 text-white shadow-md'
                        : isLocked
                            ? theme === 'light' ? 'bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed' : 'bg-slate-900/40 text-slate-600 opacity-60 cursor-not-allowed'
                            : theme === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                  <span className="flex items-center gap-1.5">
                    {isLocked ? <Lock className="h-3 w-3 text-amber-500"/> : `Page ${pNum}`}
                  </span>
                  {pNum === currentPage && <span className="text-[10px] font-bold uppercase">Active</span>}
                </button>);
            })}
          </aside>)}

        {/* Reader Canvas Container */}
        <main className="relative flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex flex-col items-center justify-start">
          
          {loading && (<div className={`flex flex-col items-center justify-center my-auto gap-3 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600"/>
              <p className="text-sm font-semibold">Decrypting and streaming protected document...</p>
            </div>)}

          {error && (<div className="max-w-md my-auto rounded-2xl bg-rose-950/40 border border-rose-800/60 p-6 text-center space-y-4">
              <AlertCircle className="h-10 w-10 text-rose-400 mx-auto"/>
              <h3 className="text-base font-bold text-white">Access Restricted</h3>
              <p className="text-xs text-rose-200">{error}</p>
              <div className="pt-2">
                <Link href={`/checkout?guideId=${guideId}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                  <ShoppingCart className="h-4 w-4"/>
                  <span>Purchase Full Course to Unlock</span>
                </Link>
              </div>
            </div>)}

          {/* Single Page View */}
          {!loading && !error && viewMode === 'single' && (<div className={`relative my-auto flex flex-col items-center rounded-lg overflow-hidden ${theme === 'light' ? 'border border-slate-300 shadow-2xl' : 'border border-slate-700/50 shadow-2xl'}`}>
              <div className="relative bg-white rounded-lg overflow-hidden" style={{ filter: getCanvasFilter() }}>
                <canvas ref={(el) => {
                canvasRefs.current[currentPage] = el;
            }} className="block mx-auto"/>
              </div>

              {/* Dynamic User Watermark Overlay */}
              <WatermarkOverlay userEmail={userEmail} userName={userName} userId={userId}/>
            </div>)}

          {/* Continuous Scroll View */}
          {!loading && !error && viewMode === 'continuous' && (<div className="flex flex-col items-center gap-8 max-w-full">
              {Array.from({ length: isPreview ? Math.min(totalPages, previewPagesLimit) : totalPages }, (_, i) => i + 1).map((pNum) => (<div key={pNum} className={`relative flex flex-col items-center rounded-lg overflow-hidden ${theme === 'light' ? 'border border-slate-300 shadow-2xl' : 'border border-slate-700/50 shadow-2xl'}`}>
                  <div className="relative bg-white rounded-lg overflow-hidden" style={{ filter: getCanvasFilter() }}>
                    <canvas ref={(el) => {
                    canvasRefs.current[pNum] = el;
                }} className="block mx-auto"/>
                  </div>

                  {/* Watermark layer per page */}
                  <WatermarkOverlay userEmail={userEmail} userName={userName} userId={userId}/>

                  <div className="absolute bottom-2 right-3 z-30 rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono text-white/80">
                    Page {pNum} of {totalPages}
                  </div>
                </div>))}
            </div>)}

          {/* Preview Mode Paywall Banner at bottom if in preview */}
          {isPreview && !loading && !error && (<div className="mt-8 mb-6 w-full max-w-xl rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-brand-500/30 p-6 text-center space-y-3 shadow-2xl">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <Lock className="h-5 w-5"/>
              </div>
              <h3 className="text-base font-bold text-white">Enjoyed the Preview?</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                You are currently viewing {previewPagesLimit} preview pages. Purchase the complete guide to unlock all {totalPages} chapters, code repositories, and updates.
              </p>
              <div className="pt-2">
                <Link href={`/checkout/${guideId}`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-brand-500/30 transition-transform hover:scale-105">
                  <Sparkles className="h-4 w-4"/>
                  <span>Unlock Full Guide for ₹{guidePrice || 499}</span>
                </Link>
              </div>
            </div>)}

        </main>
      </div>

    </div>);
}
