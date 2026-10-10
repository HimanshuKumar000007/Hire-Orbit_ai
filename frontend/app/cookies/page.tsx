"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { Cookie, MousePointer2, PieChart, ShieldCheck, Info, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 text-zinc-500 text-sm mb-4"
          >
            <div className="flex items-center gap-1.5 font-medium">
               <Clock className="w-4 h-4" />
               Last updated: October 10, 2026
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="text-amber-500/80 font-bold uppercase tracking-widest text-[10px]">Version 2.0</div>
          </motion.div>

          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.15 }}
             className="text-zinc-400 max-w-2xl mx-auto"
          >
            Learn how HireOrbitAI uses cookies, local storage, and advertising technologies (including Google AdSense) to deliver and measure our services.
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
                            { type: "Essential", desc: "Required for basic site functionality (authentication, CSRF security, sessions).", expiry: "Session" },
                            { type: "Preferences", desc: "Remembers your dashboard layout, theme, and saved AI search parameters.", expiry: "1 Year" },
                            { type: "Analytics", desc: "Google Analytics (GA4) telemetry to understand traffic and optimize matching engine performance.", expiry: "2 Years" },
                            { type: "Advertising (Google AdSense)", desc: "Google DoubleClick DART cookies used by Google and authorized third-party ad networks to serve contextual or personalized advertisements.", expiry: "Up to 13 Months" },
                            { type: "Marketing", desc: "Used for professional career outreach and feature updates.", expiry: "6 Months" }
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
                className="glass-strong p-10 rounded-[2.5rem] border border-white/5 space-y-8"
              >
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-3">Managing Your Advertising & Cookie Preferences</h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                       You have full control over cookie usage. You can manage or disable advertising cookies directly through third-party regulatory tools or your browser settings:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                       <a
                         href="https://adssettings.google.com"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center block group"
                       >
                         <h4 className="text-white font-bold text-sm mb-1 group-hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5">
                           Google Ads Settings <ExternalLink className="w-3.5 h-3.5" />
                         </h4>
                         <p className="text-zinc-500 text-xs">Opt out of personalized ads served across Google networks.</p>
                       </a>
                       <a
                         href="https://www.aboutads.info/choices/"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center block group"
                       >
                         <h4 className="text-white font-bold text-sm mb-1 group-hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5">
                           AboutAds / NAI <ExternalLink className="w-3.5 h-3.5" />
                         </h4>
                         <p className="text-zinc-500 text-xs">Opt out of interest-based ads from participating network members.</p>
                       </a>
                       <a
                         href="https://policies.google.com/technologies/partner-sites"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center block group"
                       >
                         <h4 className="text-white font-bold text-sm mb-1 group-hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5">
                           Google Partner Sites <ExternalLink className="w-3.5 h-3.5" />
                         </h4>
                         <p className="text-zinc-500 text-xs">Read Google&apos;s full privacy practices for partner apps.</p>
                       </a>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-500">
                      Looking for more details? Review our full <Link href="/privacy" className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300">Privacy Policy</Link> or reach out to us at <a href="mailto:hireorbitai@gmail.com" className="text-white underline">hireorbitai@gmail.com</a>.
                    </p>
                    <Link
                      href="/contact"
                      className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all text-xs shrink-0"
                    >
                      Contact Compliance Desk
                    </Link>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
