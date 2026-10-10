"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { Shield, Lock, Eye, FileText, ChevronRight, Clock, Cookie, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
               Last updated: October 10, 2026
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="text-emerald-500/80 font-bold uppercase tracking-widest text-[10px]">Version 3.0</div>
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

              {/* Google AdSense & Advertising Cookies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">4</div>
                   Google AdSense & Third-Party Advertising
                 </h2>
                 <div className="space-y-4 text-zinc-400 leading-relaxed">
                   <p>
                     We use third-party advertising companies, including <strong className="text-white">Google AdSense</strong>, to serve advertisements when you visit our website. These companies may use cookies, web beacons, and other tracking technologies to collect information about your visits to this and other websites in order to provide personalized advertisements about goods and services of interest to you.
                   </p>
                   
                   <div className="glass p-6 rounded-2xl border border-white/10 space-y-4 bg-white/[0.02]">
                     <h3 className="text-white font-bold text-base flex items-center gap-2">
                       <Cookie className="w-5 h-5 text-emerald-400" />
                       DoubleClick DART Cookie & Google Advertising Policies
                     </h3>
                     <ul className="space-y-3 text-sm text-zinc-300">
                       <li className="flex items-start gap-2">
                         <span className="text-emerald-400 font-bold">•</span>
                         <span><strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites on the internet.</span>
                       </li>
                       <li className="flex items-start gap-2">
                         <span className="text-emerald-400 font-bold">•</span>
                         <span><strong>Personalized Advertising:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to HireOrbitAI and/or other sites across the internet.</span>
                       </li>
                       <li className="flex items-start gap-2">
                         <span className="text-emerald-400 font-bold">•</span>
                         <span><strong>Partner Site Data Usage:</strong> For details on how Google handles data when you use our site, please visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300 inline-flex items-center gap-1 font-medium">How Google uses information from sites or apps that use our services <ExternalLink className="w-3.5 h-3.5 inline" /></a>.</span>
                       </li>
                     </ul>
                   </div>

                   <div className="glass p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                     <h4 className="text-white font-bold text-sm">How to Opt Out of Personalized Advertising</h4>
                     <p className="text-sm text-zinc-300">
                       You have complete control over how advertising cookies are used for personalization:
                     </p>
                     <div className="flex flex-wrap gap-3 pt-2">
                       <a
                         href="https://adssettings.google.com"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                       >
                         Google Ads Settings <ExternalLink className="w-3.5 h-3.5" />
                       </a>
                       <a
                         href="https://www.aboutads.info/choices/"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                       >
                         AboutAds Consumer Choice (NAI) <ExternalLink className="w-3.5 h-3.5" />
                       </a>
                       <a
                         href="https://www.youronlinechoices.com/"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                       >
                         Your Online Choices (EU) <ExternalLink className="w-3.5 h-3.5" />
                       </a>
                     </div>
                   </div>
                 </div>
              </motion.div>

              {/* Log Files & Web Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">5</div>
                   Log Files & Telemetry
                 </h2>
                 <p className="text-zinc-400 leading-relaxed">
                   Like many standard websites, HireOrbitAI maintains system log files. The information inside these log files includes internet protocol (IP) addresses, browser types, Internet Service Providers (ISP), date/time stamps, referring/exit pages, and click counts. This data is not linked to any information that is personally identifiable and is used solely for analyzing trends, administering the site, preventing malicious traffic, and gathering broad demographic insights.
                 </p>
              </motion.div>

              {/* Data Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">6</div>
                   Security Measures & Storage
                 </h2>
                 <p className="text-zinc-400 leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/10">
                    We implement industry-standard administrative, technical, and physical 
                    security measures to help protect your personal information. These 
                    include end-to-end encryption for resume data, TLS 1.3 in transit, AES-256 
                    at rest, and strict row-level security across databases.
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
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">7</div>
                   Your Privacy Rights (GDPR, CCPA & DPDP)
                 </h2>
                 <p className="text-zinc-400 leading-relaxed mb-6">
                    Depending on your location, you hold statutory rights regarding your personal information, including the right to access, rectify, port, or request deletion of your records. You may exercise any of these rights at any time by contacting our privacy compliance desk.
                 </p>
                 <div className="grid sm:grid-cols-3 gap-4">
                    <a href="mailto:hireorbitai@gmail.com?subject=Data Access Request" className="p-4 rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-bold text-center block bg-white/[0.02]">Request Access</a>
                    <a href="mailto:hireorbitai@gmail.com?subject=Data Portability Export" className="p-4 rounded-xl border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-bold text-center block bg-white/[0.02]">Portability Export</a>
                    <a href="mailto:hireorbitai@gmail.com?subject=Account Deletion Request" className="p-4 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-bold text-center block bg-rose-500/5">Delete Account</a>
                 </div>
              </motion.div>
           </div>

           {/* Contact Section */}
           <div className="mt-32 p-12 rounded-[3rem] border border-white/10 bg-gradient-to-tr from-emerald-500/5 to-transparent text-center">
              <FileText className="w-12 h-12 text-emerald-500 mx-auto mb-6 opacity-30" />
              <h3 className="text-xl font-bold text-white mb-4">Questions about our Privacy Policy?</h3>
              <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
                If you have questions or concerns regarding our privacy practices, Google AdSense disclosures, or personal data handling, our privacy team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="mailto:hireorbitai@gmail.com"
                  className="px-6 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors text-sm"
                >
                  hireorbitai@gmail.com
                </a>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-colors text-sm"
                >
                  Visit Contact Desk
                </Link>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
