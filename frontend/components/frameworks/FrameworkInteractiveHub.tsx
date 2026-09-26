"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Code2, 
  Search, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface FrameworkItem {
  id: string;
  name: string;
  version: string;
  category: "all" | "fullstack" | "performance" | "enterprise" | "content";
  architecture: string;
  reactivity: string;
  bundleSize: string;
  bundleSizeKb: number;
  marketSharePercent: number;
  salaryUs: string;
  salaryUsNum: number;
  salaryIn: string;
  rating: number;
  tagline: string;
  idealFor: string;
  pros: string[];
  cons: string[];
  atsKeywords: string[];
  accentColor: string;
}

const FRAMEWORKS: FrameworkItem[] = [
  {
    id: "react-nextjs",
    name: "React 19 & Next.js 15",
    version: "19.0 / 15.1",
    category: "fullstack",
    architecture: "Virtual DOM + React Server Components (RSC)",
    reactivity: "Unidirectional with React Compiler auto-memoization",
    bundleSize: "~42.8 KB (Client Runtime)",
    bundleSizeKb: 42.8,
    marketSharePercent: 68.4,
    salaryUs: "$165,000 / yr",
    salaryUsNum: 165000,
    salaryIn: "₹26,00,000 / yr",
    rating: 9.8,
    tagline: "The undisputed global industry standard for modern web engineering",
    idealFor: "Enterprise SaaS, high-traffic consumer web apps, and maximum job opportunities",
    pros: [
      "Over 68% of all frontend tech job openings worldwide",
      "Massive ecosystem (shadcn/ui, TanStack, Tailwind, Framer Motion)",
      "Zero client bundle for server components with Next.js App Router"
    ],
    cons: [
      "Steeper architectural learning curve with RSC and streaming boundaries",
      "Hydration overhead if not utilizing server components effectively"
    ],
    atsKeywords: ["React 19", "Next.js 15", "React Server Components", "Server Actions", "TypeScript", "TanStack Query", "Zustand", "Tailwind CSS"],
    accentColor: "from-cyan-500 to-blue-600"
  },
  {
    id: "vue-nuxt",
    name: "Vue 3.5 & Nuxt 3",
    version: "3.5 / 3.13",
    category: "fullstack",
    architecture: "Fine-Grained Reactive Proxies + Compiler-Optimized VDOM",
    reactivity: "Native Proxy Reactivity (ref, reactive, computed)",
    bundleSize: "~16.4 KB",
    bundleSizeKb: 16.4,
    marketSharePercent: 17.2,
    salaryUs: "$148,000 / yr",
    salaryUsNum: 148000,
    salaryIn: "₹22,00,000 / yr",
    rating: 9.3,
    tagline: "The developer ergonomics gold standard with lightning productivity",
    idealFor: "Fast-moving startups, full-stack SaaS MVPs, and elegant single-file codebases",
    pros: [
      "Single-File Components (SFC) provide pristine separation of concerns",
      "56% memory reduction in Vue 3.5 state tracking graphs",
      "Nuxt Nitro engine deploys seamlessly to Cloudflare, AWS, and Vercel"
    ],
    cons: [
      "Smaller US enterprise job market compared to React and Angular",
      "Third-party component library ecosystem is smaller than React's"
    ],
    atsKeywords: ["Vue 3.5", "Nuxt 3", "Composition API", "Pinia", "Vite", "TypeScript", "Single-File Components (SFC)"],
    accentColor: "from-emerald-400 to-teal-600"
  },
  {
    id: "angular",
    name: "Angular 19",
    version: "19.0",
    category: "enterprise",
    architecture: "Incremental DOM + Signals Architecture",
    reactivity: "Fine-Grained Native Signals & Zone-less execution",
    bundleSize: "~32.5 KB (Zone-less)",
    bundleSizeKb: 32.5,
    marketSharePercent: 21.8,
    salaryUs: "$155,000 / yr",
    salaryUsNum: 155000,
    salaryIn: "₹24,00,000 / yr",
    rating: 9.1,
    tagline: "The battle-tested enterprise powerhouse for mission-critical software",
    idealFor: "Fintech, banking platforms, healthcare, government portals, and large monorepos",
    pros: [
      "Full batteries-included framework (DI, RxJS/Signals, HTTP client, Form validation)",
      "Strict architectural conventions reduce divergence across 100+ engineer teams",
      "Modern @defer syntax offers native declarative lazy loading"
    ],
    cons: [
      "Steep initial learning curve for engineers unfamiliar with enterprise OOP and RxJS",
      "More verbose syntax compared to lightweight alternatives"
    ],
    atsKeywords: ["Angular 19", "Angular Signals", "RxJS", "TypeScript", "Dependency Injection", "Enterprise Architecture", "Zone-less Angular"],
    accentColor: "from-red-500 to-rose-700"
  },
  {
    id: "svelte-kit",
    name: "Svelte 5 & SvelteKit",
    version: "5.0 / 2.5",
    category: "performance",
    architecture: "Compile-Time Code Generation (Zero Virtual DOM)",
    reactivity: "Runes ($state, $derived, $effect)",
    bundleSize: "~2.8 KB",
    bundleSizeKb: 2.8,
    marketSharePercent: 8.6,
    salaryUs: "$160,000 / yr",
    salaryUsNum: 160000,
    salaryIn: "₹25,00,000 / yr",
    rating: 9.5,
    tagline: "Ultra-compact compile-time magic with surgical DOM reactivity",
    idealFor: "Real-time collaborative tools, low-latency dashboards, and high-FPS web applications",
    pros: [
      "Compiles directly to tiny, optimized vanilla JavaScript DOM operations",
      "Runes offer seamless reactivity in both UI components and plain TypeScript files",
      "Near-perfect Core Web Vitals and tiny client download footprints"
    ],
    cons: [
      "Smaller enterprise hiring footprint than React or Angular",
      "Smaller third-party component ecosystem requiring custom building"
    ],
    atsKeywords: ["Svelte 5", "SvelteKit", "Runes ($state, $derived)", "Compile-Time Reactivity", "Vite", "TypeScript", "Core Web Vitals"],
    accentColor: "from-orange-500 to-amber-600"
  },
  {
    id: "solid-js",
    name: "Solid.js",
    version: "1.9",
    category: "performance",
    architecture: "Direct DOM Bindings (No Virtual DOM Diffing)",
    reactivity: "Ultra-Fine-Grained Reactive Primitives (createSignal)",
    bundleSize: "~7.2 KB",
    bundleSizeKb: 7.2,
    marketSharePercent: 4.2,
    salaryUs: "$168,000 / yr",
    salaryUsNum: 168000,
    salaryIn: "₹27,00,000 / yr",
    rating: 9.2,
    tagline: "The reigning speed champion of modern client-side execution",
    idealFor: "High-frequency trading interfaces, WebGL/canvas integration, and extreme throughput UIs",
    pros: [
      "Consistently tops the JS Framework Benchmark in speed and memory efficiency",
      "Components run only once; no wasteful tree re-render diff cycles",
      "Familiar JSX syntax with true reactivity"
    ],
    cons: [
      "Niche job market; predominantly adopted by elite engineering specialists",
      "Props destructuring requires special accessor awareness"
    ],
    atsKeywords: ["Solid.js", "SolidStart", "Fine-Grained Signals", "JSX", "High-Performance DOM", "TypeScript"],
    accentColor: "from-blue-400 to-indigo-600"
  },
  {
    id: "astro",
    name: "Astro 5",
    version: "5.0",
    category: "content",
    architecture: "Component Islands (Zero-JS baseline)",
    reactivity: "Multi-framework islands with client directives (client:visible)",
    bundleSize: "0.0 KB (Default static)",
    bundleSizeKb: 0.1,
    marketSharePercent: 11.5,
    salaryUs: "$145,000 / yr",
    salaryUsNum: 145000,
    salaryIn: "₹21,00,000 / yr",
    rating: 9.6,
    tagline: "The undisputed king of content-driven websites and 100/100 Lighthouse scores",
    idealFor: "Documentation, editorial portals, corporate marketing platforms, and content e-commerce",
    pros: [
      "Zero client JavaScript sent to browser by default",
      "Allows using React, Vue, Svelte, and Solid components inside the exact same project",
      "Instant SEO indexation and top Google Search performance"
    ],
    cons: [
      "Not designed for complex single-page app authenticated workflows (e.g. Figma-like tools)",
      "Dynamic state across disparate islands requires nanostores or custom events"
    ],
    atsKeywords: ["Astro 5", "Islands Architecture", "Content Collections", "Static Site Generation (SSG)", "SEO Optimization", "Core Web Vitals"],
    accentColor: "from-purple-500 to-pink-600"
  },
  {
    id: "qwik",
    name: "Qwik",
    version: "1.8",
    category: "performance",
    architecture: "Resumable DOM (Hydration-Free Architecture)",
    reactivity: "Micro-Signals with progressive script chunk streaming",
    bundleSize: "< 1.0 KB (Initial JS execution)",
    bundleSizeKb: 1.0,
    marketSharePercent: 3.1,
    salaryUs: "$152,000 / yr",
    salaryUsNum: 152000,
    salaryIn: "₹23,00,000 / yr",
    rating: 8.9,
    tagline: "Instant sub-50ms Time To Interactive via revolutionary resumability",
    idealFor: "High-traffic mobile e-commerce, global shopping funnels, and slow network audiences",
    pros: [
      "Completely eradicates hydration bottlenecks and main thread blocking",
      "Progressively downloads and executes event code only when the user interacts",
      "Sub-50ms INP even on entry-level Android devices"
    ],
    cons: [
      "Smallest developer mindshare and community support",
      "Requires understanding the $ symbol code-splitting syntax"
    ],
    atsKeywords: ["Qwik", "QwikCity", "Resumability", "Hydration-Free Web", "Fine-Grained Micro-Signals", "E-Commerce Web Performance"],
    accentColor: "from-indigo-400 to-purple-600"
  }
];

