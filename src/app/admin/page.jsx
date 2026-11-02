'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  BookOpen,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <span className="text-xs font-mono text-slate-400">Loading Live Analytics...</span>
      </div>
    );
  }

  const { stats, categoryStats = [], revenueChartData = [], recentOrders = [] } = data;
  const maxChartRevenue = Math.max(...revenueChartData.map((d) => d.revenue), 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Platform Dashboard & Analytics</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Live
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer revenue, order fulfillment, and verified student lead metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/guides"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <span>+ Upload New Guide</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ₹{stats.totalRevenue?.toLocaleString() || 0}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Today: <strong className="text-emerald-400">₹{stats.todayRevenue || 0}</strong></span>
            <span>Month: <strong className="text-white">₹{stats.monthRevenue || 0}</strong></span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.totalOrders || 0}</div>
          <span className="text-[11px] text-slate-400 block">Orders successfully processed</span>
        </div>

        {/* Registered Users (Excluding Admins) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.totalUsers || 0}</div>
          <span className="text-[11px] text-slate-400 block">Enrolled students & customer leads</span>
        </div>

        {/* Active Guides */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Guides</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats.activeGuides || 0} <span className="text-xs text-slate-400 font-normal">/ {stats.totalGuides || 0}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium block">
            Published & active in store
          </span>
        </div>
      </div>

      {/* 14-Day Revenue History Chart */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">14-Day Revenue Trajectory</h3>
            <p className="text-xs text-slate-400">Daily sales volume in ₹</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            <TrendingUp className="h-3.5 w-3.5" /> Live Stream
          </span>
        </div>

        {/* Dynamic Bar Visualization */}
        <div className="h-48 w-full flex items-end justify-between gap-1.5 sm:gap-2 pt-8">
          {revenueChartData.map((d, idx) => {
            const hasRevenue = d.revenue > 0;
            const heightPct = hasRevenue
              ? Math.max(14, Math.round((d.revenue / maxChartRevenue) * 100))
              : 4; // Subtle flat baseline for ₹0 days
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shadow-md">
                  ₹{d.revenue}
                </div>
                <div
                  className={`w-full rounded-t transition-all ${
                    hasRevenue
                      ? 'bg-gradient-to-t from-emerald-700 via-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/20 group-hover:brightness-125'
                      : 'bg-slate-800/50 group-hover:bg-slate-700/70'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500 rotate-45 sm:rotate-0 mt-1">
                  {d.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Category Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Performance */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Category Popularity</h3>
          {categoryStats.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No course categories published yet.
            </div>
          ) : (
            <div className="space-y-3">
              {categoryStats.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5"
                >
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">{cat._id}</span>
                    <span className="text-emerald-400">{cat.totalSales} Sales</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{cat.count} Published Guides</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Recent Customer Orders</h3>
            <Link href="/admin/orders" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              <span>View All Orders</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1.5 border border-dashed border-slate-800 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No customer orders yet</p>
              <p className="text-[11px] text-slate-500">
                Live customer purchases will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 text-xs">
              {recentOrders.map((ord) => (
                <div key={ord._id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{ord.guideTitle}</span>
                      <span className="font-mono text-[10px] text-slate-500">#{ord.orderNumber}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {ord.customerDetails?.name} ({ord.customerDetails?.email})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white block">₹{ord.amount}</span>
                    <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
