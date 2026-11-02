import mongoose from 'mongoose';
import connectToDatabase from './db';
import Guide from '@/models/Guide';
import { createDemoCoursePdf } from './pdf-generator';
import { savePdfFile } from './storage';

export const AI_MARKETER_KITS = [
  {
    _id: new mongoose.Types.ObjectId('6adc8def486c185f0a88bdd2'),
    title: 'AI Marketer Starter',
    slug: 'ai-marketer-starter-kit',
    category: 'AI Marketing Toolkits',
    price: 99,
    originalPrice: 299,
    level: 'Beginner',
    shortDescription: 'Discover what AI can do for your daily marketing work.',
    description:
      'The AI Marketer Starter Kit provides 200+ curated AI tools, 100+ production prompts, Claude Skills, beginner workflows, Claude walkthroughs, Notion Starter System, n8n introduction, and access to the AI Marketer Community.',
    coverImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Tools', 'Prompts', 'Claude Skills', 'Notion', 'n8n', 'Starter'],
    badge: 'LEARN AI',
    topBadge: '',
    dotColor: 'emerald',
    ctaText: 'Start with Starter →',
    popular: false,
    orderIndex: 1,
    previewPages: 2,
    isActive: true,
    isFeatured: true,
    highlights: [
      '200+ AI tools',
      '100+ prompts',
      'Claude Skills',
      'Beginner workflows',
      'Claude walkthroughs',
      'Notion Starter System',
      'n8n introduction',
      'AI Marketer Community',
    ],
    pdfContent: {
      title: 'AI Marketer Starter Kit — Foundations & Tools',
      category: 'AI Marketing Toolkits',
      author: 'AutoGreen AI Knowledge Team',
      pages: [
        {
          heading: 'Curated AI Tools Directory & Selection Framework',
          subheading: 'Choosing the Right Model and Tool for Daily Marketing Operations',
          content: [
            'Modern marketing requires moving beyond general chatbots to specialised AI capabilities. This starter guide breaks down foundational LLMs (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro) and categorizes 200+ tools for copywriting, visual asset creation, and audience research.',
            'Always evaluate tools based on integration capability, API access, latency, and hallucination guardrails before embedding them into client deliverables.',
          ],
          codeSnippet: [
            '// System Prompt for Marketing Copy Ideation',
            'Role: Senior Growth Copywriter & Conversion Specialist',
            'Task: Generate 5 high-converting headlines using the PAS framework',
            'Context: B2B SaaS automated lead qualification',
            'Constraint: Under 12 words per headline with strong active verbs',
          ],
          takeaways: [
            'Select models based on task: Claude for nuanced long-form copy, GPT-4o for rapid multimodality.',
            'Maintain a private swipe file of verified high-performing prompts.',
            'Standardize outputs using structured JSON formats for repeatable pipeline ingest.',
          ],
        },
        {
          heading: '100+ Production Prompts & Claude Skills',
          subheading: 'Instruction Engineering for Predictable High-Converting Outputs',
          content: [
            'Prompts are code for language models. A robust marketing prompt specifies persona, context, dynamic variables, negative constraints, and exact output syntax.',
            'By packaging these prompts into reusable Claude Skills, marketers save 15+ hours each week on repetitive research, email drafting, and social campaign variation.',
          ],
          codeSnippet: [
            '// Dynamic Social Repurposing Template',
            'Input: Long-form article transcript',
            'Output format:',
            '1. Twitter/X Thread (7 tweets with engagement hook)',
            '2. LinkedIn Thought Leadership Post (with paragraph breaks)',
            '3. 60-second Short-form Video Script (Hook, Story, Offer)',
          ],
          takeaways: [
            'Always include few-shot examples to align tone and style.',
            'Use negative prompting to prevent generic buzzwords ("revolutionary", "game-changing").',
            'Test prompts across varying temperature settings to balance creativity and consistency.',
          ],
        },
      ],
    },
  },
  {
    _id: new mongoose.Types.ObjectId('6adc8def486c185f0a88bdd5'),
    title: 'AI Marketer Pro',
    slug: 'ai-marketer-pro-kit',
    category: 'AI Marketing Toolkits',
    price: 599,
    originalPrice: 1499,
    level: 'Intermediate',
    shortDescription: 'Turn AI tools into repeatable marketing workflows.',
    description:
      'The AI Marketer Pro Kit turns tools into repeatable systems. Includes everything in Starter plus advanced AI tools, advanced Claude skills, n8n automation lab, 10–20 automation workflows, Marketing OS, AI reporting systems, AI audit systems, and advanced research workflows.',
    coverImage:
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Automation', 'n8n', 'Marketing OS', 'Workflows', 'Reporting', 'Pro'],
    badge: 'EXECUTE WITH AI',
    topBadge: '',
    dotColor: 'amber',
    ctaText: 'Go Pro →',
    popular: false,
    orderIndex: 2,
    previewPages: 2,
    isActive: true,
    isFeatured: true,
    highlights: [
      'Everything in Starter',
      'Advanced AI tools',
      'Advanced Claude Skills',
      'Marketing workflows',
      'n8n automation lab',
      '10–20 automation workflows',
      'Marketing OS',
      'AI reporting system',
      'AI audit system',
      'Advanced research workflows',
    ],
    pdfContent: {
      title: 'AI Marketer Pro Kit — Advanced Workflows & n8n Automation',
      category: 'AI Marketing Toolkits',
      author: 'AutoGreen AI Architecture Team',
      pages: [
        {
          heading: 'Marketing OS Architecture & Workspace Organization',
          subheading: 'Centralizing Campaigns, Content Pipelines, and Knowledge Assets',
          content: [
            'The Marketing OS eliminates organizational fragmentation by unifying content calendars, creative asset libraries, brand voice documentation, and analytics in a centralized database.',
            'AI agents query this central repository to produce copy that matches brand guidelines, historical winning hooks, and real-time audience feedback.',
          ],
          codeSnippet: [
            '// Marketing OS Content Database Schema',
            'const ContentItem = {',
            '  title: "Q4 Growth Retrospective",',
            '  status: "Review",',
            '  channels: ["LinkedIn", "Email Newsletter"],',
            '  assignedAgent: "AI Content Architect",',
            '  brandVoiceChecksum: "VERIFIED_PASSED"',
            '};',
          ],
          takeaways: [
            'Decouple raw content generation from editorial verification.',
            'Establish automated brand safety and compliance checklists.',
            'Store campaign performance metrics directly alongside prompt variations.',
          ],
        },
        {
          heading: 'n8n Automation Lab: Webhooks & Autonomous Loops',
          subheading: 'Connecting Forms, CRMs, LLMs, and Automated Email Sequences',
          content: [
            'n8n serves as the central nervous system connecting lead forms, scraping engines, AI evaluators, and notification systems without writing backend code.',
            'When a lead submits an inquiry, an n8n webhook triggers real-time company enrichment, prompts an LLM for personalized qualification scoring, and notifies sales in Slack within 4 seconds.',
          ],
          codeSnippet: [
            '// n8n Webhook Workflow Execution Step',
            'Webhook Trigger (Lead Form)',
            '  → Clearbit Enrichment API',
            '  → Claude 3.5 Sonnet (Lead Qualification Scoring)',
            '  → Filter: Score > 80 ? Send VIP Calendar Link : Add Nurture',
            '  → Slack #enterprise-deals Notification',
          ],
          takeaways: [
            'Always build error-handling branches in automated workflows.',
            'Keep API secrets secured in environment vaults rather than hardcoded nodes.',
            'Implement rate-limiting and backoff strategies for third-party AI APIs.',
          ],
        },
      ],
    },
  },
  {
    _id: new mongoose.Types.ObjectId('6adc8def486c185f0a88bdd8'),
    title: 'AI Marketer Expert',
    slug: 'ai-marketer-expert-stack',
    category: 'AI Marketing Toolkits',
    price: 1299,
    originalPrice: 2999,
    level: 'Advanced',
    shortDescription: 'Build your own AI marketing department.',
    description:
      'The premier AI marketing ecosystem. Includes everything in Starter and Pro plus AI employee builder, autonomous AI agents, advanced production n8n workflows, AI Agency OS, freelancer client acquisition systems, custom workflow builder, monetization systems, and private expert community.',
    coverImage:
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Employees', 'AI Agents', 'Agency OS', 'Monetization', 'Expert Stack'],
    badge: 'BUILD WITH AI',
    topBadge: 'Most Powerful',
    dotColor: 'rose',
    ctaText: 'Become an AI Operator →',
    popular: true,
    orderIndex: 3,
    previewPages: 2,
    isActive: true,
    isFeatured: true,
    highlights: [
      'Everything in Starter + Pro',
      'AI employee builder',
      'AI agents',
      'Advanced n8n',
      'AI Agency OS',
      'AI freelancer system',
      'AI marketing agency system',
      'Custom workflow builder',
      'Monetization systems',
      'Expert community',
    ],
    pdfContent: {
      title: 'AI Marketer Expert Stack — Autonomous AI Departments',
      category: 'AI Marketing Toolkits',
      author: 'AutoGreen AI Core Engineering',
      pages: [
        {
          heading: 'Autonomous AI Employees & Multi-Agent Orchestration',
          subheading: 'Designing Research, Copy, Support, and Reporting Autonomous Workers',
          content: [
            'The Expert Stack moves beyond single-prompt tasks to coordinated multi-agent swarms. In this architecture, a Supervisor Agent delegating tasks to a Research Worker, a Copy Architect, and a Fact-Checking Auditor.',
            'Agents execute stateful work, save intermediate findings to vector memory, and only surface human-in-the-loop notifications for final publication approval.',
          ],
          codeSnippet: [
            '// Multi-Agent Swarm Orchestrator Loop',
            'const supervisor = new AgentSupervisor({',
            '  workers: [Researcher, Copywriter, SEOAnalyst, ComplianceAuditor],',
            '  strategy: "consensus_verification",',
            '  maxIterations: 4,',
            '});',
            'const report = await supervisor.executeTask("Produce Q1 B2B Market Brief");',
          ],
          takeaways: [
            'Constrain agent action spaces with strictly typed tool calls.',
            'Store conversational state and intermediate outputs in persistent cache.',
            'Audit token consumption and set strict circuit breakers for recursion.',
          ],
        },
        {
          heading: 'Agency OS & Monetization Blueprint',
          subheading: 'Selling AI Transformation and Workflow Automations to High-Ticket Clients',
          content: [
            'Building AI capabilities unlocks the ability to package AI-as-a-Service for clients. Instead of billing hourly, AI operators sell turn-key automation infrastructure, retainer-based AI employees, and performance-based marketing engines.',
            'This chapter provides the complete legal service contracts, client onboarding audit templates, pricing calculators, and deliverable handoff systems.',
          ],
          codeSnippet: [
            '// High-Ticket AI Retainer Structure',
            'Tier 1: AI Marketing Infrastructure Audit & Architecture (₹1,50,000)',
            'Tier 2: Dedicated Autonomous Research & Copy Agent Deployment (₹75,000/mo)',
            'Tier 3: Full Custom AI Employee Swarm + Continuous Optimization (₹2,00,000/mo)',
          ],
          takeaways: [
            'Price on business outcome and operational time saved, never on hours spent.',
            'Deliver proprietary documentation and DRM protected guidebooks to clients.',
            'Establish recurring monitoring retainers for pipeline reliability.',
          ],
        },
      ],
    },
  },
];

