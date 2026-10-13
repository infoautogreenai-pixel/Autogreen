'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
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
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
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
        <div className="relative w-full min-h-[380px] lg:min-h-screen bg-gradient-to-br from-[#2434f6] via-[#1e2ddb] to-[#121ea8] p-8 sm:p-14 lg:p-20 flex flex-col justify-between overflow-hidden text-white">
          
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
            </div>

            <div className="mb-8 sm:mb-12">
              <svg className="w-14 h-14 sm:w-16 sm:h-16 text-white" viewBox="0 0 100 100" fill="currentColor">
                <rect x="42" y="5" width="16" height="90" rx="8" />
                <rect x="5" y="42" width="90" height="16" rx="8" />
                <rect x="42" y="5" width="16" height="90" rx="8" transform="rotate(45 50 50)" />
                <rect x="42" y="5" width="16" height="90" rx="8" transform="rotate(-45 50 50)" />
              </svg>
            </div>

            {/* Main Greeting */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Hello<br />
              AutoGreen! 👋
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-white text-xs sm:text-sm lg:text-base leading-relaxed max-w-sm mt-5 font-normal">
              Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!
            </p>
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
        <div className="w-full min-h-screen p-8 sm:p-14 lg:p-20 flex flex-col justify-between bg-white text-slate-900 overflow-y-auto">
          
          <div className="max-w-md w-full mx-auto my-auto py-6">
            {/* Top Brand Name & Back to Home */}
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-block text-2xl font-black text-slate-900 tracking-tight hover:opacity-80 transition-opacity">
                AutoGreen<span className="text-[#2434f6]">.</span>
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
            <div className="mt-8 sm:mt-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-xs sm:text-sm text-black mt-2 leading-relaxed">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-slate-900 font-bold underline hover:text-[#2434f6] transition-colors">
                  Create a new account now
                </Link>
                , it&apos;s FREE! Takes less than a minute.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mt-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              
              {/* Email Field with clean underline style */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border-b-2 border-slate-200 focus:border-slate-900 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none transition-colors"
                />
              </div>

              {/* Password Field with clean underline style & Eye toggle */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border-b-2 border-slate-200 focus:border-slate-900 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 text-slate-400 hover:text-slate-700 focus:outline-none transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Main Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#141418] hover:bg-black text-white text-sm font-bold shadow-lg shadow-black/10 disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Logging In...</span>
                    </>
                  ) : (
                    <span>Login Now</span>
                  )}
                </button>

                {/* Login with Google Button */}
                <button
                  type="button"
                  onClick={() => {
                    // Demo Google login indicator
                    setEmail('student@autogreen.ai');
                    setPassword('student123');
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
                >
                  {/* Google G Logo SVG */}
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Login with Google</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Forgot Password Link */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Forget password?{' '}
            <Link href="mailto:support@autogreen.ai" className="font-bold text-slate-900 hover:underline">
              Click here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
