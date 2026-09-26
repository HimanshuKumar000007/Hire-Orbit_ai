"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { GovJobNotification } from "@/lib/gov-jobs-data";
import { UniversalJobCard } from "@/components/gov/jobs/UniversalJobCard";
import {
  Search,
  Sparkles,
  FileText,
  ExternalLink,
  Calendar,
  Award,
  GraduationCap,
  Clock,
  ChevronRight,
  ArrowRight,
  Filter,
  X,
  IndianRupee,
  Layers,
  Zap,
  Info,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface GovHubListingProps {
  /**
   * Current notices fetched server-side from Supabase.
   * This is always the live database state — no static fallback is used.
   */
  initialNotifications: GovJobNotification[];
}

export function GovHubListing({ initialNotifications }: GovHubListingProps) {
  // Seed state from server data — no client-side re-fetch.
  const [notifications] = useState<GovJobNotification[]>(initialNotifications);

  const [activeTab, setActiveTab] = useState<'all' | 'job' | 'admit-card' | 'result' | 'answer-key'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQualification, setSelectedQualification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tab counts derived from live server data (not the old static array)
  const tabCounts = useMemo(() => ({
    all: notifications.length,
    job: notifications.filter(i => i.type === 'job' || i.type === 'recruitment').length,
    'admit-card': notifications.filter(i => i.type === 'admit-card').length,
    result: notifications.filter(i => i.type === 'result').length,
    'answer-key': notifications.filter(i => i.type === 'answer-key').length,
  }), [notifications]);

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Type tab filter
      if (activeTab !== 'all') {
        if (activeTab === 'job') {
          if (item.type !== 'job' && item.type !== 'recruitment') return false;
        } else if (item.type !== activeTab) {
          return false;
        }
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
  }, [notifications, activeTab, selectedCategory, selectedQualification, searchQuery]);

  const leadStory = notifications.find((j) => j.isLeadStory) || notifications[0];

  return (
    <>
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

      {/* Main Content Area */}
      <section className="py-10">
        {/* Navigation Tabs (All, Latest Jobs, Admit Card, Results, Answer Key) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Updates', icon: Layers },
              { id: 'job', label: 'Latest Jobs (Apply)', icon: FileText },
              { id: 'admit-card', label: 'Admit Cards', icon: Calendar },
              { id: 'result', label: 'Results & Cutoffs', icon: Award },
              { id: 'answer-key', label: 'Answer Keys', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tabCounts[tab.id as keyof typeof tabCounts];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
                    {count}
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
            {filteredNotifications.map((item) => (
              <UniversalJobCard key={item.id} job={item} />
            ))}
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
      </section>
    </>
  );
}
