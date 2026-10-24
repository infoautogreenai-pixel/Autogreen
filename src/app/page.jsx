'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, CheckCircle, Bot, Zap, Mic, Code, BookOpen, ChevronDown, Check, Compass, Briefcase, Terminal, Activity, Send, X } from 'lucide-react';
export default function HomePage() {
    const [guides, setGuides] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    // Interactive Agent Tab State
    const [activeAgentTab, setActiveAgentTab] = useState(0);
    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(0);
    // Newsletter State
    const [emailSubscribed, setEmailSubscribed] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    // Request a Demo Modal State
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [demoSubmitted, setDemoSubmitted] = useState(false);
    const [demoForm, setDemoForm] = useState({ name: '', email: '', message: '' });
    // Interactive Canvas Ref for constellation background
    const canvasRef = useRef(null);
    useEffect(() => {
        // Particle constellation animation
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        const handleResize = () => {
            if (!canvas)
                return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        const particles = [];
        for (let i = 0; i < 45; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.8 + 1,
                alpha: Math.random() * 0.5 + 0.2,
            });
        }
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - dist / 130)})`;
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
                if (p.x < 0)
                    p.x = width;
                if (p.x > width)
                    p.x = 0;
                if (p.y < 0)
                    p.y = height;
                if (p.y > height)
                    p.y = 0;
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
    useEffect(() => {
        async function fetchGuides() {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (selectedCategory !== 'All')
                    queryParams.set('category', selectedCategory);
                if (searchQuery)
                    queryParams.set('search', searchQuery);
                const res = await fetch(`/api/guides?${queryParams.toString()}`);
                const data = await res.json();
                if (data.success) {
                    setGuides(data.guides || []);
                    if (data.categories) {
                        setCategories(data.categories);
                    }
                }
            }
            catch (err) {
                console.error('Error fetching guides:', err);
            }
            finally {
                setLoading(false);
            }
        }
        const timer = setTimeout(() => {
            fetchGuides();
        }, 200);
        return () => clearTimeout(timer);
    }, [selectedCategory, searchQuery]);
    // Ecosystem Pillars Data
    const pillars = [
        {
            step: '01',
            tag: 'Discover',
            title: 'Find the right AI tools.',
            desc: 'Curated AI tools for every profession and industry — filtered by use case, difficulty, and stack.',
            icon: Compass,
            gradient: 'from-emerald-500/20 to-teal-500/10',
            actionText: 'Explore Directory',
            link: '#resources'
        },
        {
            step: '02',
            tag: 'Kits',
            title: 'Get ready-to-use AI systems.',
            desc: 'Role-specific AI toolkits — tools, prompts, workflows and automations in one place.',
            icon: Briefcase,
            gradient: 'from-emerald-500/25 to-green-600/10',
            actionText: 'View AI Kits',
            link: '#kits'
        },
        {
            step: '03',
            tag: 'Automate',
            title: 'Automate repetitive work.',
            desc: 'Connect apps, data and AI so decisions and actions happen without you.',
            icon: Zap,
            gradient: 'from-emerald-500/20 to-cyan-600/10',
            actionText: 'See Automations',
            link: '#automate'
        },
        {
            step: '04',
            tag: 'Agents',
            title: 'Build AI employees.',
            desc: 'Specialised AI agents that research, sell, support and report alongside your team.',
            icon: Bot,
            gradient: 'from-emerald-500/20 to-lime-600/10',
            actionText: 'Meet The Agents',
            link: '#agents'
        },
        {
            step: '05',
            tag: 'Voice',
            title: 'Deploy AI voice experiences.',
            desc: 'Natural, conversational voice agents for sales, support, qualification, and booking.',
            icon: Mic,
            gradient: 'from-emerald-500/20 to-teal-600/10',
            actionText: 'Explore Voice',
            link: '#voice'
        },
        {
            step: '06',
            tag: 'Studio',
            title: 'Build custom AI solutions.',
            desc: 'Strategy, implementation and transformation — bespoke AI systems for your brand.',
            icon: Code,
            gradient: 'from-emerald-500/20 to-emerald-700/10',
            actionText: 'Contact Studio',
            link: 'mailto:contact@autogreen.ai'
        }
    ];
    // Dynamic AI Marketer Kit Tiers Data (Synced with MongoDB Atlas & /api/kits)
    const defaultKits = [
        {
            id: '6adc8def486c185f0a88bdd2',
            guideId: '6adc8def486c185f0a88bdd2',
            name: 'AI Marketer Starter',
            badge: 'LEARN AI',
            dotColor: 'emerald',
            price: '₹99',
            originalPrice: '₹299',
            description: 'Discover what AI can do for your daily marketing work.',
            features: [
                '200+ AI tools',
                '100+ prompts',
                'Claude Skills',
                'Beginner workflows',
                'Claude walkthroughs',
                'Notion Starter System',
                'n8n introduction',
                'AI Marketer Community'
            ],
            cta: 'Start with Starter →',
            popular: false
        },
        {
            id: '6adc8def486c185f0a88bdd5',
            guideId: '6adc8def486c185f0a88bdd5',
            name: 'AI Marketer Pro',
            badge: 'EXECUTE WITH AI',
            dotColor: 'amber',
            price: '₹599',
            originalPrice: '₹1,499',
            description: 'Turn AI tools into repeatable marketing workflows.',
            features: [
                'Everything in Starter',
                'Advanced AI tools',
                'Advanced Claude Skills',
                'Marketing workflows',
                'n8n automation lab',
                '10–20 automation workflows',
                'Marketing OS',
                'AI reporting system',
                'AI audit system',
                'Advanced research workflows'
            ],
            cta: 'Go Pro →',
            popular: false
        },
        {
            id: '6adc8def486c185f0a88bdd8',
            guideId: '6adc8def486c185f0a88bdd8',
            name: 'AI Marketer Expert',
            badge: 'BUILD WITH AI',
            topBadge: 'Most Powerful',
            dotColor: 'rose',
            price: '₹1,299',
            originalPrice: '₹2,999',
            description: 'Build your own AI marketing department.',
            features: [
                'Everything in Starter + Pro',
                'AI employee builder',
                'AI agents',
                'Advanced n8n',
                'AI Agency OS',
                'AI freelancer system',
                'AI marketing agency system',
                'Custom workflow builder',
                'Monetization systems',
                'Expert community'
            ],
            cta: 'Become an AI Operator →',
            popular: true
        }
    ];

    const [kits, setKits] = useState(defaultKits);

    // Fetch dynamic kits from database
    useEffect(() => {
        async function loadKits() {
            try {
                const res = await fetch('/api/kits');
                const data = await res.json();
                if (data.success && Array.isArray(data.tiers) && data.tiers.length > 0) {
                    setKits(data.tiers);
                }
            } catch (err) {
                console.error('Error fetching dynamic kits:', err);
            }
        }
        loadKits();
    }, []);
    // AI Agents Directory Data
    const agents = [
        {
            name: 'AI Research Agent',
            role: 'Market & Competitive Intelligence',
            status: 'Autonomous Worker',
            capabilities: [
                'Scrapes competitor pricing, offerings and ads',
                'Synthesizes industry whitepapers into 2-page briefs',
                'Monitors social sentiment and emergent trends'
            ],
            sampleOutput: 'Identified 3 market gaps in B2B AI automation. Generated executive summary + 14 reference citations.'
        },
        {
            name: 'AI Marketing Agent',
            role: 'Multi-Channel Campaign Architect',
            status: 'Autonomous Worker',
            capabilities: [
                'Drafts high-converting landing page copy and headlines',
                'Schedules omnichannel social variations with hooks',
                'Conducts A/B test analysis on CTR and conversion'
            ],
            sampleOutput: 'Generated 5 high-converting ad hooks with 9.2% estimated CTR increase over baseline.'
        },
        {
            name: 'AI Support Agent',
            role: '24/7 Context-Aware Customer Care',
            status: 'Real-time Autonomous',
            capabilities: [
                'Instant answers grounded in company documentation',
                'Processes ticket escalation with sentiment scoring',
                'Integrates with Slack, Zendesk, and Intercom'
            ],
            sampleOutput: 'Resolved 84% of tier-1 customer inquiries instantly with a 98.7% satisfaction rating.'
        },
        {
            name: 'AI Reporting Agent',
            role: 'KPI & Revenue Data Synthesizer',
            status: 'Scheduled Worker',
            capabilities: [
                'Extracts data from Stripe, GA4, and CRM systems',
                'Translates tabular metrics into actionable narrative',
                'Dispatches Monday morning executive briefs'
            ],
            sampleOutput: 'Weekly brief sent: CAC dropped 18%, MRR increased 12.4% driven by Kit Tier 2.'
        },
        {
            name: 'AI Lead Qualification Agent',
            role: 'High-Intent Prospect Scoring',
            status: 'Autonomous Inbound',
            capabilities: [
                'Enriches company size, tech stack, and LinkedIn data',
                'Interviews inbound visitors via conversational chat',
                'Auto-books qualified meetings on sales calendars'
            ],
            sampleOutput: 'Qualified 42 enterprise leads this week and routed 18 direct calls to account executives.'
        }
    ];
    // FAQ Data
    const faqs = [
        {
            q: 'What is AutoGreen AI?',
            a: 'AutoGreen AI is a global AI ecosystem. We help people and businesses discover the right AI tools, learn to use them, automate their work and build custom AI systems — from individual workflows to full AI employees.'
        },
        {
            q: 'Who is AutoGreen AI for?',
            a: 'AutoGreen is built for professionals, creators, agency owners, SMEs, and enterprise operators. If you work in modern business, AutoGreen helps you work faster, automate routine operations, and lead with AI.'
        },
        {
            q: 'What is the AI Marketer Kit?',
            a: 'A role-specific digital toolkit that turns marketers into AI operators. It combines Claude Skills, tested workflows, n8n automations, and AI employee templates across three progressive levels: Starter, Community, and Expert.'
        },
        {
            q: 'Which AI tools and models are included?',
            a: 'Our ecosystem encompasses top foundational models (Claude 3.5, OpenAI, Gemini) and specialised tools across copywriting, design, video, research, automation (n8n, Make), and voice AI.'
        },
        {
            q: 'What are AI agents and AI employees?',
            a: 'AI agents are autonomous software systems built to perform specialised work — researching, qualifying leads, drafting reports, and answering customer queries without constant manual intervention.'
        },
        {
            q: 'Can businesses partner with AutoGreen Studio for custom systems?',
            a: 'Yes. Through AutoGreen Automate, Agents, Voice, and Studio, we design and implement bespoke AI strategy, proprietary knowledge bases, and custom agents for organizations of any scale.'
        },
        {
            q: 'How does digital access and DRM protection work?',
            a: 'All guides and toolkits purchased on AutoGreen are delivered through our high-performance in-browser DRM reader. Content is encrypted, personalized with dynamic watermarks, and synchronized across your devices.'
        }
    ];
    return (<div className="relative min-h-screen bg-[#FFFFFF] text-slate-900 selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Interactive Constellation Background Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-20"/>

      {/* Ambient Soft Emerald Glow Elements */}
      <div className="ambient-glow -top-32 left-1/2 -translate-x-1/2 h-[550px] w-[550px] bg-emerald-100/40"/>
      <div className="ambient-glow top-[900px] -left-40 h-[450px] w-[450px] bg-teal-100/30"/>
      <div className="ambient-glow top-[2200px] -right-40 h-[550px] w-[550px] bg-emerald-100/30"/>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (2-COLUMN GRID)                                          */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (2-COLUMN GRID - MATCHING REFERENCE DESIGN)              */}
      {/* ========================================================================= */}
      <section className="relative z-10 bg-[#FAFAFC] text-slate-900 border-b border-slate-200 py-[35px] sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* GRID 1 (LEFT): Text, Heading, URL Input & Contact */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left z-10">
              
              {/* Eyebrow */}
              <div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1B1D3A] font-sans">
                  WELCOME TO AUTOGREEN
                </span>
              </div>

              {/* Main Headline matching reference design */}
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.08] text-[#1B1D3A]">
                <span className="text-[#E94D4D]">Digital</span> <br />
                <span>Marketing</span> <br />
                <span className="relative inline-block border-[1.5px] border-[#4A90E2] bg-[#F0F6FF]/70 rounded-md px-3.5 py-0.5 mt-1 select-none text-[#1B1D3A]">
                  Success
                  {/* 8 resize/drag handles matching reference graphic */}
                  <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                  <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                  <span className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                  <span className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                  <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                  <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] border-[#4A90E2] rounded-[1px]"></span>
                </span>
              </h1>

              {/* Subheading Description */}
              <p className="text-black text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed font-normal">
                Ensuring the best return on investment for your bespoke SEO campaign requirement.
              </p>

              {/* Interactive URL / Search Box + Analyze Button */}
              <div className="pt-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = '#kits';
                  }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50 max-w-lg transition-all focus-within:border-[#4A90E2] focus-within:ring-2 focus-within:ring-[#4A90E2]/20"
                >
                  <input
                    type="text"
                    placeholder="http://yoursite.com"
                    className="px-4 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none flex-1 font-sans"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0 mt-2 sm:mt-0"
                  >
                    Analyze Your Site
                  </button>
                </form>
              </div>

              {/* Contact Info Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-black">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E94D4D]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold text-[#1B1D3A] text-base block tracking-tight">800-123-4567</span>
                    <span className="text-black text-[11px] font-semibold uppercase tracking-wider">INFO@COMPANY.COM</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="#kits"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <span>Explore AI Kits</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* GRID 2 (RIGHT): Hero Image, Faint ERIO watermark & Top-Right CTA Card */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Subtle background text watermark "ERIO" matching reference design */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-[120px] font-black text-slate-200/50 select-none pointer-events-none tracking-widest hidden lg:block font-heading -rotate-90 origin-center">
                ERIO
              </div>

              {/* Top-Right Floating "Start growing" Dark Card (from reference design) */}
              <div className="absolute -top-4 right-0 sm:right-2 z-20 hidden sm:block bg-[#091527] p-6 shadow-2xl text-left w-52 rounded-none">
                <p className="text-sm font-bold text-white leading-snug">
                  Start growing<br />with AutoGreen.
                </p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white uppercase tracking-wider hover:underline"
                >
                  <span>SIGN IN</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Main Image from D:\sameer sir ai tols\public\images\herobanner homepage.png */}
              <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-none flex justify-center">
                <img
                  src="/images/herobanner_homepage.png"
                  alt="AutoGreen Digital Marketing Success"
                  className="w-full max-w-[520px] h-auto object-contain"
                />
              </div>

              {/* Subtle "SCROLL |" Indicator */}
              <div className="absolute -right-6 bottom-8 hidden xl:flex items-center gap-2 -rotate-90 origin-right text-[10px] uppercase font-mono tracking-widest text-slate-400">
                <span className="font-bold">SCROLL</span>
                <span className="w-6 h-0.5 bg-[#1B1D3A] inline-block"></span>
              </div>

            </div>

          </div>

          {/* Hero Ecosystem Stats Row */}
          <div className="mt-12 sm:mt-16 border-t border-slate-200 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4 text-center">
              <div>
                <p className="text-3xl font-extrabold text-[#1B1D3A] tracking-tight">450+</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-600 font-bold mt-1">Curated AI Tools</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#1B1D3A] tracking-tight">12,000+</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-600 font-bold mt-1">Active AI Operators</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#1B1D3A] tracking-tight">85,000+</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-600 font-bold mt-1">Automations Deployed</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#1B1D3A] tracking-tight">99.4%</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-600 font-bold mt-1">Workflow Reliability</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHY CHOOSE US / BOOST TRAFFIC SECTION (WHITE BACKGROUND, BLACK TEXT)   */}
      {/* ========================================================================= */}
      <section id="discover" className="relative z-10 bg-white text-slate-900 py-[35px] sm:py-20 lg:py-28 border-b border-slate-200 overflow-hidden">
        
        {/* Subtle World Map Silhouette Watermark in Background */}
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-1/2 h-full opacity-40 select-none flex items-center justify-center">
          <svg className="w-full h-auto max-w-xl text-slate-100 fill-current" viewBox="0 0 1000 500">
            <path d="M150,150 Q180,120 220,150 T290,140 T320,200 T270,260 T180,280 T130,230 Z" />
            <path d="M480,130 Q540,110 590,140 T650,220 T580,310 T490,260 T460,180 Z" />
            <path d="M720,160 Q780,120 850,170 T890,260 T820,330 T730,270 T700,210 Z" />
            <path d="M220,320 Q260,300 290,340 T270,420 T210,400 Z" />
            <path d="M780,350 Q830,330 870,370 T840,430 T780,410 Z" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT: 2x2 Grid of Feature Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              
              {/* Card 1: Orange/Amber Sphere */}
              <div className="rounded-2xl bg-white border border-slate-100 p-6 sm:p-7 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 text-left group">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-md shadow-orange-500/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  {/* Gloss highlight */}
                  <div className="absolute top-1.5 left-2 w-4 h-2 rounded-full bg-white/45 blur-[0.5px]"></div>
                  <div className="absolute bottom-1 right-2 w-3 h-3 rounded-full bg-black/15"></div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                  Discover, Explore the product
                </h3>
              </div>

              {/* Card 2: Blue/Cyan Sphere */}
              <div className="rounded-2xl bg-white border border-slate-100 p-6 sm:p-7 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 text-left group">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-md shadow-blue-500/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <div className="absolute top-1.5 left-2 w-4 h-2 rounded-full bg-white/45 blur-[0.5px]"></div>
                  <div className="absolute bottom-1 right-2 w-3 h-3 rounded-full bg-black/15"></div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                  Art Direction & Brand Strategy
                </h3>
              </div>

              {/* Card 3: Lime/Green Sphere */}
              <div className="rounded-2xl bg-white border border-slate-100 p-6 sm:p-7 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 text-left group">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-lime-300 via-emerald-500 to-green-600 shadow-md shadow-emerald-500/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <div className="absolute top-1.5 left-2 w-4 h-2 rounded-full bg-white/45 blur-[0.5px]"></div>
                  <div className="absolute bottom-1 right-2 w-3 h-3 rounded-full bg-black/15"></div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                  Product UX, Design & Development
                </h3>
              </div>

              {/* Card 4: Purple/Violet Sphere */}
              <div className="rounded-2xl bg-white border border-slate-100 p-6 sm:p-7 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 text-left group">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-700 shadow-md shadow-purple-500/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <div className="absolute top-1.5 left-2 w-4 h-2 rounded-full bg-white/45 blur-[0.5px]"></div>
                  <div className="absolute bottom-1 right-2 w-3 h-3 rounded-full bg-black/15"></div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                  Marketing Strategy & SEO Campaigns
                </h3>
              </div>

            </div>

            {/* RIGHT: Why Choose Us Content & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Eyebrow */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B1D3A]">
                  WHY CHOOSE US
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Boosts Your Website Traffic!
              </h2>

              {/* Description */}
              <p className="text-black text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                We are passionate about our work. Our designers stay ahead of the curve to provide engaging and user-friendly website designs to make your business stand out. Our developers are committed to maintaining the highest web standards so that your site will withstand the test of time. We care about your business, which is why we work with you.
              </p>

              {/* Discover More Button */}
              <div className="pt-2">
                <Link
                  href="#kits"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-md border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider transition-all shadow-sm group"
                >
                  <span>Discover More</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED AI KITS & TIERS (#kits)                                       */}
      {/* ========================================================================= */}
      <section id="kits" className="relative z-10 py-[45px] sm:py-24 bg-[#080d1a] border-t border-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Briefcase className="h-3.5 w-3.5"/>
              <span>DIGITAL TOOLKITS & WORKFLOWS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Start with the <span className="text-emerald-400">AI Marketer Kit</span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              A role-specific digital toolkit that turns marketers into AI operators. It combines Claude Skills,
              workflows, n8n automations, and AI employees across three progressive levels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {kits.map((tier) => {
              const isExpert = Boolean(tier.popular || tier.topBadge || tier.name?.toLowerCase().includes('expert'));
              const dotColorClass =
                tier.dotColor === 'amber'
                  ? 'bg-amber-400'
                  : tier.dotColor === 'rose'
                  ? 'bg-rose-500'
                  : 'bg-emerald-400';

              return (
                <div
                  key={tier.name || tier.id}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#0c101d] ${
                    isExpert
                      ? 'border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 lg:-translate-y-2'
                      : 'border border-slate-800/80 hover:border-slate-700 shadow-xl'
                  }`}
                >
                  {/* Top Floating Badge for Most Powerful */}
                  {tier.topBadge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-bold tracking-wide shadow-md shadow-emerald-500/25">
                      {tier.topBadge}
                    </div>
                  )}

                  <div>
                    {/* Tier Tag Line with Colored Dot */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColorClass}`} />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
                        {tier.badge}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-2xl font-bold text-white tracking-tight">{tier.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 min-h-[38px] leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Price in ₹ */}
                    <div className="mt-6 mb-7 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400 font-medium">one-time</span>
                    </div>

                    {/* Checklist Features */}
                    <div className="space-y-3.5 mb-8">
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-300">
                          <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-6 border-t border-slate-800/80">
                    <Link
                      href={`/checkout?guideId=${tier.guideId || tier.id}&tier=${encodeURIComponent(
                        tier.name
                      )}&price=${encodeURIComponent(tier.price)}`}
                      className={`w-full py-3.5 px-6 rounded-full text-center text-sm flex items-center justify-center gap-2 transition-all ${
                        isExpert
                          ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 active:scale-[0.99]'
                          : 'bg-[#121827] hover:bg-slate-800 text-white font-semibold border border-slate-700/80 shadow-md active:scale-[0.99]'
                      }`}
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight
                        className={`h-4 w-4 ${isExpert ? 'text-slate-950' : 'text-slate-300'}`}
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 4. AI AGENTS DIRECTORY & INTERACTIVE SHOWCASE (#agents)                  */}
      {/* ========================================================================= */}
      <section id="agents" className="relative z-10 py-[35px] sm:py-24 bg-white border-t border-slate-200 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
              <Bot className="h-3.5 w-3.5"/>
              <span>AUTONOMOUS AI WORKFORCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
              Build <span className="text-emerald-600">AI employees.</span>
            </h2>
            <p className="mt-4 text-black text-base">
              Specialised AI agents that research, sell, support and report alongside your team.
              Explore our production-ready agent blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Agent Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {agents.map((agent, index) => (<button key={agent.name} onClick={() => setActiveAgentTab(index)} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${activeAgentTab === index
                ? 'border-emerald-600 bg-emerald-50/80 text-slate-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${activeAgentTab === index
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      <Bot className="h-5 w-5"/>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{agent.name}</p>
                      <p className="text-xs text-black">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                    Live
                  </span>
                </button>))}
            </div>

            {/* Agent Live Terminal / Execution Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-8 shadow-2xl relative overflow-hidden text-white">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80"/>
                    <div className="h-3 w-3 rounded-full bg-amber-500/80"/>
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80"/>
                    <span className="text-xs font-mono text-slate-400 ml-2">autogreen-agent-sandbox v2.4</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Activity className="h-3.5 w-3.5 animate-pulse"/>
                    <span>STATUS: {agents[activeAgentTab].status.toUpperCase()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white mb-1">
                    {agents[activeAgentTab].name}
                  </h4>
                  <p className="text-xs text-emerald-400 font-mono mb-6">
                    ROLE: {agents[activeAgentTab].role}
                  </p>

                  <div className="space-y-4 mb-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Core Autonomous Capabilities:
                    </p>
                    {agents[activeAgentTab].capabilities.map((cap, i) => (<div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5"/>
                        <span>{cap}</span>
                      </div>))}
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-slate-800 mb-6">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 mb-1">
                      <Terminal className="h-3.5 w-3.5"/>
                      <span>Latest Autonomous Dispatch:</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono italic">
                      "{agents[activeAgentTab].sampleOutput}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/#kits" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-sm">
                      <span>Deploy This Agent Template</span>
                      <ArrowRight className="h-3.5 w-3.5"/>
                    </Link>
                    <a href="mailto:contact@autogreen.ai" className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs hover:bg-slate-700 transition-all">
                      Request Custom Training
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. AUTOMATION & VOICE AI CAPABILITIES (#automate & #voice)                */}
      {/* ========================================================================= */}
      <section id="automate" className="relative z-10 py-[35px] sm:py-24 bg-[#F8FAFC] border-t border-slate-200 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                <Zap className="h-3.5 w-3.5"/>
                <span>INTELLIGENT WORKFLOW ENGINE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Automate repetitive work. <br />
                <span className="text-emerald-600">Connect apps, data and AI.</span>
              </h2>

              <p className="mt-4 text-black text-sm sm:text-base leading-relaxed">
                Connect your business tools, databases, and AI models so decisions and actions occur without friction.
                From automated client onboarding to multi-step research reports, AutoGreen gives you battle-tested n8n
                and webhook pipelines.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-black">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</div>
                  <span>Trigger from any webhook, form, CRM or database event</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">2</div>
                  <span>Process context through Claude 3.5 Sonnet / OpenAI with strict guardrails</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-black">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">3</div>
                  <span>Dispatch formatted outputs to Slack, Gmail, Google Sheets or your custom API</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link href="#kits" className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-sm">
                  <span>Get Ready Automations</span>
                  <ArrowRight className="h-3.5 w-3.5"/>
                </Link>
              </div>
            </div>

            {/* Voice AI Card (#voice) */}
            <div id="voice" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <Mic className="h-6 w-6"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">Deploy AI Voice Experiences</h3>
                  <p className="text-xs text-emerald-700 font-mono">Ultra-low latency conversational agents</p>
                </div>
              </div>

              <p className="text-xs text-black leading-relaxed mb-6">
                Deliver human-like, real-time voice interactions across inbound calls, outbound qualification, and customer support.
                AutoGreen Voice connects telephony with LLMs in under 450ms.
              </p>

              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                <div className="flex items-center justify-between text-xs text-black">
                  <span>Voice Latency</span>
                  <span className="font-mono text-emerald-700 font-bold">&lt; 450ms</span>
                </div>
                <div className="flex items-center justify-between text-xs text-black">
                  <span>Supported Accents & Languages</span>
                  <span className="font-mono text-emerald-700 font-bold">38+</span>
                </div>
                <div className="flex items-center justify-between text-xs text-black">
                  <span>Calendar & CRM Integration</span>
                  <span className="font-mono text-emerald-700 font-bold">Google, Cal.com, HubSpot</span>
                </div>
              </div>

              <Link href="mailto:contact@autogreen.ai" className="w-full py-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs flex items-center justify-center gap-2 transition-all">
                <span>Consult On Voice Implementation</span>
                <ArrowRight className="h-3.5 w-3.5"/>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 6. CURATED AI GUIDES & E-BOOKS CATALOG (#resources)                       */}
      {/* ========================================================================= */}
      <section id="resources" className="relative z-10 py-[35px] sm:py-24 bg-white border-t border-slate-200 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
                <BookOpen className="h-3.5 w-3.5"/>
                <span>DRM SECURED DIGITAL GUIDES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                Curated AI Technical Guides
              </h2>
              <p className="mt-2 text-black text-sm max-w-xl">
                Read in-depth manuals, developer architecture blueprints, and business playbooks
                directly in our cloud DRM reader.
              </p>
            </div>

            {/* Real-time Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search guides, tools, agents..." className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"/>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'}`}>
                {cat}
              </button>))}
          </div>

          {/* Guides Grid */}
          {loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (<div key={n} className="h-80 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse"/>))}
            </div>) : guides.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (<div key={guide._id || guide.slug} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={guide.coverImage || '/placeholder-cover.jpg'} alt={guide.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => {
                    e.target.style.display = 'none';
                }}/>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-mono font-semibold text-emerald-700 shadow-xs">
                        {guide.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-xs text-black line-clamp-2">
                        {guide.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-[#111827]">₹{guide.price}</span>
                        {guide.originalPrice && (<span className="text-xs text-slate-400 line-through">₹{guide.originalPrice}</span>)}
                      </div>

                      <Link href={`/guides/${guide.slug}`} className="px-4 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all">
                        Read Guide
                      </Link>
                    </div>
                  </div>
                </div>))}
            </div>) : (<div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              <BookOpen className="h-10 w-10 text-emerald-600 mx-auto mb-3"/>
              <p className="text-sm font-semibold text-slate-900">No guides matching your criteria</p>
              <p className="text-xs text-black mt-1">Try resetting the category filter or search query</p>
              <button onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
            }} className="mt-4 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors">
                Reset Filters
              </button>
            </div>)}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PHILOSOPHY & WHY US                                                   */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-[35px] sm:py-24 bg-[#F8FAFC] border-t border-slate-200 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
              We separate useful AI <br />
              <span className="text-emerald-600">from AI noise.</span>
            </h2>
            <p className="mt-4 text-black text-base">
              AI changes constantly. AutoGreen evolves with it. We engineer pragmatic systems that drive
              verifiable productivity rather than superficial hype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Find the right AI tools</h4>
              <p className="text-xs text-black leading-relaxed">
                Filter through thousands of AI products to uncover the select few that generate immediate ROI for your role.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Create AI employees</h4>
              <p className="text-xs text-black leading-relaxed">
                Package tasks into autonomous agents that conduct research, resolve support, and publish content without supervision.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Automate workflows</h4>
              <p className="text-xs text-black leading-relaxed">
                Wire up APIs, webhooks, and n8n scripts so multi-step operational chains execute seamlessly around the clock.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Become future-ready</h4>
              <p className="text-xs text-black leading-relaxed">
                Transition from manual operator to strategic orchestrator of intelligent systems across modern business.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (Accordion)                                */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-[35px] sm:py-24 bg-white border-t border-slate-200 text-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold mb-2">Answers</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-black text-sm">
              Everything you need to know about AutoGreen AI, the kits, automations, and DRM ecosystem.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (<div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden transition-colors hover:border-slate-300">
                  <button onClick={() => setOpenFaq(isOpen ? null : index)} className="w-full p-6 text-left flex items-center justify-between gap-4 text-slate-900 font-semibold text-sm sm:text-base hover:text-emerald-700 transition-colors">
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-emerald-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
                  </button>

                  {isOpen && (<div className="px-6 pb-6 text-xs sm:text-sm text-black leading-relaxed border-t border-slate-200/80 bg-white pt-4">
                      {faq.a}
                    </div>)}
                </div>);
        })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. NEWSLETTER & ECOSYSTEM BANNER                                          */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-[35px] sm:py-20 bg-gradient-to-b from-[#F8FAFC] to-white border-t border-slate-200 text-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-mono font-semibold text-emerald-800 mb-6">
            <span>WEEKLY BRIEFING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
            Practical AI, straight to your inbox.
          </h2>

          <p className="mt-4 text-black text-sm sm:text-base max-w-xl mx-auto">
            Different Businesses. One Green. Join 12,000+ engineers, marketers and founders building with AI.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            {emailSubscribed ? (<div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600"/>
                <span>You are on the list! Welcome to AutoGreen AI.</span>
              </div>) : (<form onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail)
                    setEmailSubscribed(true);
            }} className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-slate-300 shadow-md focus-within:border-emerald-600 transition-all">
                <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your work email address..." className="w-full bg-transparent px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"/>
                <button type="submit" className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shrink-0 flex items-center gap-1.5 shadow-xs">
                  <span>Subscribe</span>
                  <Send className="h-3.5 w-3.5"/>
                </button>
              </form>)}
            <p className="text-[11px] text-black mt-3">No spam. Only high-signal workflows, agent blueprints, and tool teardowns.</p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. NEED MORE INFORMATION? / REQUEST A DEMO CTA BANNER (ABOVE FOOTER)     */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-[35px] sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[36px] bg-gradient-to-r from-[#0082ff] via-[#006beb] to-[#0057d9] overflow-hidden shadow-2xl">
          
          {/* Subtle geometric polygon triangle background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full object-cover" viewBox="0 0 1200 400" preserveAspectRatio="none" fill="none">
              <polygon points="0,0 200,400 400,0" fill="white" opacity="0.1" />
              <polygon points="200,400 400,0 600,400" fill="white" opacity="0.15" />
              <polygon points="400,0 600,400 800,0" fill="white" opacity="0.08" />
              <polygon points="600,400 800,0 1000,400" fill="white" opacity="0.12" />
              <polygon points="800,0 1000,400 1200,0" fill="white" opacity="0.1" />
              <polygon points="100,0 300,250 500,0" fill="white" opacity="0.07" />
              <polygon points="700,200 900,400 1100,200" fill="white" opacity="0.1" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-[360px] lg:min-h-[400px]">
            
            {/* Left Content */}
            <div className="w-full lg:w-7/12 py-10 sm:py-14 lg:py-16 px-6 sm:px-12 lg:px-16 flex flex-col justify-center text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
                Need more information?
              </h2>
              
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl font-normal">
                Fill out the form, and a member of our team will get in touch with you to provide a solution tailored to your needs.
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-[#d62888] font-bold text-sm hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-pink-100/80"
                >
                  Request a demo
                </button>
              </div>
            </div>

            {/* Right Image: Person holding tablet */}
            <div className="w-full lg:w-5/12 flex items-end justify-center lg:justify-end px-6 lg:px-0 pt-4 lg:pt-0">
              <div className="relative w-72 sm:w-80 lg:w-[380px] h-[320px] sm:h-[360px] lg:h-[400px]">
                <img
                  src="/images/cta_woman_tablet.jpg"
                  alt="Request a demo - AutoGreen team"
                  className="w-full h-full object-cover object-top mix-blend-multiply drop-shadow-2xl pointer-events-none"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Request a Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => {
                setIsDemoModalOpen(false);
                setDemoSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="inline-flex h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Demo Request Received!</h3>
                <p className="text-xs sm:text-sm text-black max-w-sm mx-auto">
                  Thank you, <strong className="text-slate-900">{demoForm.name || 'there'}</strong>! A solutions specialist will connect with you at <span className="text-emerald-700 font-mono font-semibold">{demoForm.email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsDemoModalOpen(false);
                    setDemoSubmitted(false);
                    setDemoForm({ name: '', email: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0082ff]">Get in touch</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Request a Personalized Demo</h3>
                <p className="text-xs text-black mt-1">
                  Tell us a bit about your business goals and we will set up a guided walkthrough.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDemoSubmitted(true);
                  }}
                  className="mt-6 space-y-4 text-xs"
                >
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0082ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Work Email Address</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0082ff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">What solutions are you interested in?</label>
                    <textarea
                      rows={3}
                      value={demoForm.message}
                      onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                      placeholder="AI Kits, Automations, custom agents..."
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0082ff]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#0082ff] hover:bg-[#0070df] text-white font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
                  >
                    Submit Demo Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>);
}
