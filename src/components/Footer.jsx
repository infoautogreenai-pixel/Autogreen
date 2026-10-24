'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
export default function Footer() {
    const pathname = usePathname();
    // Hide in dedicated distraction-free reader screen, admin portal, login, and signup
    if (
        pathname.startsWith('/dashboard/reader') ||
        pathname.startsWith('/admin') ||
        pathname === '/login' ||
        pathname === '/signup'
    ) {
        return null;
    }
    return (<footer className="border-t border-slate-200 bg-[#F8FAFC] text-black text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-xs">
                <Sparkles className="h-5 w-5 text-emerald-600"/>
              </div>
              <span className="font-bold text-lg leading-tight tracking-tight text-black">
                AutoGreen <span className="text-emerald-600 font-semibold">AI</span>
              </span>
            </Link>
            <p className="text-black text-xs leading-relaxed max-w-sm">
              A global AI ecosystem helping people and businesses discover, use, automate and build with artificial intelligence.
              Different Businesses. One Green.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-medium">Global AI Ecosystem Active</span>
            </div>
          </div>

          {/* Ecosystem Navigation */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-3">Ecosystem</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#discover" className="hover:text-emerald-700 text-black transition-colors">
                  01 Discover
                </Link>
              </li>
              <li>
                <Link href="/#kits" className="hover:text-emerald-700 text-black transition-colors">
                  02 AI Kits
                </Link>
              </li>
              <li>
                <Link href="/#automate" className="hover:text-emerald-700 text-black transition-colors">
                  03 Automate
                </Link>
              </li>
              <li>
                <Link href="/#agents" className="hover:text-emerald-700 text-black transition-colors">
                  04 AI Agents
                </Link>
              </li>
              <li>
                <Link href="/#voice" className="hover:text-emerald-700 text-black transition-colors">
                  05 Voice AI
                </Link>
              </li>
              <li>
                <a href="mailto:contact@autogreen.ai" className="hover:text-emerald-700 text-black transition-colors">
                  06 Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-3">Company & Portals</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="hover:text-emerald-700 text-black transition-colors">
                  About AutoGreen AI
                </Link>
              </li>
              <li>
                <Link href="/login?role=user" className="hover:text-emerald-700 text-black font-semibold transition-colors flex items-center gap-1.5">
                  <span>User / Student Login</span>
                </Link>
              </li>
              <li>
                <Link href="/login?role=admin" className="hover:text-emerald-700 text-black font-semibold transition-colors flex items-center gap-1.5">
                  <span>🛡️ Admin Portal Login</span>
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-emerald-700 text-black transition-colors">
                  Register New Account
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-700 text-black transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-700 text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect / Studio */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600"/>
              Build with AutoGreen
            </h3>
            <p className="text-[11px] text-black leading-relaxed">
              Need custom AI strategy, agent implementation, or enterprise workflow deployment?
            </p>
            <a href="mailto:contact@autogreen.ai" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors pt-1">
              <span>Talk to AutoGreen Studio</span>
              <ArrowRight className="h-3 w-3"/>
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-black text-[11px]">
          <p>© {new Date().getFullYear()} AutoGreen AI. Built for the modern world, wherever you work.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-emerald-700 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-emerald-700 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-emerald-700 transition-colors">Privacy</Link>
            <span className="flex items-center gap-1 text-black">
              <Lock className="h-3 w-3 text-emerald-600"/> Secure DRM Platform
            </span>
          </div>
        </div>
      </div>
    </footer>);
}
