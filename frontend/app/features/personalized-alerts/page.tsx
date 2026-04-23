"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Smartphone, 
  Mail, 
  Settings, 
  Filter, 
  Clock,
  ArrowRight,
  Zap,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function PersonalizedAlertsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                Zero Noise, Maximum Impact
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Alerts That <br />
                <span className="gradient-text">Actually Matter</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-zinc-400 leading-relaxed mb-8"
              >
                Stop drowning in irrelevant notifications. HireOrbitAI monitors the market 
                24/7 and only breaks your focus when we find a role that has a high 
                probability of landing you an interview.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link 
                  href="/signup"
                  className="px-8 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
                >
                  Configure My Alerts
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="glass-strong rounded-3xl p-6 border border-white/10 relative overflow-hidden space-y-4">
                 <div className="flex items-center justify-between pb-4 border-b border-white/5">
                   <div className="text-white font-bold">Priority Feed</div>
                   <Settings className="w-4 h-4 text-zinc-500 cursor-pointer" />
                 </div>
                 
                 {[
                   { title: "Senior UI Designer", company: "Linear", match: 96, time: "2m ago", type: "Perfect Match" },
                   { title: "Product Strategist", company: "Vercel", match: 88, time: "1h ago", type: "High Prob." },
                   { title: "Creative Lead", company: "Apple", match: 91, time: "3h ago", type: "Top 5%" }
                 ].map((alert, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors cursor-default"
                   >
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <div className="text-white text-sm font-bold">{alert.title}</div>
                         <div className="text-xs text-zinc-500">{alert.company}</div>
                       </div>
                       <div className="text-[10px] text-zinc-600 font-mono">{alert.time}</div>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                         {alert.type}
                       </span>
                       <span className="text-xs font-bold text-white">{alert.match}% Match</span>
                     </div>
                   </motion.div>
                 ))}

                 <div className="pt-4 flex justify-center">
                    <div className="animate-pulse flex items-center gap-2 text-xs text-zinc-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Monitoring 1.2M jobs in real-time...
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connectivity */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Multi-Channel Delivery</h2>
            <p className="text-zinc-400">Get notified wherever you are. No app install required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: "WhatsApp Sync", desc: "Get high-priority matches sent directly to your phone for instant action." },
              { icon: Mail, title: "Daily Digest", desc: "A beautifully curated summary of the day's opportunities, directly in your inbox." },
              { icon: Smartphone, title: "Push Notifications", desc: "Real-time updates via browser and mobile for the fastest response times." }
            ].map((channel, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-white/5 text-center group hover:border-rose-500/20 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-rose-500 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <channel.icon className="w-8 h-8" />
                </div>
                <h3 className="text-white font-bold mb-3">{channel.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{channel.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logic Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-white">Smart Selection <br /><span className="text-rose-400">Not Just Filters</span></h2>
              <p className="text-zinc-400">
                Most platforms alert you for everything. We use a probabilistic filter 
                that considers your preferences, current market competitiveness, and 
                the likelihood of response.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Filter, text: "Noise Reduction Algorithm" },
                  { icon: Clock, text: "Frequency Control (Instant to Weekly)" },
                  { icon: Zap, text: "First-to-Apply Advantage" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-300">
                    <item.icon className="w-5 h-5 text-rose-400" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full glass p-8 rounded-[2rem] border border-white/10">
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-6">Efficiency Stats</div>
              <div className="space-y-6">
                {[
                  { label: "Notification Accuracy", val: 98 },
                  { label: "Reduction in Spam", val: 85 },
                  { label: "Response Rate Improvement", val: 60 }
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">{stat.label}</span>
                      <span className="text-white">+{stat.val}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${stat.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Never Miss Your <span className="text-emerald-400">Big Break</span></h2>
          <p className="text-zinc-400 mb-10">Start getting the job alerts you actually want to open.</p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
          >
            Stay Notified
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