/**
 * Ensure all 3 core AI Marketer tiers exist in MongoDB with valid PDFs.
 * If any tier is missing, automatically creates it and attaches an initial PDF.
 * If a tier already exists, preserves its uploaded PDF files and admin edits.
 */
export async function ensureAiMarketerKits() {
  await connectToDatabase();

  const results = [];

  for (const kitData of AI_MARKETER_KITS) {
    let existing = await Guide.findOne({
      $or: [
        { _id: kitData._id },
        { slug: kitData.slug },
        { title: kitData.title },
      ],
    });

    if (!existing) {
      // Generate initial PDF file for this kit tier
      let pdfFiles = [];
      try {
        const pdfBuffer = await createDemoCoursePdf(kitData.pdfContent);
        const fileName = `${kitData.slug}.pdf`;
        const savedFile = await savePdfFile(pdfBuffer, fileName);
        pdfFiles = [
          {
            fileName: savedFile.fileName,
            fileKey: savedFile.fileKey,
            fileSize: savedFile.fileSize,
            pageCount: 3,
            order: 0,
          },
        ];
      } catch (pdfErr) {
        console.warn(`[KitsInit] Could not generate initial PDF for ${kitData.title}:`, pdfErr.message);
      }

      existing = await Guide.create({
        _id: kitData._id,
        title: kitData.title,
        slug: kitData.slug,
        category: kitData.category,
        price: kitData.price,
        originalPrice: kitData.originalPrice,
        level: kitData.level,
        shortDescription: kitData.shortDescription,
        description: kitData.description,
        coverImage: kitData.coverImage,
        tags: kitData.tags,
        badge: kitData.badge,
        topBadge: kitData.topBadge,
        dotColor: kitData.dotColor,
        ctaText: kitData.ctaText,
        popular: kitData.popular,
        orderIndex: kitData.orderIndex,
        previewPages: kitData.previewPages,
        isActive: kitData.isActive,
        isFeatured: kitData.isFeatured,
        highlights: kitData.highlights,
        pdfFiles,
      });

      console.log(`[KitsInit] Created AI Marketer tier in MongoDB: ${existing.title} (₹${existing.price})`);
    } else {
      // If tier exists but has no PDF files, generate one so it is immediately sellable
      if (!existing.pdfFiles || existing.pdfFiles.length === 0) {
        try {
          const pdfBuffer = await createDemoCoursePdf(kitData.pdfContent);
          const fileName = `${kitData.slug}.pdf`;
          const savedFile = await savePdfFile(pdfBuffer, fileName);
          existing.pdfFiles = [
            {
              fileName: savedFile.fileName,
              fileKey: savedFile.fileKey,
              fileSize: savedFile.fileSize,
              pageCount: 3,
              order: 0,
            },
          ];
          await existing.save();
          console.log(`[KitsInit] Attached initial PDF to existing tier: ${existing.title}`);
        } catch (pdfErr) {
          console.warn(`[KitsInit] Could not attach PDF to ${existing.title}:`, pdfErr.message);
        }
      }
    }

    results.push(existing);
  }

  return results;
}

