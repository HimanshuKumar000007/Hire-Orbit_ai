"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { FileText, Scale, UserCheck, AlertCircle, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-8 border border-blue-500/20 shadow-glow-sm"
          >
            <Scale className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Terms of Service
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 text-zinc-500 text-sm"
          >
            <div className="flex items-center gap-1.5 font-medium">
               <Clock className="w-4 h-4" />
               Effective Date: October 10, 2026
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="text-blue-500/80 font-bold uppercase tracking-widest text-[10px]">Legal</div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-400">
           <div className="space-y-16">
              {/* Agreement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
                 <p className="leading-relaxed">
                    By accessing or using HireOrbitAI, you agree to be bound by these 
                    Terms of Service. If you do not agree to all of these terms, do 
                    not use our services. These terms constitute a legally binding 
                    agreement between you and HireOrbitAI.
                 </p>
              </motion.div>

              {/* Account Responsibilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white">2. Account Responsibility</h2>
                 <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                    <p className="flex items-start gap-3">
                       <UserCheck className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                       <span>You are responsible for maintaining the confidentiality of your account and password.</span>
                    </p>
                    <p className="flex items-start gap-3">
                       <UserCheck className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                       <span>You must provide accurate and complete professional information for AI matching purposes.</span>
                    </p>
                    <p className="flex items-start gap-3">
                       <UserCheck className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                       <span>Any misuse of automated tools to extract data from our platform is strictly prohibited.</span>
                    </p>
                 </div>
              </motion.div>

              {/* Intellectual Property */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
                 <p className="leading-relaxed">
                    The HireOrbitAI platform, including the AI matching engine, logos, designs, 
                    and software, is protected by intellectual property laws. You are 
                    granted a limited license to use our services but may not copy, 
                    modify, or redistribute our proprietary systems without written consent.
                 </p>
              </motion.div>

              {/* Limitation of Liability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 bg-white/5 p-10 rounded-[2.5rem] border border-white/10"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                    4. Limitation of Liability
                 </h2>
                 <p className="text-sm italic leading-relaxed">
                    HireOrbitAI provides AI-driven career suggestions. While we strive 
                    for maximum precision, we do not guarantee job placement or 
                    specific career outcomes. The platform is provided "as is" and 
                    "as available" without warranties of any kind.
                 </p>
              </motion.div>

              {/* Termination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white">5. Termination</h2>
                 <p className="leading-relaxed">
                    We reserve the right to terminate or suspend your account at our 
                    sole discretion, without notice, for conduct that we believe 
                    violates these Terms or is harmful to other users of our platform.
                 </p>
              </motion.div>
           </div>

           {/* Legal Note */}
           <div className="mt-32 p-12 text-center glass rounded-3xl border border-white/5 max-w-2xl mx-auto">
              <FileText className="w-10 h-10 text-blue-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-white font-bold text-lg mb-2">Legal Compliance & Contact</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                These terms are governed by the applicable laws of India. For specific legal inquiries, statutory notices, or terms clarification, please contact our compliance desk at{" "}
                <a href="mailto:hireorbitai@gmail.com" className="text-blue-400 underline underline-offset-4 font-semibold">
                  hireorbitai@gmail.com
                </a>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <Link href="/privacy" className="text-zinc-400 hover:text-white underline">
                  Privacy Policy
                </Link>
                <span className="text-zinc-600">•</span>
                <Link href="/disclaimer" className="text-zinc-400 hover:text-white underline">
                  Platform Disclaimer
                </Link>
                <span className="text-zinc-600">•</span>
                <Link href="/contact" className="text-zinc-400 hover:text-white underline">
                  Contact Us
                </Link>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
