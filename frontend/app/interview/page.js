"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, UserCheck, Loader2, CheckCircle2, ChevronRight, MessageSquare, Award, AlertCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { toast } from "sonner";

export default function InterviewPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Customization step
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradedResult, setGradedResult] = useState(null);
  const [allGrades, setAllGrades] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);

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

        const pRole = profile?.role || "Professional";
        setUserProfile({
          name: profile?.full_name || "User",
          email: session.user.email,
          role: pRole,
          skills: profile?.skills || [],
          experience: profile?.experience || ""
        });
        setRole(pRole);
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, [router, supabase]);

  const startInterview = async () => {
    setSessionLoading(true);
    try {
      const response = await fetch(`/api/ai-interview-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role, jobDescription })
      });

      if (!response.ok) {
        throw new Error("Failed to load interview questions");
      }

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions returned by AI");
      }

      setQuestions(data.questions);
      setCurrentIdx(0);
      setAllGrades([]);
      setUserAnswer("");
      setGradedResult(null);
      setSessionActive(true);
      setSessionComplete(false);
      toast.success("Interview session initialized! 🎙️");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to initialize interview.");
    } finally {
      setSessionLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please enter your response first.");
      return;
    }

    setGrading(true);
    try {
      const currentQuestion = questions[currentIdx].question;
      const response = await fetch(`/api/ai-grade-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: currentQuestion, answer: userAnswer })
      });

      if (!response.ok) {
        throw new Error("Grading service error");
      }

      const data = await response.json();
      setGradedResult(data);
      setAllGrades((prev) => [...prev, { question: currentQuestion, answer: userAnswer, ...data }]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to grade answer.");
    } finally {
      setGrading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setUserAnswer("");
      setGradedResult(null);
    } else {
      setSessionComplete(true);
    }
  };

  const resetSession = () => {
    setSessionActive(false);
    setQuestions([]);
    setAllGrades([]);
    setGradedResult(null);
    setUserAnswer("");
    setSessionComplete(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Initializing Interview Room...</p>
        </div>
      </div>
    );
  }

  const averageScore = allGrades.length > 0 
    ? Math.round(allGrades.reduce((sum, g) => sum + g.score, 0) / allGrades.length) 
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar activeItem="interview" user={userProfile} />

      <main className="lg:ml-72 flex-1 min-h-screen relative p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-glow">
                <UserCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">AI Mock Interview Prep</h1>
                <p className="text-zinc-400 text-sm">Simulate live technical and behavioral interviews graded by AI career experts.</p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!sessionActive && !sessionComplete ? (
              // STEP 1: Customize Session
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-strong rounded-[2.5rem] border border-white/5 p-8 lg:p-12 space-y-8"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-black text-white">Configure Your Interview Room</h3>
                  <p className="text-zinc-400 text-sm mt-2">Tailor the simulation parameters to match your goals.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">Target Role / Title</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-2xl py-4 px-6 text-sm transition-all focus:outline-none placeholder-zinc-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300">Specific Job Description (Optional)</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the target job description to generate highly specific custom interview questions..."
                      className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-2xl p-6 text-sm h-48 transition-all focus:outline-none placeholder-zinc-600 resize-none"
                    />
                  </div>

                  <button
                    onClick={startInterview}
                    disabled={sessionLoading || !role.trim()}
                    className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                      sessionLoading || !role.trim()
                        ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-glow hover:shadow-glow-lg cursor-pointer"
                    }`}
                  >
                    {sessionLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>PREPARING QUESTIONS...</span>
                      </>
                    ) : (
                      <>
                        <span>START SIMULATION 🎙️</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : sessionActive && !sessionComplete ? (
              // STEP 2: Active Simulation Q&A
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Question Info Bar */}
                <div className="flex items-center justify-between bg-zinc-900/60 border border-white/5 rounded-2xl p-4 px-6">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
                  <span className="text-xs text-zinc-500 font-bold">Targeting: {role}</span>
                </div>

                {/* Question Card */}
                <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white leading-relaxed">{questions[currentIdx]?.question}</h3>
                </div>

                {/* Answer Area */}
                {!gradedResult ? (
                  <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your structured answer here (Try using the STAR format: Situation, Task, Action, Result)..."
                      className="w-full bg-zinc-900/60 border border-white/5 hover:border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-2xl p-5 text-sm h-64 transition-all focus:outline-none placeholder-zinc-500 resize-none font-sans leading-relaxed"
                    />
                    <div className="flex justify-between items-center gap-4">
                      <button
                        onClick={resetSession}
                        className="px-6 py-4 rounded-xl text-xs font-black text-zinc-500 hover:text-white transition-colors uppercase border border-white/5 hover:bg-white/5 cursor-pointer"
                      >
                        Quit Session
                      </button>
                      <button
                        onClick={submitAnswer}
                        disabled={grading || !userAnswer.trim()}
                        className={`px-8 py-4 rounded-xl text-xs font-black flex items-center gap-2 transition-all uppercase tracking-wider ${
                          grading || !userAnswer.trim()
                            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                            : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow cursor-pointer"
                        }`}
                      >
                        {grading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI Evaluating...</span>
                          </>
                        ) : (
                          <span>Submit Answer</span>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Grading result card
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* Score Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass-strong rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center space-y-2">
                        <Award className="w-8 h-8 text-emerald-400" />
                        <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">AI Evaluation Score</h4>
                        <span className="text-4xl font-black text-white">{gradedResult.score}/100</span>
                      </div>
                      <div className="md:col-span-2 glass-strong rounded-3xl p-6 border border-white/5 space-y-2">
                        <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-emerald-400" /> Constructive Feedback</h4>
                        <p className="text-zinc-300 text-sm leading-relaxed">{gradedResult.feedback}</p>
                      </div>
                    </div>

                    {/* Model Answer comparison */}
                    <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
                      <h4 className="text-white font-bold text-sm">Suggested Model Response</h4>
                      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {gradedResult.improvedAnswer}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end">
                      <button
                        onClick={nextQuestion}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow px-8 py-4 rounded-xl text-xs font-black flex items-center gap-2 uppercase tracking-widest cursor-pointer"
                      >
                        <span>{currentIdx + 1 === questions.length ? "Finish Session" : "Next Question"}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // STEP 3: Session Complete / Final Scorecard
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-strong rounded-[2.5rem] border border-white/5 p-8 lg:p-12 text-center space-y-8"
              >
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-glow">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">Interview Complete!</h3>
                  <p className="text-zinc-500 text-sm">Fantastic job. Here is your final performance scorecard.</p>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
                  <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Average Session Score</p>
                    <p className="text-4xl font-black text-emerald-400 mt-2">{averageScore}/100</p>
                  </div>
                  <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Evaluated Questions</p>
                    <p className="text-4xl font-black text-white mt-2">{allGrades.length}</p>
                  </div>
                </div>

                {/* Question Log */}
                <div className="space-y-4 text-left max-w-2xl mx-auto pt-6 border-t border-white/5">
                  <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Performance Log</h4>
                  {allGrades.map((grade, idx) => (
                    <div key={idx} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-2">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-xs font-bold text-white">Question {idx + 1}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          grade.score >= 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
                        }`}>
                          Score: {grade.score}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 font-medium">{grade.question}</p>
                      <p className="text-xs text-zinc-500 line-clamp-2 italic">“{grade.answer}”</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-4 rounded-xl text-xs font-black text-zinc-400 hover:text-white transition-colors uppercase border border-white/5 hover:bg-white/5 cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={resetSession}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer"
                  >
                    Start New Simulation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px]" />
        </div>
      </main>
    </div>
  );
}
