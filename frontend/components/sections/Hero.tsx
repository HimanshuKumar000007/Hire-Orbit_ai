import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Play, Sparkles, Zap, TrendingUp, Bell, Check, 
  Target, Globe, Code, SlidersHorizontal, UserCheck, Award, FileText, ChevronRight, MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase';

// Premium Interactive Dashboard Preview Component
function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<'matches' | 'tailor' | 'interview'>('matches');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-xl mx-auto"
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-violet-500/10 to-teal-500/20 rounded-3xl blur-3xl opacity-75" />
      
      {/* Interactive Tabs Header */}
      <div className="flex border border-white/10 border-b-0 bg-zinc-950/80 rounded-t-2xl p-1 gap-1">
        {[
          { id: 'matches', label: 'Matches', icon: Target },
          { id: 'tailor', label: 'Resume Tailor', icon: SlidersHorizontal },
          { id: 'interview', label: 'Interview Simulator', icon: UserCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Container */}
      <div className="relative glass-strong rounded-b-2xl overflow-hidden border border-white/10 min-h-[380px] bg-zinc-950/90 flex flex-col">
        {/* Header URL */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 text-center pr-6">
            <span className="text-[10px] text-zinc-600 font-mono">hireorbit.ai/{activeTab}</span>
          </div>
        </div>

        {/* Tab content view */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === 'matches' && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Match Score', value: '85%', color: 'text-emerald-400' },
                    { label: 'Jobs Found', value: '24', color: 'text-white' },
                    { label: 'Alerts', value: 'Active', color: 'text-emerald-400' },
                  ].map((stat, i) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                      <p className={`text-base font-black ${stat.color}`}>{stat.value}</p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Job Cards */}
                <div className="space-y-2">
                  {[
                    { company: 'Tesla', role: 'Electrical Engineer', match: 92, color: 'from-emerald-500 to-teal-600' },
                    { company: 'Google', role: 'Data Analyst', match: 81, color: 'from-blue-500 to-indigo-600' },
                  ].map((job) => (
                    <div key={job.company} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-emerald-500/20 transition-all">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${job.color} flex items-center justify-center text-white text-xs font-black uppercase shadow-md`}>
                        {job.company[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-bold truncate">{job.role}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-400">{job.match}%</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase">match</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insight Card */}
                <div className="bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white font-bold uppercase tracking-wider">AI Insight</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                        Add <span className="text-emerald-400 font-bold">Python</span> to your profile to increase your target role match by <span className="text-emerald-400 font-bold">+15%</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tailor' && (
              <motion.div
                key="tailor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                {/* comparative visual */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Original Bullet</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-sans italic">"Worked on the React codebase and fixed rendering bugs."</p>
                  </div>
                  <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 space-y-1 relative">
                    <p className="text-[8px] text-emerald-400 uppercase tracking-widest font-black flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> AI Tailored (STAR)</p>
                    <p className="text-[10px] text-zinc-300 leading-relaxed font-sans font-medium">"Optimized React rendering pipelines, reducing initial load latency by <span className="text-emerald-400 font-bold">32%</span>."</p>
                  </div>
                </div>

                {/* Keyword Analysis checklist */}
                <div className="glass-strong rounded-xl p-3 border border-white/5 space-y-2">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">ATS Keyword Checklist</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'React', status: 'matched' },
                      { name: 'Tailwind CSS', status: 'matched' },
                      { name: 'Kubernetes', status: 'missing' },
                      { name: 'CI/CD Pipelines', status: 'matched' },
                    ].map((k) => (
                      <span
                        key={k.name}
                        className={`text-[9px] px-2 py-0.5 rounded-full border ${
                          k.status === 'matched'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                        }`}
                      >
                        {k.status === 'matched' ? '✓ ' : '⚠ '}
                        {k.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cover letter draft */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-1"><FileText className="w-3 h-3" /> Tailored Cover Letter</p>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    Dear Hiring Manager, I am writing to express my strong interest in the Electrical Engineer role at Tesla. Given my expertise in MATLAB and...
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'interview' && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                {/* Active Question */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                  <p className="text-[8px] text-emerald-400 uppercase tracking-widest font-black flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Question 2 of 5</p>
                  <p className="text-xs text-white font-bold leading-normal">
                    "How do you design a database schema to handle high-write performance?"
                  </p>
                </div>

                {/* Candidate Typed Answer */}
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-1 font-sans">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Candidate Response</p>
                  <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                    "I would use database sharding and add a Redis cache layer to write in batches..."
                  </p>
                </div>

                {/* Graded Output */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-center">
                    <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">AI Score</p>
                    <p className="text-lg font-black text-emerald-400 mt-0.5">88/100</p>
                  </div>
                  <div className="col-span-8 bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
                    <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1"><Award className="w-2.5 h-2.5" /> AI Feedback</p>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                      Excellent technical depth. To hit 95+, quantify the batch write latency improvements.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}


export function Hero() {
  const [session, setSession] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        const uploaded = profileData?.resume_url || (profileData?.skills && profileData?.skills.length > 0) || (profileData?.role && profileData?.role !== "Unknown");
        setHasResume(uploaded);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setHasResume(false);
      } else {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Career Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Land the Right Job{' '}
              <span className="gradient-text">Faster with AI</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400 max-w-xl"
            >
              Get real-time job alerts, AI-powered matching, and a personalized roadmap 
              to grow your career. Stop applying blindly—let AI find your perfect match.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-lg px-8 py-6 rounded-xl shadow-glow hover:shadow-glow-lg transition-all group"
              >
                <Link href={session ? (hasResume ? "/dashboard" : "/onboarding") : "/signup"}>
                  {session ? (hasResume ? "Go to Dashboard" : "Upload Resume") : "Get Started Free"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 text-lg px-8 py-6 rounded-xl group"
              >
                <Link href="#demo">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  View Demo
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              {[
                { icon: Check, text: 'Free forever plan' },
                { icon: Zap, text: 'Setup in 2 minutes' },
                { icon: TrendingUp, text: 'Used by 10K+ professionals' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-500">
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <DashboardPreview />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-zinc-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
