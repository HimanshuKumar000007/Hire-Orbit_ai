"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  FileText, 
  Layout, 
  User, 
  Briefcase, 
  Zap, 
  Download, 
  Search, 
  ChevronRight, 
  ArrowRight,
  Eye,
  Star,
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const templateCategories = [
  {
    title: "Resume Templates",
    count: "12 Templates",
    icon: FileText,
    color: "emerald"
  },
  {
    title: "Cover Letters",
    count: "08 Templates",
    icon: User,
    color: "blue"
  },
  {
    title: "Portfolio Layouts",
    count: "05 Templates",
    icon: Layout,
    color: "purple"
  }
];

const templates = [
  {
    title: "The Modern Architect",
    category: "Software Engineering",
    type: "Resume",
    popularity: "Most Popular",
    gradient: "from-emerald-500/10 to-teal-500/10"
  },
  {
    title: "Impact Narrative",
    category: "Product Management",
    type: "Cover Letter",
    popularity: "Highly Rated",
    gradient: "from-blue-500/10 to-indigo-500/10"
  },
  {
    title: "Creative Grid",
    category: "UX/UI Design",
    type: "Portfolio",
    popularity: "Trending",
    gradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    title: "Data Strategist",
    category: "Data Science",
    type: "Resume",
    popularity: "ATS Optimized",
    gradient: "from-amber-500/10 to-orange-500/10"
  },
  {
    title: "Minimal Executive",
    category: "Leadership",
    type: "Resume",
    popularity: "Elite Tier",
    gradient: "from-zinc-500/10 to-zinc-700/10"
  },
  {
    title: "The Visionary Pitch",
    category: "Founders / Entrepreneurs",
    type: "Cover Letter",
    popularity: "Winning Choice",
    gradient: "from-rose-500/10 to-red-500/10"
  }
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 fill-emerald-400" />
              Pro Career Assets
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Start with a <br />
              <span className="gradient-text">High-Performance</span> Foundation
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed mb-10"
            >
              AI-optimized, ATS-friendly, and narrative-driven templates 
              designed to land you at the top of the interview pile.
            </motion.p>

            {/* Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3"
            >
               {["All Templates", "Software Engineer", "Product Manager", "Designer", "Data Scientist", "Executive"].map((tag, i) => (
                 <button key={i} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/5 hover:border-emerald-500/30 transition-all ${i === 0 ? 'bg-emerald-500 text-black border-emerald-500' : 'text-zinc-500'}`}>
                    {tag}
                 </button>
               ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Overview */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {templateCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-${cat.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                   <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{cat.title}</h3>
                <p className="text-zinc-500 text-sm">{cat.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-16">
              <div>
                 <h2 className="text-3xl font-bold text-white mb-4">Featured Layouts</h2>
                 <p className="text-zinc-400">Battle-tested templates that drive maximum conversion.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                 <Layers className="w-4 h-4 text-emerald-500" />
                 Grid View
              </div>
           </div>

           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {templates.map((tpl, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="group cursor-pointer"
               >
                 <div className="relative glass rounded-[2.5rem] border border-white/5 overflow-hidden group-hover:border-emerald-500/30 transition-all">
                    {/* Template Card Top / Visual */}
                    <div className={`h-64 bg-gradient-to-br ${tpl.gradient} relative overflow-hidden flex items-center justify-center p-8`}>
                       <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                         <div className="h-full w-full flex flex-col gap-2">
                           {[1,2,3,4,5,6].map(j => (
                             <div key={j} className="h-4 bg-white/10 rounded w-full" />
                           ))}
                         </div>
                       </div>
                       <FileText className="w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                       
                       {/* Floating Badge */}
                       <div className="absolute top-6 right-6">
                          <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 uppercase tracking-widest backdrop-blur-md">
                            {tpl.popularity}
                          </div>
                       </div>
                       
                       {/* Hover Overlay Actions */}
                       <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                             <Eye className="w-5 h-5" />
                          </button>
                          <button className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-110 transition-transform">
                             <Download className="w-5 h-5" />
                          </button>
                       </div>
                    </div>

                    {/* Template Card Bottom Content */}
                    <div className="p-8">
                       <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                          {tpl.type}
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                       </div>
                       <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{tpl.title}</h3>
                       <p className="text-zinc-500 text-sm font-medium">{tpl.category}</p>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Custom Template CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
           <div className="glass-strong rounded-[3rem] p-12 sm:p-24 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-purple-500/10" />
              <div className="relative z-10">
                 <h2 className="text-4xl font-bold text-white mb-8 leading-tight">Need a Bespoke Template? <br /> Our <span className="gradient-text">AI Designer</span> can help.</h2>
                 <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
                    Tell us about your target role and our AI will generate a customized 
                    template specifically for your industry and experience level.
                 </p>
                 <button className="bg-white text-black font-bold px-12 py-5 rounded-full hover:bg-emerald-500 hover:text-black transition-all hover:scale-105 inline-flex items-center gap-2">
                    Start Custom Generation
                    <Zap className="w-5 h-5 fill-current" />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Quote Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-8">
              <Star className="w-6 h-6 fill-current" />
           </div>
           <blockquote className="text-2xl text-white font-medium italic mb-8 leading-relaxed">
              "The 'Modern Architect' template literally doubled my interview response rate 
              in two weeks. The structure makes it so easy for recruiters to find my impact."
           </blockquote>
           <div className="text-emerald-400 font-bold uppercase tracking-widest text-xs">— Senior Backend Engineer at Google</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
