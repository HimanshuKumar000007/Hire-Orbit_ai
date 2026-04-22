"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Brain, 
  Search, 
  Cpu, 
  Network, 
  Target, 
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SemanticMatchingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6"
              >
                <Brain className="w-4 h-4" />
                Next-Gen Matching Engine
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Beyond Keywords: <br />
                <span className="gradient-text">Semantic Intelligence</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-zinc-400 leading-relaxed mb-8"
              >
                Traditional job boards look for matching words. HireOrbitAI understands the 
                meaning behind your experience. We map your skills into a high-dimensional 
                vector space to find roles that align with your true potential.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link 
                  href="/signup"
                  className="px-8 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started Free
                </Link>
                <button className="px-8 py-4 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all">
                  View Demo
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-emerald-500/20 blur-3xl opacity-30" />
              <div className="relative glass-strong rounded-3xl p-8 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Vector Embedding</div>
                      <div className="text-xs text-zinc-500">Live processing...</div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-mono text-sm">98.2% Accuracy</div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Role Context", match: 95 },
                    { label: "Skill Nuance", match: 88 },
                    { label: "Career Trajectory", match: 92 }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">{stat.label}</span>
                        <span className="text-white">{stat.match}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.match}%` }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                          className="h-full bg-gradient-to-r from-violet-500 to-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 italic text-sm text-zinc-400">
                  "Found a matches for 'Product Design' despite no direct keyword match in resume, identified via 'UX Research' and 'Figma' clusters."
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Our AI doesn't just read; it understands. We use transformer-based models to 
              create a mathematical representation of your career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Network,
                title: "Knowledge Mapping",
                desc: "We analyze millions of professional profiles to understand how skills relate to each other in the real world."
              },
              {
                icon: Search,
                title: "Latent Intent Detection",
                desc: "We look for hidden potential in your work history that traditional ATS systems completely ignore."
              },
              {
                icon: Target,
                title: "Precision Matching",
                desc: "Jobs are ranked based on a composite score of skills, salary, culture, and growth potential."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/10 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Semantic Matching <br />
                <span className="text-emerald-400">Wins Every Time</span>
              </h2>
              <div className="space-y-4">
                {[
                  "No more missing out due to 'wrong' keywords",
                  "Understand the actual level of seniority required",
                  "Match based on projects, not just job titles",
                  "Identify adjacent careers you're qualified for"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1">10x</div>
                <div className="text-xs text-zinc-500">Faster Matching</div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1">92%</div>
                <div className="text-xs text-zinc-500">User Satisfaction</div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1">+45%</div>
                <div className="text-xs text-zinc-500">Interview Rate</div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-white mb-1">2.4m</div>
                <div className="text-xs text-zinc-500">Data Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/10" />
            <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Start Your Intelligent Search Today</h2>
            <p className="text-zinc-400 mb-8 relative z-10 max-w-2xl mx-auto">
              Ready to see what you've been missing? Let our AI show you the opportunities 
              that actually match your unique professional DNA.
            </p>
            <Link 
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105 relative z-10"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
