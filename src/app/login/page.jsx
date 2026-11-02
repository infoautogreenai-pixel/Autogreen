'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Users,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

function UserIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const redirectUrl = searchParams.get('redirect');
      const target = redirectUrl || (res.user?.role === 'admin' ? '/admin' : '/dashboard');
      window.location.href = target;
    } else {
      setError(res.error || 'Invalid email or password');
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
                Student & Member Portal
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
              Student Portal
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-blue-100 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md mt-4 font-normal">
              Sign in to access your purchased AI toolkits, interactive guides, reading dashboard, and member benefits.
            </p>

            {/* Highlights Card */}
            <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-md space-y-2.5 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Instant Access:</strong> All purchased course guides in one place.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Secure DRM Reader:</strong> Distraction-free protected learning.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Points & Rewards:</strong> Earn bonus points with every purchase.</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-10 pt-8 mt-auto flex items-center justify-between">
            <p className="text-xs text-blue-200/70 font-medium">
              © {new Date().getFullYear()} AutoGreen AI. All rights reserved.
            </p>
            <Link
              href="/admin/login"
              className="text-xs text-blue-200/80 hover:text-white underline font-medium flex items-center gap-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Portal →</span>
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL: Clean Minimalist Login Form                     */}
        {/* ============================================================ */}
        <div className="w-full min-h-screen p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-white text-slate-900 overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto py-4">
            {/* Top Brand Name & Back to Home */}
            <div className="flex items-center justify-between mb-8">
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

            {/* Welcome Heading */}
            <div>
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
              </p>
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
              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border-b-2 border-slate-200 focus:border-slate-900 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none transition-colors"
                />
              </div>

              {/* Password Field with Eye toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Password
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
                  className="w-full py-3.5 px-6 rounded-xl text-white text-sm font-bold shadow-lg disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 bg-[#1222e8] hover:bg-[#0e1cb3] shadow-blue-600/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="h-4 w-4" />
                      <span>Login to Student Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom info link */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                New user?{' '}
                <Link href="/signup" className="font-bold text-[#1222e8] hover:underline">
                  Sign Up Here
                </Link>
              </span>
              <Link
                href="/admin/login"
                className="font-semibold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Admin Login Portal →</span>
              </Link>
            </div>
          </div>

          {/* Minimal Form Footer */}
          <div className="max-w-md w-full mx-auto pt-6 text-center text-xs text-slate-400">
            Protected by AutoGreen AI Zero-Trust Platform Security.
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
        <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-[#1222e8]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
