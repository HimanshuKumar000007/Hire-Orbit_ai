"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SlidersHorizontal, Loader2, Check, Copy, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { toast } from "sonner";

export default function TailorPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("bullets");
  const [copiedText, setCopiedText] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/login");
          return;
        }

        setToken(session.access_token);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setUserProfile({
          name: profile?.full_name || "User",
          email: session.user.email,
          role: profile?.role || "Professional",
          skills: profile?.skills || [],
          experience: profile?.experience || ""
        });
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/ai-tailor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ jobDescription })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to tailor resume");
      }

      const data = await response.json();
      setResult(data);
      toast.success("Resume tailored successfully! 🚀");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to customize resume.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedText(""), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Initializing Tailor Suite...</p>
        </div>
      </div>
    );
  }

  const keywordMatchPercentage = result
    ? Math.round(
        (result.atsKeywords.filter((k) => k.status === "matched").length /
          Math.max(result.atsKeywords.length, 1)) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar activeItem="tailor" user={userProfile} />

      <main className="lg:ml-72 flex-1 min-h-screen relative p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-glow">
                <SlidersHorizontal className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">AI Resume Tailoring Suite</h1>
                <p className="text-zinc-400 text-sm">Tailor your resume bullet points and cover letter to any job description to beat the ATS.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-strong rounded-[2rem] p-6 lg:p-8 border border-white/5 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Job Description</h3>
                  <p className="text-xs text-zinc-500">Paste the job description of the role you want to apply for.</p>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description (responsibilities, skills, qualifications) here..."
                  className="w-full bg-zinc-900/60 border border-white/5 hover:border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-2xl p-5 text-sm h-96 transition-all focus:outline-none placeholder-zinc-500 resize-none font-sans leading-relaxed"
                />
                <button
                  onClick={handleTailor}
                  disabled={loading || !jobDescription.trim()}
                  className={`w-full py-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all duration-300 ${
                    loading || !jobDescription.trim()
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-glow hover:shadow-glow-lg cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Optimizing Resume with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>TAILOR RESUME & COVER LETTER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Keyword Match Card */}
                    <div className="glass-strong rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center gap-6 justify-between">
                      <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">ATS Keyword Match</h4>
                        <div className="flex items-baseline gap-2 justify-center md:justify-start">
                          <span className="text-4xl font-black text-white">{keywordMatchPercentage}%</span>
                          <span className="text-xs text-zinc-500">of required skills matched</span>
                        </div>
                      </div>
                      <div className="w-full md:w-64 bg-zinc-900 h-3.5 rounded-full overflow-hidden border border-white/5 relative">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-1000"
                          style={{ width: `${keywordMatchPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Keywords Breakdown */}
                    <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
                      <h4 className="text-white font-bold text-sm">Keyword Analysis</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.atsKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                              kw.status === "matched"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                            }`}
                          >
                            {kw.status === "matched" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5" />
                            )}
                            {kw.keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Output Tabs Card */}
                    <div className="glass-strong rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
                      {/* Tabs Bar */}
                      <div className="flex border-b border-white/5 bg-zinc-950/60 p-2">
                        <button
                          onClick={() => setActiveTab("bullets")}
                          className={`flex-1 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            activeTab === "bullets" ? "bg-white/5 text-white" : "text-zinc-500 hover:text-white"
                          }`}
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          Tailored Bullet Points
                        </button>
                        <button
                          onClick={() => setActiveTab("cover-letter")}
                          className={`flex-1 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            activeTab === "cover-letter" ? "bg-white/5 text-white" : "text-zinc-500 hover:text-white"
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          Custom Cover Letter
                        </button>
                      </div>

                      {/* Tab Content */}
                      <div className="p-6 lg:p-8">
                        {activeTab === "bullets" ? (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Incorporate these into your Resume experience</p>
                              <button
                                onClick={() =>
                                  copyToClipboard(result.tailoredBullets.join("\n"), "bullets")
                                }
                                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                              >
                                {copiedText === "bullets" ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy All</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="space-y-4">
                              {result.tailoredBullets.map((bullet, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-emerald-500/20 transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                                    {idx + 1}
                                  </div>
                                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">{bullet}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Custom Cover Letter Draft</p>
                              <button
                                onClick={() => copyToClipboard(result.coverLetter, "coverLetter")}
                                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                              >
                                {copiedText === "coverLetter" ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy Letter</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed font-sans">
                              {result.coverLetter}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[450px] flex flex-col items-center justify-center p-8 glass-strong rounded-[2.5rem] border border-white/5 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-zinc-500">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h4 className="text-white font-bold text-lg">Awaiting Job Details</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">
                        Paste the target job description on the left and click Tailor to instantly align your resume and build a professional cover letter.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Floating background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px]" />
        </div>
      </main>
    </div>
  );
}
