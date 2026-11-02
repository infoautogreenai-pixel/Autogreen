import connectToDatabase from './db';
import User from '@/models/User';
import Guide from '@/models/Guide';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import Settings from '@/models/Settings';
import { hashPassword } from './auth';
import { savePdfFile } from './storage';
import { createDemoCoursePdf } from './pdf-generator';

// =============================================
// Database Seeder
// =============================================
// This file fills the database with sample/demo data.
// It creates:
// 1. Platform settings (name, payment config, etc.)
// 2. Discount coupons (WELCOME50, PRO20, MEGA50)
// 3. Admin user account (admin@autogreenai.com)
// 4. Sample course guides with actual PDF files

// ==========================================
// Sample Course Data
// ==========================================
// Each course has: title, description, price, category,
// and PDF content (chapters with headings, code snippets, takeaways)

const sampleCoursesData = [
  {
    title: 'The Ultimate Next.js 15 & React Architecture Handbook',
    slug: 'nextjs-15-architecture-handbook',
    category: 'Web Development',
    price: 499,
    originalPrice: 1499,
    level: 'Advanced',
    shortDescription: 'Master App Router, Server Actions, DRM PDF Streaming, Cache Invalidation, and Enterprise Design Patterns.',
    description: 'A comprehensive, deeply technical, 100+ page handbook covering production-ready fullstack development with Next.js 15, React 19, TypeScript, dynamic streaming, zero-trust backend security, and micro-frontend architectures.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Next.js', 'React 19', 'TypeScript', 'Tailwind', 'Architecture'],
    highlights: [
      'Comprehensive breakdown of Server Actions vs REST endpoints',
      'DRM-style in-browser canvas streaming architectures',
      'Advanced React 19 hooks and optimistic UI updates',
      'Complete production deployment and edge caching checklist'
    ],
    pdfContent: {
      title: 'The Ultimate Next.js 15 & React Architecture Handbook',
      category: 'Web Development',
      author: 'Senior Principal Engineer Team',
      pages: [
        {
          heading: 'App Router Internals & Server Components',
          subheading: 'Understanding Streaming, Suspense boundaries, and Component Execution Cycles',
          content: [
            'Next.js 15 represents a fundamental shift towards streaming server-driven architectures. By offloading complex logic and database querying to React Server Components (RSC), we achieve zero client bundle cost for data-fetching modules.',
            'When a request reaches Next.js, the router evaluates server components in parallel, sending incremental chunks via HTTP/2 or HTTP/3 chunked transfer encoding directly to the browser.',
          ],
          codeSnippet: [
            '// Server Action with optimistic mutation',
            'export async function updateProfile(formData: FormData) {',
            '  "use server";',
            '  const session = await getAuthSession();',
            '  if (!session) throw new UnauthorizedError();',
            '  await db.users.updateOne({ id: session.id }, { $set: data });',
            '  revalidatePath("/dashboard");',
            '}',
          ],
          takeaways: [
            'Always segregate Server Components from Client interactive islands.',
            'Keep secrets strictly in server files and avoid leaking environment variables.',
            'Use granular Suspense boundaries to stream critical above-the-fold UI instantly.',
          ],
        },
        {
          heading: 'Zero-Trust Secure File Streaming Architecture',
          subheading: 'Preventing URL leaks, direct scraping, and enforcing authorization',
          content: [
            'Direct public object URLs (such as standard S3 or public buckets) are dangerous for monetized digital assets. Any user can copy and redistribute the link.',
            'Instead, an enterprise architecture implements an authenticated streaming proxy that validates session tokens, checks database purchase entitlements, and pipes binary buffers byte-by-byte into the client canvas.',
          ],
          codeSnippet: [
            '// Authenticated streaming response',
            'const stream = getSecureBufferStream(fileKey);',
            'return new Response(stream, {',
            '  headers: {',
            '    "Content-Type": "application/pdf",',
            '    "Content-Disposition": "inline",',
            '    "Cache-Control": "private, no-cache, no-store",',
            '  }',
            '});',
          ],
          takeaways: [
            'Never render raw PDF URLs in iframes or embed tags.',
            'Render pages to HTML5 Canvas to eliminate browser save triggers.',
            'Overlay dynamic translucent user watermarks across rendered canvases.',
          ],
        },
        {
          heading: 'State Management & High Performance Cache Strategies',
          subheading: 'Cache tags, time-based revalidation, and distributed invalidation',
          content: [
            'Caching in Next.js 15 operates at four distinct levels: Request Memoization, Data Cache, Full Route Cache, and Router Cache.',
            'Properly tagging your data fetches with specific keys allows targeted revalidation without invalidating your entire route tree.',
          ],
          takeaways: [
            'Use unstable_cache or tag-based revalidation for shared public datasets.',
            'Enforce no-store on personalized authenticated user dashboards.',
            'Monitor edge cache hit ratios using telemetry middleware.',
          ],
        },
      ],
    },
  },
  {
    title: 'AI Engineering & Production LLM Applications Guide',
    slug: 'ai-engineering-production-llm-guide',
    category: 'Artificial Intelligence',
    price: 699,
    originalPrice: 1999,
    level: 'Intermediate',
    shortDescription: 'From RAG systems, Vector Embeddings, and Agent Tool-Use to Cost Optimization and Evaluation.',
    description: 'Learn how to build, deploy, and evaluate production-grade AI applications using modern LLMs, Vector Databases (Pinecone/Qdrant/pgvector), Hybrid Search RAG pipelines, and autonomous agent loops.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI', 'LLM', 'RAG', 'Python', 'LangChain', 'OpenAI'],
    highlights: [
      'Advanced Chunking Strategies and Multi-Query Retrieval',
      'Guardrails, Hallucination Detection, and Evals',
      'Function Calling and Agent Tool Loops',
      'Token Cost Reduction and Latency Benchmarking'
    ],
    pdfContent: {
      title: 'AI Engineering & Production LLM Applications Guide',
      category: 'Artificial Intelligence',
      author: 'AI Research & Deployment Lab',
      pages: [
        {
          heading: 'High-Accuracy RAG Architectures',
          subheading: 'Beyond Naive Semantic Search: Hybrid Reranking & Context Compression',
          content: [
            'Naive RAG pipelines suffer from context loss and high false-positive retrieval rates when queries are nuanced.',
            'By pairing sparse BM25 keyword matching with dense embedding cosine similarity and running results through a Cross-Encoder Reranker, retrieval precision increases by up to 45%.',
          ],
          codeSnippet: [
            '# Hybrid Rerank Retrieval Pipeline',
            'dense_docs = vector_store.similarity_search(query, k=25)',
            'sparse_docs = bm25_retriever.get_relevant_documents(query)',
            'merged = deduplicate(dense_docs + sparse_docs)',
            'final_top_k = cohere_rerank(query, merged, top_n=5)',
          ],
          takeaways: [
            'Always evaluate your retrieval engine with synthetic Q&A datasets.',
            'Apply chunk overlap and metadata filtering by user tenant.',
            'Use context compression to save token costs and reduce noise.',
          ],
        },
        {
          heading: 'Autonomous Agent Loops and Safe Tool Execution',
          subheading: 'Deterministic orchestration and sandbox boundaries',
          content: [
            'LLM agents must execute actions through strictly typed schema declarations. By combining tool calling with schema validation, agent errors are caught prior to execution.',
          ],
          takeaways: [
            'Enforce timeouts and max iteration bounds on all autonomous agent loops.',
            'Audit all outgoing tool parameters before mutating databases.',
          ],
        },
      ],
    },
  },
  {
    title: 'Full Stack Web Security & Ethical Hacking Blueprint',
    slug: 'web-security-ethical-hacking-blueprint',
    category: 'Cybersecurity',
    price: 599,
    originalPrice: 1799,
    level: 'Intermediate',
    shortDescription: 'Complete roadmap to defending modern web apps against OWASP Top 10, Auth bypasses, and API exploits.',
    description: 'Equip yourself with practical cybersecurity skills. Understand CSRF, XSS, SSRF, JWT vulnerabilities, IDOR, SQL/NoSQL injections, Rate Limiting, and CORS misconfigurations with hands-on mitigation blueprints.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Cybersecurity', 'OWASP', 'JWT', 'Penetration Testing', 'API Security'],
    highlights: [
      'Comprehensive defense against IDOR and Broken Object Level Auth',
      'Secure Cookie handling, SameSite, and Strict Transport Security',
      'Rate-limiting algorithms: Token Bucket and Sliding Window',
      'Automated Vulnerability Scanning and Penetration Testing checklist'
    ],
    pdfContent: {
      title: 'Full Stack Web Security & Ethical Hacking Blueprint',
      category: 'Cybersecurity',
      author: 'AppSec Threat Intelligence Group',
      pages: [
        {
          heading: 'Authentication & Session Token Hardening',
          subheading: 'Why LocalStorage is Unsafe for Tokens and How to Configure httpOnly Cookies',
          content: [
            'Storing authentication JWTs in client-side localStorage opens up total account takeover via any single Cross-Site Scripting (XSS) vulnerability.',
            'By storing tokens in httpOnly, Secure, SameSite=Lax/Strict cookies, browser JavaScript cannot access the token, preventing exfiltration.',
          ],
          codeSnippet: [
            '// Hardened Cookie Configuration',
            'res.setHeader("Set-Cookie", serialize("auth_token", token, {',
            '  httpOnly: true,',
            '  secure: process.env.NODE_ENV === "production",',
            '  sameSite: "lax",',
            '  path: "/",',
            '  maxAge: 60 * 60 * 24 * 7, // 7 days',
            '}));',
          ],
          takeaways: [
            'Never trust user-supplied IDs without validating ownership in session context.',
            'Rotate and invalidate tokens immediately upon password reset.',
            'Implement cryptographically secure webhook signature verification.',
          ],
        },
        {
          heading: 'Rate Limiting & Anti-Scraping Defenses',
          subheading: 'Protecting digital product streams from distributed scraping',
          content: [
            'Rate limiting is crucial for sensitive file streaming endpoints. Without throttling, bad actors can script rapid automated downloads of complete digital asset libraries.',
          ],
          takeaways: [
            'Rate limit sensitive endpoints by both User ID and IP address.',
            'Log anomaly bursts to security telemetry pipelines.',
          ],
        },
      ],
    },
  },
  {
    title: 'Modern Microservices & Kubernetes Deployment Guide',
    slug: 'microservices-kubernetes-deployment-guide',
    category: 'DevOps & Cloud',
    price: 799,
    originalPrice: 2299,
    level: 'Advanced',
    shortDescription: 'Design, containerize, and orchestrate resilient microservices with Docker, Kubernetes, CI/CD, and Helm.',
    description: 'From container fundamentals to production Kubernetes clusters. Learn Ingress Controllers, Service Meshes (Istio), HPA Autoscaling, Helm charts, Secret Management, and zero-downtime rolling deployments.',
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
    tags: ['DevOps', 'Kubernetes', 'Docker', 'AWS', 'Microservices'],
    highlights: [
      'Production K8s manifest patterns and resource limits',
      'Configuring Ingress with SSL/TLS and Cert-Manager',
      'Zero-downtime rolling updates and Canary deployments',
      'Prometheus and Grafana cluster monitoring setups'
    ],
    pdfContent: {
      title: 'Modern Microservices & Kubernetes Deployment Guide',
      category: 'DevOps & Cloud',
      author: 'Cloud Native Infrastructure Architects',
      pages: [
        {
          heading: 'Production Kubernetes Cluster Architecture',
          subheading: 'Control Plane, Worker Nodes, Networking, and Container Runtimes',
          content: [
            'Kubernetes abstracts physical infrastructure into a declarative control loop. Mastering Deployments, StatefulSets, DaemonSets, and Cluster Autoscaling is the foundation of high-availability cloud engineering.',
          ],
          takeaways: [
            'Always specify CPU and Memory requests and limits to prevent noisy neighbor eviction.',
            'Use Liveness and Readiness probes with sensible initial delays.',
            'Keep secrets externalized in encrypted vaults or KMS-backed secret managers.',
          ],
        },
      ],
    },
  },
  {
    title: 'Python for Data Science & Machine Learning Masterclass',
    slug: 'python-data-science-ml-masterclass',
    category: 'Data Science',
    price: 449,
    originalPrice: 1299,
    level: 'Beginner',
    shortDescription: 'Master Pandas, NumPy, Scikit-Learn, Matplotlib, Feature Engineering, and Predictive Modeling.',
    description: 'A beginner-to-advanced hands-on guide packed with practical exercises, real-world datasets, statistical modeling methods, data cleaning recipes, and machine learning pipeline construction.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: ['Python', 'Data Science', 'Pandas', 'Machine Learning', 'NumPy'],
    highlights: [
      'Fast-track Pandas data manipulation workflows',
      'Feature engineering and categorical encoding mastery',
      'Supervised vs Unsupervised ML algorithm comparisons',
      'Real-world business predictive models with ROC-AUC tuning'
    ],
    pdfContent: {
      title: 'Python for Data Science & Machine Learning Masterclass',
      category: 'Data Science',
      author: 'Lead Data Science Academy',
      pages: [
        {
          heading: 'Data Wrangling and High Performance Pandas',
          subheading: 'Vectorization, memory optimization, and cleaning pipelines',
          content: [
            'Data preparation accounts for over 70% of a data scientist\'s workflow. Leveraging vectorized operations in Pandas instead of Python iterrows() leads to 100x performance improvements.',
          ],
          takeaways: [
            'Downcast numeric datatypes to uint8/float32 to minimize memory usage.',
            'Use category dtype for low-cardinality string columns.',
          ],
        },
      ],
    },
  },
  {
    title: 'UI/UX Design Systems & Micro-Interactions Playbook',
    slug: 'ui-ux-design-systems-playbook',
    category: 'Design & UI',
    price: 399,
    originalPrice: 999,
    level: 'All Levels',
    shortDescription: 'Craft stunning, accessible, high-converting digital interfaces with modern Figma tokens and design systems.',
    description: 'Learn the exact design principles, color theory, typography hierarchy, spatial systems, and micro-interaction animations used by world-class software teams to create sticky, intuitive user experiences.',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['UI/UX', 'Design Systems', 'Figma', 'CSS', 'Micro-interactions'],
    highlights: [
      'Visual hierarchy and typography scale math',
      'Glassmorphism, dark mode palettes, and accent contrast',
      'Micro-animations that increase conversion rates',
      'Figma component tokens to Tailwind CSS design tokens'
    ],
    pdfContent: {
      title: 'UI/UX Design Systems & Micro-Interactions Playbook',
      category: 'Design & UI',
      author: 'Product Experience Guild',
      pages: [
        {
          heading: 'Modern Design Tokens & Visual Hierarchy',
          subheading: 'Building consistent typography, spacing, and elevation systems',
          content: [
            'A design system is the single source of truth connecting product design and frontend engineering. By standardizing spacing on an 8pt grid and defining semantic color tokens, design velocity triples.',
          ],
          takeaways: [
            'Never use arbitrary hex values in production components.',
            'Maintain minimum 4.5:1 contrast ratios for WCAG AA compliance.',
            'Use micro-animations with cubic-bezier easing to reward user interactions.',
          ],
        },
      ],
    },
  },
];

