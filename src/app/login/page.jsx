'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  User as UserIcon,
  Users,
  Sparkles,
  Lock,
  CheckCircle2
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const roleParam = searchParams.get('role');
  const [activeTab, setActiveTab] = useState(roleParam === 'admin' ? 'admin' : 'user');

  const [email, setEmail] = useState(roleParam === 'admin' ? 'autogreenai.com' : '');
  const [password, setPassword] = useState(roleParam === 'admin' ? 'Autogreen@2026' : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sync tab if query param changes
  useEffect(() => {
    if (roleParam === 'admin') {
      setActiveTab('admin');
      if (!email) {
        setEmail('autogreenai.com');
        setPassword('Autogreen@2026');
      }
    } else if (roleParam === 'user') {
      setActiveTab('user');
    }
  }, [roleParam]);

  // Tab switcher helper
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'admin') {
      setEmail('autogreenai.com');
      setPassword('Autogreen@2026');
    } else {
      if (email === 'autogreenai.com') {
        setEmail('');
        setPassword('');
      }
    }
  };

  // Quick Demo fill buttons
  const fillStudentCredentials = () => {
    setActiveTab('user');
    setEmail('student@example.com');
    setPassword('student123');
    setError(null);
  };

  const fillAdminCredentials = () => {
    setActiveTab('admin');
    setEmail('autogreenai.com');
    setPassword('Autogreen@2026');
    setError(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(res.error || 'Invalid email/username or password');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen z-50 overflow-y-auto bg-white">
      {/* Main Split Container - Full Screen Edge to Edge */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* ============================================================ */}
        {/* LEFT PANEL: Deep Royal Blue Brand Hero                      */}
        {/* ============================================================ */}
        <div className="relative w-full min-h-[380px] lg:min-h-screen bg-gradient-to-br from-[#1222e8] via-[#101db8] to-[#0a116b] p-8 sm:p-14 lg:p-20 flex flex-col justify-between overflow-hidden text-white">
          {/* Subtle curved wireframe overlay pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 500 500" fill="none">
              <path d="M-100 200 C 150 100, 350 400, 600 250" stroke="white" strokeWidth="1.5" />
              <path d="M-50 150 C 200 80, 400 350, 650 200" stroke="white" strokeWidth="1.5" />
              <path d="M0 100 C 250 60, 450 300, 700 150" stroke="white" strokeWidth="1.5" />
              <circle cx="420" cy="120" r="180" stroke="white" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="420" cy="120" r="240" stroke="white" strokeWidth="0.8" />
              <circle cx="420" cy="120" r="300" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Top Section: Geometric Asterisk / Star Logo & Back to Home */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-xl transition-all group border border-white/15 shadow-sm"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Multi-User Supported
              </span>
            </div>

            <div className="mb-8 sm:mb-10">
              <svg className="w-14 h-14 sm:w-16 sm:h-16 text-white" viewBox="0 0 100 100" fill="currentColor">
                <rect x="42" y="5" width="16" height="90" rx="8" />
                <rect x="5" y="42" width="90" height="16" rx="8" />
                <rect x="42" y="5" width="16" height="90" rx="8" transform="rotate(45 50 50)" />
                <rect x="42" y="5" width="16" height="90" rx="8" transform="rotate(-45 50 50)" />
              </svg>
            </div>

            {/* Main Greeting */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              AutoGreen AI<br />
              Secure Portal
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-blue-100 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md mt-4 font-normal">
              Unified authentication for both Students/Members and Platform Administrators. Multiple users can sign up and login simultaneously with their own accounts.
            </p>

            {/* Highlights Card */}
            <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-md space-y-2.5 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Multi-User Architecture:</strong> Any number of users can register & log in.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Dedicated Admin Control:</strong> Full access to kits, orders, and users.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>DRM & Points:</strong> Individual libraries and bonus point rewards.</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-10 pt-8 mt-auto">
            <p className="text-xs text-blue-200/70 font-medium">
              © {new Date().getFullYear()} AutoGreen AI. All rights reserved.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL: Clean Minimalist Login Form                     */}
        {/* ============================================================ */}
        <div className="w-full min-h-screen p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-white text-slate-900 overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto py-4">
            {/* Top Brand Name & Back to Home */}
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-block text-2xl font-black text-slate-900 tracking-tight hover:opacity-80 transition-opacity">
                AutoGreen<span className="text-[#1222e8]">.</span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* ROLE SELECTOR TABS (Admin Login vs User Login) */}
            <div className="mt-8">
              <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTabChange('user')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'user'
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-300/40 border border-slate-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <UserIcon className={`h-4 w-4 ${activeTab === 'user' ? 'text-[#1222e8]' : 'text-slate-400'}`} />
                  <span>User Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('admin')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-slate-900 text-white shadow-md shadow-black/20'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className={`h-4 w-4 ${activeTab === 'admin' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Admin Login</span>
                </button>
              </div>
            </div>

            {/* Welcome Heading depending on Tab */}
            <div className="mt-6">
              {activeTab === 'user' ? (
                <>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1222e8] bg-blue-50 px-2.5 py-1 rounded-full mb-2 border border-blue-200">
                    <Users className="h-3.5 w-3.5" />
                    <span>Member & Student Portal</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[#1222e8] font-bold underline hover:text-blue-800 transition-colors">
                      Register a new account (Free)
                    </Link>
                    . Multiple users can sign up!
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-2 border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Restricted Control Suite</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Admin Portal Login
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Administrative access to manage courses, guides, coupons, orders, and all registered users.
                  </p>
                </>
              )}
            </div>

            {/* Quick Demo Pre-fill helper chip */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">Quick Test:</span>
              {activeTab === 'user' ? (
                <button
                  type="button"
                  onClick={fillStudentCredentials}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Fill Demo Student (student@example.com)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Fill Admin (autogreenai.com)</span>
                </button>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Email / Username Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {activeTab === 'admin' ? 'Admin Username or Email' : 'Email Address'}
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'autogreenai.com or admin@autogreenai.com' : 'name@example.com'}
                  className="w-full border-b-2 border-slate-200 focus:border-slate-900 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none transition-colors"
                />
              </div>

              {/* Password Field with Eye toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {activeTab === 'admin' ? 'Admin Password' : 'Password'}
                  </label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border-b-2 border-slate-200 focus:border-slate-900 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 text-slate-400 hover:text-slate-700 focus:outline-none transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 rounded-xl text-white text-sm font-bold shadow-lg disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${
                    activeTab === 'admin'
                      ? 'bg-slate-950 hover:bg-black shadow-black/20'
                      : 'bg-[#1222e8] hover:bg-[#0e1cb3] shadow-blue-600/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : activeTab === 'admin' ? (
                    <>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Authenticate & Enter Admin Panel</span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="h-4 w-4" />
                      <span>Login to Student Dashboard</span>
                    </>
                  )}
                </button>

                {activeTab === 'user' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('student@autogreen.ai');
                      setPassword('student123');
                    }}
                    className="w-full py-3 px-6 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Instant Login (Demo Operator)</span>
                  </button>
                )}
              </div>
            </form>

            {/* Bottom info link */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              {activeTab === 'user' ? (
                <>
                  <span>
                    New user?{' '}
                    <Link href="/signup" className="font-bold text-[#1222e8] hover:underline">
                      Sign Up Here
                    </Link>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTabChange('admin')}
                    className="font-semibold text-slate-700 hover:text-black flex items-center gap-1"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Admin Access →</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="font-mono text-[11px] text-slate-500">
                    Host: autogreenai.com
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTabChange('user')}
                    className="font-semibold text-[#1222e8] hover:underline flex items-center gap-1"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    <span>← Switch to User Login</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer Assistance */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Need help signing in?{' '}
            <Link href="mailto:support@autogreen.ai" className="font-semibold text-slate-700 hover:underline">
              support@autogreen.ai
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1222e8]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
