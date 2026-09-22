"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { getSupabaseClient } from "@/lib/supabase";
import { 
  GOV_JOB_NOTIFICATIONS, 
  BREAKING_TICKER_ITEMS,
  GovJobNotification 
} from "@/lib/gov-jobs-data";
import { 
  Search, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  Calendar, 
  Award, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  ArrowRight, 
  Filter, 
  X, 
  Building2, 
  IndianRupee,
  Layers,
  Zap,
  Info,
  Flame,
  Radio
} from 'lucide-react';

export default function GovJobsPage() {
  const [notifications, setNotifications] = useState<GovJobNotification[]>(GOV_JOB_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'job' | 'admit-card' | 'result' | 'answer-key'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQualification, setSelectedQualification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadLiveNotifications() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('gov_notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: GovJobNotification[] = data.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            title: d.title,
            shortTitle: d.short_title || d.title,
            organization: d.organization,
            category: d.category,
            type: d.type,
            badgeStatus: d.badge_status,
            badgeColor: d.badge_color,
            vacancies: d.vacancies,
            qualification: d.qualification,
            qualificationLevel: d.qualification_level,
            ageLimit: d.age_limit,
            payScale: d.pay_scale,
            applicationFee: d.application_fee || {},
            importantDates: d.important_dates || {},
            location: d.location,
            summary: d.summary,
            keyHighlights: d.key_highlights || [],
            selectionProcess: d.selection_process || [],
            officialPdfUrl: d.official_pdf_url,
            applyUrl: d.apply_url,
            updatedAt: 'Live from Gazette',
            isTrending: d.is_trending,
            isLeadStory: d.is_lead_story,
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.warn('Using static gov notifications fallback:', err);
      }
    }
    loadLiveNotifications();
  }, []);

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Type tab filter
      if (activeTab !== 'all' && item.type !== activeTab) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'state') {
          const isStateCat = item.category === 'state';
          const isStatePolice = item.category === 'police' && item.location && item.location.toLowerCase() !== 'all india';
          const isStateLocation = item.location && item.location.toLowerCase() !== 'all india' && !item.location.toLowerCase().includes('central');
          if (!isStateCat && !isStatePolice && !isStateLocation) {
            return false;
          }
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }
      // Qualification filter
      if (selectedQualification !== 'all' && item.qualificationLevel !== selectedQualification) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesOrg = item.organization.toLowerCase().includes(query);
        const matchesShort = item.shortTitle.toLowerCase().includes(query);
        const matchesQual = item.qualification.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrg && !matchesShort && !matchesQual) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, selectedCategory, selectedQualification, searchQuery]);

  const leadStory = notifications.find((j) => j.isLeadStory) || notifications[0];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 pt-16 lg:pt-20">
      <Navigation />

      {/* Breaking News Ticker (Bloomberg / Multi-Billion Dollar Media Style) */}
      <div className="bg-zinc-900/90 border-b border-white/5 sticky top-16 lg:top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider shrink-0 animate-pulse">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            Live Dispatch
          </div>
          <div className="overflow-hidden whitespace-nowrap w-full relative">
            <div className="inline-block animate-marquee text-xs text-zinc-300 font-medium">
              {[...BREAKING_TICKER_ITEMS, ...BREAKING_TICKER_ITEMS].join('    •    ')}
            </div>
          </div>
        </div>
      </div>

      {/* Newsroom Hero Header */}
      <section className="relative pt-12 pb-10 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/3 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-20 right-10 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/5">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified National Recruitment Desk • Official Gazette Sourced
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Government Careers <span className="gradient-text">Newsroom</span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Zero clutter, zero spam ads. Authoritative notifications, admit card release trackers, official answer keys, and exam results for over 100M+ Indian aspirants.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 text-xs text-zinc-400 shrink-0">
              <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl">
                <div className="text-emerald-400 font-bold text-lg">108,000+</div>
                <div className="text-zinc-500">Active Vacancies Tracked</div>
              </div>
              <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl">
                <div className="text-blue-400 font-bold text-lg">100%</div>
                <div className="text-zinc-500">Official Portal Verified</div>
              </div>
            </div>
          </div>

          {/* Lead Cover Story Banner */}
          {leadStory && (
            <div className="mt-8 relative rounded-3xl overflow-hidden glass border border-white/10 p-6 sm:p-8 bg-gradient-to-r from-emerald-950/20 via-zinc-900/50 to-zinc-900/80">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-black font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Featured Lead Story
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-emerald-400 font-medium">{leadStory.organization}</span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {leadStory.updatedAt}
                    </span>
                  </div>

                  <Link
                    href={`/gov/${leadStory.slug}`}
                    className="text-2xl sm:text-3xl font-extrabold text-white hover:text-emerald-400 transition-colors block"
                  >
                    {leadStory.title}
                  </Link>

                  <p className="text-zinc-300 text-sm line-clamp-2">
                    {leadStory.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 pt-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Award className="w-4 h-4" /> {leadStory.vacancies}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <GraduationCap className="w-4 h-4" /> {leadStory.qualification}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <IndianRupee className="w-4 h-4" /> {leadStory.payScale}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto">
                  <Link
                    href={`/gov/${leadStory.slug}`}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-sm"
                  >
                    View Official Notice
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/onboarding"
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
                  >
                    <Zap className="w-4 h-4 text-emerald-400" />
                    AI Eligibility Scan
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation Tabs (All, Latest Jobs, Admit Card, Results, Answer Key) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Updates', icon: Layers, count: GOV_JOB_NOTIFICATIONS.length },
                { id: 'job', label: 'Latest Jobs (Apply)', icon: FileText, count: GOV_JOB_NOTIFICATIONS.filter(i => i.type === 'job').length },
                { id: 'admit-card', label: 'Admit Cards', icon: Calendar, count: GOV_JOB_NOTIFICATIONS.filter(i => i.type === 'admit-card').length },
                { id: 'result', label: 'Results & Cutoffs', icon: Award, count: GOV_JOB_NOTIFICATIONS.filter(i => i.type === 'result').length },
                { id: 'answer-key', label: 'Answer Keys', icon: CheckCircle2, count: GOV_JOB_NOTIFICATIONS.filter(i => i.type === 'answer-key').length },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-zinc-950 shadow-glow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black/20 text-zinc-950 font-bold' : 'bg-white/10 text-zinc-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search SSC, RRB, UP Police, SBI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filter Badges (Sector & Qualification) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-500 flex items-center gap-1 font-medium mr-1">
                <Filter className="w-3.5 h-3.5" /> Sector:
              </span>
              {[
                { id: 'all', label: 'All Sectors' },
                { id: 'central', label: 'Central / SSC / UPSC' },
                { id: 'state', label: 'State Exams (All 28 States)' },
                { id: 'railway', label: 'Railways' },
                { id: 'police', label: 'Police & Defense' },
                { id: 'banking', label: 'Banking' },
                { id: 'teaching', label: 'Teaching / CTET' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Qualification:</span>
              <select
                value={selectedQualification}
                onChange={(e) => setSelectedQualification(e.target.value)}
                className="bg-zinc-900 border border-white/10 text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-xs"
              >
                <option value="all">All Qualifications</option>
                <option value="10th">10th Pass</option>
                <option value="12th">12th Pass</option>
                <option value="graduate">Graduate (B.Com, BA, B.Sc, B.Tech)</option>
                <option value="diploma">Diploma / Engineering</option>
              </select>
            </div>
          </div>

          {/* Job Feed Grid */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-white/5">
              <Info className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-1">No recruitments match your filter</h3>
              <p className="text-zinc-500 text-sm mb-4">Try clearing your search query or selecting &quot;All Sectors&quot;.</p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedCategory('all');
                  setSelectedQualification('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotifications.map((item) => {
                const getBadgeStyle = (color: string) => {
                  switch (color) {
                    case 'emerald':
                      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    case 'blue':
                      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                    case 'amber':
                      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    case 'purple':
                      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                    default:
                      return 'bg-white/10 text-zinc-300 border-white/10';
                  }
                };

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group hover:shadow-glow-sm"
                  >
                    <div>
                      {/* Card Header: Organization & Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="text-xs text-zinc-400 font-medium truncate max-w-[170px]">
                            {item.organization}
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${getBadgeStyle(item.badgeColor)}`}>
                          {item.badgeStatus}
                        </span>
                      </div>

                      {/* Card Title */}
                      <Link 
                        href={`/gov/${item.slug}`}
                        className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3 block"
                      >
                        {item.title}
                      </Link>

                      {/* Specs Matrix */}
                      <div className="space-y-2 py-3 border-y border-white/5 text-xs text-zinc-300">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">Vacancies:</span>
                          <span className="font-bold text-emerald-400">{item.vacancies}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">Eligibility:</span>
                          <span className="font-medium text-zinc-200 truncate max-w-[180px] text-right" title={item.qualification}>
                            {item.qualification}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">Age Bracket:</span>
                          <span className="font-medium text-zinc-300">{item.ageLimit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">Key Date:</span>
                          <span className="font-medium text-amber-400">
                            {item.importantDates.lastDate 
                              ? `Deadline: ${item.importantDates.lastDate}`
                              : item.importantDates.examDate
                              ? `Exam: ${item.importantDates.examDate}`
                              : item.importantDates.resultDate
                              ? `Result: ${item.importantDates.resultDate}`
                              : 'Active Now'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Footers */}
                    <div className="pt-4 mt-2 flex items-center gap-2">
                      <Link
                        href={`/gov/${item.slug}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-sm"
                      >
                        Read Full Notice
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={item.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white hover:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10"
                        title="Open Official Portal"
                      >
                        Apply / Portal
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* THE CONVERSION BRIDGE: Resume Scan Module */}
          <div className="mt-16 rounded-3xl p-8 sm:p-12 relative overflow-hidden glass border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Free AI Career Utility
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Not Sure If You Qualify for These Exams? <br />
                <span className="gradient-text">Let AI Scan Your Resume & Verify</span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
                Don&apos;t spend hours scrolling through 60-page bureaucratic PDFs trying to figure out if your degree, age, or passing year matches. Upload your resume or details to HireOrbitAI, and our AI will automatically cross-check your profile against all active Central and State government notifications in 5 seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/onboarding"
                  className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow hover:scale-105"
                >
                  <FileText className="w-4 h-4" />
                  Upload Resume &amp; Check Eligibility
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/copilot"
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Prepare with AI Exam Copilot
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Age &amp; Degree Verification
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free &amp; Private
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ATS Compatibility Score Included
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
