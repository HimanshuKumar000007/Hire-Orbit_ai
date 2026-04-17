"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, MapPin, Globe, Sparkles, Zap, Target } from "lucide-react";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔥 STEP 4.2 — Read job data from localStorage
    try {
      const data = localStorage.getItem("selectedJob");
      if (data) {
        setJob(JSON.parse(data));
      } else {
        setError("No job data found in local storage. Please return to the dashboard.");
      }
    } catch (err) {
      console.error("Error reading from local storage:", err);
      setError("Could not retrieve job data.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">Scanning Job Intel...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Target className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">Analysis Terminated</h1>
          <p className="text-zinc-500">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Support both JSearch and internal/Adzuna data structures
  const title = job.job_title || job.title || "Job Opportunity";
  const companyName = job.employer_name || job.company?.display_name || job.company || "Unknown Company";
  const locationName = job.job_city ? `${job.job_city}, ${job.job_country}` : (job.location?.display_name || job.location || "Remote");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -ml-64 -mb-64" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative">
        {/* Navigation */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="group flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Return to Base</span>
        </button>

        <div className="space-y-8">
          {/* Header Card */}
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Live Data Synced
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-500/50" />
                    <span>{companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500/50" />
                    <span>{locationName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl px-8 py-6 text-center backdrop-blur-xl">
                <p className="text-4xl font-black text-emerald-400 leading-none mb-2">{job.score || 85}%</p>
                <p className="text-[10px] text-emerald-500/60 uppercase font-black tracking-[0.2em]">Match Sync</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {/* Intel Section */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Strategic Intel</h3>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
                  <p className="text-zinc-300 leading-relaxed text-lg relative z-10">
                    {job.job_description || job.description || "Synthesizing full job intelligence... This role requires high-level technical expertise and strategic problem solving aligned with your analyzed skill set."}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Zap className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Match Highlights</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.matchedSkills?.map(skill => (
                    <span key={skill} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2 rounded-xl font-bold">
                      {skill}
                    </span>
                  ))}
                  {job.missingSkills?.map(skill => (
                    <span key={skill} className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2 rounded-xl font-bold">
                      Missing: {skill}
                    </span>
                  ))}
                  {(!job.matchedSkills || job.matchedSkills.length === 0) && (!job.missingSkills || job.missingSkills.length === 0) && (
                    <span className="text-zinc-500 italic text-sm">Awaiting full skill mapping...</span>
                  )}
                </div>
              </section>
            </div>

            {/* Action Section */}
            <div className="space-y-6">
              {/* 🔥 BONUS: APPLY NOW BUTTON */}
              <div className="bg-emerald-500 rounded-3xl p-8 text-center space-y-6 shadow-glow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h3 className="text-2xl font-black text-white leading-tight">Ready to initiate application?</h3>
                <p className="text-emerald-100/80 font-medium">Your profile is highly optimized for this trajectory.</p>
                <button 
                  onClick={() => {
                    console.log("🚀 User initiating application for:", title);
                    
                    if (job.job_apply_link) {
                      window.open(job.job_apply_link, '_blank');
                    } else if (job.job_google_link) {
                      window.open(job.job_google_link, '_blank');
                    } else if (job.apply_url || job.redirect_url) {
                      window.open(job.apply_url || job.redirect_url, '_blank');
                    } else {
                      const searchQuery = `${title} ${companyName} careers`;
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                    }
                  }}
                  className="w-full bg-white text-emerald-600 font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  Apply Now
                </button>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-4">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 rotate-180 text-emerald-500" />
                  Next Phase Guidance
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Apply today to capitalize on your current match momentum. Our AI suggests highlighting your <span className="text-emerald-400">{job.matchedSkills?.[0] || 'core technical competencies'}</span> in the initial screening.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