/**
 * Seed the database with demo data.
 * This function creates all the initial data needed to run the platform.
 */
export async function seedDatabase() {
  // Step 0: Connect to the database
  await connectToDatabase();

  console.log('--- Starting Database Seeding ---');

  // ==========================================
  // Step 1: Create Platform Settings
  // ==========================================
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      platformName: 'LearnForge PDF Academy',
      pointsEarnRate: 10,          // Users earn 10% of purchase price as points
      pointsRedeemRate: 0.5,       // 100 points = â‚¹50 discount
      razorpayKeyId: 'rzp_test_mockKey123',
      razorpayKeySecret: 'rzp_test_mockSecret456',
      razorpayEnabled: true,
      stripePublishableKey: 'pk_test_mockKey123',
      stripeSecretKey: 'sk_test_mockSecret456',
      stripeEnabled: true,
      testGatewayEnabled: true,
      supportEmail: 'support@learnforge.io',
    });
    console.log('Created default Platform Settings');
  }

  // ==========================================
  // Step 2: Create Discount Coupons
  // ==========================================
  const defaultCoupons = [
    {
      code: 'WELCOME50',
      discountType: 'flat',
      discountValue: 50,
      minOrderAmount: 299,
      isActive: true,
      usageLimit: 5000,
    },
    {
      code: 'PRO20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 399,
      maxDiscount: 200,
      isActive: true,
      usageLimit: 1000,
    },
    {
      code: 'MEGA50',
      discountType: 'percentage',
      discountValue: 50,
      minOrderAmount: 599,
      maxDiscount: 350,
      isActive: true,
      usageLimit: 500,
    },
  ];

  for (const c of defaultCoupons) {
    const exists = await Coupon.findOne({ code: c.code });
    if (!exists) {
      await Coupon.create(c);
      console.log(`Created Coupon: ${c.code}`);
    }
  }

  // ==========================================
  // Step 3: Create Admin User (if not exists)
  // ==========================================
  let admin = await User.findOne({ role: 'admin' });
  const adminPassHash = await hashPassword('Autogreen@2026');
  if (!admin) {
    admin = await User.create({
      name: 'AutoGreen Admin',
      email: 'admin@autogreenai.com',
      passwordHash: adminPassHash,
      role: 'admin',
      points: 1000,
      pointsHistory: [
        { type: 'earned', amount: 1000, reason: 'Initial Admin Bonus', date: new Date() },
      ],
      purchasedGuides: [],
    });
    console.log('Created Admin: admin@autogreenai.com');
  }

  // ==========================================
  // Step 4: Create Course Guides & Generate PDFs
  // ==========================================
  const createdGuides = [];
  for (const course of sampleCoursesData) {
    let existingGuide = await Guide.findOne({ slug: course.slug });

    // Generate a real PDF file and save it to secure storage
    const pdfBuffer = await createDemoCoursePdf(course.pdfContent);
    const savedFile = await savePdfFile(pdfBuffer, `${course.slug}.pdf`);

    if (!existingGuide) {
      // Create new guide in the database
      existingGuide = await Guide.create({
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        coverImage: course.coverImage,
        price: course.price,
        originalPrice: course.originalPrice,
        category: course.category,
        tags: course.tags,
        level: course.level,
        highlights: course.highlights,
        previewPages: 2,
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 124,
        salesCount: 88,
        pdfFiles: [
          {
            fileName: `${course.title}.pdf`,
            fileKey: savedFile.fileKey,
            fileSize: savedFile.fileSize,
            pageCount: course.pdfContent.pages.length + 1,
            order: 0,
          },
        ],
      });
      console.log(`Created Guide: ${course.title}`);
    } else {
      // Update existing guide with new PDF file
      existingGuide.pdfFiles = [
        {
          fileName: `${course.title}.pdf`,
          fileKey: savedFile.fileKey,
          fileSize: savedFile.fileSize,
          pageCount: course.pdfContent.pages.length + 1,
          order: 0,
        },
      ];
      await existingGuide.save();
    }
    createdGuides.push(existingGuide);
  }

  console.log('--- Database Seeding Complete ---');
  return { success: true };
}
