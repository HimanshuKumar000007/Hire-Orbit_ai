"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, MessageSquareCode, ArrowUpRight } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

const SUGGESTED_PROMPTS = [
  { text: "Transition career path", description: "How do I transition to an AI Engineer?" },
  { text: "Draft a cold email", description: "Write an outreach email to a tech recruiter." },
  { text: "Salary negotiation", description: "How should I negotiate a remote senior dev offer?" },
  { text: "Skill growth checklist", description: "What certifications boost my profile?" }
];

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your **Orbit Copilot** career coach. I've analyzed your resume and skills. How can I help you level up your career, prepare for interviews, or tailor your resume today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const messagesEndRef = useRef(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (!textToSend) setInput("");

    const updatedMessages = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch(`/api/ai-copilot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I ran into an error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Initializing Copilot Intel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidebar activeItem="copilot" user={userProfile} />

      <main className="lg:ml-72 flex-1 flex flex-col h-screen relative overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <MessageSquareCode className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Orbit AI Copilot</h1>
              <p className="text-xs text-zinc-500">Your Personal Career Advisor</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Coaching Active
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow flex-shrink-0">
                      <Sparkles className="w-4.5 h-4.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-[1.5rem] p-5 text-sm leading-relaxed border ${
                      m.role === "user"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-white rounded-tr-none"
                        : "glass-strong border-white/5 text-zinc-300 rounded-tl-none"
                    }`}
                  >
                    {m.content.split("\n").map((line, lIdx) => {
                      // Basic bold rendering helper
                      let text = line;
                      const parts = [];
                      let lastIndex = 0;
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      let match;
                      while ((match = boldRegex.exec(line)) !== null) {
                        if (match.index > lastIndex) {
                          parts.push(line.slice(lastIndex, match.index));
                        }
                        parts.push(<strong key={match.index} className="text-white font-bold">{match[1]}</strong>);
                        lastIndex = boldRegex.lastIndex;
                      }
                      if (lastIndex < line.length) {
                        parts.push(line.slice(lastIndex));
                      }
                      return (
                        <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                          {parts.length > 0 ? parts : text}
                        </p>
                      );
                    })}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 text-white font-semibold text-xs flex-shrink-0">
                      {userProfile?.name?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                </div>
                <div className="glass-strong border-white/5 text-zinc-500 rounded-[1.5rem] rounded-tl-none p-5 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="max-w-4xl w-full mx-auto px-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 z-10">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.description)}
                className="flex items-center justify-between p-4 rounded-2xl glass hover:bg-white/5 border border-white/5 hover:border-emerald-500/30 text-left transition-all duration-300 group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors uppercase tracking-wider">{prompt.text}</p>
                  <p className="text-xs text-zinc-500 mt-1">{prompt.description}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-6 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 z-10">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about your resume, career transitions, or interviews..."
                className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white rounded-2xl py-4 pl-6 pr-14 text-sm transition-all focus:outline-none placeholder-zinc-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                  input.trim() && !loading
                    ? "bg-emerald-500 text-white hover:bg-emerald-400 cursor-pointer shadow-glow"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Premium Background Gradient */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px]" />
        </div>
      </main>
    </div>
  );
}
