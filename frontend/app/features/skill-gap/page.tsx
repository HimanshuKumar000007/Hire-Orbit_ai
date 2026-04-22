"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  Map, 
  Rocket,
  CheckCircle2,
  ArrowRight,
  Monitor
} from 'lucide-react';
import Link from 'next/link';

export default function SkillGapPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
              >
                <BarChart3 className="w-4 h-4" />
                Live Benchmarking
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Bridge the Gap to <br />
                <span className="gradient-text">Your Dream Role</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-zinc-400 leading-relaxed mb-8"
              >
                Stop guessing what skills you need. Our AI analyzes thousands of job 
                descriptions in real-time to identify the exact technical and soft skills 
                hirers are looking for right now.
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
                  Analyze My Skills
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative"
            >
              <div className="glass-strong rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="text-white font-semibold">Market Analysis: Senior Dev</div>
                </div>

                <div className="space-y-6">
                  {[
                    { skill: "React / Next.js", level: 90, status: "Mastered" },
                    { skill: "System Design", level: 65, status: "Growing" },
                    { skill: "Python / AI", level: 40, status: "Gap Identified" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-300">{item.skill}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          item.level > 80 ? "bg-emerald-500/10 text-emerald-400" :
                          item.level > 60 ? "bg-amber-500/10 text-amber-400" :
                          "bg-rose-500/10 text-rose-400"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.level}%` }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                          className={`h-full bg-gradient-to-r ${
                            item.level > 80 ? "from-emerald-600 to-teal-400" :
                            item.level > 60 ? "from-amber-600 to-orange-400" :
                            "from-rose-600 to-pink-400"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Recommended Pathway</div>
                  <div className="flex gap-2">
                    <div className="flex-1 glass p-3 rounded-xl border border-white/5 text-center text-xs text-white">
                      System Design Course
                    </div>
                    <div className="flex-1 glass p-3 rounded-xl border border-white/5 text-center text-xs text-white">
                      AWS Certification
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-white mb-6">Your Personal <br /><span className="text-emerald-400">Career Roadmap</span></h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                We don't just point out problems; we provide the solution. Every identified gap 
                comes with a curated list of resources to help you level up.
              </p>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, text: "Curated Learning Materials" },
                  { icon: Map, text: "Step-by-Step Milestones" },
                  { icon: Rocket, text: "Career Growth Projection" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-300">
                    <item.icon className="w-5 h-5 text-emerald-500" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
               {[
                 { title: "Real-time Demand", desc: "Our data refreshes every hour, reflecting the very latest shifts in technologies hirers want." },
                 { title: "Relative Ranking", desc: "See how your skills rank against other candidates applying for the same roles." },
                 { title: "Cert Valuator", desc: "Find out exactly how much a specific certification will increase your match probability." },
                 { title: "Salary Impact", desc: "Calculate the exact potential salary increase for every new skill you master." }
               ].map((card, i) => (
                 <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all hover:translate-y-[-4px]">
                   <h3 className="text-white font-bold mb-3">{card.title}</h3>
                   <p className="text-zinc-500 text-sm">{card.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Stop Staying Stagnant</h2>
          <p className="text-zinc-400 text-lg mb-10">
            Join 10,000+ professionals who are using HireOrbitAI to track their growth 
            and land higher-paying roles through data-driven skill development.
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
          >
            Start Analyzing Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
