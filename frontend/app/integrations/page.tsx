"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Puzzle, 
  Linkedin, 
  Github, 
  Slack, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Globe, 
  Cpu, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  Database
} from 'lucide-react';
import Link from 'next/link';

const integrations = [
  {
    category: "Professional Networks",
    items: [
      { name: "LinkedIn", icon: Linkedin, color: "text-blue-500", desc: "Sync your profile and professional history seamlessly." },
      { name: "GitHub", icon: Github, color: "text-white", desc: "Showcase your contributions and technical prowess." }
    ]
  },
  {
    category: "Communication",
    items: [
      { name: "Slack", icon: Slack, color: "text-purple-400", desc: "Get real-time job alerts in your workspace." },
      { name: "Discord", icon: MessageSquare, color: "text-indigo-400", desc: "Connect with community-driven career alerts." }
    ]
  },
  {
    category: "Productivity",
    items: [
      { name: "Google Calendar", icon: Calendar, color: "text-red-400", desc: "Sync interview schedules and follow-ups." },
      { name: "Notion", icon: Globe, color: "text-zinc-400", desc: "Save job leads and research notes directly." }
    ]
  },
  {
    category: "Recruitment Systems",
    items: [
      { name: "Workday", icon: Cpu, color: "text-orange-400", desc: "Direct integration with major enterprise ATS." },
      { name: "Lever", icon: ShieldCheck, color: "text-blue-400", desc: "One-click applications to Lever-hosted roles." }
    ]
  }
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
              <Puzzle className="w-4 h-4" />
              Unified Career Ecosystem
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Connect Your <br />
              <span className="gradient-text">Entire Workflow</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed"
            >
              HireOrbitAI doesn't live in a silo. We integrate with the tools you already 
              use to make your job search seamless, organized, and lightning fast.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Integrations Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {integrations.map((group, groupIdx) => (
              <div key={group.category}>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold text-white mb-10 flex items-center gap-3"
                >
                  <span className="w-8 h-px bg-emerald-500/30" />
                  {group.category}
                </motion.h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {group.items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
                      <div className="relative glass-strong rounded-3xl p-8 border border-white/5 hover:border-emerald-500/20 transition-all flex items-start gap-6">
                        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                          <item.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            {item.desc}
                          </p>
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-500/60 uppercase tracking-widest">
                            <Zap className="w-3 h-3" />
                            Pre-configured
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer API Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-[2.5rem] p-12 border border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Code2 className="w-64 h-64 text-emerald-500" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Built for <span className="gradient-text">Developers</span>
                </h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  Want to build your own custom workflow? Our robust API and Webhook 
                  system allows you to programmatically access your job matches, 
                  resume analysis, and career insights.
                </p>
                
                <div className="space-y-6">
                  {[
                    { icon: Database, title: "Structured Data", desc: "Access all your job matching data in clean, standard JSON format." },
                    { icon: Zap, title: "Real-time Webhooks", desc: "Trigger actions in your own apps when a high-probability match is found." }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <feat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{feat.title}</h4>
                        <p className="text-zinc-500 text-sm">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                   <Link 
                    href="/docs"
                    className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:gap-3 transition-all"
                  >
                    Explore Documentation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/10 bg-zinc-900/50 p-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-zinc-500 text-xs italic">match_payload.json</span>
                </div>
                <pre className="text-emerald-400/80 leading-relaxed">
                  {`{
  "id": "match_92834",
  "score": 0.94,
  "role": "Senior Frontend Engineer",
  "company": "Supabase",
  "skills_matched": [
    "Next.js", "TypeScript", "Tailwind"
  ],
  "reasoning": "Semantic alignment found..."
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Missing an Integration?</h2>
          <p className="text-zinc-400 text-lg mb-10">
            Tell us which tools you use, and our team will prioritize building it. 
            We're adding new integrations every single week.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-10 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105">
              Submit Request
            </button>
            <Link 
              href="/signup"
              className="px-10 py-4 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
