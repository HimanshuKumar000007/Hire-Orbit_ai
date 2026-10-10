"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  FileText, 
  Clock, 
  Building2, 
  Brain, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-8 border border-amber-500/20 shadow-glow-sm"
          >
            <AlertTriangle className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Platform Disclaimer
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 text-zinc-500 text-sm mb-4"
          >
            <div className="flex items-center gap-1.5 font-medium">
               <Clock className="w-4 h-4" />
               Effective Date: October 10, 2026
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="text-amber-500/80 font-bold uppercase tracking-widest text-[10px]">Legal Notice</div>
          </motion.div>

          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.15 }}
             className="text-zinc-400 max-w-2xl mx-auto"
          >
            Important legal notices regarding our AI career intelligence tools, government job information desk, and third-party advertising.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-400">
           <div className="space-y-16">
              
              {/* 1. Government Non-Affiliation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">1</div>
                   Government Examination &amp; Recruitment Non-Affiliation
                 </h2>
                 <div className="glass p-8 rounded-3xl border border-white/10 space-y-4 bg-white/[0.02]">
                   <div className="flex items-start gap-3">
                     <Building2 className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                     <p className="text-zinc-300 leading-relaxed">
                       <strong>HireOrbitAI is an independent, privately operated career technology platform.</strong> We are <strong>NOT</strong> affiliated with, associated with, endorsed by, or in any way officially connected with the Government of India, any State Government, Union Territory administration, or statutory recruitment boards including but not limited to UPSC, SSC, IBPS, RRB, State Public Service Commissions (PSCs), or National Testing Agencies.
                     </p>
                   </div>
                   <p className="leading-relaxed text-sm text-zinc-400 pt-2 border-t border-white/5">
                     All notices, admit card dates, syllabus outlines, and result updates published on our Government Desk (<Link href="/gov" className="text-emerald-400 underline underline-offset-4">/gov</Link>) are curated strictly for informational and educational reference from publicly available official gazettes, press releases, and authorized departmental portals. While we employ rigorous multi-layer verification algorithms to ensure timeliness and accuracy, aspirants are strongly advised to always cross-verify all details against the official notification documents published on the respective official government portals.
                   </p>
                 </div>
              </motion.div>

              {/* 2. AI Career Advice & Matching */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">2</div>
                   AI Recommendations &amp; Employment Guarantee Disclaimer
                 </h2>
                 <p className="leading-relaxed">
                   The resume parsing engines, ATS score estimates, interview question models, and career roadmaps provided by HireOrbitAI are algorithmic guidance tools generated via artificial intelligence and predictive machine learning models.
                 </p>
                 <ul className="space-y-3">
                   {[
                     "HireOrbitAI does not guarantee employment, interview callbacks, hiring offers, or specific compensation outcomes.",
                     "ATS scores reflect algorithmic compatibility models and may vary from proprietary enterprise screening setups used by individual corporate employers.",
                     "Users remain fully responsible for the accuracy and truthful representation of all information submitted on their resumes and job applications."
                   ].map((item, i) => (
                     <li key={i} className="flex gap-3 text-zinc-300">
                       <ChevronRight className="w-5 h-5 text-amber-500 shrink-0" />
                       <span>{item}</span>
                     </li>
                   ))}
                 </ul>
              </motion.div>

              {/* 3. Third-Party Advertising & Google AdSense */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">3</div>
                   Third-Party Advertising &amp; Google AdSense
                 </h2>
                 <p className="leading-relaxed">
                   This website displays advertisements served by third-party advertising networks, including <strong>Google AdSense</strong>. 
                 </p>
                 <div className="glass p-6 rounded-2xl border border-white/5 space-y-3 text-sm">
                   <p>
                     The appearance of third-party advertisements or sponsored links on HireOrbitAI does not constitute an endorsement, warranty, or recommendation by HireOrbitAI of the advertised products, services, claims, or businesses.
                   </p>
                   <p className="text-zinc-500">
                     We bear no responsibility or liability for transactions, interactions, or engagements between users and third-party advertisers. Users should review the respective privacy terms and conditions of third-party vendors when interacting with external advertisements.
                   </p>
                 </div>
              </motion.div>

              {/* 4. External Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">4</div>
                   External Hyperlinks
                 </h2>
                 <p className="leading-relaxed">
                   HireOrbitAI may contain links to external third-party websites or services that are not owned or controlled by HireOrbitAI (e.g., official recruitment portals, educational sites, partner resources). We have no control over, and assume no responsibility for, the content, privacy policies, availability, or practices of any third-party websites.
                 </p>
              </motion.div>

              {/* 5. Contact Desk */}
              <div className="mt-32 p-12 text-center glass rounded-3xl border border-white/5 max-w-2xl mx-auto">
                 <Scale className="w-10 h-10 text-amber-400 mx-auto mb-4 opacity-50" />
                 <h3 className="text-white font-bold text-lg mb-2">Notice &amp; Takedown Requests</h3>
                 <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                   If you believe any information, notice summary, or content on this website is inaccurate or requires clarification, please notify our editorial and compliance team immediately.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold">
                   <a 
                     href="mailto:hireorbitai@gmail.com?subject=Disclaimer Clarification Request"
                     className="px-6 py-3 rounded-xl bg-amber-500 text-black hover:bg-amber-400 transition-colors"
                   >
                     hireorbitai@gmail.com
                   </a>
                   <Link
                     href="/contact"
                     className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors"
                   >
                     Visit Contact Desk
                   </Link>
                 </div>
              </div>

           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
