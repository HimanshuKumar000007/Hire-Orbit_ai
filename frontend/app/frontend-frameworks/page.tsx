import { Metadata } from "next";
import Link from "next/link";
import { 
  Sparkles, 
  Layers, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  BookOpen
} from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { FrameworkInteractiveHub } from "@/components/frameworks/FrameworkInteractiveHub";

const siteUrl = process.env.SITE_URL || "https://hireorbitai.in";
const canonicalUrl = `${siteUrl}/frontend-frameworks`;

export const metadata: Metadata = {
  title: "Top Frontend Frameworks (2026): Best Web Frameworks Compared | HireOrbitAi",
  description: "Comprehensive 2026 guide to modern frontend frameworks: React 19, Next.js 15, Vue 3.5, Angular 19, Svelte 5, and Solid.js. Compare performance benchmarks, bundle sizes, developer salaries, ATS keywords, and interview guides.",
  keywords: [
    "%frontend frameworks",
    "frontend frameworks",
    "best frontend frameworks 2026",
    "modern frontend frameworks",
    "frontend framework comparison",
    "fastest frontend frameworks",
    "react vs vue vs angular",
    "frontend frameworks for web development",
    "frontend developer framework salary 2026"
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Top Frontend Frameworks (2026): Best Web Frameworks Compared",
    description: "Architectural benchmarks, bundle sizes, hiring demand, and developer compensation across React 19, Next.js 15, Vue 3.5, Angular 19, Svelte 5, Solid.js, and Astro.",
    url: canonicalUrl,
    siteName: "HireOrbitAi",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Frontend Frameworks (2026): Best Web Frameworks Compared",
    description: "Architectural benchmarks, bundle sizes, hiring demand, and developer compensation across React 19, Next.js 15, Vue 3.5, Angular 19, Svelte 5, Solid.js, and Astro.",
    creator: "@hireorbitai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const FAQ_DATA = [
  {
    question: "What is a frontend framework?",
    answer: "A frontend framework is a collection of pre-written software libraries, architecture patterns, and runtime tools that developers use to build interactive user interfaces and web applications. Modern frontend frameworks like React, Next.js, Vue, Angular, and Svelte handle DOM rendering, state synchronization, routing, and server-side streaming."
  },
  {
    question: "Which frontend framework has the highest job market demand in 2026?",
    answer: "React (paired with Next.js) dominates the global technical recruitment market, appearing in over 68% of all frontend developer job requisitions. Angular holds strong market dominance in enterprise banking and government systems, while Vue.js is widely used across agile startups and European/Asian tech sectors."
  },
  {
    question: "What is the fastest frontend framework in 2026?",
    answer: "Solid.js and Svelte 5 lead raw client-side DOM execution speed and low memory footprint by eliminating the Virtual DOM in favor of fine-grained reactive Signals and compile-time code generation. For content-first sites, Astro delivers the fastest initial page loads by shipping 0 KB of client JavaScript by default."
  },
  {
    question: "How do React Server Components (RSC) change modern frontend development?",
    answer: "React Server Components execute exclusively on the server, allowing developers to query databases and internal APIs directly without leaking credentials or sending heavy dependencies to the browser. This eliminates client bundle bloat while enabling streaming SSR with Suspense."
  },
  {
    question: "What is the difference between Virtual DOM and Signals?",
    answer: "Virtual DOM compares an in-memory replica of the DOM tree to calculate differences (diffing) before updating the real DOM. In contrast, Signals create direct reactive subscriptions between variables and specific DOM nodes, updating the exact element instantly when values change without traversing or re-rendering component trees."
  },
  {
    question: "How do I optimize my frontend developer resume for ATS filters?",
    answer: "Ensure your resume explicitly highlights modern framework keywords like React 19, Next.js App Router, Server Actions, TypeScript, TanStack Query, and Core Web Vitals optimization. Using HireOrbitAi's free resume scanner allows you to benchmark your resume against real job requisitions before applying."
  }
];

export default function FrontendFrameworksPage() {
  // Schema.org JSON-LD Structured Data
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Top Frontend Frameworks (2026): Best Web Frameworks Compared",
    description: "Comprehensive 2026 guide to modern frontend frameworks: React 19, Next.js 15, Vue 3.5, Angular 19, Svelte 5, Solid.js, and Astro.",
    url: canonicalUrl,
    datePublished: "2026-09-26T00:00:00.000Z",
    dateModified: "2026-09-26T00:00:00.000Z",
    author: {
      "@type": "Organization",
      name: "HireOrbitAi Engineering & Research",
      url: siteUrl
    },
    publisher: {
      "@type": "Organization",
      name: "HireOrbitAi",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`
      }
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Frontend Frameworks",
        item: canonicalUrl
      }
    ]
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best Frontend Frameworks 2026",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "React 19 & Next.js 15",
        description: "The global industry standard full-stack UI runtime with React Server Components and Turbopack."
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vue 3.5 & Nuxt 3",
        description: "The developer ergonomics gold standard with Single-File Components and reactive Proxies."
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Angular 19",
        description: "The enterprise powerhouse with native Signals, Zone-less execution, and built-in dependency injection."
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Svelte 5 & SvelteKit",
        description: "Compile-time reactive code generation using Runes with zero Virtual DOM overhead."
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Solid.js",
        description: "Direct DOM bindings via fine-grained Signals with fastest execution speeds in benchmark suites."
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Astro 5",
        description: "Islands Architecture shipping 0 KB JavaScript baseline for content sites and 100/100 Lighthouse SEO."
      }
    ]
  };

  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30 text-zinc-100 overflow-x-hidden">
      <Navigation />

      {/* Structured Data Scripts for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      {/* ── Hero Section ── */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden border-b border-zinc-800/80">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[800px] h-[350px] sm:h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-20 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb Navigation */}
            <nav className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 mb-5 sm:mb-6 max-w-full truncate">
              <Link href="/" className="hover:text-emerald-400 transition-colors shrink-0">Home</Link>
              <span>/</span>
              <span className="text-zinc-200 font-medium truncate">Frontend Frameworks</span>
            </nav>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6 break-words">
              Modern <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Frontend Frameworks</span> Guide (2026)
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10 font-light">
              The definitive architectural comparison of <strong className="text-zinc-200">React 19, Next.js 15, Vue 3.5, Angular 19, Svelte 5, and Solid.js</strong>. 
              Explore bundle benchmarks, Core Web Vitals performance, recruiter hiring demand, and developer salary bands.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-10 text-left">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Market Dominance
                </div>
                <div className="text-2xl font-bold text-white">68.4%</div>
                <div className="text-xs text-zinc-400 mt-0.5">React Ecosystem Share</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  Smallest Bundle
                </div>
                <div className="text-2xl font-bold text-white">2.8 KB</div>
                <div className="text-xs text-zinc-400 mt-0.5">Svelte 5 Runes</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Avg Senior Salary
                </div>
                <div className="text-2xl font-bold text-white">$165,000</div>
                <div className="text-xs text-zinc-400 mt-0.5">Full-Stack Framework Dev</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Zero-JS Default
                </div>
                <div className="text-2xl font-bold text-white">100/100</div>
                <div className="text-xs text-zinc-400 mt-0.5">Astro Lighthouse Score</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/tailor"
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Scan Resume for Framework Skills
              </Link>
              <Link
                href="/blog/modern-frontend-frameworks-2026-guide"
                className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Read In-Depth Technical Whitepaper
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Interactive Section ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Interactive Frontend Framework Explorer
          </h2>
          <p className="text-zinc-400 text-base">
            Filter, inspect, and copy verified ATS keywords across all major frontend web frameworks. 
            Use our AI Framework Architect quiz below to identify your optimal tech stack.
          </p>
        </div>

        <FrameworkInteractiveHub />
      </section>

      {/* ── Architectural Deep Dive Table ── */}
      <section className="py-16 bg-zinc-900/30 border-y border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Under The Hood
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 mb-4">
              Virtual DOM vs Signals vs Compilers: Which Architecture Wins?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Every frontend framework adopts a unique strategy to solve the fundamental problem of web applications: 
              keeping user interface DOM nodes synchronized with application state in memory.
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-950/70 shadow-2xl overflow-hidden max-w-full">
            <div className="flex sm:hidden items-center justify-between px-3.5 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Scroll table horizontally
              </span>
              <span className="text-[10px] text-emerald-300 font-mono tracking-wider">Swipe ➔</span>
            </div>
            <div className="overflow-x-auto max-w-full -webkit-overflow-scrolling-touch">
              <table className="min-w-[640px] w-full text-left text-xs sm:text-sm text-zinc-300">
                <thead className="bg-zinc-900 text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4 sm:py-4 sm:px-6 font-semibold whitespace-nowrap">Architectural Paradigm</th>
                    <th className="py-3 px-4 sm:py-4 sm:px-6 font-semibold whitespace-nowrap">Primary Frameworks</th>
                    <th className="py-3 px-4 sm:py-4 sm:px-6 font-semibold">How DOM Updates Execute</th>
                    <th className="py-3 px-4 sm:py-4 sm:px-6 font-semibold whitespace-nowrap">INP & Core Web Vitals</th>
                    <th className="py-3 px-4 sm:py-4 sm:px-6 font-semibold">Developer Trade-Off</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-zinc-800/60 font-normal">
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">Virtual DOM</td>
                  <td className="py-4 px-6 text-emerald-400">React 19, Vue 3.5</td>
                  <td className="py-4 px-6">Diffs an in-memory JS tree and calculates minimum patches.</td>
                  <td className="py-4 px-6"><span className="text-amber-400 font-medium">Good (&lt;100ms)</span></td>
                  <td className="py-4 px-6 text-zinc-400">Can incur GC memory pressure on massive real-time data streams without memoization.</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">Fine-Grained Signals</td>
                  <td className="py-4 px-6 text-cyan-400">Solid.js, Angular 19</td>
                  <td className="py-4 px-6">Direct reactive subscribers update exact leaf DOM nodes without tree traversal.</td>
                  <td className="py-4 px-6"><span className="text-emerald-400 font-medium">Elite (&lt;15ms)</span></td>
                  <td className="py-4 px-6 text-zinc-400">Requires strict attention to reactive tracking contexts and props destructuring.</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">Compile-Time Generation</td>
                  <td className="py-4 px-6 text-orange-400">Svelte 5 (Runes)</td>
                  <td className="py-4 px-6">Build-time compiler generates imperative vanilla DOM mutation instructions.</td>
                  <td className="py-4 px-6"><span className="text-emerald-400 font-medium">Elite (&lt;20ms)</span></td>
                  <td className="py-4 px-6 text-zinc-400">Smaller ecosystem of pre-built third-party components compared to React.</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">React Server Components</td>
                  <td className="py-4 px-6 text-blue-400">Next.js 15, Remix</td>
                  <td className="py-4 px-6">Executes on server/edge; sends light JSX wire format with zero client bundle footprint.</td>
                  <td className="py-4 px-6"><span className="text-emerald-400 font-medium">Outstanding TTFB</span></td>
                  <td className="py-4 px-6 text-zinc-400">Requires mental discipline separating server data fetching from client interactive hooks.</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">Resumability (Zero Hydration)</td>
                  <td className="py-4 px-6 text-purple-400">Qwik</td>
                  <td className="py-4 px-6">Serializes framework state into HTML; executes event handlers lazily on click.</td>
                  <td className="py-4 px-6"><span className="text-emerald-400 font-medium">Sub-50ms TTI</span></td>
                  <td className="py-4 px-6 text-zinc-400">Emerging ecosystem; requires custom syntactic delimiters ($).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

      {/* ── Career & ATS Optimization Section ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              Recruiter & ATS Intelligence
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              How Tech Companies Screen Frontend Resumes in 2026
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-6">
              Writing &ldquo;Frontend Developer with React experience&rdquo; no longer passes modern Applicant Tracking Systems (ATS) at top tech employers like Stripe, Google, or high-growth SaaS unicorns. 
            </p>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              Recruiters and hiring managers look for <strong className="text-zinc-200">quantified architectural achievements</strong> and specific modern framework keywords:
            </p>

            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-sm font-bold text-white mb-1">❌ Weak Resume Bullet:</div>
                <div className="text-xs text-red-300/80 font-mono">
                  &ldquo;Built responsive web pages using React, HTML, and CSS.&rdquo;
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
                <div className="text-sm font-bold text-emerald-400 mb-1">✅ High-Impact 2026 Resume Bullet:</div>
                <div className="text-xs text-emerald-200 font-mono">
                  &ldquo;Re-architected enterprise portal to Next.js 15 App Router & Server Components, reducing client bundle size by 62% and improving Interaction to Next Paint (INP) from 380ms to 42ms for 2.4M monthly users.&rdquo;
                </div>
              </div>
            </div>

            <Link
              href="/tailor"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Benchmark My Resume Now (Free)
            </Link>
          </div>

          {/* Framework Market Share Visual Card */}
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                2026 Global Job Requisitions by Framework
              </div>
              <span className="text-xs text-zinc-500 font-mono">100k+ Job Postings</span>
            </div>

            <div className="space-y-4">
              {[
                { name: "React / Next.js", percent: 68.4, color: "bg-cyan-500" },
                { name: "Angular (Enterprise)", percent: 21.8, color: "bg-red-500" },
                { name: "Vue.js / Nuxt", percent: 17.2, color: "bg-emerald-500" },
                { name: "Astro (Content & SEO)", percent: 11.5, color: "bg-purple-500" },
                { name: "Svelte / SvelteKit", percent: 8.6, color: "bg-orange-500" },
                { name: "Solid.js", percent: 4.2, color: "bg-blue-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-200">{item.name}</span>
                    <span className="text-emerald-400 font-mono">{item.percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Source: HireOrbitAi Job Intelligence Engine</span>
              <Link href="/blog/modern-frontend-frameworks-2026-guide" className="text-emerald-400 hover:underline">
                View Full Salary Report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-20 bg-zinc-900/30 border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 mb-4">
              Frequently Asked Questions About Frontend Frameworks
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Clear answers to the most common queries searched by software engineers, hiring managers, and students.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 relative overflow-hidden border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Advance Your Engineering Career
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to Land a Top-Tier Frontend Engineering Role?
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Scan your resume for high-converting framework keywords, practice technical architecture interviews, and get matched with verified engineering roles on HireOrbitAi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tailor"
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Tailor Resume for Frontend Framework Roles
            </Link>
            <Link
              href="/interview"
              className="px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-sm transition-all flex items-center gap-2"
            >
              Start AI Mock Technical Interview
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
