import express from "express";
import axios from "axios";
import { jobs as localJobs } from "../data/jobs.js";
import { matchJobs } from "../utils/matchJobs.js";

const router = express.Router();

// ─── SerpAPI Google Jobs Integration ────────────────────────────────────────

/**
 * Fetch live Google Jobs via SerpAPI for a given role + location
 */
async function fetchGoogleJobs(role, location = "India") {
  try {
    const query = `${role} jobs in ${location}`;
    console.log(`🌐 SerpAPI Google Jobs → query: "${query}"`);

    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_jobs",
        q: query,
        location: location,
        hl: "en",
        gl: "in",           // India results
        chips: "date_posted:month", // jobs from last month
        api_key: process.env.SERPAPI_KEY,
      },
      timeout: 10000,
    });

    const rawJobs = response.data.jobs_results || [];
    console.log(`✅ SerpAPI returned ${rawJobs.length} Google Jobs`);

    // Normalise to the shape the rest of the app expects
    return rawJobs.map((job, idx) => {
      // Extract salary from extensions array if present
      const extensions = job.detected_extensions || {};
      const salary = extensions.salary
        ? extensions.salary
        : job.extensions?.find(e => e.includes("₹") || e.includes("$") || e.toLowerCase().includes("lpa") || e.toLowerCase().includes("month")) || "Competitive";

      // ── Best "Apply Now" link from apply_options ────────────────────────────
      // apply_options contains the actual job posting URLs (LinkedIn, BeBee, Shine etc.)
      // Priority: direct company site > known job boards > LinkedIn > Google fallback
      const applyOptions = job.apply_options || [];
      
      const PREFERRED_BOARDS = ["glassdoor", "naukri", "shine", "indeed", "monster", "weekday", "freshersworld"];
      const directLink = applyOptions.find(o =>
        o.link && PREFERRED_BOARDS.some(b => o.link.toLowerCase().includes(b))
      );
      const anyLink = applyOptions.find(o => o.link);
      
      const applyLink =
        directLink?.link ||
        anyLink?.link ||
        `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + (job.company_name || "") + " apply job")}`;

      // Also expose all options so frontend can show a "more options" dropdown
      const applyOptionsList = applyOptions.map(o => ({ label: o.title || "Apply", url: o.link })).filter(o => o.url);


      // Extract skills from job description + highlights
      const descriptionText = [
        job.description || "",
        ...(job.job_highlights?.Qualifications || []),
        ...(job.job_highlights?.Responsibilities || []),
      ].join(" ");

      return {
        id: job.job_id || `gj-${idx}`,
        title: job.title || "Job Opening",
        company: job.company_name || "Company",
        location: job.location || location,
        salary,
        description: job.description || "",
        descriptionText,
        redirect_url: applyLink,
        job_apply_link: applyLink,
        applyOptions: applyOptionsList,  // all available apply sources
        postedAt: extensions.posted_at || "Recent",
        source: "Google Jobs",
        thumbnail: job.thumbnail || null,
      };
    });
  } catch (err) {
    if (err.response?.status === 401) {
      console.error("❌ SerpAPI key invalid or expired");
    } else if (err.response?.status === 429) {
      console.warn("⚠️ SerpAPI quota exceeded — falling back to local jobs");
    } else {
      console.error("❌ SerpAPI error:", err.message);
    }
    return null; // signals caller to use fallback
  }
}

/**
 * Detect the role label from the user's skills list (for Google Jobs query)
 */
function inferRoleFromSkills(skills = []) {
  const lower = skills.map(s => s.toLowerCase());
  const checks = [
    { keywords: ["teaching", "classroom", "lesson planning", "student counseling", "curriculum"], role: "Teacher" },
    { keywords: ["react", "javascript", "vue", "angular", "frontend"], role: "Frontend Developer" },
    { keywords: ["node.js", "express", "django", "flask", "backend"], role: "Backend Developer" },
    { keywords: ["python", "machine learning", "data science", "tensorflow", "nlp"], role: "Data Scientist" },
    { keywords: ["docker", "kubernetes", "aws", "devops", "ci/cd"], role: "DevOps Engineer" },
    { keywords: ["autocad", "solidworks", "mechanical", "manufacturing"], role: "Mechanical Engineer" },
    { keywords: ["matlab", "circuit", "electrical", "power systems", "plc"], role: "Electrical Engineer" },
    { keywords: ["seo", "social media", "content marketing", "digital marketing"], role: "Digital Marketer" },
    { keywords: ["sql", "excel", "financial modeling", "accounting", "finance"], role: "Financial Analyst" },
  ];

  for (const { keywords, role } of checks) {
    if (keywords.some(kw => lower.some(s => s.includes(kw)))) {
      return role;
    }
  }
  return "Professional"; // generic fallback
}

// ─── GET /api/jobs ───────────────────────────────────────────────────────────

const googleJobsCache = new Map();
const JOBS_CACHE_TTL = 60 * 60 * 1000; // 1 Hour

router.get("/jobs", async (req, res) => {
  try {
    const skillsParam = req.query.skills || "";
    const roleParam   = req.query.role   || "";

    if (!skillsParam && !roleParam) {
      return res.status(400).json({ error: "No skills or role provided" });
    }

    const userSkills = skillsParam ? skillsParam.split(",").map(s => s.trim()).filter(Boolean) : [];
    const role = roleParam || inferRoleFromSkills(userSkills);

    console.log(`🎯 /api/jobs called — role: "${role}" | skills: [${userSkills.slice(0, 4).join(", ")}...]`);

    // ── 1. Try SerpAPI Google Jobs first (with Smart Caching) ──────────────
    const cacheKey = role.toLowerCase().trim();
    let googleJobs = null;

    if (googleJobsCache.has(cacheKey)) {
      const cached = googleJobsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < JOBS_CACHE_TTL) {
        console.log(`📦 Premium Cache HIT (Saved 1 SerpAPI Credit) — role: "${role}"`);
        googleJobs = cached.jobs;
      }
    }

    if (!googleJobs) {
      googleJobs = await fetchGoogleJobs(role);
      if (googleJobs && googleJobs.length > 0) {
        googleJobsCache.set(cacheKey, { jobs: googleJobs, timestamp: Date.now() });
      }
    }

    if (googleJobs && googleJobs.length > 0) {
      // Match each Google Job against the user's skills
      const matched = matchJobs(userSkills, googleJobs.map(job => ({
        ...job,
        // Pass the combined description text for skill extraction
        description: job.descriptionText || job.description,
      })));

      console.log(`✅ Returning ${matched.length} Google Jobs (matched + ranked)`);
      return res.json({ data: matched, source: "google_jobs" });
    }

    // ── 2. Fallback: local jobs database ──────────────────────────────────
    console.warn("⚠️ Falling back to local jobs database");
    const localMatched = matchJobs(userSkills, localJobs);
    return res.json({ data: localMatched, source: "local" });

  } catch (err) {
    console.error("JOB API ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export default router;
