"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { Cookie, MousePointer2, PieChart, ShieldCheck, Info } from 'lucide-react';

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-8 border border-amber-500/20 shadow-glow-sm"
          >
            <Cookie className="w-8 h-8" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Cookie Policy
          </motion.h1>
          
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-zinc-500 max-w-2xl mx-auto italic"
          >
            Transparent insights into how we use cookies to personalize 
            your professional orbit.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="space-y-16">
              {/* Introduction */}
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-500" />
                    What are Cookies?
                 </h2>
                 <p className="text-zinc-400 leading-relaxed">
                    Cookies are small text files that are stored on your device when you 
                    visit a website. They help the website remember your preferences 
                    and provide a more seamless user experience. We use them to keep 
                    you logged in and remember your AI matching filters.
                 </p>
              </div>

              {/* Types of Cookies Table */}
              <div className="space-y-8">
                 <h2 className="text-2xl font-bold text-white">How We Use Cookies</h2>
                 <div className="overflow-hidden glass rounded-3xl border border-white/10">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                             <th className="px-6 py-4 font-bold text-zinc-300">Type</th>
                             <th className="px-6 py-4 font-bold text-zinc-300">Purpose</th>
                             <th className="px-6 py-4 font-bold text-zinc-300">Expiry</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {[
                            { type: "Essential", desc: "Required for basic site functionality (login, security).", expiry: "Session" },
                            { type: "Preferences", desc: "Remembers your dashboard layout and AI settings.", expiry: "1 Year" },
                            { type: "Analytics", desc: "Helps us improve our matching engine speed.", expiry: "2 Years" },
                            { type: "Marketing", desc: "Used for professional career outreach campaigns.", expiry: "6 Months" }
                          ].map((cookie, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                               <td className="px-6 py-4 font-bold text-white">{cookie.type}</td>
                               <td className="px-6 py-4 text-zinc-400">{cookie.desc}</td>
                               <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{cookie.expiry}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Cookie Management */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-strong p-10 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center gap-10"
              >
                 <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-4">Managing Preferences</h2>
                    <p className="text-zinc-500 leading-relaxed mb-6">
                       You can opt-out of non-essential cookies at any time via our 
                       preference center. Note that disabling some cookies may 
                       affect the performance of our semantic matching tools.
                    </p>
                    <button className="px-8 py-4 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all">
                       Open Cookie Settings
                    </button>
                 </div>
                 <div className="w-48 h-48 bg-amber-500/5 rounded-full flex items-center justify-center border border-amber-500/10">
                    <MousePointer2 className="w-16 h-16 text-amber-500/30" />
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
