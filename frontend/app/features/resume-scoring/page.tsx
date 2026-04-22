"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Layout, 
  Hash, 
  Eye,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ResumeScoringPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                AI-Driven Optimization
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Stop Guessing, <br />
                <span className="gradient-text">Start Scoring High</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-zinc-400 leading-relaxed mb-8"
              >
                Your resume has 6 seconds to make an impression. Our AI simulates both ATS 
                algorithms and human recruiter behavior to give you a roadmap for a resume 
                that actually gets noticed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link 
                  href="/signup"
                  className="px-8 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
                >
                  Score My Resume
                </Link>
                <button className="px-8 py-4 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all">
                  How it Works
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="glass-strong rounded-3xl p-8 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-white font-bold text-xl">Resume Analysis</div>
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-2xl bg-emerald-500/5">
                    84
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: "ATS Compatibility", val: "Excellent", color: "text-emerald-400" },
                    { label: "Impact Verbs", val: "Medium", color: "text-amber-400" },
                    { label: "Scanability", val: "High", color: "text-emerald-400" }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-zinc-400 text-sm">{stat.label}</span>
                      <span className={`text-sm font-bold ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    Critical Suggestion
                  </div>
                  <p className="text-sm text-zinc-300">
                    "Replace passive phrasing like 'Responsible for' with active impact verbs like 'Spearheaded' or 'Orchestrated'."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "ATS Proofing", desc: "Ensure your resume is readable by every major tracking system." },
              { icon: Layout, title: "Structure Check", desc: "AI-verified layouts that guide the human eye to your best work." },
              { icon: Hash, title: "Quantification", desc: "We help you turn vague duties into measurable achievements." },
              { icon: Eye, title: "Keyword Audit", desc: "Identify missing industry-standard terms for your target roles." }
            ].map((pillar, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-lg">{pillar.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparisons */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-[2rem] border border-white/10 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 border-b md:border-b-0 md:border-r border-white/5">
                <h3 className="text-2xl font-bold text-white mb-8">Traditional Resume</h3>
                <ul className="space-y-4">
                  {["Vague job descriptions", "Missing keywords", "Complex formatting blocks ATS", "Focuses on duties, not results"].map((item, i) => (
                    <li key={i} className="flex gap-3 text-zinc-500 text-sm italic">
                      <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-[10px]">—</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-12 bg-emerald-500/5">
                <h3 className="text-2xl font-bold text-white mb-8">HireOrbitAI Optimized</h3>
                <ul className="space-y-4">
                  {["Impact-driven bullet points", "Targeted keyword density", "Clean, machine-readable structure", "Focuses on measurable ROI"].map((item, i) => (
                    <li key={i} className="flex gap-3 text-emerald-400 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">First Impressions Matter. <br />Make Yours Count.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link 
              href="/signup"
              className="px-12 py-5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
            >
              Upload Now
            </Link>
          </div>
          <p className="mt-8 text-zinc-500 text-sm">Takes less than 30 seconds to get your first score.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
