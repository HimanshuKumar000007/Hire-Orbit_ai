"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Mail, FileText, CheckCircle2, ChevronLeft, Briefcase, Award, Globe, ArrowRight } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PublicPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId;
  const supabase = getSupabaseClient();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPublicProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error || !data) {
          console.warn("Public portfolio profile not found:", error?.message);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Fetch portfolio error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Loading Verified Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
        <div className="glass-strong rounded-3xl p-12 max-w-md w-full border border-white/10 space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 text-red-400">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Profile Not Found</h2>
            <p className="text-zinc-500 text-sm">The requested verified candidate portfolio does not exist or has been made private.</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl py-4 font-bold border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Go back to home
          </button>
        </div>
      </div>
    );
  }

  const userInitials = (profile.full_name || "User").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* Top Banner Navigation */}
      <header className="p-6 border-b border-white/5 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              HireOrbit<span className="text-emerald-400">AI</span> Verified
            </span>
          </div>

          <button
            onClick={() => router.push("/")}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Create Your Profile <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 md:py-16 space-y-12 relative z-10">
        
        {/* Dynamic Card Hero Section */}
        <div className="glass-strong rounded-[2.5rem] border border-white/5 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-2xl">
          {/* Internal Glow blobs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-violet-500/5 blur-[120px] rounded-full" />

          {/* User Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-glow">
              {userInitials}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-zinc-900 rounded-full border border-emerald-500/30 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          {/* User Meta Data */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" /> AI Profile Verified
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">{profile.full_name || "Candidate Name"}</h2>
              <p className="text-xl text-emerald-400 font-bold tracking-tight">{profile.role || "Professional Target Role"}</p>
            </div>
            <p className="text-zinc-400 text-sm max-w-xl font-sans leading-relaxed">
              Verified career profile compiled from verified skills analysis. Contact candidate directly or download their official resume portfolio below.
            </p>
          </div>
        </div>

        {/* Dynamic Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Stats / Skills) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick CTAs */}
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-3">
              <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Professional Contact</h4>
              <a
                href={`mailto:${profile.email || ""}?subject=Inquiry%20from%20HireOrbitAI`}
                className="w-full py-4 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all uppercase tracking-wider cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Candidate</span>
              </a>

              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl text-xs font-black bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 border border-white/10 transition-all uppercase tracking-wider cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Full Resume</span>
                </a>
              )}
            </div>

            {/* Verified Skills Grid */}
            <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
              <div>
                <h4 className="text-white font-bold text-sm">Verified Skill Set</h4>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">AI-extracted and matched capabilities</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(profile.skills || []).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 text-xs font-semibold text-zinc-300 transition-all duration-300 hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Experience Details) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Experience Card */}
            <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Experience Summary</h3>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {profile.experience || "No experience summary detailed."}
              </div>
            </div>
            
            {/* Trust Footer */}
            <div className="flex items-center gap-2 justify-center pt-8 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50" />
              <span>HireOrbitAI Verified Credential Token</span>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px]" />
      </div>
    </div>
  );
}
