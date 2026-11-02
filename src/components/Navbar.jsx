'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sprout,
  ArrowUpRight,
  Menu,
  X,
  ShoppingBag,
  ShieldCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';

function UserIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Don't show public nav inside login, signup, reader, or admin portal
  if (
    pathname.startsWith('/dashboard/reader') ||
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return null;
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 border-b border-white/5 bg-[#030712]/75 backdrop-blur-xl"
      data-testid="main-navigation"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Brand Logo */}
        <Link
          className="group flex items-center gap-2.5"
          data-testid="nav-logo"
          href="/"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 transition-colors duration-300 group-hover:bg-emerald-500/25">
            <Sprout className="h-5 w-5 text-emerald-400" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-white">
            AutoGreen <span className="text-emerald-400">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <Link
            data-testid="nav-link-discover"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/#discover"
          >
            Discover
          </Link>
          <Link
            data-testid="nav-link-kits"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/#kits"
          >
            Kits
          </Link>
          <Link
            data-testid="nav-link-automate"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/#automate"
          >
            Automate
          </Link>
          <Link
            data-testid="nav-link-agents"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/#agents"
          >
            Agents
          </Link>
          <Link
            data-testid="nav-link-voice"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/#voice"
          >
            Voice
          </Link>
          <Link
            data-testid="nav-link-studio"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/#studio"
          >
            Studio
          </Link>
          <Link
            data-testid="nav-link-about"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/about"
          >
            About
          </Link>
          <Link
            data-testid="nav-link-resources"
            className="rounded-full px-3.5 py-2 text-sm transition-colors duration-300 text-slate-400 hover:text-white"
            href="/#resources"
          >
            Resources
          </Link>
        </nav>

        {/* Desktop Action CTAs & Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="mailto:contact@autogreen.ai"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors hover:bg-white/5 h-9 px-4 py-2 text-sm text-slate-400 hover:text-white"
            data-testid="nav-talk-cta"
          >
            Talk to AutoGreen
          </a>

          <Link href="/#kits">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap shadow h-9 py-2 group rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors duration-300 hover:bg-emerald-500"
              data-testid="nav-explore-kits-cta"
            >
              <span>Explore AI Kits</span>
              <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Link>

          {/* User Auth Info */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3.5 py-1.5 text-xs text-white hover:border-emerald-500/40 transition-all"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono">{user.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#070e17] p-2 shadow-2xl backdrop-blur-xl z-50">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg mt-1"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                    <span>My Library</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-950/30 rounded-lg"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded-lg mt-1 text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-slate-300 hover:border-emerald-500/40 hover:text-white transition-all bg-white/5"
            >
              <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Log In</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-md text-slate-300 hover:text-white hover:bg-white/5 h-9 w-9 lg:hidden"
          data-testid="nav-mobile-menu-button"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#030712] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/#discover"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Discover
            </Link>
            <Link
              href="/#kits"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Kits
            </Link>
            <Link
              href="/#automate"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Automate
            </Link>
            <Link
              href="/#agents"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Agents
            </Link>
            <Link
              href="/#voice"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Voice
            </Link>
            <Link
              href="/#studio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Studio
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              About
            </Link>
            <Link
              href="/#resources"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
            >
              Resources
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/#kits"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500"
            >
              Explore AI Kits
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-full border border-white/10 text-white font-medium text-xs hover:bg-white/5"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-full border border-white/10 text-white font-medium text-xs hover:bg-white/5"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
