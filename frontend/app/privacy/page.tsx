"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { Shield, Lock, Eye, FileText, ChevronRight, Clock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8 border border-emerald-500/20 shadow-glow-sm"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 text-zinc-500 text-sm"
          >
            <div className="flex items-center gap-1.5 font-medium">
               <Clock className="w-4 h-4" />
               Last updated: April 22, 2024
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="text-emerald-500/80 font-bold uppercase tracking-widest text-[10px]">Version 2.4</div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="space-y-16">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">1</div>
                   Introduction
                 </h2>
                 <p className="text-zinc-400 leading-relaxed text-lg">
                    At HireOrbitAI, your privacy is our priority. This Privacy Policy 
                    explains how we collect, use, disclose, and safeguard your 
                    information when you use our platform. We value the trust you 
                    place in us and are committed to protecting your career data.
                 </p>
              </motion.div>

              {/* Data We Collect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">2</div>
                   Data Collection
                 </h2>
                 <div className="grid sm:grid-cols-2 gap-6">
                    <div className="glass p-6 rounded-2xl border border-white/5">
                       <h4 className="text-white font-bold mb-2">Personal Data</h4>
                       <p className="text-zinc-500 text-sm">Name, email, and professional links you provide during registration.</p>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5">
                       <h4 className="text-white font-bold mb-2">Resume Data</h4>
                       <p className="text-zinc-500 text-sm">The content of your resume, including skills, history, and education.</p>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5">
                       <h4 className="text-white font-bold mb-2">Usage Data</h4>
                       <p className="text-zinc-500 text-sm">Information about how you interact with our AI matching engines.</p>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5">
                       <h4 className="text-white font-bold mb-2">Integration Data</h4>
                       <p className="text-zinc-500 text-sm">Data synced from connected platforms like LinkedIn and GitHub.</p>
                    </div>
                 </div>
              </motion.div>

              {/* How We Use Your Data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">3</div>
                   Use of Information
                 </h2>
                 <ul className="space-y-4">
                    {[
                      "To provide, operate, and maintain our AI matching services.",
                      "To improve and personalize your career path recommendations.",
                      "To analyze and understand how you use our platform.",
                      "To develop new features, services, and AI training models locally.",
                      "To communicate with you regarding updates or support requests."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-zinc-400">
                        <ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                 </ul>
              </motion.div>

              {/* Data Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Lock className="w-6 h-6 text-emerald-500" />
                    Security Measures
                 </h2>
                 <p className="text-zinc-400 leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/10">
                    We implement industry-standard administrative, technical, and physical 
                    security measures to help protect your personal information. These 
                    include end-to-end encryption for resume data and multi-factor 
                    authentication for all account access.
                 </p>
              </motion.div>

              {/* Your Rights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <Eye className="w-6 h-6 text-emerald-500" />
                   Your Rights (GDPR/CCPA)
                 </h2>
                 <p className="text-zinc-400 leading-relaxed mb-6">
                    You have the right to access, update, or delete the personal information 
                    we have on you. Detailed below are the actions you can take:
                 </p>
                 <div className="grid sm:grid-cols-3 gap-4">
                    <button className="p-4 rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:border-white/20 transition-all text-sm font-bold">Request Access</button>
                    <button className="p-4 rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:border-white/20 transition-all text-sm font-bold">Portability Export</button>
                    <button className="p-4 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all text-sm font-bold">Delete Account</button>
                 </div>
              </motion.div>
           </div>

           {/* Contact Section */}
           <div className="mt-32 p-12 rounded-[3rem] border border-white/10 bg-gradient-to-tr from-emerald-500/5 to-transparent text-center">
              <FileText className="w-12 h-12 text-emerald-500 mx-auto mb-6 opacity-30" />
              <h3 className="text-xl font-bold text-white mb-4">Questions about this policy?</h3>
              <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
                If you have any questions or concern about our privacy practices, 
                please reach out to our global privacy office.
              </p>
              <a 
                href="mailto:privacy@hireorbitai.com"
                className="text-emerald-400 font-bold underline underline-offset-8 decoration-emerald-500/30 hover:text-emerald-300 transition-colors"
              >
               privacy@hireorbitai.com
              </a>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
