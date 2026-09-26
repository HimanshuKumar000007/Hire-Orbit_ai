"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Mail, 
  Newspaper, 
  TrendingUp, 
  Brain, 
  Rocket, 
  Star,
  Sparkles,
  Lock,
  Timer,
  Rss,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from "lucide-react";
import Link from "next/link";
import { 
  getPublishedPosts, 
  getUpcomingPosts, 
  getAllPosts, 
  BlogPost 
} from "@/lib/blog-data";
import { toast } from "sonner";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewMode, setPreviewMode] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Enable preview mode via URL query parameter (e.g., /blog?preview=true) for testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "true") {
        setPreviewMode(true);
      }
    }
  }, []);

  // Categories list
  const categories = ["All", "Resume & ATS", "Interview Prep", "AI & Tech", "Career Growth"];

  // Fetch posts based on preview mode
  const publishedPosts = useMemo(() => {
    return getPublishedPosts(previewMode);
  }, [previewMode]);

  const upcomingPosts = useMemo(() => {
    return getUpcomingPosts();
  }, []);

  // Filter published posts based on search query and category
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        post.seoKeywords.some((kw) => kw.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [publishedPosts, selectedCategory, searchQuery]);

  // Featured Post is the latest published post
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const regularPosts = filteredPosts.length > 0 ? filteredPosts.slice(1) : [];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setEmailSubscribed(true);
    toast.success("You are subscribed to the 10-Day AI Career Series!");
  };

  // Calculate days remaining until an upcoming post
  const getDaysUntil = (dateStr: string) => {
    const diffMs = new Date(dateStr).getTime() - new Date().getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (diffHours <= 24) {
      return `Releases in ${diffHours}h`;
    }
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `Releases in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30 text-zinc-100 overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Series Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 max-w-full truncate"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span className="truncate">10-Day Automated Career &amp; AI Intelligence Series</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight tracking-tight break-words"
            >
              Master the Future of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Hiring, AI &amp; High-Growth Tech
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed mb-6 sm:mb-10 max-w-2xl mx-auto font-light px-1"
            >
              Actionable engineering playbooks, ATS reverse-engineering, STAR interview frameworks, and salary negotiation strategies. Releasing every single day.
            </motion.p>

            {/* Search Bar & Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto relative group mb-5 sm:mb-6"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by keyword, topic, or ATS tips..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-10 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-500 text-sm shadow-xl backdrop-blur-md"
              />
              <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </motion.div>

            {/* Quick RSS link & Admin preview notification */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-zinc-500">
              <Link
                href="/blog/rss.xml"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 transition-colors bg-white/[0.02]"
              >
                <Rss className="w-3.5 h-3.5 text-emerald-400" />
                <span>RSS Feed</span>
              </Link>
              {previewMode && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Preview Mode Active (?preview=true)
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs Section */}
      <section className="py-4 sm:py-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none flex-nowrap w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 text-xs font-bold uppercase tracking-wider px-3.5 sm:px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "text-zinc-400 border-white/5 hover:border-white/20 hover:text-white bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-zinc-500 w-full sm:w-auto text-left sm:text-right">
              Showing <span className="text-emerald-400 font-semibold">{filteredPosts.length}</span> published article{filteredPosts.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article Section (Latest Live) */}
      {featuredPost && (
        <section className="pt-8 sm:pt-12 pb-6 sm:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 sm:mb-6">
              <Flame className="w-4 h-4 text-emerald-400" />
              Featured Release
            </div>

            <Link href={`/blog/${featuredPost.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative glass-strong rounded-2xl sm:rounded-[2.5rem] border border-white/10 hover:border-emerald-500/30 transition-all overflow-hidden p-6 sm:p-10 lg:p-12"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mb-4">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(featuredPost.publishedAt))}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {featuredPost.readTime}
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 sm:mb-4 group-hover:text-emerald-400 transition-colors leading-tight break-words">
                      {featuredPost.title}
                    </h2>

                    <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6 font-light max-w-2xl break-words">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {featuredPost.author.name[0]}
                        </div>
                        <span className="text-xs text-zinc-300 font-medium truncate">
                          {featuredPost.author.name}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Complete Guide <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 hidden lg:flex justify-end">
                    <div className="w-48 h-48 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                      <Brain className="w-20 h-20 text-emerald-400/80" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid of Remaining Published Articles */}
      <section className="py-8 sm:py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              Latest Insights &amp; Playbooks
            </h2>
          </div>

          {regularPosts.length === 0 && !featuredPost && (
            <div className="text-center py-12 sm:py-16 glass-strong rounded-2xl sm:rounded-3xl border border-white/10 px-4">
              <p className="text-zinc-400 text-sm sm:text-base mb-3">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-emerald-400 text-xs font-bold uppercase tracking-wider hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="relative glass-strong rounded-2xl sm:rounded-[2rem] border border-white/5 group-hover:border-emerald-500/30 transition-all overflow-hidden flex flex-col h-full hover:-translate-y-1">
                    {/* Header Banner */}
                    <div className="h-32 sm:h-40 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-transparent p-4 sm:p-6 relative flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
                          {post.readTime}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.publishedAt))}
                      </div>
                    </div>

                    {/* Article Body */}
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-emerald-400 transition-colors leading-snug break-words">
                        {post.title}
                      </h3>

                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3.5 sm:pt-4 border-t border-white/5 mt-auto text-xs">
                        <span className="text-zinc-400 font-medium truncate max-w-[140px]">{post.author.name}</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform shrink-0">
                          Read Post <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Scheduled Drops (10-Day Series Showcase) */}
      {!previewMode && upcomingPosts.length > 0 && (
        <section className="py-12 sm:py-20 border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                  <Timer className="w-4 h-4 text-emerald-400 shrink-0" />
                  Automated 10-Day Release Pipeline
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-white break-words">
                  Upcoming Daily Drops
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                  1 new high-impact playbook automatically unlocks every day at midnight without human intervention.
                </p>
              </div>

              <div className="self-start sm:self-auto inline-flex items-center gap-2 text-xs px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Auto-Unlocks Daily at Midnight
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {upcomingPosts.map((upPost, idx) => (
                <div
                  key={upPost.slug}
                  className="rounded-2xl sm:rounded-3xl border border-white/5 glass-strong p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                      <span className="text-[10px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {upPost.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <Lock className="w-3 h-3 shrink-0" />
                        {getDaysUntil(upPost.publishedAt)}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-zinc-200 mb-2 leading-snug break-words">
                      {upPost.title}
                    </h4>

                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {upPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 mt-5 sm:mt-6">
                    <span>Est. {upPost.readTime}</span>
                    <span className="text-zinc-400 flex items-center gap-1">
                      Day {idx + 2} of 10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Subscription Section */}
      <section className="py-16 sm:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4 sm:mb-6 shadow-lg shadow-emerald-500/10">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4 break-words">
                Get Each Daily Drop in Your Inbox
              </h2>
              <p className="text-zinc-400 mb-6 sm:mb-8 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
                Join 25,000+ engineers, product managers, and leaders receiving each day's deep dive into ATS algorithms, AI interview prompts, and market salary data.
              </p>

              {emailSubscribed ? (
                <div className="p-4 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  <span>You are subscribed! Watch your inbox every morning at 6:00 AM UTC.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your work email address"
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-emerald-500 text-black font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-emerald-400 transition-all hover:scale-105 text-sm shadow-lg shadow-emerald-500/20"
                  >
                    Subscribe Daily
                  </button>
                </form>
              )}

              <p className="mt-4 text-[11px] sm:text-xs text-zinc-500">
                Zero spam. One-click unsubscribe anytime. Read our{" "}
                <Link href="/privacy" className="underline hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Cloud */}
      <section className="py-16 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">
            Core Competencies &amp; Topics
          </h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              "ATS Resume Optimization",
              "STAR Method Framework",
              "Semantic Search Matching",
              "AI Mock Interviews",
              "Salary Negotiation Scripts",
              "Counter-Offer Playbooks",
              "AI Engineer Roadmap",
              "Vector Embeddings",
              "System Design Scalability",
              "Cold Outreach DMs",
              "Hidden Job Market",
              "Autonomous Career Copilots"
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 text-xs hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
