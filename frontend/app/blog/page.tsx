"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Search, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowRight, 
  Tag, 
  Share2, 
  Mail,
  Newspaper,
  TrendingUp,
  Brain,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    title: "How AI is Revolutionizing Semantic Job Matching",
    excerpt: "Discover the technology behind deep learning models that understand the true meaning of your career history, going far beyond simple keyword searches.",
    category: "AI & Tech",
    date: "April 20, 2024",
    readTime: "8 min read",
    author: "HireOrbit Team",
    icon: Brain,
    imageColor: "from-violet-500/20 to-purple-500/20"
  },
  {
    title: "10 Skills Every Frontend Developer Needs in 2024",
    excerpt: "The landscape of web development is shifting. We analyzed 100,000+ job descriptions to identify the must-have skills for this year.",
    category: "Career Advice",
    date: "April 15, 2024",
    readTime: "5 min read",
    author: "Himanshu Kumar",
    icon: Rocket,
    imageColor: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Understanding ATS: Why Your Resume Might Be Getting Filtered",
    excerpt: "Applicant Tracking Systems are the first hurdle. Learn how to structure your resume to ensure it actually reaches human eyes.",
    category: "Optimization",
    date: "April 10, 2024",
    readTime: "6 min read",
    author: "HireOrbit Team",
    icon: Newspaper,
    imageColor: "from-orange-500/20 to-amber-500/20"
  },
  {
    title: "The Power of Networking in the Age of Remote Work",
    excerpt: "Remote work hasn't killed networking—it has changed it. Explore strategies for building meaningful professional relationships online.",
    category: "Professional Growth",
    date: "April 05, 2024",
    readTime: "7 min read",
    author: "Himanshu Kumar",
    icon: TrendingUp,
    imageColor: "from-blue-500/20 to-cyan-500/20"
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Newspaper className="w-4 h-4" />
              The HireOrbit Blog
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Navigating the Future of <br />
              <span className="gradient-text">Work and Intelligence</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed mb-10"
            >
              Expert insights, product updates, and career roadmaps to help 
              you stay ahead in a rapidly evolving professional landscape.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto relative group"
            >
               <input 
                type="text" 
                placeholder="Search articles, topics, keywords..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-500"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-emerald-400" />
              Latest Insights
            </h2>
            <div className="flex gap-4">
               {["All", "Tech", "Career", "Updates"].map((cat, i) => (
                 <button key={i} className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/5 hover:border-white/20 transition-all ${i === 0 ? 'bg-emerald-500 text-black border-emerald-500' : 'text-zinc-500'}`}>
                    {cat}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative glass-strong rounded-[2.5rem] border border-white/5 group-hover:border-white/20 transition-all overflow-hidden flex flex-col h-full">
                  <div className={`h-48 bg-gradient-to-br ${post.imageColor} relative flex items-center justify-center overflow-hidden`}>
                     <post.icon className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-6 left-6">
                        <span className="text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                          {post.category}
                        </span>
                     </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                           {post.author[0]}
                         </div>
                         <span className="text-xs text-zinc-300 font-medium">{post.author}</span>
                      </div>
                      <div className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-[3rem] p-12 sm:p-16 text-center border border-white/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-violet-500/5" />
             <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8">
                   <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Stay Ahead of the Curve</h2>
                <p className="text-zinc-400 mb-10 text-lg">
                  Join 20,000+ professionals receiving weekly insights on AI, careers, 
                  and the future of the workspace. No spam, just value.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your professional email" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  <button className="bg-emerald-500 text-black font-bold px-10 py-5 rounded-full hover:bg-emerald-400 transition-all hover:scale-105">
                    Subscribe Now
                  </button>
                </form>
                
                <p className="mt-6 text-xs text-zinc-500">
                  By subscribing, you agree to our <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Categories / Tags Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-10">Popular Topics</h3>
           <div className="flex flex-wrap justify-center gap-3">
              {["Career Growth", "AI Matching", "Remote Work", "Resume Tips", "ATS", "Interview Skills", "Technical Prep", "Salary Negotiation"].map((tag, i) => (
                <div key={i} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 text-sm hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-pointer">
                   {tag}
                </div>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
