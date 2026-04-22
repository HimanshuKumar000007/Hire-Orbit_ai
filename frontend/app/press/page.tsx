"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Newspaper, 
  Download, 
  Share2, 
  Mail, 
  Globe, 
  FileText, 
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  Star,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const pressReleases = [
  {
    date: "April 18, 2024",
    title: "HireOrbitAI Raises $5M Seed Round to Accelerate Career Intelligence",
    excerpt: "The funding will be used to expand the engineering team and scale the proprietary AI matching engine globally.",
    link: "#"
  },
  {
    date: "March 25, 2024",
    title: "Introducing Real-time Skill Gap Analysis: A New Era of Personal Growth",
    excerpt: "HireOrbitAI launches a revolutionary tool that maps candidate skills against live market demand in real-time.",
    link: "#"
  },
  {
    date: "February 12, 2024",
    title: "HireOrbitAI Reaches 50,000 Active Users Milestone",
    excerpt: "The platform sees rapid adoption among tech professionals seeking more meaningful career advancements.",
    link: "#"
  }
];

const mediaMentions = [
  { outlet: "TechCrunch", quote: "HireOrbitAI is fixing the broken link between talent and opportunity.", date: "April 2024" },
  { outlet: "Wired", quote: "The future of job searching is semantic, and HireOrbitAI is leading the way.", date: "March 2024" },
  { outlet: "Forbes", quote: "A game-changer for professionals looking to stay relevant in an AI-driven economy.", date: "February 2024" }
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <Newspaper className="w-4 h-4" />
            Press & Media
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
          >
            HireOrbitAI <br />
            <span className="gradient-text">In the News</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto"
          >
            Stay updated with our latest announcements, news appearances, 
            and brand assets for media professionals.
          </motion.p>
        </div>
      </section>

      {/* Featured Mentions Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {mediaMentions.map((mention, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
              >
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">{mention.outlet}</div>
                <p className="text-white font-medium italic mb-6 leading-relaxed">
                  "{mention.quote}"
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-zinc-600 text-xs">{mention.date}</span>
                  <ExternalLink className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Official Announcements</h2>
              <p className="text-zinc-400">The latest stories directly from our team.</p>
            </div>
            <button className="text-emerald-400 font-bold flex items-center gap-2 group">
              View All Releases
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative glass p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group-hover:border-emerald-500/30 transition-all">
                  <div className="max-w-2xl">
                    <div className="text-xs text-zinc-500 mb-2">{release.date}</div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                      {release.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {release.excerpt}
                    </p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white text-sm font-bold border border-white/10 hover:bg-white/10 transition-all">
                      Read More
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-zinc-400 hover:text-white border border-white/10 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit Section */}
      <section className="py-24 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-[2.5rem] p-12 border border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Download className="w-64 h-64 text-emerald-500" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">Media Kit</h2>
              <p className="text-zinc-400 mb-12 max-w-2xl leading-relaxed">
                Download our official brand assets, including logos, founder photography, 
                and product screenshots for your editorial coverage.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Brand Logos", icon: ImageIcon, size: "12MB", format: "SVG, PNG" },
                  { title: "Founder Photos", icon: Star, size: "45MB", format: "High-Res JPG" },
                  { title: "Product Screens", icon: Globe, size: "28MB", format: "RAW, PNG" },
                  { title: "Brand Guidelines", icon: FileText, size: "5MB", format: "PDF" }
                ].map((item, i) => (
                  <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold mb-2">{item.title}</h4>
                    <div className="text-xs text-zinc-500 mb-6">{item.format} • {item.size}</div>
                    <button className="flex items-center gap-2 text-emerald-400 text-xs font-bold hover:gap-3 transition-all">
                      Download Kit
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">Media Inquiries</h2>
          <p className="text-zinc-400 mb-10 text-lg">
            For interview requests, podcast appearances, or storytelling opportunities, 
            please get in touch with our media relations team.
          </p>
          <a 
            href="mailto:press@hireorbitai.com"
            className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
          >
            press@hireorbitai.com
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
