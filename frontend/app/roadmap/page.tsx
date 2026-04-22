"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Rocket, 
  Map, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Brain, 
  Workflow, 
  Users, 
  ShieldCheck,
  Target,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const milestones = [
  {
    phase: "Phase 1: Foundation",
    title: "The Birth of HireOrbitAI",
    status: "Completed",
    date: "Q4 2023",
    icon: ShieldCheck,
    color: "emerald",
    items: [
      "Core Semantic Matching Engine development",
      "Initial Resume Scoring Algorithms",
      "Basic Job Alert System",
      "Launch of Beta Platform"
    ]
  },
  {
    phase: "Phase 2: Expansion",
    title: "Scaling Intelligence",
    status: "In Progress",
    date: "Q1-Q2 2024",
    icon: Rocket,
    color: "violet",
    items: [
      "Real-time Skill Gap Analysis deployment",
      "WhatsApp & Slack integration release",
      "Advanced Career Pathing Dashboard",
      "Multi-platform job indexing (LinkedIn, Indeed, etc.)"
    ]
  },
  {
    phase: "Phase 3: Advanced Coaching",
    title: "The Personal Career Agent",
    status: "Planned",
    date: "Q3-Q4 2024",
    icon: Brain,
    color: "blue",
    items: [
      "AI-driven Mock Interview simulator",
      "Predictive Salary Benchmarking",
      "Automated skill roadmap generator",
      "Enterprise API for recruiters"
    ]
  },
  {
    phase: "Phase 4: Future",
    title: "Autonomous Future",
    status: "Vision",
    date: "2025 & Beyond",
    icon: Sparkles,
    color: "amber",
    items: [
      "Autonomous Agent-based job applications",
      "VR-enabled workspace previews",
      "Decentralized Verified Career Identity",
      "Global Talent DAO integration"
    ]
  }
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Map className="w-4 h-4" />
              Product Roadmap
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Building the Future of <br />
              <span className="gradient-text">Career Intelligence</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed"
            >
              Our mission is to democratize career success through advanced AI. 
              Here is how we are getting there, step by step.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-violet-500/50 to-transparent hidden md:block" />

          <div className="space-y-24">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={milestone.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 gap-y-8 relative`}
              >
                {/* Center Circle */}
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-zinc-900 border-4 border-zinc-800 hidden md:flex items-center justify-center z-10">
                   <div className={`w-3 h-3 rounded-full ${
                     milestone.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                     milestone.status === 'In Progress' ? 'bg-violet-500 animate-pulse' :
                     'bg-zinc-700'
                   }`} />
                </div>

                {/* Content */}
                <div className="flex-1 w-full">
                  <div className="group relative">
                    <div className={`absolute -inset-px bg-gradient-to-r from-${milestone.color}-500/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />
                    <div className="relative glass-strong rounded-[2rem] p-10 border border-white/5 hover:border-white/10 transition-all overflow-hidden h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`text-xs font-bold text-${milestone.color}-400 uppercase tracking-widest bg-${milestone.color}-500/10 px-3 py-1 rounded-full`}>
                          {milestone.phase}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          {milestone.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-${milestone.color}-400`}>
                          <milestone.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {milestone.title}
                        </h3>
                      </div>

                      <ul className="space-y-4">
                        {milestone.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-400 group/item">
                            {milestone.status === 'Completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5 group-hover/item:text-emerald-500/50 transition-colors" />
                            )}
                            <span className="group-hover/item:text-zinc-300 transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${
                             milestone.status === 'Completed' ? 'text-emerald-400' :
                             milestone.status === 'In Progress' ? 'text-violet-400' :
                             'text-zinc-500'
                           }`}>
                             Status: {milestone.status}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty spacer for alignment */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 text-center">
            {[
              { icon: Users, title: "Community Driven", desc: "Our roadmap is regularly adjusted based on feedback from our 50,000+ beta users." },
              { icon: Target, title: "Precision Focused", desc: "Every feature must measurably improve candidate interview rates by at least 15%." },
              { icon: Workflow, title: "Ethics First", desc: "AI transparency and bias reduction are at the core of every new algorithm we build." }
            ].map((phil, i) => (
              <div key={i} className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 mx-auto">
                  <phil.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">{phil.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{phil.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Be Part of the Journey</h2>
          <p className="text-zinc-400 text-lg mb-10">
            Join our Early Access program to test new features before they hit the main roadmap 
            and help us build the future of hiring.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/signup"
              className="px-10 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
            >
              Get Early Access
            </Link>
            <button className="px-10 py-4 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all">
              Join Discord
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
