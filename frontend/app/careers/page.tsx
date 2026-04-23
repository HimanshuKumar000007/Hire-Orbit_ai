"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Briefcase, 
  Globe, 
  Zap, 
  Heart, 
  Coffee, 
  Monitor, 
  Rocket, 
  Users, 
  ArrowRight,
  GraduationCap,
  Clock
} from 'lucide-react';
import Link from 'next/link';

const positions = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote / Hybrid",
    type: "Full-time"
  },
  {
    title: "AI/ML Research Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Product Designer (UX/UI)",
    department: "Design",
    location: "Remote / Hybrid",
    type: "Full-time"
  },
  {
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Customer Success Lead",
    department: "Operations",
    location: "Remote",
    type: "Full-time"
  }
];

const benefits = [
  { icon: Globe, title: "Remote-First", desc: "Work from anywhere in the world. We believe in results, not residency." },
  { icon: GraduationCap, title: "Learning Stipend", desc: "Annual budget for courses, books, and professional growth." },
  { icon: Heart, title: "Health & Wellness", desc: "Comprehensive health coverage and mental health support." },
  { icon: Zap, title: "Modern Tech", desc: "Get the best tools for the job. MacBook Pro, ergonomic setups, etc." }
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl home-glow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Briefcase className="w-4 h-4" />
              Join the Mission
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Help Us Build the <br />
              <span className="gradient-text">Future of Work</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed mb-10"
            >
              At HireOrbitAI, we are redefining how the world finds work. 
              We're looking for passionate, curious, and driven individuals 
              to join our mission-driven team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
               <a 
                href="#open-roles"
                className="px-10 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
               >
                View Open Roles
               </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Engineering a Better <br /><span className="text-emerald-400">Career Experience</span></h2>
                 <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                    We aren't just building software; we are building hope. Every line of code 
                    and every pixel we design directly contributes to helping someone land 
                    the role that will change their life.
                 </p>
                 <div className="space-y-4">
                    {[
                      { icon: Users, title: "Autonomous Teams", desc: "We trust our people. You own your work and its impact." },
                      { icon: Coffee, title: "Work-Life Harmony", desc: "No burnout culture. We value mental health and personal time." },
                      { icon: Rocket, title: "Fast Growth", desc: "Join an early-stage team and shape the foundation of the company." }
                    ].map((val, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                           <val.icon className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-white font-bold">{val.title}</h4>
                            <p className="text-zinc-500 text-sm">{val.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="relative">
                 <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
                 <div className="glass-strong rounded-[2.5rem] p-12 border border-white/10 relative z-10">
                    <div className="text-6xl font-bold text-white mb-4">100%</div>
                    <div className="text-xl font-bold text-emerald-400 mb-6">Remote Distribution</div>
                    <p className="text-zinc-400 mb-8">
                      Our team spans across 4 continents and 12 time zones. We embrace 
                      asynchronous communication to maintain peak productivity and personal freedom.
                    </p>
                    <div className="flex -space-x-4">
                       {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center">
                            <Users className="w-6 h-6 text-zinc-600" />
                         </div>
                       ))}
                       <div className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-emerald-500 flex items-center justify-center text-black font-bold text-xs">
                          +12
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Perks & Benefits</h2>
              <p className="text-zinc-500">We take care of our own so they can take care of the mission.</p>
           </div>
           
           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-white font-bold mb-3">{benefit.title}</h3>
                   <p className="text-zinc-500 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="open-roles" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                 <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Current Openings</h2>
                 <p className="text-zinc-400">Join a team of 20+ engineers, designers, and thinkers.</p>
              </div>
              <div className="flex gap-2">
                 {["All Positions", "Engineering", "Design", "Marketing"].map((filter, i) => (
                   <button key={i} className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/5 hover:border-white/20 transition-all ${i === 0 ? 'bg-emerald-500 text-black border-emerald-500' : 'text-zinc-500'}`}>
                      {filter}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              {positions.map((role, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                   <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative glass-strong p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group-hover:border-emerald-500/30 transition-all">
                      <div>
                         <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{role.title}</h3>
                         <div className="flex flex-wrap gap-4 text-xs font-medium text-zinc-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" />{role.department}</span>
                            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{role.location}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{role.type}</span>
                         </div>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white font-bold text-sm border border-white/10 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all">
                         Apply Now
                         <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
              ))}
           </div>

           <div className="mt-16 text-center">
              <p className="text-zinc-500 mb-6 font-medium">Don't see a role that fits? We're always looking for talent.</p>
              <button className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors underline underline-offset-8">
                 Send us an Open Application
              </button>
           </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="glass p-12 sm:p-20 rounded-[3rem] border border-white/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-indigo-500/5" />
             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Ready to Scale the Orbit?</h2>
             <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
                Join Himanshu and the rest of the team in solving the world's most 
                complex career challenges. Let's build together.
             </p>
             <button className="bg-emerald-500 text-black font-bold px-12 py-5 rounded-full hover:bg-emerald-400 transition-all hover:scale-105">
                Join the Team
             </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
