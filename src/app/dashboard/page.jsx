'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  LayoutDashboard,
  FileText,
  User as UserIcon,
  Coins,
  CheckCircle2
} from 'lucide-react';

export default function DashboardLibraryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [purchasedGuides, setPurchasedGuides] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    async function loadUserPurchases() {
      if (!user) return;
      try {
        const res = await fetch('/api/guides');
        const data = await res.json();
        if (data.success && data.guides) {
          const userPurchases = user.purchasedGuides || [];
          // Match user purchased guides with details
          const enriched = userPurchases
            .map((p) => {
              const guideDetails = data.guides.find(
                (g) => (g._id || g.id) === (p.guideId?._id || p.guideId)
              );
              return {
                ...p,
                details: guideDetails,
              };
            })
            .filter((p) => p.details);
          setPurchasedGuides(enriched);
        }
      } catch (err) {
        console.error('Error loading purchases:', err);
      } finally {
        setFetching(false);
      }
    }

    if (user) {
      loadUserPurchases();
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          <p className="text-xs font-semibold text-slate-500">Loading your library...</p>
        </div>
      </div>
    );
  }

  const filteredPurchases = purchasedGuides.filter(
    (p) =>
      p.details?.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.details?.category.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-10 selection:bg-emerald-500 selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ============================================================== */}
        {/* DASHBOARD TOP NAVIGATION TABS                                  */}
        {/* ============================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-600" />
              <span>My Library</span>
            </Link>

            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-slate-500" />
              <span>Order Invoices</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              <UserIcon className="h-4 w-4 text-slate-500" />
              <span>Account Settings</span>
            </Link>
          </div>

          {/* User Points Badge */}
          <div className="flex items-center gap-2 pr-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>{user?.points || 0} pts</span>
            </div>

            <Link
              href="/#kits"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* HEADER SECTION                                                 */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Learning Library
              </h1>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-extrabold">
                {purchasedGuides.length} {purchasedGuides.length === 1 ? 'Guide' : 'Guides'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal">
              Welcome back, <strong className="text-slate-900 font-bold">{user?.name}</strong>. Your protected courses & toolkits are ready for in-browser reading.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#kits"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore More Kits</span>
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SEARCH BAR WITHIN LIBRARY                                      */}
        {/* ============================================================== */}
        {purchasedGuides.length > 0 && (
          <div className="max-w-md">
            <div className="relative flex items-center rounded-xl bg-white border border-slate-200 shadow-xs px-3.5 py-2.5 text-xs text-slate-900 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search in your purchased courses & toolkits..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-xs"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* EMPTY STATE                                                    */}
        {/* ============================================================== */}
        {purchasedGuides.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your Library is Empty</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t enrolled in any digital kits or course guides yet. Browse our catalog and start reading with instant in-browser access.
            </p>
            <div className="pt-2">
              <Link
                href="/#kits"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
              >
                <span>Browse Store Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* CARDS GRID (PREMIUM LIGHT THEME WITH HIGH CONTRAST)         */
          /* ============================================================ */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPurchases.map((item) => {
              const guide = item.details;
              const lastRead = item.lastReadPage || 1;
              const totalEstPages = guide.pdfFiles?.[0]?.pageCount || 4;
              const progressPct = Math.min(
                100,
                Math.round((lastRead / totalEstPages) * 100)
              );

              return (
                <div
                  key={item._id || item.guideId}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Thumbnail / Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={guide.coverImage}
                      alt={guide.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase px-3 py-1 shadow-sm">
                        {guide.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" />
                      <span>DRM Active</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 tracking-tight">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {guide.shortDescription || guide.description}
                      </p>

                      {/* Reading Progress Indicator */}
                      <div className="pt-2 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-slate-500">
                          <span>Reading Progress</span>
                          <span className="text-emerald-700 font-bold font-mono">
                            Page {lastRead} of {totalEstPages}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(12, progressPct)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Open Reader Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Purchased {new Date(item.purchasedAt || Date.now()).toLocaleDateString()}
                      </span>

                      <Link
                        href={`/dashboard/reader/${guide.id || guide._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Continue Reading</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
