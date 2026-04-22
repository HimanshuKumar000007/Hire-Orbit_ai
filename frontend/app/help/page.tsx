"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Search, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Cpu, 
  MessageCircle, 
  Mail, 
  ChevronDown, 
  HelpCircle,
  Zap,
  Globe,
  Settings
} from 'lucide-react';
import { useState } from 'react';

const categories = [
  { icon: User, title: "Account & Billing", desc: "Manage your subscription, security, and personal data." },
  { icon: Briefcase, title: "Jobs & Matching", desc: "How our AI finds you roles and how to manage applications." },
  { icon: Cpu, title: "AI Optimization", desc: "Tips for resume scoring and real-time skill analysis." },
  { icon: Settings, title: "Technical Support", desc: "Troubleshoot browser issues, sync delays, and errors." }
];

const faqs = [
  {
    question: "How does the AI semantic matching work?",
    answer: "Our engine uses advanced vector embeddings to understand the context of your skills and career history. Instead of just looking for keywords, it understands the 'meaning' behind your experience and matches it with job requirements that require similar depth."
  },
  {
    question: "Is my personal data secure?",
    answer: "Absolutely. We use enterprise-grade encryption and comply with global data protection standards (GDPR/CCPA). Your resume data is only used for matching and is never sold to third parties."
  },
  {
    question: "How can I improve my resume score?",
    answer: "The scoring engine looks for impact-driven language and technical alignment. We recommend using quantifiable results and ensuring your most relevant skills are clearly articulated in your professional summary."
  },
  {
    question: "Can I connect multiple professional accounts?",
    answer: "Yes! You can link LinkedIn, GitHub, and your personal portfolio sites in the 'Integrations' section of your dashboard to provide a holistic view for the AI."
  }
];

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Support Center
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-8 leading-tight"
          >
            How Can We <span className="gradient-text">Help You</span> Today?
          </motion.h1>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for answers, guides, troubleshooting..." 
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-500 shadow-glow-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold mb-3">{cat.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
             <p className="text-zinc-500">Quick answers to common queries about HireOrbitAI.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="glass rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-white/10"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center text-white font-medium group"
                >
                  <span className="group-hover:text-emerald-400 transition-colors">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-strong rounded-[3rem] p-12 sm:p-20 text-center border border-white/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-indigo-500/5" />
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Still Need Assistance?</h2>
                <p className="text-zinc-400 mb-12 text-lg">
                  Can't find the answer you're looking for? Our dedicated 
                  support advocates are ready to help you 24/7.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                   <button className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all">
                      <MessageCircle className="w-5 h-5" />
                      Live Chat Support
                   </button>
                   <button className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all">
                      <Mail className="w-5 h-5" />
                      Send an Email
                   </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-6 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live: <span className="text-white">Under 2m response</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Support: <span className="text-white">Global (24/7)</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
