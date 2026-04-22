"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Search, 
  Book, 
  FileText, 
  Code2, 
  Cpu, 
  Zap, 
  Shield, 
  HelpCircle, 
  ChevronRight, 
  ArrowRight,
  Terminal,
  Settings,
  Layout
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    title: "Getting Started",
    icon: Zap,
    items: ["Quick Start Guide", "Account Setup", "Profile Creation", "First Match"]
  },
  {
    title: "Core Platform",
    icon: Layout,
    items: ["Dashboard Overview", "Job Search", "Application Tracking", "Profile Analytics"]
  },
  {
    title: "AI Intelligence",
    icon: Cpu,
    items: ["Semantic Matching", "Resume Optimization", "Skill Gap Analysis", "Career Roadmaps"]
  },
  {
    title: "Developer API",
    icon: Terminal,
    items: ["Authentication", "Endpoints Reference", "Webhooks", "SDKs"]
  }
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Book className="w-4 h-4" />
              Developer Portal & Documentation
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Master the Future of <br />
              <span className="gradient-text">Career Intelligence</span>
            </motion.h1>
            
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-2xl mx-auto group mt-8"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search for guides, APIs, features..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-500 shadow-glow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 px-2 py-1 rounded border border-white/10 text-[10px] text-zinc-500 font-mono hidden sm:block">
                ⌘ + K
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Docs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong rounded-3xl p-8 border border-white/5 hover:border-emerald-500/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                   <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6 underline underline-offset-8 decoration-emerald-500/30">
                  {cat.title}
                </h3>
                <ul className="space-y-4">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 group/item cursor-pointer">
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover/item:text-emerald-400 transition-colors" />
                      <span className="text-zinc-400 text-sm group-hover/item:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex gap-16 items-center">
            <div className="flex-1 mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold text-white mb-6">Quick Start <br /><span className="text-emerald-400">Guide</span></h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Connect your professional accounts and let our AI index your career history. 
                Get started in less than 2 minutes.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: "01", title: "Authenticate", desc: "Connect your LinkedIn or GitHub accounts." },
                  { step: "02", title: "Semantic Scan", desc: "Our AI analyzes your experience vector." },
                  { step: "03", title: "Smart Matches", desc: "Receive your first curated job matches." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-2xl font-bold text-emerald-500/20 font-mono">{s.step}</div>
                    <div>
                      <h4 className="text-white font-bold">{s.title}</h4>
                      <p className="text-zinc-500 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
               <div className="glass rounded-[2rem] border border-white/10 bg-zinc-900/50 p-8 font-mono text-sm overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Terminal className="w-32 h-32 text-emerald-500" />
                  </div>
                  <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
                     <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                     <div className="w-3 h-3 rounded-full bg-zinc-700" />
                     <div className="w-3 h-3 rounded-full bg-zinc-700" />
                     <span className="ml-2 text-zinc-600 text-xs italic">setup_env.sh</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                       <span className="text-zinc-600">1</span>
                       <span className="text-emerald-400">npm</span>
                       <span className="text-white">install @hireorbit/sdk</span>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-zinc-600">2</span>
                       <span className="text-violet-400">const</span>
                       <span className="text-white">client = </span>
                       <span className="text-blue-400">new</span>
                       <span className="text-emerald-400">HireOrbit</span>
                       <span className="text-zinc-500">(apiKey)</span>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-zinc-600">3</span>
                       <span className="text-violet-400">await</span>
                       <span className="text-white">client.</span>
                       <span className="text-emerald-400">matchProfile</span>
                       <span className="text-zinc-500">()</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Guides Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
             <HelpCircle className="w-6 h-6 text-emerald-400" />
             Popular Guides
           </h2>
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Optimizing Your Match Score", desc: "Learn how to tweak your profile for better AI alignment." },
                { title: "Managing Privacy Settings", desc: "Control who sees your data and how it's analyzed." },
                { title: "API Authentication Guide", desc: "Best practices for securing your API integrations." },
                { title: "Custom Alert Configuration", desc: "Set up advanced boolean filters for your jobs." },
                { title: "Understanding Embeddings", desc: "A technical deep dive into our semantic logic." },
                { title: "Troubleshooting Sync", desc: "What to do if your profile sync is delayed." }
              ].map((guide, i) => (
                <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                  <h4 className="text-white font-bold mb-2 flex items-center justify-between">
                    {guide.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{guide.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold text-white mb-6">Need More Help?</h2>
           <p className="text-zinc-400 mb-8">Our support team and developer advocates are available 24/7 for tailored guidance.</p>
           <div className="flex justify-center gap-4">
              <button className="px-8 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all">
                Contact Support
              </button>
              <button className="px-8 py-4 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all">
                Join Community
              </button>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
