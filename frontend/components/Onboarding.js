"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudUpload, FileCheck, Loader2, CheckCircle2, ChevronRight, 
  Sparkles, Shield, User, Award, Layers, Plus, X 
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function Onboarding() {
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  
  // Scanned / Parsed states
  const [extractedName, setExtractedName] = useState("");
  const [extractedRole, setExtractedRole] = useState("");
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [extractedExp, setExtractedExp] = useState("");
  
  // Console logs during scanning
  const [scanLogs, setScanLogs] = useState([]);
  
  const [uploading, setUploading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [userId, setUserId] = useState(null);
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
        } else {
          setUserId(session.user.id);
          setToken(session.access_token);

          // Check if user already has a resume
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          const hasUploadedResume =
            profileData?.resume_url ||
            (profileData?.skills && profileData?.skills.length > 0) ||
            (profileData?.role && profileData?.role !== "Unknown");

          if (hasUploadedResume) {
            router.replace("/dashboard");
          } else {
            setAuthLoading(false);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.replace("/login");
      }
    };
    checkSession();
  }, [router, supabase]);

  const simulateLogs = (callback) => {
    const logs = [
      "Initializing orbit scan engines...",
      "Reading document structure & layout...",
      "Extracting professional roles and experience...",
      "Analyzing core skills & competencies...",
      "Syncing with secure Supabase storage...",
      "Running final AI validation..."
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, `[OK] ${log}`]);
        if (idx === logs.length - 1) {
          setTimeout(callback, 1000);
        }
      }, (idx + 1) * 800);
    });
  };

  const handleStartAnalysis = async () => {
    if (!file) {
      toast.error("Please select a resume file (.pdf)");
      return;
    }

    setStep("scan");
    setUploading(true);
    setScanLogs(["[INFO] Connecting to AI Parser..."]);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("userId", userId || "");
      formData.append("jobDescription", "Unknown");

      const response = await fetch(`/api/upload-resume`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      const resumeData = data.resumeData || data;

      // Start simulating the scanning console logs
      simulateLogs(() => {
        setExtractedName(resumeData.name || resumeData.fullName || "User");
        setExtractedRole(resumeData.role || "Professional");
        setExtractedSkills(resumeData.skills || []);
        setExtractedExp(resumeData.experience || "");
        setUploading(false);
        setStep("verify");
        toast.success("AI extraction completed! 🚀");
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err.message);
      toast.error(err.message || "Failed to analyze resume");
      setStep("upload");
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !extractedSkills.includes(newSkill.trim())) {
      setExtractedSkills([...extractedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setExtractedSkills(extractedSkills.filter((s) => s !== skillToRemove));
  };

  const handleLaunchDashboard = async () => {
    try {
      setUploading(true);
      
      // Save the final verified details to Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          name: extractedName,
          full_name: extractedName,
          role: extractedRole,
          skills: extractedSkills,
          experience: extractedExp,
          updated_at: new Date()
        })
        .eq("user_id", userId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Profile verified! Welcome to HireOrbit 🚀");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save verified profile details.");
      setUploading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 selection:bg-emerald-500/30 overflow-hidden relative font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Decorative Badge */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            AI Career Launchpad
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="step-upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-[2.5rem] p-10 lg:p-12 border border-white/10 relative overflow-hidden group shadow-2xl space-y-8"
            >
              <div className="text-center relative">
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                  Upload Your <span className="gradient-text">Future</span>
                </h1>
                <p className="text-zinc-400 text-base max-w-sm mx-auto">
                  Our AI will analyze your resume to map perfect matches and build your career trajectory.
                </p>
              </div>

              <motion.div 
                whileHover={{ scale: 1.01, borderColor: 'rgba(16, 185, 129, 0.3)' }}
                whileTap={{ scale: 0.99 }}
                className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all duration-500 text-center cursor-pointer group/upload ${
                  file 
                    ? 'border-emerald-500/50 bg-emerald-500/5 ring-8 ring-emerald-500/5' 
                    : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5 bg-zinc-950/30'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="p-5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                        <FileCheck className="w-12 h-12 text-emerald-400" />
                      </div>
                      <div className="absolute inset-0 bg-emerald-500 blur-2xl rounded-full opacity-20" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-emerald-400 text-xl font-bold px-4 line-clamp-1">
                        {file.name}
                      </p>
                      <p className="text-xs text-emerald-500/60 font-bold uppercase tracking-wider">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Scan
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 group-hover/upload:bg-emerald-500/10 group-hover/upload:border-emerald-500/20 transition-all duration-300">
                      <CloudUpload className="w-12 h-12 text-zinc-500 group-hover/upload:text-emerald-400 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-300 text-lg font-bold">
                        Drop your resume or <span className="text-emerald-400 font-black">browse</span>
                      </p>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">PDF format only • Max 5MB</p>
                    </div>
                  </div>
                )}
              </motion.div>

              <button
                onClick={handleStartAnalysis}
                disabled={!file}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-500 ${
                  !file
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-glow hover:shadow-glow-lg'
                }`}
              >
                START AI ANALYSIS
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black pt-2">
                <span className="flex items-center gap-2 underline underline-offset-4 decoration-emerald-500/30"><Shield className="w-3.5 h-3.5 text-emerald-500" /> AES-256</span>
                <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                <span className="flex items-center gap-2 underline underline-offset-4 decoration-emerald-500/30"><Layers className="w-3.5 h-3.5 text-emerald-500" /> SUPABASE</span>
              </div>
            </motion.div>
          )}

          {step === "scan" && (
            <motion.div
              key="step-scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-[2.5rem] p-10 lg:p-12 border border-white/10 relative overflow-hidden group shadow-2xl space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                  Scanning Trajectory <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                </h2>
                <p className="text-zinc-500 text-sm mt-2">AI is mapping your skills and analyzing your work experience...</p>
              </div>

              {/* Scanning visual box */}
              <div className="relative h-48 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-center items-center">
                <FileCheck className="w-16 h-16 text-zinc-600 animate-pulse" />
                
                {/* Glowing Laser Scan Line */}
                <motion.div
                  animate={{ y: [-96, 96, -96] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_3px_#10b981]"
                />
              </div>

              {/* Output Console Logs */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 h-44 overflow-y-auto font-mono text-xs text-zinc-400 space-y-2">
                {scanLogs.map((log, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={log.includes("[OK]") ? "text-emerald-400 font-bold" : "text-zinc-500"}
                  >
                    {log}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              key="step-verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-[2.5rem] p-8 lg:p-10 border border-white/10 relative overflow-hidden shadow-2xl space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                  Verify Profile Data <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                </h2>
                <p className="text-zinc-500 text-sm mt-1">Review the AI-extracted information before starting.</p>
              </div>

              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
                {/* Full name input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={extractedName}
                    onChange={(e) => setExtractedName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-xl py-3 px-4 text-sm transition-all focus:outline-none"
                  />
                </div>

                {/* Target Role input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Career Role
                  </label>
                  <input
                    type="text"
                    value={extractedRole}
                    onChange={(e) => setExtractedRole(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-xl py-3 px-4 text-sm transition-all focus:outline-none"
                  />
                </div>

                {/* Skills tags list */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Verified Skills
                  </label>
                  
                  {/* Add skill input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                      placeholder="Add another skill tag..."
                      className="flex-1 bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-xl py-3 px-4 text-xs transition-all focus:outline-none placeholder-zinc-600"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Skills tags view */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {extractedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors hover:border-red-500/20 hover:bg-red-500/5 group"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-zinc-500 group-hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirm action buttons */}
              <div className="flex gap-4 justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setStep("upload")}
                  className="px-6 py-4 rounded-xl text-xs font-black text-zinc-500 hover:text-white transition-colors uppercase border border-white/5 hover:bg-white/5 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleLaunchDashboard}
                  disabled={uploading || !extractedName.trim() || !extractedRole.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow px-8 py-4 rounded-xl text-xs font-black flex items-center gap-2 uppercase tracking-widest cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Dashboard</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
