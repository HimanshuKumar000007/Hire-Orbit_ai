import { createClient } from "@supabase/supabase-js";

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "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";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buqkdtnffjoiwwtfxiek.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";

// 🧠 Direct NVIDIA NIM Copilot Generator (Serverless Resilient Fallback)
async function generateDirectCopilot(parsedBody, authHeader) {
  const { messages = [], skill, mode } = parsedBody;

  let profile = null;
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : null;

  if (token) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      });
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        profile = data;
      }
    } catch (e) {
      console.warn("Direct Supabase profile lookup fallback error:", e.message);
    }
  }

  let analysisData = profile?.analysis_data || {};
  if (typeof analysisData === "string") {
    try { analysisData = JSON.parse(analysisData); } catch (e) {}
  }

  const resumeData = analysisData?.resumeData || {};
  const candidateName = profile?.full_name || profile?.name || resumeData.name || "Candidate";
  const candidateRole = profile?.role || resumeData.role || "Professional";
  const candidateSkills = (profile?.skills?.length ? profile.skills : resumeData.skills) || [];
  const candidateExp = profile?.experience || resumeData.experience || "Experience details from verified resume";
  const candidateEducation = resumeData.education || profile?.education || "";
  const candidateProjects = resumeData.projects || [];
  const candidateStrengths = resumeData.strengths || [];
  const matchedSkills = analysisData?.matchedSkills || [];
  const missingSkills = analysisData?.missingSkills || [];

  const profileContext = `=== CANDIDATE COMPLETE RESUME & CAREER INTELLIGENCE ===
- Candidate Name: ${candidateName}
- Target Career Role: ${candidateRole}
- Verified Skills in Resume: ${candidateSkills.join(", ") || "General Professional Skills"}
- Detailed Experience & Background:
${typeof candidateExp === "string" ? candidateExp : JSON.stringify(candidateExp, null, 2)}
- Education & Certifications: ${candidateEducation || "Higher Education"}
- Projects Completed: ${Array.isArray(candidateProjects) ? candidateProjects.map(p => typeof p === "string" ? p : `${p.title || p.name || 'Project'}: ${p.description || ''}`).join("; ") : candidateProjects || "None listed"}
- Identified Strengths: ${candidateStrengths.join(", ") || "Adaptability, Core Problem Solving"}
- Identified Skill Gaps for Target Role: ${missingSkills.join(", ") || "None"}
- Matched Skills in Current Market: ${matchedSkills.join(", ") || "Evaluated"}
${skill ? `- Current Focused Skill To Master: ${skill}` : ""}`;

  const systemPrompt = `You are "Orbit Copilot", HireOrbitAI's elite AI Career Advisor, Technical Mentor, and Executive Learning Coach.
You have direct, unrestricted access to the candidate's complete resume, background history, target role, and career gap analysis.

${profileContext}

CRITICAL INSTRUCTIONS FOR LEARNING STUDY NOTES & GUIDES:
When the user asks to "Start Learning", learn a skill, or create study notes (e.g. for "${skill || 'a target skill'}"):
1. Ground every single note in ${candidateName}'s actual background. Directly bridge their existing experience (${candidateRole} with skills like ${candidateSkills.slice(0, 4).join(", ")}) to master this new skill.
2. Produce an EXHAUSTIVE, high-yield, structured MASTER STUDY GUIDE & NOTES using clear Markdown:
   # 📘 Master Study Notes & Roadmap: ${skill || 'Target Skill'}
   > Tailored for **${candidateName}** | Target Role: **${candidateRole}** | Gap-Closer for Higher Match Score

   ### 1. 🎯 Why This Skill Matters for Your Target Role (${candidateRole})
   Explain why hiring managers prioritize this, how it impacts ATS match scores, and how it complements the candidate's current experience.

   ### 2. 🧠 Core Fundamentals & Concepts Cheat Sheet
   Provide high-yield, technical deep-dive notes:
   - Key terminology, core rules, and architecture
   - Practical syntax, design patterns, or standard operating procedures (use code blocks or clear bullet lists)
   - Common pitfalls and anti-patterns to avoid

   ### 3. 🗓️ Accelerated Learning Roadmap (Actionable Phases)
   Break down realistic milestones to reach job-readiness:
   - **Phase 1 (Days 1–4): Foundation & Essential Setup**
   - **Phase 2 (Days 5–10): Real-World Application & Core Patterns**
   - **Phase 3 (Days 11–14): Production-Grade Best Practices & Optimization**

   ### 4. 🛠️ Portfolio Project Spec (Resume Gap-Closer)
   Describe a concrete, high-impact project that combines their existing background with this new skill. Include core features, architecture, and what makes it impressive to recruiters.

   ### 5. 📝 Ready-to-Use Google XYZ Resume Bullets
   Give 2–3 copy-paste ready bullet points following the Google formula ("Accomplished [X] as measured by [Y] by doing [Z]") that they can add to their resume upon completing this module.

   ### 6. 🎤 Top Interview Questions & STAR Model Answers
   Provide 2–3 realistic interview questions on this topic with senior-level answers demonstrating practical mastery.

For general career questions, resume optimizations, or salary negotiation:
- Give direct, highly personalized, actionable advice referencing their real resume data.
- Keep the formatting clean, modern, and inspiring.`;

  const userAndAssistantMessages = messages.map(m => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.content
  })).slice(-10);

  const nvidiaRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NVIDIA_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta/llama-3.2-11b-vision-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        ...userAndAssistantMessages
      ],
      temperature: 0.7,
      max_tokens: 4096
    })
  });

  const nvidiaData = await nvidiaRes.json();
  const reply = nvidiaData?.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error(nvidiaData?.error?.message || "No content returned from NVIDIA NIM AI");
  }

  return reply;
}

export async function POST(req) {
  const authHeader = req.headers.get("authorization") || "";
  let bodyText = "";
  let parsedBody = {};

  try {
    bodyText = await req.text();
    parsedBody = JSON.parse(bodyText || "{}");
  } catch (e) {
    parsedBody = {};
  }

  const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5001";

  // 1. If backend URL is defined and not standard localhost in production, attempt backend
  const isLocalHost = BACKEND.includes("127.0.0.1") || BACKEND.includes("localhost");
  
  if (!isLocalHost) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const backendRes = await fetch(`${BACKEND}/api/ai/copilot-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: bodyText || "{}",
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        return Response.json(data, { status: 200 });
      }
    } catch (backendErr) {
      console.warn("⚠️ Backend copilot proxy error, falling back to direct NVIDIA NIM:", backendErr.message);
    }
  }

  // 2. Direct Serverless Fallback via NVIDIA NIM AI (Guarantees 100% uptime on Vercel & Local)
  try {
    const aiMessage = await generateDirectCopilot(parsedBody, authHeader);
    return Response.json({ message: aiMessage }, { status: 200 });
  } catch (fallbackErr) {
    console.error("❌ Direct NVIDIA NIM copilot error:", fallbackErr.message);
    return Response.json({ error: fallbackErr.message || "AI Engine Unavailable" }, { status: 500 });
  }
}

