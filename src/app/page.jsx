'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Check,
  Minus,
  ChevronDown,
  Compass,
  Package,
  Workflow,
  Bot,
  AudioLines,
  PenTool,
  GraduationCap,
  Megaphone,
  Laptop,
  Rocket,
  Building2,
  Landmark,
} from 'lucide-react';

export default function HomePage() {
  // Interactive Accordion State for FAQ (12 questions)
  const [openFaq, setOpenFaq] = useState(0);

  // Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Dynamic live kit tiers from MongoDB
  const [liveKits, setLiveKits] = useState(null);

  useEffect(() => {
    async function fetchLiveKits() {
      try {
        const res = await fetch('/api/kits');
        const data = await res.json();
        if (data.success && Array.isArray(data.tiers) && data.tiers.length >= 3) {
          setLiveKits(data.tiers);
        }
      } catch (err) {
        console.warn('Live kits fetch note:', err);
      }
    }
    fetchLiveKits();
  }, []);

  const starterTier = liveKits?.find(
    (k) =>
      k.slug === 'ai-marketer-starter-kit' ||
      k.id === '6adc8def486c185f0a88bdd2' ||
      k.name?.toLowerCase().includes('starter')
  );

  const proTier = liveKits?.find(
    (k) =>
      k.slug === 'ai-marketer-pro-kit' ||
      k.id === '6adc8def486c185f0a88bdd5' ||
      k.name?.toLowerCase().includes('pro')
  );

  const expertTier = liveKits?.find(
    (k) =>
      k.slug === 'ai-marketer-expert-stack' ||
      k.id === '6adc8def486c185f0a88bdd8' ||
      k.name?.toLowerCase().includes('expert')
  );

  // Particle constellation background canvas ref
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.4 + 0.15,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  const faqData = [
    {
      q: 'What is AutoGreen AI?',
      a: 'AutoGreen AI is a global AI ecosystem. We help people and businesses discover the right AI tools, learn to use them, automate repetitive work, and build custom AI systems — from individual workflows to full AI employees.',
    },
    {
      q: 'Who is AutoGreen AI for?',
      a: 'AutoGreen is built for students, marketers, freelancers, founders, agencies, and enterprises looking to leverage artificial intelligence for productivity, automation, and business growth.',
    },
    {
      q: 'What is the AI Marketer Kit?',
      a: 'A comprehensive role-specific toolkit that turns marketers into AI operators. It combines Claude Skills, tested workflows, n8n automations, and AI employee templates across three progressive levels: Starter, Pro, and Expert.',
    },
    {
      q: 'Which AI tools are included?',
      a: 'Our ecosystem encompasses top foundational models (Claude 3.5, OpenAI, Gemini) and specialised tools across copywriting, design, video, research, automation (n8n, Make), and voice AI.',
    },
    {
      q: 'Do I need technical knowledge?',
      a: 'No prior coding experience is required. The Starter and Pro tiers include step-by-step walkthroughs, prompt templates, and pre-built workflows designed for non-technical operators.',
    },
    {
      q: 'What is an AI Skill?',
      a: 'An AI Skill is a specialised instruction framework and template packaged for LLMs (like Claude or GPT) that enables them to execute complex, professional-grade tasks autonomously.',
    },
    {
      q: 'What are AI agents?',
      a: 'AI agents are autonomous software systems built to perform specialized work — researching, qualifying leads, drafting reports, and answering customer queries without constant manual intervention.',
    },
    {
      q: 'What is n8n?',
      a: 'n8n is a powerful, flexible node-based workflow automation tool that lets you connect hundreds of apps, databases, and AI models to run automated pipelines without writing code.',
    },
    {
      q: 'Can businesses work with AutoGreen?',
      a: 'Yes. We partner with companies to audit their workflows, identify automation opportunities, and deploy custom AI solutions tailored to their industry and operational stack.',
    },
    {
      q: 'Can AutoGreen build custom AI systems?',
      a: 'Yes. Through AutoGreen Studio, we design and implement bespoke AI strategy, proprietary knowledge bases, voice agents, and custom AI employees for organizations of any scale.',
    },
    {
      q: 'Is the content updated as AI changes?',
      a: 'Yes. The ecosystem is continuously updated with new AI models, revised prompt architectures, updated automation templates, and weekly community insights.',
    },
    {
      q: 'Which countries can use AutoGreen?',
      a: 'AutoGreen AI is a global platform accessible worldwide with multi-currency checkout support, instant digital access, and global community membership.',
    },
  ];

  const marqueeItems = [
    'Different Businesses. One Green.',
    'AI is the new green.',
    'Discover AI.',
    'Build with AI.',
    'Automate the work.',
    'Create AI employees.',
    'Grow with intelligence.',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
        data-testid="hero-section"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,78,59,0.42),_transparent_65%)]" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-24 md:px-12">
          {/* Eyebrow */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
              AutoGreen AI — a global AI ecosystem
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="mt-8 font-heading text-[clamp(3.2rem,8.5vw,7rem)] font-light leading-[0.98] tracking-tighter text-white">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block">AI is the</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block">
                <span className="text-gradient-green font-normal">new green.</span>
              </span>
            </span>
          </h1>

          {/* Description Paragraphs */}
          <div className="mt-9 max-w-2xl space-y-4">
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              Thousands of businesses. Thousands of professions. Thousands of ways to work.{' '}
              <span className="text-white font-medium">One intelligence connects them all.</span>
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              AutoGreen AI helps people and businesses discover, use, automate and build with artificial intelligence.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/#kits" data-discover="true">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow group h-13 rounded-full bg-emerald-600 px-8 py-4 font-medium text-white transition-all duration-300 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="hero-explore-kits-cta"
              >
                <span>Explore AI Kits</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>

            <Link href="/about" data-discover="true">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm border shadow-sm h-13 rounded-full border-white/15 px-8 py-4 font-medium text-slate-200 transition-all duration-300 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-white/5"
                data-testid="hero-explore-autogreen-cta"
              >
                <span>Explore AutoGreen AI</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-5 w-5 text-emerald-400/60" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. EDITORIAL MARQUEE                                                      */}
      {/* ========================================================================= */}
      <div
        className="overflow-hidden border-y border-white/5 py-5 select-none bg-[#030712]/90"
        data-testid="editorial-marquee"
      >
        <div className="marquee-track flex items-center whitespace-nowrap">
          <div className="flex items-center shrink-0" aria-hidden="false">
            {marqueeItems.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center font-mono text-xs uppercase tracking-[0.35em] text-emerald-200/40"
              >
                <span className="px-10">{item}</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
              </span>
            ))}
          </div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            {marqueeItems.map((item, idx) => (
              <span
                key={`dup-${idx}`}
                className="flex items-center font-mono text-xs uppercase tracking-[0.35em] text-emerald-200/40"
              >
                <span className="px-10">{item}</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MANIFESTO / PHILOSOPHY SECTION                                         */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-36" data-testid="manifesto-section" id="philosophy">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {/* Eyebrow */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
              Our philosophy
            </p>
          </div>

          {/* Heading */}
          <div className="mt-6">
            <h2 className="max-w-3xl font-heading text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl text-white">
              Different Businesses. <span className="text-gradient-green">One Green.</span>
            </h2>
          </div>

          {/* 3 Columns */}
          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
            <div className="border-t border-white/10 pt-8">
              <span className="font-mono text-sm text-emerald-400/80 font-semibold">01</span>
              <h3 className="mt-4 font-heading text-2xl font-normal tracking-tight text-white">
                Every plant is different.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                The world is full of plants, trees and grasses. They vary in shape, size, purpose and growth — yet one colour connects them all.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <span className="font-mono text-sm text-emerald-400/80 font-semibold">02</span>
              <h3 className="mt-4 font-heading text-2xl font-normal tracking-tight text-white">
                Businesses are no different.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Different industries. Different people. Different challenges. Different goals. Thousands of ways to work, side by side.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <span className="font-mono text-sm text-emerald-400/80 font-semibold">03</span>
              <h3 className="mt-4 font-heading text-2xl font-normal tracking-tight text-white">
                AI is the common intelligence.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                One technology now connects the modern world of work. AutoGreen AI makes that intelligence easier to discover, understand and apply.
              </p>
            </div>
          </div>

          {/* Growth Chain Pills */}
          <div className="mt-20 flex flex-wrap items-center gap-x-4 gap-y-3" data-testid="growth-chain">
            <span className="flex items-center gap-4">
              <span className="rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] border-white/10 text-slate-400 bg-white/5">
                Nature
              </span>
              <ArrowRight className="h-4 w-4 text-emerald-500/50" />
            </span>

            <span className="flex items-center gap-4">
              <span className="rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] border-white/10 text-slate-400 bg-white/5">
                People
              </span>
              <ArrowRight className="h-4 w-4 text-emerald-500/50" />
            </span>

            <span className="flex items-center gap-4">
              <span className="rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] border-white/10 text-slate-400 bg-white/5">
                Businesses
              </span>
              <ArrowRight className="h-4 w-4 text-emerald-500/50" />
            </span>

            <span className="flex items-center gap-4">
              <span className="rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-semibold shadow-sm shadow-emerald-500/20">
                AI
              </span>
              <ArrowRight className="h-4 w-4 text-emerald-500/50" />
            </span>

            <span className="flex items-center gap-4">
              <span className="rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] border-white/10 text-slate-400 bg-white/5">
                Growth
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE ECOSYSTEM SECTION                                                  */}
      {/* ========================================================================= */}
      <section
        id="discover"
        className="border-t border-white/5 py-24 md:py-32"
        data-testid="ecosystem-section"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
                The ecosystem
              </p>
              <h2 className="mt-6 font-heading text-4xl font-light tracking-tight sm:text-5xl text-white">
                One ecosystem. <span className="text-gradient-green">Endless possibilities.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Six branches of the same idea — different ways to discover, use and build with AI.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Discover */}
            <div className="h-full">
              <Link
                className="group flex h-full flex-col rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:bg-[#0A1512]"
                data-testid="ecosystem-card-discover"
                href="/#resources"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-colors duration-500 group-hover:bg-emerald-500/20">
                  <Compass className="h-5 w-5 text-emerald-400" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-medium tracking-tight text-white">Discover</h3>
                <p className="mt-1 text-sm text-emerald-200/70 font-medium">Find the right AI tools.</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  Curated AI tools for every profession and industry — filtered by use case, difficulty and price.
                </p>
                <span className="mt-6 flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>

            {/* Card 2: Kits */}
            <div className="h-full">
              <Link
                className="group flex h-full flex-col rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:bg-[#0A1512]"
                data-testid="ecosystem-card-kits"
                href="/#kits"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-colors duration-500 group-hover:bg-emerald-500/20">
                  <Package className="h-5 w-5 text-emerald-400" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-medium tracking-tight text-white">Kits</h3>
                <p className="mt-1 text-sm text-emerald-200/70 font-medium">Get ready-to-use AI systems.</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  Role-specific AI toolkits — tools, prompts, workflows and automations in one place.
                </p>
                <span className="mt-6 flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>

            {/* Card 3: Automate */}
            <div className="h-full">
              <Link
                className="group flex h-full flex-col rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:bg-[#0A1512]"
                data-testid="ecosystem-card-automate"
                href="/#automate"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-colors duration-500 group-hover:bg-emerald-500/20">
                  <Workflow className="h-5 w-5 text-emerald-400" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-medium tracking-tight text-white">Automate</h3>
                <p className="mt-1 text-sm text-emerald-200/70 font-medium">Automate repetitive work.</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  Connect apps, data and AI so decisions and actions happen without you.
                </p>
                <span className="mt-6 flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>

            {/* Card 4: Agents */}
            <div className="h-full">
              <Link
                className="group flex h-full flex-col rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:bg-[#0A1512]"
                data-testid="ecosystem-card-agents"
                href="/#agents"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-colors duration-500 group-hover:bg-emerald-500/20">
                  <Bot className="h-5 w-5 text-emerald-400" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-medium tracking-tight text-white">Agents</h3>
                <p className="mt-1 text-sm text-emerald-200/70 font-medium">Build AI employees.</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  Specialised AI agents that research, sell, support and report alongside your team.
                </p>
                <span className="mt-6 flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>

            {/* Card 5: Voice */}
            <div className="h-full">
              <Link
                className="group flex h-full flex-col rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:bg-[#0A1512]"
                data-testid="ecosystem-card-voice"
                href="/#voice"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-colors duration-500 group-hover:bg-emerald-500/20">
                  <AudioLines className="h-5 w-5 text-emerald-400" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-medium tracking-tight text-white">Voice</h3>
                <p className="mt-1 text-sm text-emerald-200/70 font-medium">Deploy AI voice experiences.</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  Voice agents that qualify leads, book appointments and answer customers.
                </p>
                <span className="mt-6 flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>

            {/* Card 6: Studio */}
            <div className="h-full">
              <Link
                className="group flex h-full flex-col rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:bg-[#0A1512]"
                data-testid="ecosystem-card-studio"
                href="/#studio"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-colors duration-500 group-hover:bg-emerald-500/20">
                  <PenTool className="h-5 w-5 text-emerald-400" />
                </span>
                <h3 className="mt-6 font-heading text-xl font-medium tracking-tight text-white">Studio</h3>
                <p className="mt-1 text-sm text-emerald-200/70 font-medium">Build custom AI solutions.</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  Strategy, implementation and transformation — bespoke AI systems for your brand.
                </p>
                <span className="mt-6 flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED PRODUCT SECTION                                               */}
      {/* ========================================================================= */}
      <section className="border-t border-white/5 py-24 md:py-32" data-testid="featured-product-section">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2 md:px-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
              Featured product
            </p>
            <h2 className="mt-6 font-heading text-4xl font-light tracking-tight sm:text-5xl text-white">
              The AI Marketer Kit
            </h2>
            <p className="mt-4 font-heading text-xl text-emerald-200/90 font-medium">
              From AI user to AI marketing operator.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-400">
              Stop collecting AI tools. Start using AI like a marketer. The AI Marketer Kit gives you the tools, prompts, AI employees, workflows, automations and systems to work faster and build better marketing processes.
            </p>
            <div className="mt-9">
              <Link href="/#kits" data-discover="true">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow group h-13 rounded-full bg-emerald-600 px-8 py-4 font-medium text-white transition-all duration-300 hover:bg-emerald-500 hover:scale-[1.02]"
                  data-testid="featured-product-cta"
                >
                  <span>Explore the AI Marketer Kit</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>

          <div>
            <div className="drift-slow relative overflow-hidden rounded-3xl border border-white/10">
              <img
                alt="Abstract green organic form — the AutoGreen AI Marketer Kit"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                src="https://images.pexels.com/photos/25630339/pexels-photo-25630339.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.15),_rgba(2,6,23,0.55))]" />
              <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-[#030712]/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-emerald-200 backdrop-blur-md">
                Starter · Pro · Expert
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PRICING & TIERS LADDER (#kits)                                         */}
      {/* ========================================================================= */}
      <section
        id="kits"
        className="border-t border-white/5 py-24 md:py-32"
        data-testid="pricing-section"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {/* Header */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
              The AI Marketer Kit
            </p>
            <h2 className="mt-6 max-w-3xl font-heading text-4xl font-light tracking-tight sm:text-5xl text-white">
              Three levels. <span className="text-gradient-green">One AI-powered career path.</span>
            </h2>
            <p className="mt-5 font-mono text-sm text-slate-400">
              Learn AI <span className="text-emerald-400">→</span> Execute with AI{' '}
              <span className="text-emerald-400">→</span> Build with AI
            </p>
          </div>

          {/* Pricing Ladder 3-Column Cards */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3" data-testid="pricing-ladder">
              
              {/* Tier 1: Starter */}
              <div className="h-full">
                <div
                  className="relative flex h-full flex-col rounded-3xl border p-8 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 border-white/5 bg-[#070e17] hover:border-white/15"
                  data-testid="pricing-card-starter"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="pulse-dot h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: 'rgb(52, 211, 153)' }}
                    />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
                      {starterTier?.badge || 'Learn AI'}
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-2xl font-medium tracking-tight text-white">
                    {starterTier?.name || 'AI Marketer Starter'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {starterTier?.description || 'Discover what AI can do for your daily marketing work.'}
                  </p>

                  <div className="mt-7 flex items-baseline gap-2">
                    <span className="font-heading text-5xl font-light tracking-tight text-white" data-testid="pricing-starter-price">
                      {starterTier ? starterTier.price : '₹99'}
                    </span>
                    <span className="text-sm text-slate-400">one-time</span>
                  </div>

                  <ul className="mt-8 flex-1 space-y-3">
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>200+ AI tools</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>100+ prompts</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Claude Skills</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Beginner workflows</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Claude walkthroughs</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Notion Starter System</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>n8n introduction</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI Marketer Community</span>
                    </li>
                  </ul>

                  <Link href={starterTier ? `/checkout?guideId=${starterTier.id}&tier=starter` : '/checkout?tier=starter'} className="mt-8 block">
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm shadow px-4 py-3 group h-12 rounded-full font-medium transition-all duration-300 border border-white/10 bg-white/5 text-white hover:border-emerald-500/40 hover:bg-emerald-500/10"
                      data-testid="pricing-starter-cta"
                    >
                      <span>{starterTier?.cta || 'Start with Starter'}</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Tier 2: Pro */}
              <div className="h-full">
                <div
                  className="relative flex h-full flex-col rounded-3xl border p-8 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 border-white/5 bg-[#070e17] hover:border-white/15"
                  data-testid="pricing-card-pro"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="pulse-dot h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: 'rgb(251, 191, 36)' }}
                    />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
                      {proTier?.badge || 'Execute with AI'}
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-2xl font-medium tracking-tight text-white">
                    {proTier?.name || 'AI Marketer Pro'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {proTier?.description || 'Turn AI tools into repeatable marketing workflows.'}
                  </p>

                  <div className="mt-7 flex items-baseline gap-2">
                    <span className="font-heading text-5xl font-light tracking-tight text-white" data-testid="pricing-pro-price">
                      {proTier ? proTier.price : '₹599'}
                    </span>
                    <span className="text-sm text-slate-400">one-time</span>
                  </div>

                  <ul className="mt-8 flex-1 space-y-3">
                    <li className="flex items-start gap-2.5 text-sm text-slate-300 font-medium">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Everything in Starter</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Advanced AI tools</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Advanced Claude Skills</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Marketing workflows</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>n8n automation lab</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>10–20 automation workflows</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Marketing OS</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI reporting system</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI audit system</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Advanced research workflows</span>
                    </li>
                  </ul>

                  <Link href={proTier ? `/checkout?guideId=${proTier.id}&tier=pro` : '/checkout?tier=pro'} className="mt-8 block">
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm shadow px-4 py-3 group h-12 rounded-full font-medium transition-all duration-300 border border-white/10 bg-white/5 text-white hover:border-emerald-500/40 hover:bg-emerald-500/10"
                      data-testid="pricing-pro-cta"
                    >
                      <span>{proTier?.cta || 'Go Pro'}</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Tier 3: Expert (Featured) */}
              <div className="h-full">
                <div
                  className="relative flex h-full flex-col rounded-3xl border p-8 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 glow-card border-emerald-400/30 bg-[#07130F] shadow-[0_24px_80px_rgba(16,185,129,0.14)] md:-mt-5"
                  data-testid="pricing-card-expert"
                >
                  <span
                    className="absolute -top-3.5 left-8 rounded-full bg-emerald-500 px-3.5 py-1 text-xs font-semibold text-emerald-950"
                    data-testid="pricing-expert-badge"
                  >
                    {expertTier?.topBadge || 'Most Powerful'}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <span
                      className="pulse-dot h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: 'rgb(248, 113, 113)' }}
                    />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
                      {expertTier?.badge || 'Build with AI'}
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-2xl font-medium tracking-tight text-white">
                    {expertTier?.name || 'AI Marketer Expert'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {expertTier?.description || 'Build your own AI marketing department.'}
                  </p>

                  <div className="mt-7 flex items-baseline gap-2">
                    <span className="font-heading text-5xl font-light tracking-tight text-white" data-testid="pricing-expert-price">
                      {expertTier ? expertTier.price : '₹1,299'}
                    </span>
                    <span className="text-sm text-slate-400">one-time</span>
                  </div>

                  <ul className="mt-8 flex-1 space-y-3">
                    <li className="flex items-start gap-2.5 text-sm text-slate-200 font-medium">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Everything in Starter + Pro</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI employee builder</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI agents</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Advanced n8n</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI Agency OS</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI freelancer system</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>AI marketing agency system</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Custom workflow builder</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Monetization systems</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Expert community</span>
                    </li>
                  </ul>

                  <Link href={expertTier ? `/checkout?guideId=${expertTier.id}&tier=expert` : '/checkout?tier=expert'} className="mt-8 block">
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm shadow px-4 py-3 group h-12 rounded-full font-medium transition-all duration-300 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                      data-testid="pricing-expert-cta"
                    >
                      <span>{expertTier?.cta || 'Become an AI Operator'}</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Compare Table */}
          <div className="mt-20">
            <h3 className="mb-8 font-heading text-2xl font-normal tracking-tight text-white">
              Compare the kits
            </h3>

            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#070e17]" data-testid="comparison-table">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-5 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                      What&apos;s inside
                    </th>
                    <th className="p-5 text-center">
                      <span className="font-heading text-base font-medium text-white">Starter</span>
                      <span className="mt-1 block font-mono text-xs font-normal text-emerald-400">
                        {starterTier ? starterTier.price : '₹99'}
                      </span>
                    </th>
                    <th className="p-5 text-center">
                      <span className="font-heading text-base font-medium text-white">Pro</span>
                      <span className="mt-1 block font-mono text-xs font-normal text-emerald-400">
                        {proTier ? proTier.price : '₹599'}
                      </span>
                    </th>
                    <th className="p-5 text-center">
                      <span className="font-heading text-base font-medium text-white">Expert</span>
                      <span className="mt-1 block font-mono text-xs font-normal text-emerald-400">
                        {expertTier ? expertTier.price : '₹1,299'}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.03]">
                    <td className="p-5 text-sm text-slate-200">AI Tools</td>
                    <td className="p-5 text-center text-sm text-slate-400">200+</td>
                    <td className="p-5 text-center text-sm text-slate-400">200+ Advanced</td>
                    <td className="p-5 text-center text-sm text-slate-400">200+ Advanced</td>
                  </tr>
                  <tr className="border-b border-white/[0.03] bg-white/[0.02]">
                    <td className="p-5 text-sm text-slate-200">Prompt Library</td>
                    <td className="p-5 text-center text-sm text-slate-400">100+</td>
                    <td className="p-5 text-center text-sm text-slate-400">100+</td>
                    <td className="p-5 text-center text-sm text-slate-400">100+</td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="p-5 text-sm text-slate-200">Claude Skills</td>
                    <td className="p-5 text-center text-sm text-slate-400">Starter</td>
                    <td className="p-5 text-center text-sm text-slate-400">Advanced</td>
                    <td className="p-5 text-center text-sm text-slate-400">Advanced</td>
                  </tr>
                  <tr className="border-b border-white/[0.03] bg-white/[0.02]">
                    <td className="p-5 text-sm text-slate-200">AI Employees</td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="p-5 text-sm text-slate-200">Marketing Workflows</td>
                    <td className="p-5 text-center text-sm text-slate-400">Beginner</td>
                    <td className="p-5 text-center text-sm text-slate-400">Advanced</td>
                    <td className="p-5 text-center text-sm text-slate-400">Advanced</td>
                  </tr>
                  <tr className="border-b border-white/[0.03] bg-white/[0.02]">
                    <td className="p-5 text-sm text-slate-200">n8n Automation</td>
                    <td className="p-5 text-center text-sm text-slate-400">Introduction</td>
                    <td className="p-5 text-center text-sm text-slate-400">Automation lab</td>
                    <td className="p-5 text-center text-sm text-slate-400">Advanced n8n</td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="p-5 text-sm text-slate-200">Notion System</td>
                    <td className="p-5 text-center text-sm text-slate-400">Starter System</td>
                    <td className="p-5 text-center text-sm text-slate-400">Marketing OS</td>
                    <td className="p-5 text-center text-sm text-slate-400">Agency OS</td>
                  </tr>
                  <tr className="border-b border-white/[0.03] bg-white/[0.02]">
                    <td className="p-5 text-sm text-slate-200">Reporting</td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="p-5 text-sm text-slate-200">AI Audits</td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                  </tr>
                  <tr className="border-b border-white/[0.03] bg-white/[0.02]">
                    <td className="p-5 text-sm text-slate-200">AI Agents</td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="p-5 text-sm text-slate-200">Agency Systems</td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                  </tr>
                  <tr className="border-b border-white/[0.03] bg-white/[0.02]">
                    <td className="p-5 text-sm text-slate-200">Monetization</td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center text-slate-500"><Minus className="mx-auto h-4 w-4" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                  </tr>
                  <tr className="border-b border-white/[0.03]">
                    <td className="p-5 text-sm text-slate-200">Community</td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                    <td className="p-5 text-center"><Check className="mx-auto h-4 w-4 text-emerald-400" /></td>
                    <td className="p-5 text-center text-sm text-slate-400">Expert circle</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHY SECTION                                                            */}
      {/* ========================================================================= */}
      <section className="border-t border-white/5 py-24 md:py-32" data-testid="why-section">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div>
            <h2 className="max-w-3xl font-heading text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl text-white">
              AI is moving fast. You shouldn&apos;t have to{' '}
              <span className="text-gradient-green">figure it out alone.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="h-full">
              <div
                className="h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="why-card-0"
              >
                <span className="font-mono text-xs text-emerald-400/80 font-semibold">01</span>
                <h3 className="mt-4 font-heading text-xl font-medium tracking-tight text-white">Curated</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  We separate useful AI from AI noise.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="h-full">
              <div
                className="h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="why-card-1"
              >
                <span className="font-mono text-xs text-emerald-400/80 font-semibold">02</span>
                <h3 className="mt-4 font-heading text-xl font-medium tracking-tight text-white">Practical</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Everything is designed around real work.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="h-full">
              <div
                className="h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="why-card-2"
              >
                <span className="font-mono text-xs text-emerald-400/80 font-semibold">03</span>
                <h3 className="mt-4 font-heading text-xl font-medium tracking-tight text-white">Connected</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Tools, workflows and systems work together.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="h-full">
              <div
                className="h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="why-card-3"
              >
                <span className="font-mono text-xs text-emerald-400/80 font-semibold">04</span>
                <h3 className="mt-4 font-heading text-xl font-medium tracking-tight text-white">
                  Continuously evolving
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  AI changes constantly. AutoGreen evolves with it.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
              Not another AI tools directory —{' '}
              <span className="text-white font-medium">an AI intelligence ecosystem</span>, built to take you from discovery to transformation.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HOW IT WORKS SECTION                                                   */}
      {/* ========================================================================= */}
      <section
        id="automate"
        className="border-t border-white/5 py-24 md:py-32"
        data-testid="how-it-works-section"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
            How it works
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-4">
            <div>
              <span className="font-heading text-6xl font-light text-emerald-500/20">01</span>
              <h3 className="mt-4 flex items-center gap-2 font-heading text-xl font-medium tracking-tight text-white">
                <span>Discover</span>
                <ArrowRight className="h-4 w-4 text-emerald-500/50" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Find the right AI tools and capabilities.
              </p>
            </div>

            <div>
              <span className="font-heading text-6xl font-light text-emerald-500/20">02</span>
              <h3 className="mt-4 flex items-center gap-2 font-heading text-xl font-medium tracking-tight text-white">
                <span>Learn</span>
                <ArrowRight className="h-4 w-4 text-emerald-500/50" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Understand how to use them.
              </p>
            </div>

            <div>
              <span className="font-heading text-6xl font-light text-emerald-500/20">03</span>
              <h3 className="mt-4 flex items-center gap-2 font-heading text-xl font-medium tracking-tight text-white">
                <span>Build</span>
                <ArrowRight className="h-4 w-4 text-emerald-500/50" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Create workflows, automations and AI employees.
              </p>
            </div>

            <div>
              <span className="font-heading text-6xl font-light text-emerald-500/20">04</span>
              <h3 className="mt-4 flex items-center gap-2 font-heading text-xl font-medium tracking-tight text-white">
                <span>Grow</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Use AI to improve productivity, business and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. AUDIENCE SECTION                                                       */}
      {/* ========================================================================= */}
      <section
        id="agents"
        className="border-t border-white/5 py-24 md:py-32"
        data-testid="audience-section"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid items-end gap-10 md:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
                Who it&apos;s for
              </p>
              <h2 className="mt-6 font-heading text-4xl font-light tracking-tight sm:text-5xl text-white">
                Who is AutoGreen for?
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img
                alt="A team working together with AI in a modern workspace"
                className="aspect-[16/8] w-full object-cover"
                loading="lazy"
                src="https://images.pexels.com/photos/7212946/pexels-photo-7212946.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 to-transparent" />
            </div>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Students */}
            <div className="h-full">
              <div
                className="group h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="audience-card-0"
              >
                <GraduationCap className="h-5 w-5 text-emerald-400" />
                <h3 className="mt-5 font-heading text-lg font-medium tracking-tight text-white">
                  For Students
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Learn AI and become future-ready.
                </p>
              </div>
            </div>

            {/* 2. Marketers */}
            <div className="h-full">
              <div
                className="group h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="audience-card-1"
              >
                <Megaphone className="h-5 w-5 text-emerald-400" />
                <h3 className="mt-5 font-heading text-lg font-medium tracking-tight text-white">
                  For Marketers
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Create more and work faster.
                </p>
              </div>
            </div>

            {/* 3. Freelancers */}
            <div className="h-full">
              <div
                className="group h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="audience-card-2"
              >
                <Laptop className="h-5 w-5 text-emerald-400" />
                <h3 className="mt-5 font-heading text-lg font-medium tracking-tight text-white">
                  For Freelancers
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Deliver more without increasing workload.
                </p>
              </div>
            </div>

            {/* 4. Founders */}
            <div className="h-full">
              <div
                className="group h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="audience-card-3"
              >
                <Rocket className="h-5 w-5 text-emerald-400" />
                <h3 className="mt-5 font-heading text-lg font-medium tracking-tight text-white">
                  For Founders
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Build leverage into your business.
                </p>
              </div>
            </div>

            {/* 5. Agencies */}
            <div className="h-full">
              <div
                className="group h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="audience-card-4"
              >
                <Building2 className="h-5 w-5 text-emerald-400" />
                <h3 className="mt-5 font-heading text-lg font-medium tracking-tight text-white">
                  For Agencies
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Scale execution with AI.
                </p>
              </div>
            </div>

            {/* 6. Enterprises */}
            <div className="h-full">
              <div
                className="group h-full rounded-3xl border border-white/5 bg-[#070e17] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-emerald-500/25"
                data-testid="audience-card-5"
              >
                <Landmark className="h-5 w-5 text-emerald-400" />
                <h3 className="mt-5 font-heading text-lg font-medium tracking-tight text-white">
                  For Enterprises
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Implement AI across workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. METRICS SECTION                                                       */}
      {/* ========================================================================= */}
      <section
        id="voice"
        className="relative overflow-hidden border-t border-white/5 py-28 md:py-36"
        data-testid="metrics-section"
      >
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
          loading="lazy"
          src="https://images.pexels.com/photos/34169562/pexels-photo-34169562.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/75 to-[#030712] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <div>
            <h2 className="max-w-2xl font-heading text-4xl font-light tracking-tight sm:text-5xl text-white">
              Built for people who want to <span className="text-gradient-green">work smarter.</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4">
            <div data-testid="metric-0">
              <span className="font-heading text-5xl font-light tracking-tight text-emerald-300 md:text-6xl">
                200+
              </span>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                AI tools curated
              </p>
            </div>

            <div data-testid="metric-1">
              <span className="font-heading text-5xl font-light tracking-tight text-emerald-300 md:text-6xl">
                100+
              </span>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                Marketing prompts
              </p>
            </div>

            <div data-testid="metric-2">
              <span className="font-heading text-5xl font-light tracking-tight text-emerald-300 md:text-6xl">
                50+
              </span>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                AI workflows
              </p>
            </div>

            <div data-testid="metric-3">
              <span className="font-heading text-5xl font-light tracking-tight text-emerald-300 md:text-6xl">
                10+
              </span>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                AI employees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. NEWSLETTER SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32" data-testid="newsletter-section">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#070e17] p-10 md:p-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,_rgba(16,185,129,0.12),_transparent_50%)]" />

            <div className="relative max-w-2xl">
              <h2 className="font-heading text-4xl font-light tracking-tight sm:text-5xl text-white">
                Stay ahead of <span className="text-gradient-green">AI.</span>
              </h2>
              <p className="mt-5 text-base text-slate-400 sm:text-lg">
                New tools. Better workflows. Practical AI. No noise.
              </p>

              <div className="mt-8">
                {newsletterSubscribed ? (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>Thank you for subscribing! You are now connected to the Green AI briefings.</span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col gap-3 sm:flex-row"
                    data-testid="newsletter-form"
                  >
                    <input
                      className="flex w-full rounded-md border px-4 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 h-13 flex-1 border-white/10 bg-white/5 py-4 placeholder:text-slate-500 text-white"
                      required
                      placeholder="Enter your email"
                      data-testid="newsletter-email-input"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm shadow group h-13 bg-emerald-600 px-7 py-4 font-medium text-white transition-colors duration-300 hover:bg-emerald-500"
                      type="submit"
                      data-testid="newsletter-submit-button"
                    >
                      <span>Join the Green</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FAQ SECTION                                                           */}
      {/* ========================================================================= */}
      <section
        id="resources"
        className="border-t border-white/5 py-24 md:py-32"
        data-testid="faq-section"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
              Questions
            </p>
            <h2 className="mt-6 font-heading text-4xl font-light tracking-tight sm:text-5xl text-white">
              Frequently asked
            </h2>
          </div>

          <div className="md:col-span-8">
            <div className="w-full" data-testid="faq-accordion">
              {faqData.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-white/5">
                    <h3>
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="flex flex-1 w-full items-center justify-between py-5 text-left font-heading text-lg font-normal tracking-tight text-white transition-colors duration-300 hover:text-emerald-300"
                        data-testid={`faq-question-${idx}`}
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-400' : ''
                          }`}
                        />
                      </button>
                    </h3>
                    {isOpen && (
                      <div
                        className="overflow-hidden pb-5 text-sm leading-relaxed text-slate-400"
                        data-testid={`faq-answer-${idx}`}
                      >
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FINAL CTA SECTION                                                     */}
      {/* ========================================================================= */}
      <section
        id="studio"
        className="relative overflow-hidden py-28 md:py-40"
        data-testid="final-cta-section"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(6,78,59,0.45),_transparent_65%)]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center md:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">
            Grow with intelligence
          </p>

          <h2 className="mt-6 font-heading text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl md:text-6xl text-white">
            Every business can grow with the{' '}
            <span className="text-gradient-green">right intelligence.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base text-slate-400 sm:text-lg">
            Discover the tools. Build the systems. Grow with AI.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/#discover" data-discover="true">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow group h-13 rounded-full bg-emerald-600 px-8 py-4 font-medium text-white transition-all duration-300 hover:bg-emerald-500 hover:scale-[1.02]"
                data-testid="final-cta-explore-button"
              >
                <span>Explore AutoGreen AI</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>

            <Link href="/#kits" data-discover="true">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm border shadow-sm h-13 rounded-full border-white/15 px-8 py-4 font-medium text-slate-200 transition-all duration-300 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-white/5"
                data-testid="final-cta-kit-button"
              >
                <span>Start with the AI Marketer Kit</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
