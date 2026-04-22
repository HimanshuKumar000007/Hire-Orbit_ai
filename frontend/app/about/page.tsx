"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Users, 
  Target, 
  Heart, 
  Globe, 
  Mail, 
  Linkedin, 
  Twitter, 
  Github,
  Star,
  Quote,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl home-glow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Users className="w-4 h-4" />
              Our Mission
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Empowering Careers Through <br />
              <span className="gradient-text">Human-Centric AI</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed"
            >
              HireOrbitAI is more than just a job board. We are a team of visionaries 
              dedicated to bridging the gap between talent and opportunity using 
              cutting-edge technology and positive psychology.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-strong p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="w-32 h-32 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Target className="w-5 h-5" />
                </div>
                Our Purpose
              </h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                To democratize career intelligence. We believe that everyone deserves 
                access to the same level of career guidance and opportunity matching 
                traditionally reserved for elite executives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-strong p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart className="w-32 h-32 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Heart className="w-5 h-5" />
                </div>
                Our Values
              </h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Integrity, Equity, and Innovation. We prioritize the candidate's journey, 
                ensuring that AI is used to empower—not exclude—the diverse workforce 
                of the future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="py-32 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-3xl opacity-30" />
              <div className="relative glass-strong rounded-[3rem] p-4 border border-white/10 aspect-square max-w-sm mx-auto overflow-hidden group">
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                   <Users className="w-32 h-32 text-zinc-800 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="text-white font-bold text-2xl mb-1">Himanshu Kumar</div>
                   <div className="text-emerald-400 font-medium text-sm">Founder & Visionary</div>
                </div>
              </div>
            </motion.div>

            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Behind the <span className="gradient-text">Vision</span></h2>
                <div className="w-20 h-1 bg-emerald-500 rounded-full" />
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-6 -left-6 w-12 h-12 text-white/5" />
                <p className="text-xl text-zinc-300 leading-relaxed italic">
                  "HireOrbitAI was born out of a simple observation: the job market is noisy, 
                  and talent is often lost in translation. We built this platform to give 
                  every professional a clear, data-backed path to their potential."
                </p>
                <div className="mt-6 text-emerald-400 font-bold">— Himanshu Kumar</div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="glass p-6 rounded-2xl border border-white/5">
                  <Star className="w-6 h-6 text-amber-400 mb-4" />
                  <div className="text-white font-bold">100+</div>
                  <div className="text-xs text-zinc-500">Industry Partnerships</div>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
                  <div className="text-white font-bold">50k+</div>
                  <div className="text-xs text-zinc-500">Career Matches</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 bg-emerald-500/5 p-12 rounded-[2.5rem] border border-emerald-500/10">
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-white mb-2">Global Presence</div>
              <p className="text-zinc-500">Helping candidates from across 20+ countries find local and remote work.</p>
            </div>
            <div className="flex items-center gap-8 overflow-hidden">
               <Globe className="w-24 h-24 text-emerald-500/20 animate-pulse" />
               <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center">
                       <Users className="w-6 h-6 text-zinc-600" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Connect */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Get in Touch</h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
            Whether you're a candidate, a hiring partner, or just curious about our tech, 
            we'd love to hear from you.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            <a 
              href="mailto:hireorbitai@gmail.com"
              className="glass p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group"
            >
              <Mail className="w-8 h-8 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold text-sm mb-1">Email Support</div>
              <div className="text-xs text-zinc-500 truncate">hireorbitai@gmail.com</div>
            </a>
            
            <a 
              href="#"
              className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all group"
            >
              <Linkedin className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold text-sm mb-1">LinkedIn</div>
              <div className="text-xs text-zinc-500">Connect with us</div>
            </a>

            <a 
              href="#"
              className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all group"
            >
              <Twitter className="w-8 h-8 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold text-sm mb-1">Twitter</div>
              <div className="text-xs text-zinc-500">Follow @HireOrbitAI</div>
            </a>
          </div>

          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
          >
            Start Your Journey Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
