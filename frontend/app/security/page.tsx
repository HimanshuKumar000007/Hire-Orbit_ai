"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { ShieldAlert, Lock, Zap, Server, Globe, FileCheck, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 -left-1/4 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8 border border-emerald-500/20 shadow-glow"
          >
            <ShieldAlert className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Security Architecture
          </motion.h1>
          
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-zinc-500 max-w-2xl mx-auto leading-relaxed"
          >
            How we protect your career data with enterprise-grade encryption 
            and proactive vulnerability management.
          </motion.p>
        </div>
      </section>

      {/* Security Pillars */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Lock, title: "Data Encryption", desc: "All user data, including resumes and PII, is encrypted at rest using AES-256 and in transit via TLS 1.3." },
                { icon: Zap, title: "Proactive Defense", desc: "Real-time threat monitoring and automated DDoS protection to ensure platform availability." },
                { icon: FileCheck, title: "Compliance", desc: "Designed with SOC2 Type II, GDPR, and ISO 27001 standards at our core." },
                { icon: Server, title: "Isolated Compute", desc: "AI matching workloads run in isolated execution environments with strict network controls." },
                { icon: Globe, title: "Regional Sovereignty", desc: "Data residency options available for enterprises to keep data within specific geographic boundaries." },
                { icon: ShieldAlert, title: "Incident Response", desc: "Our 24/7 security team follows a rigorous incident response plan with full transparency." }
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all group"
                >
                  <pillar.icon className="w-8 h-8 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold mb-3">{pillar.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold text-white mb-12">Security Certifications</h2>
           <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale">
              {["SOC2 Certified", "GDPR Compliant", "ISO 27001", "HIPAA Ready"].map((cert, i) => (
                <div key={i} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest uppercase">
                   {cert}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Vulnerability Reporting CTA */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4">
           <div className="glass-strong rounded-[3rem] p-12 sm:p-20 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 p-12 opacity-5">
                 <ShieldAlert className="w-48 h-48 text-emerald-500" />
              </div>
              <div className="flex-1 relative z-10">
                 <h2 className="text-3xl font-bold text-white mb-4">Vulnerability Disclosure</h2>
                 <p className="text-zinc-400 leading-relaxed">
                   We believe in responsible disclosure. If you've discovered a security 
                   vulnerability, please report it to our team. We offer a competitive 
                   Bug Bounty program for qualified reports.
                 </p>
              </div>
              <div className="relative z-10">
                 <button className="px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2">
                    Report Vulnerability
                    <CheckCircle2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
