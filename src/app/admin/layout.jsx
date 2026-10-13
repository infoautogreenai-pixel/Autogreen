'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  ShieldCheck,
  ExternalLink,
  Loader2,
  LogOut,
  Menu,
  X,
  Sparkles,
  PlusCircle,
  Bell,
  Activity,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;

    if (!loading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // If on dedicated admin login page, render full screen login without dashboard sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-xs font-mono text-emerald-400/80">Authenticating Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { label: 'Overview & Stats', href: '/admin', icon: LayoutDashboard },
    { label: 'Course Guides & Kits', href: '/admin/guides', icon: BookOpen },
    { label: 'Orders & Sales', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Users & Access', href: '/admin/users', icon: Users },
    { label: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { label: 'Platform & Points', href: '/admin/settings', icon: Settings },
  ];

  // Derive current page title for breadcrumb
  const currentNav = navItems.find((item) => item.href === pathname) || {
    label: 'Administration',
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-100 selection:bg-emerald-500 selection:text-black">
      
      {/* ===================================================================== */}
      {/* 1. DEDICATED ADMIN SIDEBAR                                            */}
      {/* ===================================================================== */}

      {/* Backdrop overlay for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#051310] border-r border-emerald-950/80 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Admin Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-emerald-950/80 bg-[#030d0a]">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                  AutoGreen <span className="text-emerald-400 font-semibold">Admin</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400/80 block uppercase tracking-wider">
                  Control Suite
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Store Link */}
          <div className="p-4 pb-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/40 hover:text-white transition-all group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                <span>View Public Store</span>
              </span>
              <ChevronRight className="h-3 w-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 font-semibold">
              Management
            </p>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-slate-300 hover:bg-[#081a16] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-slate-950' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer User Section */}
        <div className="p-4 border-t border-emerald-950/80 bg-[#030d0a]">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className="inline-block text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Super Admin
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-semibold transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>

      </aside>

      {/* ===================================================================== */}
      {/* 2. MAIN ADMIN CONTENT WRAPPER WITH DEDICATED ADMIN TOPBAR             */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Dedicated Admin Header */}
        <header className="h-16 border-b border-emerald-950/80 bg-[#051310]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-30 shrink-0">
          
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-[#081b16] border border-emerald-900/60 text-slate-300 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs">
              <Link href="/admin" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className="text-white font-bold">{currentNav.label}</span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Live System Health Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#081a16] border border-emerald-900/60 text-[11px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>DRM & Core Live</span>
            </div>

            {/* New Guide Action Shortcut */}
            <Link
              href="/admin/guides"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-sm shadow-emerald-500/20"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Guide / Kit</span>
              <span className="sm:hidden">Add</span>
            </Link>

            {/* Quick Public View */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-900/50 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
              <span>Store</span>
            </Link>

            {/* Admin Profile Shortcut */}
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-950">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => logout()}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

          </div>

        </header>

        {/* Admin Page Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#020617]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
