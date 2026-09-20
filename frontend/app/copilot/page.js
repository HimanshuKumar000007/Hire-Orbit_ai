"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  MessageSquareCode, 
  ArrowUpRight,
  BookOpen,
  Target,
  Copy,
  Check,
  RotateCcw,
  Code,
  FileText
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { toast } from "sonner";

// ── Rich Markdown Renderer for Copilot Messages ────────────────────────────────
function MarkdownContent({ content }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderInline = (text) => {
    const parts = [];
    const inlineRegex = /(\*\*.*?\*\*|\`[^\`]+\`|\[.*?\]\(.*?\))/g;
    let match;
    let lastIndex = 0;
    let key = 0;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={key++} className="font-bold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={key++}
            className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-xs border border-emerald-500/20"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("[") && token.includes("](")) {
        const linkText = token.slice(1, token.indexOf("]("));
        const linkHref = token.slice(token.indexOf("](") + 2, -1);
        parts.push(
          <a
            key={key++}
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
          >
            {linkText}
          </a>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const lines = (content || "").split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3) || "code";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      const codeString = codeLines.join("\n");
      const blockId = `code-${i}`;

      elements.push(
        <div key={blockId} className="my-4 rounded-xl border border-white/10 bg-zinc-950/80 overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/5 border-b border-white/10 text-xs font-mono text-zinc-400">
            <span className="text-emerald-400 font-medium uppercase tracking-wider">{language}</span>
            <button
              onClick={() => copyToClipboard(codeString, blockId)}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedId === blockId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
            <code>{codeString}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Heading 1 (# ...)
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-black text-white mt-5 mb-3 flex items-center gap-2">
          <span className="w-2 h-6 rounded-full bg-emerald-500 inline-block" />
          <span>{line.slice(2)}</span>
        </h1>
      );
      i++;
      continue;
    }

    // Heading 2 (## ...)
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg sm:text-xl font-bold text-emerald-400 mt-5 mb-2.5 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
          <span>{line.slice(3)}</span>
        </h2>
      );
      i++;
      continue;
    }

    // Heading 3 (### ...)
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base sm:text-lg font-bold text-white mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote (> ...)
    if (line.trim().startsWith(">")) {
      const quoteText = line.replace(/^>\s*/, "");
      elements.push(
        <div key={`quote-${i}`} className="my-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm italic">
          {renderInline(quoteText)}
        </div>
      );
      i++;
      continue;
    }

    // Checklists (- [ ] or - [x])
    if (line.trim().startsWith("- [ ]") || line.trim().startsWith("- [x]")) {
      const isChecked = line.trim().startsWith("- [x]");
      const itemText = line.trim().replace(/- \[[ x]\]\s*/, "");
      elements.push(
        <div key={`check-${i}`} className="flex items-start gap-2.5 my-1.5 text-zinc-300 text-sm">
          <div className="w-4 h-4 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
            {isChecked && <Check className="w-3 h-3 text-emerald-400" />}
          </div>
          <span>{renderInline(itemText)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Bullet lists (* ... or - ...)
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      elements.push(
        <li key={`li-${i}`} className="ml-5 list-disc text-zinc-300 text-sm leading-relaxed my-1 marker:text-emerald-400">
          {renderInline(line.trim().slice(2))}
        </li>
      );
      i++;
      continue;
    }

    // Numbered lists (1. ...)
    if (/^\d+\.\s/.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\.\s(.*)/);
      if (match) {
        elements.push(
          <div key={`oli-${i}`} className="flex items-start gap-2.5 my-1.5 text-zinc-300 text-sm leading-relaxed">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {match[1]}
            </span>
            <div className="flex-1">{renderInline(match[2])}</div>
          </div>
        );
      }
      i++;
      continue;
    }

    // Horizontal Rule (---)
    if (line.trim() === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-4 border-white/10" />);
      i++;
      continue;
    }

    // Regular paragraph
    if (line.trim() !== "") {
      elements.push(
        <p key={`p-${i}`} className="text-zinc-300 text-sm leading-relaxed my-2">
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

const SUGGESTED_PROMPTS = [
  { text: "Transition career path", description: "How do I transition to an AI Engineer?" },
  { text: "Draft a cold email", description: "Write an outreach email to a tech recruiter." },
  { text: "Salary negotiation", description: "How should I negotiate a remote senior dev offer?" },
  { text: "Skill growth checklist", description: "What certifications boost my profile?" }
];

function CopilotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseClient();

  const mode = searchParams.get("mode");
  const skillParam = searchParams.get("skill");
  const titleParam = searchParams.get("title");
  const impactParam = searchParams.get("impact");

  const [activeSkill, setActiveSkill] = useState(skillParam || "");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your **Orbit Copilot** career coach. I've analyzed your resume, background, and target role. How can I help you level up your career, prepare for interviews, master new skills, or tailor your resume today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [copiedNotes, setCopiedNotes] = useState(false);

  const messagesEndRef = useRef(null);
  const autoTriggeredRef = useRef(false);

  // Authenticate session and load user profile
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

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message handler
  const handleSend = async (textToSend, customSkill) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (!textToSend) setInput("");

    const targetSkill = customSkill || activeSkill || skillParam;
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
        body: JSON.stringify({ 
          messages: updatedMessages,
          skill: targetSkill,
          mode: mode || (targetSkill ? "learn" : "general"),
          action: "notes"
        })
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
        { role: "assistant", content: "⚠️ Sorry, I ran into an error connecting with the AI engine. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Auto-trigger study notes generation when opened via "Start Learning"
  useEffect(() => {
    if (!authLoading && token && skillParam && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      setActiveSkill(skillParam);

      const targetRole = userProfile?.role && userProfile.role !== "Unknown" ? userProfile.role : "target career roles";
      const initialPrompt = `Please generate comprehensive master study notes, key concept cheat sheets, a structured learning roadmap, and resume improvement bullet points for mastering "${skillParam}". Tailor these notes specifically to my resume background, current experience, and target role (${targetRole}).`;

      handleSend(initialPrompt, skillParam);
    }
  }, [authLoading, token, skillParam, userProfile]);

  // Copy all assistant notes to clipboard
  const handleCopyAllNotes = () => {
    const assistantNotes = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content)
      .join("\n\n---\n\n");

    if (assistantNotes) {
      navigator.clipboard.writeText(assistantNotes);
      setCopiedNotes(true);
      toast.success("All learning notes copied to clipboard!");
      setTimeout(() => setCopiedNotes(false), 2500);
    }
  };

  // Skill-specific quick prompt pills
  const skillPrompts = activeSkill ? [
    { text: "🛠️ Portfolio Project", prompt: `Give me a step-by-step project blueprint for ${activeSkill} that will impress senior hiring managers.` },
    { text: "🎤 Interview Prep", prompt: `What are the top 5 technical and behavioral interview questions asked about ${activeSkill}? Provide model answers.` },
    { text: "📝 Resume Bullets", prompt: `Give me 4 Google XYZ formula resume bullet points demonstrating high-impact achievement with ${activeSkill}.` },
    { text: "🔄 Regenerate Notes", prompt: `Regenerate the study notes for ${activeSkill} with deeper advanced technical concepts and cheat sheets.` }
  ] : [];

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
        <header className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <MessageSquareCode className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">Orbit AI Copilot</h1>
                {activeSkill && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <BookOpen className="w-3 h-3" />
                    Study Notes: {activeSkill}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                {userProfile?.role ? `Coaching for ${userProfile.role} • Resume Intel Loaded` : "Your Personal AI Career Advisor"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 1 && (
              <button
                onClick={handleCopyAllNotes}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer"
                title="Copy entire study guide"
              >
                {copiedNotes ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Notes</span>
                  </>
                )}
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Coaching Active
            </div>
          </div>
        </header>

        {/* Active Learning Banner (When routed from Improve Your Profile) */}
        {activeSkill && (
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-emerald-950/20 border-b border-emerald-500/20 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <span>ACTIVE LEARNING MODULE: {activeSkill.toUpperCase()}</span>
                  {impactParam && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                      {impactParam}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-zinc-400">
                  Customized from your resume experience and target role gaps.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {skillPrompts.slice(0, 3).map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sp.prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer whitespace-nowrap"
                >
                  {sp.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow flex-shrink-0 mt-1">
                      <Sparkles className="w-4.5 h-4.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-[1.5rem] p-5 text-sm leading-relaxed border ${
                      m.role === "user"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-white rounded-tr-none shadow-sm"
                        : "glass-strong border-white/10 text-zinc-300 rounded-tl-none shadow-xl"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <MarkdownContent content={m.content} />
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 text-white font-semibold text-xs flex-shrink-0 mt-1">
                      {userProfile?.name?.slice(0, 2).toUpperCase() || "ME"}
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
                <div className="glass-strong border-white/10 text-zinc-400 rounded-[1.5rem] rounded-tl-none p-5 text-sm flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  <span className="text-xs text-zinc-400">
                    {activeSkill
                      ? `Synthesizing master learning notes for ${activeSkill} from your resume...`
                      : "Copilot analyzing your query..."}
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Prompts (when only initial message is visible and no active skill) */}
        {messages.length === 1 && !activeSkill && (
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
        <div className="p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 z-10">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  activeSkill
                    ? `Ask follow-up questions about ${activeSkill}, project steps, or interview tips...`
                    : "Ask anything about your resume, career transitions, or interview prep..."
                }
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

export default function CopilotPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <p className="text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Loading Orbit Copilot...</p>
          </div>
        </div>
      }
    >
      <CopilotContent />
    </Suspense>
  );
}
