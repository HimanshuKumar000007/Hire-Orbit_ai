"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Handshake, 
  Target, 
  Rocket, 
  Cpu, 
  GraduationCap, 
  Globe, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';
import Link from 'next/link';

const partnershipTiers = [
  {
    title: "Hiring Labs",
    icon: Building2,
    color: "emerald",
    desc: "For enterprises looking for elite-tier matched talent through our proprietary semantic engine.",
    benefits: ["Priority access to top 1% talent", "Custom recruiter dashboards", "ATS integration support"]
  },
  {
    title: "EduCloud",
    icon: GraduationCap,
    color: "violet",
    desc: "For universities and bootcamps aiming to provide AI-powered career roadmaps to their students.",
    benefits: ["White-labeled career portals", "Skill gap analysis APIs", "Student success analytics"]
  },
  {
    title: "API Alliance",
    icon: Cpu,
    color: "blue",
    desc: "For tech platforms seeking to integrate HireOrbitAI's matching intelligence into their own ecosystem.",
    benefits: ["Full REST API access", "Webhooks for real-time alerts", "Developer sandbox environment"]
  }
];

export default function PartnersPage() {
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
            <Handshake className="w-4 h-4" />
            Global Partner Network
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Building the Ecosystem of <br />
            <span className="gradient-text">Future Talent</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto"
          >
            We collaborate with world-class institutions and forward-thinking companies 
            to redefine how talent meets opportunity.
          </motion.p>
        </div>
      </section>

      {/* Partnership Tiers Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {partnershipTiers.map((tier, i) => (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className={`absolute -inset-px bg-gradient-to-br from-${tier.color}-500/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />
                <div className="relative glass-strong rounded-[2.5rem] p-10 border border-white/5 hover:border-white/10 transition-all flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-${tier.color}-400 mb-8 group-hover:scale-110 transition-transform`}>
                    <tier.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{tier.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
                    {tier.desc}
                  </p>

                  <ul className="space-y-4 mb-10">
                    {tier.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center gap-3 text-zinc-300 text-sm">
                        <CheckCircle2 className={`w-4 h-4 text-${tier.color}-500 flex-shrink-0`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-xl font-bold text-sm bg-white/5 text-white border border-white/10 group-hover:bg-${tier.color}-500 group-hover:text-black transition-all`}>
                    Inquire About {tier.title}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Partner with <br />
                <span className="text-emerald-400">HireOrbitAI?</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: Target, title: "Precision-Matched Talent", desc: "Reduce hiring time by 60% with semantic matching that understands your culture." },
                  { icon: Rocket, title: "Accelerated Growth", desc: "Gain early access to emerging talent pools before they hit the open market." },
                  { icon: Zap, title: "Advanced Analytics", desc: "Understand skill trends and market shifts with live data-driven reports." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl" />
              <div className="glass-strong rounded-[2.5rem] p-12 border border-white/10 relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-8">
                   <Sparkles className="w-5 h-5 text-amber-400" />
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Network Reach</span>
                 </div>
                 <div className="space-y-8">
                    {[
                      { label: "Global Partners", val: "150+" },
                      { label: "Hired via Partners", val: "12,000" },
                      { label: "Partner Satisfaction", val: "98%" }
                    ].map((stat, i) => (
                      <div key={i}>
                        <div className="text-4xl font-bold text-white mb-1">{stat.val}</div>
                        <div className="text-sm text-zinc-500">{stat.label}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Gallery */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-12">Trusted by Industry Leaders</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-center h-20 glass rounded-2xl border border-white/5">
                   <div className="text-white/20 font-bold italic">Partner Logo {i}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Start Your Partnership Journey</h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Ready to scale your talent ecosystem or integrate world-class AI matching? 
            Our team is excited to explore how we can build the future together.
          </p>
          <button className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105">
            Become a Partner
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
