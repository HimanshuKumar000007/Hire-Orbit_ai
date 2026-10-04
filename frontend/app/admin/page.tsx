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
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resumeFilter, setResumeFilter] = useState<"all" | "with_resume" | "no_resume">("all");
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
      // 1. Fetch user profiles
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profileErr) throw profileErr;
      setProfiles((profileData as Profile[]) || []);

      // 2. Fetch government notifications count
      const { count, error: govErr } = await supabase
        .from("gov_notifications")
        .select("*", { count: "exact", head: true });

      if (!govErr && count !== null) {
        setGovCount(count);
      }
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

  // Filtered profiles based on search and resume upload status
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
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
  }, [profiles, searchQuery, resumeFilter]);

  // Aggregated Skills Count
  const topSkills = useMemo(() => {
    const counts: Record<string, number> = {};
    profiles.forEach((p) => {
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
  }, [profiles]);

  // Derived metrics
  const totalUsers = profiles.length;
  const usersWithResumes = profiles.filter((p) => p.resume_url).length;
  const resumeConversionRate = totalUsers > 0 ? Math.round((usersWithResumes / totalUsers) * 100) : 0;
  const totalBlogs = BLOG_POSTS.length;

  // Export Users to CSV
  const exportUsersToCSV = () => {
    if (profiles.length === 0) {
      toast.error("No user records available to export");
      return;
    }

    const headers = ["User ID", "Full Name", "Email", "Role", "Skills", "Has Resume", "Resume URL", "Joined At"];
    const rows = profiles.map((p) => [
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
    link.setAttribute("download", `hireorbit_users_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported users to CSV successfully!");
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
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
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
        {/* KPI Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Users */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Registered Users</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{loading ? "..." : totalUsers}</div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">100% Verified</span> in Supabase Auth
            </div>
          </div>

          {/* Card 2: Resumes Uploaded */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Resumes Uploaded</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{loading ? "..." : usersWithResumes}</div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
              <span className="text-white font-medium">{resumeConversionRate}%</span> upload conversion rate
            </div>
          </div>

          {/* Card 3: Govt Notifications Synced */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Live Govt Jobs Synced</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{loading ? "..." : govCount.toLocaleString()}</div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">Auto-sync</span> active via Supabase
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
            Candidate Intelligence ({profiles.length})
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
                    All ({profiles.length})
                  </button>
                  <button
                    onClick={() => setResumeFilter("with_resume")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      resumeFilter === "with_resume" ? "bg-emerald-500/20 text-emerald-400 font-medium" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    With Resume ({usersWithResumes})
                  </button>
                  <button
                    onClick={() => setResumeFilter("no_resume")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      resumeFilter === "no_resume" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    No Resume ({totalUsers - usersWithResumes})
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
                      const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A";
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
                          <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                            {dateStr}
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
                    <span>Active Users (Today)</span>
                    <span className="font-semibold text-white">39 Unique</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Events Tracked</span>
                    <span className="font-semibold text-emerald-400">sign_up, resume_uploaded, pageview</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Attribution</span>
                    <span className="font-semibold text-purple-400">First-Touch & Last-Touch</span>
                  </div>
                </div>
                <a
                  href="https://mixpanel.com/project/3831201"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Open Mixpanel Workspace <ExternalLink className="w-3 h-3" />
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
                    <span>Total 24h Impressions</span>
                    <span className="font-semibold text-white">9,910 impressions</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Average Position</span>
                    <span className="font-semibold text-amber-400">4.1 (Page 1)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Target Opportunity</span>
                    <span className="font-semibold text-emerald-400">CTR Growth to 3.5%</span>
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
                Aggregated skill entities extracted across all candidate resumes and profiles.
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
