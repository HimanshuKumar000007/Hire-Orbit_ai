"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  TrendingUp, 
  Search, 
  Sparkles,
  BarChart3,
  Rocket,
  FileText,
  Bell
} from 'lucide-react';

const detailedFeatures = [
  {
    title: "AI Semantic Matching",
    description: "Our proprietary deep learning models analyze your skills, experience, and career aspirations to find jobs that aren't just keyword matches, but true career advancements.",
    icon: Brain,
    stats: "92% Match Accuracy",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
    slug: "semantic-matching"
  },
  {
    title: "Real-time Skill Gap Analysis",
    description: "Instantly see how your profile stacks up against job requirements. We don't just tell you what's missing—we provide a roadmap to bridge the gap.",
    icon: BarChart3,
    stats: "15+ Skills Tracked",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    slug: "skill-gap"
  },
  {
    title: "Intelligent Resume Scoring",
    description: "Get detailed feedback on how to optimize your resume for both ATS systems and human recruiters. Our AI analyzes structure, impact, and relevance.",
    icon: FileText,
    stats: "Instant Feedback",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    slug: "resume-scoring"
  },
  {
    title: "Hyper-Personalized Alerts",
    description: "Stop scrolling through irrelevant listings. Get notified only when a high-probability match appears, tailored to your exact preferences.",
    icon: Bell,
    stats: "24/7 Monitoring",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
    slug: "personalized-alerts"
  }
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Next-Gen Career Intelligence
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight"
            >
              The Future of <br />
              <span className="gradient-text">Job Searching is Here</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed"
            >
              Stop applying blind. HireOrbitAI uses cutting-edge artificial intelligence 
              to decode job markets and position you for success.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {detailedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute -inset-px bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />
                <div className="relative glass-strong rounded-3xl p-8 lg:p-10 border border-white/5 hover:border-emerald-500/30 transition-all overflow-hidden h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${feature.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    {feature.description}
                  </p>

                  <Link 
                    href={`/features/${feature.slug}`}
                    className="mt-8 flex items-center gap-2 text-emerald-400 font-medium text-sm group/link cursor-pointer w-fit"
                  >
                    <span>Explore Technology</span>
                    <TrendingUp className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Tech Stack Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-white mb-6">
                Built with <br />
                <span className="gradient-text">Uncompromising Tech</span>
              </h2>
              <p className="text-zinc-400">
                We combine industry-leading algorithms with deep understanding of the professional landscape to give you the ultimate edge.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: "Enterprise Security", desc: "Your data is encrypted and protected with industry-standard security protocols." },
                { icon: Zap, title: "Instant Sync", desc: "Changes to your profile or preferences are reflected across the platform in milliseconds." },
                { icon: Search, title: "Deep Indexing", desc: "We index millions of jobs daily to ensure you never miss a fresh opportunity." },
                { icon: Target, title: "Precision Tuning", desc: "Our models are continuously refined based on successful hire data points." }
              ].map((tech, i) => (
                <div key={i} className="glass rounded-2xl p-6 border border-white/5 hover:border-emerald-500/20 transition-colors">
                  <tech.icon className="w-6 h-6 text-emerald-400 mb-4" />
                  <h4 className="text-white font-semibold mb-2">{tech.title}</h4>
                  <p className="text-sm text-zinc-500">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  );
}
