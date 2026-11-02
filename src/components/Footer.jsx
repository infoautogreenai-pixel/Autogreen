'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide in dedicated reader screen, admin portal, login, and signup
  if (
    pathname.startsWith('/dashboard/reader') ||
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return null;
  }

  return (
    <footer className="border-t border-white/5 bg-[#010409] text-white" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-4">
            <Link className="flex items-center gap-2.5" data-testid="footer-logo" href="/">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
                <Sprout className="h-5 w-5 text-emerald-400" />
              </span>
              <span className="font-heading text-lg font-semibold tracking-tight text-white">
                AutoGreen <span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Different Businesses. One Green.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors duration-300 hover:border-emerald-500/40 hover:text-emerald-300"
                data-testid="footer-social-linkedin"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors duration-300 hover:border-emerald-500/40 hover:text-emerald-300"
                data-testid="footer-social-instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors duration-300 hover:border-emerald-500/40 hover:text-emerald-300"
                data-testid="footer-social-youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors duration-300 hover:border-emerald-500/40 hover:text-emerald-300"
                data-testid="footer-social-x"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-200/50">Explore</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-explore-discover" href="/#discover">
                  Discover
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-explore-kits" href="/#kits">
                  Kits
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-explore-automate" href="/#automate">
                  Automate
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-explore-agents" href="/#agents">
                  Agents
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-explore-voice" href="/#voice">
                  Voice
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-explore-studio" href="/#studio">
                  Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn Links */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-200/50">Learn</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-learn-ai-library" href="/#resources">
                  AI Library
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-learn-guides" href="/#resources">
                  Guides
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-learn-tutorials" href="/#resources">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-learn-resources" href="/#resources">
                  Resources
                </Link>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-learn-community" href="/#kits">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-200/50">Company</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-company-about" href="/about">
                  About
                </Link>
              </li>
              <li>
                <a className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-company-contact" href="mailto:contact@autogreen.ai">
                  Contact
                </a>
              </li>
              <li>
                <Link className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-company-careers" href="/about">
                  Careers
                </Link>
              </li>
              <li>
                <a className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-company-partners" href="mailto:contact@autogreen.ai">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-200/50">Legal</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-legal-privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-legal-terms">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-legal-refund-policy">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 transition-colors duration-300 hover:text-white" data-testid="footer-legal-cookie-policy">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            © 2026 AutoGreen AI. Built for the modern world, wherever you work.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-200/40">
            AI is the new green.
          </p>
        </div>
      </div>
    </footer>
  );
}
