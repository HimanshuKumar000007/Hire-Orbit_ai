"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { GovJobNotification } from "@/lib/gov-jobs-data";
import { UniversalJobCard } from "./UniversalJobCard";
import { JobSearchAndFilters, FilterState } from "./JobSearchAndFilters";
import {
  Briefcase,
  Info,
  Sparkles,
  FileText,
  ArrowRight,
  Zap,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface LatestJobsListingProps {
  /**
   * Current jobs fetched server-side from Supabase.
   * This is always the live database state — no static fallback is used.
   * Pass undefined only if the server fetch failed (will show error state).
   */
  initialJobs: GovJobNotification[];
  fetchError?: boolean;
}

export function LatestJobsListing({ initialJobs, fetchError }: LatestJobsListingProps) {
  // State is seeded from server-fetched data — no client-side refetch needed.
  const [jobs] = useState<GovJobNotification[]>(initialJobs);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedSector: 'all',
    selectedQualification: 'all',
    selectedState: 'all',
    sortBy: 'latest',
  });

  // Filter & Factual Sort Engine
  const filteredJobs = useMemo(() => {
    return jobs.filter((item) => {
      // 1. Sector Filter
      if (filters.selectedSector !== 'all') {
        if (filters.selectedSector === 'central' && item.category !== 'central') return false;
        if (filters.selectedSector === 'railway' && item.category !== 'railway') return false;
        if (filters.selectedSector === 'banking' && item.category !== 'banking') return false;
        if (filters.selectedSector === 'police' && item.category !== 'police' && item.category !== 'defense') return false;
        if (filters.selectedSector === 'teaching' && item.category !== 'teaching') return false;
        if (filters.selectedSector === 'state' && item.category !== 'state') return false;
        if (filters.selectedSector === 'healthcare' && !/health|nurse|medical|aiims|nhm|pharmacist/i.test(item.title + " " + item.organization)) return false;
        if (filters.selectedSector === 'engineering' && !/engineer|technician|junior engineer|\bje\b|diploma/i.test(item.title + " " + item.qualification)) return false;
      }

      // 2. Qualification Filter
      if (filters.selectedQualification !== 'all') {
        const q = filters.selectedQualification.toLowerCase();
        const itemQ = (item.qualificationLevel || '').toLowerCase();
        const rawQ = (item.qualification || '').toLowerCase();

        if (q === '10th' && itemQ !== '10th' && !rawQ.includes('10th') && !rawQ.includes('matric')) return false;
        if (q === '12th' && itemQ !== '12th' && !rawQ.includes('12th') && !rawQ.includes('inter')) return false;
        if (q === 'iti' && !rawQ.includes('iti')) return false;
        if (q === 'diploma' && itemQ !== 'diploma' && !rawQ.includes('diploma')) return false;
        if (q === 'graduate' && itemQ !== 'graduate' && !rawQ.includes('graduate') && !rawQ.includes('degree') && !rawQ.includes('bachelor')) return false;
        if (q === 'postgraduate' && itemQ !== 'postgraduate' && !rawQ.includes('master') && !rawQ.includes('postgraduate')) return false;
      }

      // 3. State / Location Filter
      if (filters.selectedState !== 'all') {
        const itemLoc = (item.location || '').toLowerCase();
        if (filters.selectedState === 'all-india' && !itemLoc.includes('all india') && !itemLoc.includes('central')) return false;
        if (filters.selectedState === 'uttar-pradesh' && !itemLoc.includes('uttar pradesh') && !itemLoc.includes('up')) return false;
        if (filters.selectedState === 'bihar' && !itemLoc.includes('bihar')) return false;
        if (filters.selectedState === 'rajasthan' && !itemLoc.includes('rajasthan')) return false;
        if (filters.selectedState === 'delhi' && !itemLoc.includes('delhi')) return false;
        if (filters.selectedState === 'madhya-pradesh' && !itemLoc.includes('madhya pradesh')) return false;
        if (filters.selectedState === 'maharashtra' && !itemLoc.includes('maharashtra')) return false;
        if (filters.selectedState === 'west-bengal' && !itemLoc.includes('west bengal')) return false;
        if (filters.selectedState === 'haryana' && !itemLoc.includes('haryana')) return false;
        if (filters.selectedState === 'punjab' && !itemLoc.includes('punjab')) return false;
        if (filters.selectedState === 'odisha' && !itemLoc.includes('odisha')) return false;
        if (filters.selectedState === 'gujarat' && !itemLoc.includes('gujarat')) return false;
        if (filters.selectedState === 'tamil-nadu' && !itemLoc.includes('tamil nadu')) return false;
      }

      // 4. Search Query Filter
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesOrg = item.organization.toLowerCase().includes(query);
        const matchesShort = item.shortTitle.toLowerCase().includes(query);
        const matchesQual = item.qualification.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);

        if (!matchesTitle && !matchesOrg && !matchesShort && !matchesQual && !matchesSummary) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Factual Sorting (Zero subjective scoring)
      if (filters.sortBy === 'deadline') {
        const dateA = a.importantDates.lastDate || '9999';
        const dateB = b.importantDates.lastDate || '9999';
        return dateA.localeCompare(dateB);
      }
      if (filters.sortBy === 'updated') {
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
      }
      // Default: Latest (by id, newest DB records first)
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [jobs, filters]);

  return (
    <div className="py-6">
      {/* Search and Filters Engine */}
      <JobSearchAndFilters
        filters={filters}
        onFilterChange={setFilters}
        totalResults={filteredJobs.length}
      />

      {/* Error State — Supabase fetch failed server-side */}
      {fetchError && (
        <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-amber-500/20 p-8 mb-6">
          <Info className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">Could not load live recruitment data</h3>
          <p className="text-zinc-500 text-sm">Database is temporarily unavailable. Please refresh the page to try again.</p>
        </div>
      )}

      {/* Empty State — no matching results */}
      {!fetchError && filteredJobs.length === 0 && (
        <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-white/5 p-8">
          <Info className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-1">No government recruitments match your filters</h3>
          <p className="text-zinc-500 text-sm mb-5">Try clearing your search query or choosing a broader sector/qualification.</p>
          <button
            onClick={() => setFilters({
              searchQuery: '',
              selectedSector: 'all',
              selectedQualification: 'all',
              selectedState: 'all',
              sortBy: 'latest',
            })}
            className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Job Cards Grid */}
      {!fetchError && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <UniversalJobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Free AI Career Verification Utility Banner */}
      <div className="mt-16 rounded-3xl p-8 sm:p-12 relative overflow-hidden glass border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Free AI Career Utility
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Not Sure If You Qualify for These Jobs? <br />
            <span className="gradient-text">Let AI Scan Your Resume &amp; Verify</span>
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
            Don&apos;t spend hours scrolling through 60-page bureaucratic PDFs trying to figure out if your degree, age, or passing year matches. Upload your details to HireOrbitAI, and our AI will automatically cross-check your profile against all active Central and State government notifications in 5 seconds.
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
  );
}