export function FrameworkInteractiveHub() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "fullstack" | "performance" | "enterprise" | "content">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedFramework, setCopiedFramework] = useState<string | null>(null);

  // Decision Quiz State
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ goal?: string; priority?: string }>({});
  const [quizResult, setQuizResult] = useState<FrameworkItem | null>(null);

  const filteredFrameworks = FRAMEWORKS.filter((fw) => {
    const matchesCategory = selectedCategory === "all" || fw.category === selectedCategory;
    const matchesSearch = 
      fw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.idealFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.atsKeywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyKeywords = (framework: FrameworkItem) => {
    const textToCopy = framework.atsKeywords.join(", ");
    navigator.clipboard.writeText(textToCopy);
    setCopiedFramework(framework.id);
    toast.success(`Copied ATS keywords for ${framework.name}!`);
    setTimeout(() => setCopiedFramework(null), 2500);
  };

  const handleQuizAnswer = (key: "goal" | "priority", value: string) => {
    const nextAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(nextAnswers);

    if (quizStep === 0) {
      setQuizStep(1);
    } else {
      // Calculate match
      let match = FRAMEWORKS[0]; // Default React
      if (nextAnswers.goal === "jobs") {
        match = FRAMEWORKS.find(f => f.id === "react-nextjs") || FRAMEWORKS[0];
      } else if (nextAnswers.goal === "enterprise") {
        match = FRAMEWORKS.find(f => f.id === "angular") || FRAMEWORKS[2];
      } else if (nextAnswers.goal === "speed") {
        match = FRAMEWORKS.find(f => f.id === "svelte-kit") || FRAMEWORKS[3];
      } else if (nextAnswers.goal === "dx") {
        match = FRAMEWORKS.find(f => f.id === "vue-nuxt") || FRAMEWORKS[1];
      } else if (nextAnswers.goal === "content") {
        match = FRAMEWORKS.find(f => f.id === "astro") || FRAMEWORKS[5];
      }
      setQuizResult(match);
      setQuizStep(2);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResult(null);
  };

  return (
    <div className="space-y-16">
      {/* ── Search & Category Filter Bar ── */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {[
              { id: "all", label: "All Frameworks" },
              { id: "fullstack", label: "Full-Stack (RSC / SSR)" },
              { id: "performance", label: "Ultra-Fast & Signals" },
              { id: "enterprise", label: "Enterprise Monorepo" },
              { id: "content", label: "Content & Islands" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === tab.id
                    ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search framework or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Framework Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredFrameworks.map((fw) => (
          <div
            key={fw.id}
            className="group relative bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
          >
            {/* Top Accent Glow */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${fw.accentColor}`} />

            <div>
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{fw.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
                      v{fw.version}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium mt-1">{fw.tagline}</p>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-base">
                    <span>★</span>
                    <span>{fw.rating}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">HireScore™</span>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2.5 my-5 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-center">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Job Share</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">{fw.marketSharePercent}%</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Bundle Size</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">{fw.bundleSizeKb} KB</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Avg US Salary</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">{fw.salaryUs.split(" ")[0]}</div>
                </div>
              </div>

              {/* Architecture & Details */}
              <div className="space-y-2.5 text-xs text-zinc-300 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-zinc-500 min-w-28 font-semibold">Architecture:</span>
                  <span className="text-zinc-200">{fw.architecture}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-500 min-w-28 font-semibold">Reactivity:</span>
                  <span className="text-zinc-200">{fw.reactivity}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-500 min-w-28 font-semibold">Ideal For:</span>
                  <span className="text-zinc-200">{fw.idealFor}</span>
                </div>
              </div>

              {/* Key Pros */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Top Engineering Advantages:</div>
                {fw.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>

              {/* ATS Keywords Section */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    ATS Resume Keywords
                  </span>
                  <button
                    onClick={() => handleCopyKeywords(fw)}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    {copiedFramework === fw.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {fw.atsKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 font-mono text-[11px]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
              <Link
                href="/tailor"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
              >
                Scan Resume for {fw.name.split(" ")[0]}
              </Link>
              <Link
                href="/interview"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-all"
              >
                Mock Interview Questions
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Interactive Framework Selector (Decision Quiz) ── */}
      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-emerald-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <Cpu className="w-3.5 h-3.5" />
            AI Framework Architect
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Find Your Ideal Framework in 30 Seconds
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
            Answer two quick questions regarding your team goals, project scale, and performance needs. Our matching algorithm computes your optimal technical stack.
          </p>

          <AnimatePresence mode="wait">
            {quizStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-zinc-200 mb-4">
                  Step 1: What is your primary career or product objective?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {[
                    { key: "jobs", title: "Maximum Job Openings & High Pay", desc: "Prioritize frameworks with the highest recruiter demand and salary bands" },
                    { key: "enterprise", title: "Large Enterprise & Monorepo Rigor", desc: "Need strict TypeScript conventions, banking-grade security, and scale" },
                    { key: "dx", title: "Rapid MVP & Joyful Developer Experience", desc: "Clean single-file components, minimal boilerplate, and fast releases" },
                    { key: "speed", title: "Raw Benchmark Speed & Low Latency", desc: "Real-time trading, gaming, zero Virtual DOM overhead, and tiny bundles" },
                    { key: "content", title: "Content Publishing & 100/100 SEO", desc: "Marketing websites, blogs, zero-JS baseline, and high conversion" }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleQuizAnswer("goal", opt.key)}
                      className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-900/80 transition-all group flex flex-col justify-between"
                    >
                      <div className="font-semibold text-sm text-zinc-100 group-hover:text-emerald-300">
                        {opt.title}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {quizStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-zinc-200 mb-4">
                  Step 2: What is your architectural preference for state and rendering?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {[
                    { key: "rsc", title: "Server-Driven (React Server Components)", desc: "Database queries in server components, streaming SSR, edge caching" },
                    { key: "signals", title: "Fine-Grained Signals (Direct DOM)", desc: "Surgical leaf-node updates without component tree re-render passes" },
                    { key: "compiled", title: "Compiler Magic (No Runtime VDOM)", desc: "Code compiles to vanilla DOM mutations at build time" },
                    { key: "islands", title: "Islands Architecture (Zero JS by default)", desc: "HTML-first pages with isolated interactive widgets" }
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleQuizAnswer("priority", opt.key)}
                      className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-900/80 transition-all group flex flex-col justify-between"
                    >
                      <div className="font-semibold text-sm text-zinc-100 group-hover:text-emerald-300">
                        {opt.title}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {quizStep === 2 && quizResult && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-emerald-500/50 text-left shadow-2xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Recommendation Match: 99.4%
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {quizResult.name}
                    </h4>
                    <p className="text-sm text-zinc-400 mt-0.5">{quizResult.tagline}</p>
                  </div>
                  <div className="text-right sm:text-right">
                    <div className="text-xs text-zinc-500">Market Job Share</div>
                    <div className="text-2xl font-bold text-emerald-400">{quizResult.marketSharePercent}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="font-semibold text-zinc-400 block mb-1">Why this fits your profile:</span>
                    <p className="text-zinc-300">{quizResult.idealFor}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="font-semibold text-zinc-400 block mb-1">Architecture & Reactivity:</span>
                    <p className="text-zinc-300">{quizResult.architecture}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    onClick={resetQuiz}
                    className="text-xs text-zinc-400 hover:text-white underline transition-colors"
                  >
                    ← Retake Decision Assessment
                  </button>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/tailor"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Scan My Resume for {quizResult.name.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
