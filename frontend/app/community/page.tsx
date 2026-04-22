"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Users, 
  MessageSquare, 
  Linkedin, 
  Twitter, 
  Github, 
  Calendar, 
  Zap, 
  Globe, 
  Star, 
  Heart, 
  ArrowRight,
  Share2,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

const socialHubs = [
  {
    name: "Discord",
    icon: MessageSquare,
    color: "bg-indigo-500",
    members: "10k+",
    desc: "Real-time discussions, technical help, and career networking.",
    link: "#"
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-600",
    members: "25k+",
    desc: "Professional insights, hiring news, and industry partnerships.",
    link: "#"
  },
  {
    name: "Twitter",
    icon: Twitter,
    color: "bg-zinc-800",
    members: "15k+",
    desc: "Latest product updates, AI trends, and community highlights.",
    link: "#"
  }
];

const events = [
  {
    title: "AI & The Future of Backend Development",
    date: "April 28, 2024",
    time: "6:00 PM GMT",
    type: "Webinar",
    speaker: "Himanshu Kumar"
  },
  {
    title: "HireOrbit Community Meetup - SF",
    date: "May 05, 2024",
    time: "4:00 PM PST",
    type: "In-person",
    speaker: "Community Leaders"
  },
  {
    title: "Optimizing Your Career Path Workshop",
    date: "May 12, 2024",
    time: "10:00 AM EST",
    type: "Workshop",
    speaker: "Career Experts"
  }
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <Users className="w-4 h-4" />
            Better Together
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Join the Orbit of <br />
            <span className="gradient-text">World-Class Talent</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            More than just a platform, HireOrbitAI is a global community of developers, 
            thinkers, and leaders helping each other scale their careers.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm font-bold">50+ Countries</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span className="text-white text-sm font-bold">500+ Weekly Discussions</span>
             </div>
             <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm font-bold">24/7 Support</span>
             </div>
          </div>
        </div>
      </section>

      {/* Social Hubs Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {socialHubs.map((hub, i) => (
              <motion.div
                key={hub.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass-strong rounded-[2.5rem] p-8 border border-white/5 hover:border-white/20 transition-all flex flex-col"
              >
                <div className={`${hub.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                  <hub.icon className="w-8 h-8" />
                </div>
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-2xl font-bold text-white">{hub.name}</h3>
                   <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 tracking-widest">{hub.members} members</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-10 flex-1">
                  {hub.desc}
                </p>
                <button className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 text-white font-bold text-sm border border-white/10 hover:bg-white/10 transition-all">
                  Join {hub.name}
                  <Share2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
               <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Community <br /><span className="text-emerald-400">Ambassador Program</span></h2>
               <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                  Are you a natural leader? Our Ambassador Program empowers individuals 
                  to lead local chapters, host meetups, and contribute to our open-source 
                  initiatives.
               </p>
               <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Trophy, title: "VIP Rewards", desc: "Early access, free Pro subs, and special badges." },
                    { icon: Heart, title: "Global Impact", desc: "Help local talent discover their best career paths." }
                  ].map((p, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-white/5">
                       <p.icon className="w-6 h-6 text-emerald-400 mb-4" />
                       <h4 className="text-white font-bold text-sm mb-1">{p.title}</h4>
                       <p className="text-zinc-500 text-xs">{p.desc}</p>
                    </div>
                  ))}
               </div>
               <button className="flex items-center gap-2 text-emerald-400 font-bold hover:gap-3 transition-all">
                  Learn about Ambassadors
                  <ArrowRight className="w-4 h-4" />
               </button>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className={`glass-strong aspect-square rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group ${i % 2 === 0 ? 'mt-8' : ''}`}>
                    <Users className="w-12 h-12 text-white/5 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-40" />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
             <div>
               <h2 className="text-3xl font-bold text-white mb-4">Upcoming Events</h2>
               <p className="text-zinc-400">Join our next technical deep dive or career workshop.</p>
             </div>
             <div className="hidden sm:flex gap-4">
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all">
                   <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all">
                   <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col group"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="text-[10px] font-bold text-zinc-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-tighter decoration-emerald-500 underline underline-offset-4">{event.type}</div>
                   <Calendar className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{event.title}</h3>
                <div className="space-y-2 mb-8 flex-1">
                   <div className="text-xs text-zinc-500 flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-500" />
                      Speaker: {event.speaker}
                   </div>
                   <div className="text-xs text-zinc-500 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      {event.date} • {event.time}
                   </div>
                </div>
                <button className="w-full py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all">
                   Register For Event
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
              <Star className="w-4 h-4 fill-emerald-400" />
              Orbit Community Digest
           </div>
           <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Stay Connected with the Orbit</h2>
           <p className="text-zinc-500 text-lg mb-10">
              Get weekly summaries of the best discussions, top community members, 
              and exclusive career opportunities delivered to your inbox.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button className="bg-emerald-500 text-black font-bold px-8 py-4 rounded-full hover:bg-emerald-400 transition-all">
                Subscribe
              </button>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
