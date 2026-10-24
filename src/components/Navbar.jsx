'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ShieldCheck, ShoppingBag, User as UserIcon, LogOut, Menu, X, LayoutDashboard, ChevronDown } from 'lucide-react';
export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
    const isActive = (path) => pathname === path;
    // Don't show public nav inside login, signup, reader, or admin portal
    if (
        pathname.startsWith('/dashboard/reader') ||
        pathname.startsWith('/admin') ||
        pathname === '/login' ||
        pathname === '/signup'
    ) {
        return null;
    }
    return (<header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-all shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* AutoGreen Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-emerald-600"/>
          </div>
          <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 flex items-center gap-1.5">
            AutoGreen <span className="text-emerald-600 font-semibold">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/#discover" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Discover
          </Link>
          <Link href="/#kits" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Kits
          </Link>
          <Link href="/#automate" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Automate
          </Link>
          <Link href="/#agents" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Agents
          </Link>
          <Link href="/#voice" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Voice
          </Link>
          <Link href="/#studio" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Studio
          </Link>
          <Link href="/about" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/about') ? 'text-emerald-600 font-semibold' : 'text-slate-600'}`}>
            About
          </Link>
          <Link href="/#resources" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Resources
          </Link>
        </nav>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center gap-3">
          <a href="mailto:contact@autogreen.ai" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Talk to AutoGreen
          </a>

          <Link href="/#kits" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-600/20">
            <span>Explore AI Kits</span>
            <span className="text-xs">↗</span>
          </Link>

          {user ? (<div className="flex items-center gap-3">
              {/* My Purchases Shortcut */}
              <Link href="/dashboard" className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg border transition-all ${isActive('/dashboard')
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
                <ShoppingBag className="h-4 w-4 text-emerald-600"/>
                <span>My Library</span>
              </Link>

              {/* Admin Panel Link */}
              {user.role === 'admin' && (<Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition-all">
                  <ShieldCheck className="h-4 w-4 text-purple-600"/>
                  <span>Admin Panel</span>
                </Link>)}

              {/* User Dropdown */}
              <div className="relative">
                <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs transition-all text-sm font-medium">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400"/>
                </button>

                {userDropdownOpen && (<div onMouseLeave={() => setUserDropdownOpen(false)} className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-black font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors">
                        <ShieldCheck className="h-4 w-4 text-purple-600"/>
                        Admin Dashboard
                      </Link>
                    )}

                    <Link href="/dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <LayoutDashboard className="h-4 w-4 text-emerald-600"/>
                      My Purchased Guides
                    </Link>

                    <Link href="/dashboard/orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <ShoppingBag className="h-4 w-4 text-emerald-600"/>
                      Order History & Invoices
                    </Link>

                    <Link href="/dashboard/profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      <UserIcon className="h-4 w-4 text-sky-600"/>
                      Account Settings
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium">
                      <LogOut className="h-4 w-4"/>
                      Sign Out
                    </button>
                  </div>)}
              </div>
            </div>) : (<div className="flex items-center gap-2">
              {/* Login Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  onMouseEnter={() => setLoginDropdownOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span>Log In</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {loginDropdownOpen && (
                  <div
                    onMouseLeave={() => setLoginDropdownOpen(false)}
                    className="absolute right-0 mt-1 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <p className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Select Login Portal
                    </p>

                    <Link
                      href="/login?role=user"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1222e8] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900 group-hover:text-[#1222e8] transition-colors">
                          User / Member Login
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          For students & buyers (Multi-user)
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/login?role=admin"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-emerald-50/60 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Admin Portal Login
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          Management & platform control
                        </span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-emerald-500 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            </div>)}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900">
            {mobileMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (<div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-800">
            Explore Guides
          </Link>
          <Link href="/#categories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-800">
            Categories
          </Link>
          {user ? (<>
              <div className="pt-2 border-t border-slate-100"></div>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-base font-medium text-emerald-600">
                <ShoppingBag className="h-4 w-4"/>
                My Purchased Guides
              </Link>
              <Link href="/dashboard/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-base font-medium text-emerald-600">
                <LayoutDashboard className="h-4 w-4"/>
                Order History & Invoices
              </Link>
              {user.role === 'admin' && (<Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-base font-medium text-purple-600">
                  <ShieldCheck className="h-4 w-4"/>
                  Admin Portal
                </Link>)}
              <button onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                }} className="w-full text-left py-2 text-base font-medium text-rose-600 flex items-center gap-2">
                <LogOut className="h-4 w-4"/>
                Sign Out
              </button>
            </>) : (<div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login?role=user"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-left text-sm font-semibold rounded-xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4 text-[#1222e8]" />
                <span>User / Student Login</span>
              </Link>
              <Link
                href="/login?role=admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-left text-sm font-semibold rounded-xl bg-slate-900 text-white flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Admin Portal Login</span>
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-emerald-600 text-white"
              >
                Create Account (Multi-User)
              </Link>
            </div>)}
        </div>)}
    </header>);
}
