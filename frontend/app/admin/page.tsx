"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  FileText,
  TrendingUp,
  Search,
  Download,
  ShieldCheck,
  Lock,
  Unlock,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Database,
  Globe,
  Key,
  Sparkles,
  Filter,
  Briefcase,
  Calendar,
  Layers,
  ArrowUpRight,
  Copy,
  Check,
  ChevronRight,
  UserCheck,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";
import { BLOG_POSTS } from "@/lib/blog-data";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  name: string | null;
  role: string | null;
  skills: string[] | null;
  experience: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string | null;
  analysis_data?: any;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Data states
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [govCount, setGovCount] = useState<number>(0);
  const [privateJobsCount, setPrivateJobsCount] = useState<number>(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resumeFilter, setResumeFilter] = useState<"all" | "with_resume" | "no_resume">("all");
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "all">("all");
  const [activeTab, setActiveTab] = useState<"users" | "analytics" | "content" | "skills" | "utm_builder">("users");

  // UTM Generator tool state
  const [utmUrl, setUtmUrl] = useState("https://hireorbitai.in/copilot");
  const [utmSource, setUtmSource] = useState("twitter");
  const [utmMedium, setUtmMedium] = useState("social");
  const [utmCampaign, setUtmCampaign] = useState("ai_resume_scorer");
  const [copiedUtm, setCopiedUtm] = useState(false);

  const supabase = getSupabaseClient();

  // Check saved session on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("hireorbit_admin_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch real-time data once authenticated
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user profiles directly from Supabase
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profileErr) throw profileErr;
      setProfiles((profileData as Profile[]) || []);

      // 2. Fetch government notifications count
      const { count: govNotifCount, error: govErr } = await supabase
        .from("gov_notifications")
        .select("*", { count: "exact", head: true });

      if (!govErr && govNotifCount !== null) {
        setGovCount(govNotifCount);
      }

      // 3. Fetch private tech jobs count
      const { count: jobCount, error: jobsErr } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true });

      if (!jobsErr && jobCount !== null) {
        setPrivateJobsCount(jobCount);
      }

      setLastRefreshedAt(new Date());
    } catch (err: any) {
      console.error("[Admin Dashboard] Data fetch error:", err);
      toast.error("Failed to refresh some metrics: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master passkeys (owner bypass)
    const validKeys = [
      "orbit_admin_2026",
      "hireorbit_admin",
      "himanshu_admin",
      process.env.NEXT_PUBLIC_ADMIN_KEY || "orbit2026",
    ];

    if (validKeys.includes(passcode.trim())) {
      setIsAuthenticated(true);
      sessionStorage.setItem("hireorbit_admin_authenticated", "true");
      setErrorMsg("");
      toast.success("Welcome to HireOrbit AI Admin Console!");
    } else {
      setErrorMsg("Incorrect security passkey. Please check credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("hireorbit_admin_authenticated");
    setPasscode("");
    toast.info("Logged out of Admin Console");
  };

  const timeRangeLabels: Record<"today" | "7d" | "30d" | "all", string> = {
    today: "Today (Last 24 Hours)",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days (1 Month)",
    all: "All Time",
  };

  // Safe UTC date parser: Postgres returns timestamps like "2026-10-03 16:10:22.659677" without timezone.
  // Adding 'Z' ensures browsers treat it as UTC rather than confusing it with local time.
  const parseUtcDate = (dateStr: string | null | undefined): Date | null => {
    if (!dateStr) return null;
    let str = dateStr.trim();
    if (!str) return null;
    if (str.includes(" ") && !str.includes("T")) {
      str = str.replace(" ", "T");
    }
    if (!str.endsWith("Z") && !str.includes("+") && !/-\d{2}:\d{2}$/.test(str)) {
      str = str + "Z";
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const isWithinTimeRange = (dateStr: string | null | undefined, range: "today" | "7d" | "30d" | "all") => {
    if (range === "all") return true;
    const parsed = parseUtcDate(dateStr);
    if (!parsed) return false;
    const itemDate = parsed.getTime();
    const now = Date.now();
    const diffMs = now - itemDate;

    if (range === "today") {
      const oneDayMs = 24 * 60 * 60 * 1000;
      return diffMs >= 0 && diffMs <= oneDayMs;
    }
    if (range === "7d") {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      return diffMs >= 0 && diffMs <= sevenDaysMs;
    }
    if (range === "30d") {
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      return diffMs >= 0 && diffMs <= thirtyDaysMs;
    }
    return true;
  };

  const formatCandidateTimeAgo = (dateStr: string | null | undefined) => {
    const parsed = parseUtcDate(dateStr);
    if (!parsed) return "N/A";
    const diffMs = Date.now() - parsed.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return parsed.toLocaleDateString();
  };

  // Time-scoped profiles for KPI metrics (candidates who registered in this timeframe)
  const timeScopedProfiles = useMemo(() => {
    return profiles.filter((p) => isWithinTimeRange(p.created_at, timeRange));
  }, [profiles, timeRange]);

  const scopedTotalUsers = timeScopedProfiles.length;

  // Time-scoped resumes (candidates who uploaded or updated a resume in this timeframe)
  const scopedResumes = useMemo(() => {
    return profiles.filter((p) => {
      if (!p.resume_url) return false;
      if (timeRange === "all") return true;
      const activityDate = p.updated_at || p.created_at;
      return isWithinTimeRange(activityDate, timeRange) || isWithinTimeRange(p.created_at, timeRange);
    });
  }, [profiles, timeRange]);

  const scopedUsersWithResumes = scopedResumes.length;
  const scopedResumeConversionRate =
    scopedTotalUsers > 0 ? Math.round((scopedUsersWithResumes / scopedTotalUsers) * 100) : 0;

  // Filtered profiles based on search, resume upload status, and time range
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Time filter
      if (!isWithinTimeRange(p.created_at, timeRange)) return false;

      // Resume filter
      if (resumeFilter === "with_resume" && !p.resume_url) return false;
      if (resumeFilter === "no_resume" && p.resume_url) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (p.full_name || p.name || "").toLowerCase();
      const email = (p.email || "").toLowerCase();
      const role = (p.role || "").toLowerCase();
      const skills = (p.skills || []).join(" ").toLowerCase();

      return name.includes(q) || email.includes(q) || role.includes(q) || skills.includes(q);
    });
  }, [profiles, searchQuery, resumeFilter, timeRange]);

  // Aggregated Skills Count (based on active time window)
  const topSkills = useMemo(() => {
    const counts: Record<string, number> = {};
    timeScopedProfiles.forEach((p) => {
      (p.skills || []).forEach((skill) => {
        const cleaned = skill.trim();
        if (cleaned) {
          counts[cleaned] = (counts[cleaned] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [timeScopedProfiles]);

  // Derived metrics
  const totalUsers = profiles.length;
  const usersWithResumes = profiles.filter((p) => p.resume_url).length;
  const resumeConversionRate = totalUsers > 0 ? Math.round((usersWithResumes / totalUsers) * 100) : 0;
  const totalBlogs = BLOG_POSTS.length;

  // Export Users to CSV
  const exportUsersToCSV = () => {
    const listToExport = filteredProfiles.length > 0 ? filteredProfiles : profiles;
    if (listToExport.length === 0) {
      toast.error("No user records available to export");
      return;
    }

    const headers = ["User ID", "Full Name", "Email", "Role", "Skills", "Has Resume", "Resume URL", "Joined At"];
    const rows = listToExport.map((p) => [
      p.user_id,
      `"${p.full_name || p.name || "N/A"}"`,
      `"${p.email || "N/A"}"`,
      `"${p.role || "N/A"}"`,
      `"${(p.skills || []).join(", ")}"`,
      p.resume_url ? "YES" : "NO",
      `"${p.resume_url || ""}"`,
      p.created_at,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hireorbit_users_${timeRange}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${listToExport.length} candidate records to CSV successfully!`);
  };

  // Generate UTM link
  const generatedUtmUrl = useMemo(() => {
    try {
      const base = new URL(utmUrl);
      if (utmSource) base.searchParams.set("utm_source", utmSource);
      if (utmMedium) base.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) base.searchParams.set("utm_campaign", utmCampaign);
      return base.toString();
    } catch {
      return `${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    }
  }, [utmUrl, utmSource, utmMedium, utmCampaign]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUtmUrl);
    setCopiedUtm(true);
    toast.success("UTM tracking URL copied to clipboard!");
    setTimeout(() => setCopiedUtm(false), 2500);
  };

  // 🔒 Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">HireOrbit AI Admin</h1>
            <p className="text-sm text-zinc-400 mt-1">Platform Command & Analytics Center</p>
          </div>

          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Security Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passkey..."
                  className="w-full bg-zinc-950/70 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-600"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>
              {errorMsg && <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errorMsg}</p>}
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Unlock className="w-4 h-4" /> Unlock Console
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>HireOrbit AI Systems v2.4</span>
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Return Home →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 🔓 Authenticated Admin View
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-md">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">HireOrbit<span className="text-emerald-400">AI</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Admin Master
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">Live Analytics & User Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase Live DB</span>
            </div>

            {lastRefreshedAt && (
              <span className="hidden lg:inline text-[11px] text-zinc-500 font-mono">
                Synced {lastRefreshedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Data from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">{loading ? "Refreshing..." : "Live Refresh"}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Horizon Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Timeframe Horizon</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {timeRangeLabels[timeRange]}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Filter candidate registrations, resume conversion rates, and talent metrics
              </div>
            </div>
          </div>

          {/* Time range pills */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1 rounded-xl gap-1 shrink-0">
            <button
              onClick={() => setTimeRange("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeRange === "today"
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeRange === "7d"
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeRange === "30d"
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeRange === "all"
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Registered Users */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {timeRange === "all" ? "Total Registered Users" : `Users (${timeRange === "today" ? "Today" : timeRange === "7d" ? "7 Days" : "1 Month"})`}
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? "..." : scopedTotalUsers}
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center justify-between">
              <span className="text-emerald-400 font-medium">
                {timeRange === "all" ? "100% Verified" : "Active in window"}
              </span>
              {timeRange !== "all" && (
                <span className="text-zinc-500 text-[11px]">All-time: {totalUsers}</span>
              )}
            </div>
          </div>

          {/* Card 2: Resumes Uploaded */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {timeRange === "all" ? "Resumes Uploaded" : `Resumes (${timeRange === "today" ? "Today" : timeRange === "7d" ? "7 Days" : "1 Month"})`}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              {loading ? "..." : scopedUsersWithResumes}
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center justify-between">
              <span className="text-white font-medium">
                {scopedResumeConversionRate}% conversion
              </span>
              {timeRange !== "all" && (
                <span className="text-zinc-500 text-[11px]">All-time: {usersWithResumes}</span>
              )}
            </div>
          </div>

          {/* Card 3: Live Jobs Synced in Database */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Jobs in Engine</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? "..." : (govCount + privateJobsCount > 0 ? (govCount + privateJobsCount).toLocaleString() : govCount.toLocaleString())}
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center justify-between">
              <span className="text-emerald-400 font-medium">{govCount.toLocaleString()} Govt</span>
              <span className="text-zinc-500 text-[11px]">• {privateJobsCount} Private Tech</span>
            </div>
          </div>

          {/* Card 4: Published Articles */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">SEO Articles Indexed</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-purple-400 tracking-tight">{totalBlogs}</div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">116 Pages</span> rendered in sitemap.xml
            </div>
          </div>
        </section>

        {/* Quick Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Candidate Intelligence ({timeRange === "all" ? profiles.length : `${filteredProfiles.length} of ${profiles.length}`})
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "analytics"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Traffic & Mixpanel Hub
          </button>

          <button
            onClick={() => setActiveTab("utm_builder")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "utm_builder"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            UTM Campaign Builder
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "content"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            SEO Articles & Sitemaps ({totalBlogs})
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "skills"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Skills Talent Radar ({topSkills.length})
          </button>
        </div>

        {/* TAB 1: USERS & RESUMES */}
        {activeTab === "users" && (
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            {/* Table Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by name, email, target role, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500/50"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Resume Filter Pills */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setResumeFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      resumeFilter === "all" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    All ({timeScopedProfiles.length})
                  </button>
                  <button
                    onClick={() => setResumeFilter("with_resume")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      resumeFilter === "with_resume" ? "bg-emerald-500/20 text-emerald-400 font-medium" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    With Resume ({scopedUsersWithResumes})
                  </button>
                  <button
                    onClick={() => setResumeFilter("no_resume")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      resumeFilter === "no_resume" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    No Resume ({scopedTotalUsers - scopedUsersWithResumes})
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportUsersToCSV}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export to CSV
                </button>
              </div>
            </div>

            {/* Active Time Horizon Filter Banner */}
            {timeRange !== "all" && (
              <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Filtered by <strong>{timeRangeLabels[timeRange]}</strong>: Showing <strong>{filteredProfiles.length}</strong> of {profiles.length} total candidates.
                  </span>
                </div>
                <button
                  onClick={() => setTimeRange("all")}
                  className="text-xs text-zinc-300 hover:text-white underline cursor-pointer shrink-0 ml-2 font-medium"
                >
                  Reset to All Time
                </button>
              </div>
            )}

            {/* User List Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-semibold text-[10px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role / Title</th>
                    <th className="py-3 px-4">Top Extracted Skills</th>
                    <th className="py-3 px-4">Resume</th>
                    <th className="py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-normal text-zinc-300">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                        Loading candidate records from Supabase...
                      </td>
                    </tr>
                  ) : filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        No candidate records found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map((p) => {
                      const displayName = p.full_name || p.name || "Anonymous Candidate";
                      const timeAgo = formatCandidateTimeAgo(p.created_at);
                      const exactDate = p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A";
                      const fullTooltip = p.created_at ? parseUtcDate(p.created_at)?.toLocaleString() : "";
                      const skills = p.skills || [];

                      return (
                        <tr key={p.id || p.user_id} className="hover:bg-zinc-950/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[11px] text-zinc-300">
                                {displayName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-white">{displayName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                            {p.email || <span className="text-zinc-600">No Email</span>}
                          </td>
                          <td className="py-3.5 px-4">
                            {p.role ? (
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[11px]">
                                {p.role}
                              </span>
                            ) : (
                              <span className="text-zinc-600">Pending Scan</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 flex-wrap max-w-xs">
                              {skills.slice(0, 3).map((s, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                                  {s}
                                </span>
                              ))}
                              {skills.length > 3 && (
                                <span className="text-[10px] text-zinc-500">+{skills.length - 3}</span>
                              )}
                              {skills.length === 0 && <span className="text-zinc-600 text-[10px]">None</span>}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {p.resume_url ? (
                              <a
                                href={p.resume_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-medium transition-colors"
                              >
                                <Download className="w-3 h-3" /> View PDF
                              </a>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">No file</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-400 text-[11px]" title={fullTooltip || undefined}>
                            <div className="font-medium text-white">{timeAgo}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {exactDate}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: ANALYTICS & MIXPANEL HUB */}
        {activeTab === "analytics" && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mixpanel Hub */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Mixpanel Product Analytics</h3>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Project Token <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-emerald-400">9043ec1...</code> is live. Tracking user signups, resume scans, and UTM parameters.
                </p>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Candidates in Window</span>
                    <span className="font-semibold text-white">{scopedTotalUsers} Registered</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>All-Time Candidates</span>
                    <span className="font-semibold text-emerald-400">{profiles.length} Profiles</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Resumes in DB</span>
                    <span className="font-semibold text-emerald-400">{usersWithResumes} Uploaded</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Events Auto-Recorded</span>
                    <span className="font-semibold text-purple-400">sign_up, resume_uploaded, pageview</span>
                  </div>
                </div>
                <a
                  href="https://mixpanel.com/project/3831201"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Open Live Mixpanel Workspace <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Google Search Console Hub */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Google Search Console</h3>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                </div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Domain <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-blue-400">hireorbitai.in</code> performance metrics.
                </p>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Verified Domain</span>
                    <span className="font-semibold text-white">hireorbitai.in</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Sitemap XML Pages</span>
                    <span className="font-semibold text-emerald-400">116 Pages Generated</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Search Index Status</span>
                    <span className="font-semibold text-blue-400">Active (Auto-Crawl)</span>
                  </div>
                </div>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Open Search Console <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Google Analytics 4 */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Google Analytics 4</h3>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Tag ID <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-amber-400">G-82W7CWTG5N</code> embedded globally in layout.js.
                </p>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Tag Status</span>
                    <span className="font-semibold text-emerald-400">Active (Head Script)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>JSON-LD Schema</span>
                    <span className="font-semibold text-white">Org + WebSite + App</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Real-time Streams</span>
                    <span className="font-semibold text-amber-400">Connected</span>
                  </div>
                </div>
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Open Google Analytics <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: UTM CAMPAIGN BUILDER */}
        {activeTab === "utm_builder" && (
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-xl max-w-3xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> 1-Click UTM Campaign Link Builder
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Share tracked links on Twitter, LinkedIn, WhatsApp, or ads. Mixpanel will automatically record the marketing source and attach it to signups!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Destination URL</label>
                <input
                  type="text"
                  value={utmUrl}
                  onChange={(e) => setUtmUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500/50"
                  placeholder="https://hireorbitai.in/copilot"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">UTM Source (e.g. twitter, linkedin, reddit)</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500/50"
                    placeholder="twitter"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">UTM Medium (e.g. social, cpc, email)</label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500/50"
                    placeholder="social"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">UTM Campaign (e.g. resume_scorer, job_sprint)</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500/50"
                    placeholder="ai_resume_scorer"
                  />
                </div>
              </div>

              {/* Generated URL Box */}
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
                  Generated Tracking URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedUtmUrl}
                    className="w-full bg-zinc-950 border border-emerald-500/30 text-emerald-300 rounded-xl px-4 py-3 text-xs font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedUtm ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedUtm ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: CONTENT & SITEMAPS */}
        {activeTab === "content" && (
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" /> Published SEO Articles ({BLOG_POSTS.length})
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  High-intent, high-RPM articles targeting Google organic search traffic.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-xs text-zinc-300"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" /> Main Sitemap
                </a>
                <a
                  href="/gov-sitemap/sitemap.xml"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-xs text-zinc-300"
                >
                  <Database className="w-3.5 h-3.5 text-amber-400" /> Govt Sitemap
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BLOG_POSTS.map((post, idx) => (
                <div key={post.slug || idx} className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h4 className="font-semibold text-white text-xs line-clamp-2 leading-relaxed">
                      {post.title}
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[200px]">
                      /blog/{post.slug}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1"
                    >
                      Read <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: SKILLS RADAR */}
        {activeTab === "skills" && (
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-xl max-w-3xl">
            <div className="mb-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Candidate Talent Pool Skills Distribution
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Aggregated skill entities extracted from candidate profiles ({timeRangeLabels[timeRange]}).
              </p>
            </div>

            {topSkills.length === 0 ? (
              <p className="text-xs text-zinc-500 py-8 text-center">No skills extracted yet.</p>
            ) : (
              <div className="space-y-3">
                {topSkills.map(([skill, count]) => {
                  const maxCount = topSkills[0][1] || 1;
                  const pct = Math.round((count / maxCount) * 100);

                  return (
                    <div key={skill} className="flex items-center gap-4 text-xs">
                      <span className="w-32 font-medium text-white truncate text-left">{skill}</span>
                      <div className="flex-1 bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono text-zinc-400">{count} devs</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
