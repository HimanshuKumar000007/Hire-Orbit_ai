import type { Metadata } from 'next';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { GovHubListing } from "@/components/gov/GovHubListing";
import { fetchGovNotifications } from "@/lib/gov-listing-data";
import { BREAKING_TICKER_ITEMS } from "@/lib/gov-jobs-data";
import { ShieldCheck, Radio } from 'lucide-react';

export const metadata: Metadata = {
  title: "Government Jobs, Admit Cards & Results 2026 | HireOrbitAI Gov Desk",
  description: "Zero clutter, zero spam. Authoritative government recruitment notifications, admit card trackers, answer keys, and exam results for 100M+ Indian aspirants.",
  openGraph: {
    title: "Government Careers Newsroom | HireOrbitAI",
    description: "Official Central & State recruitment notifications, admit cards, results, and answer keys — all in one place.",
    url: "https://hireorbitai.in/gov",
    siteName: "HireOrbitAI Government Careers",
    type: "website",
  },
  alternates: {
    canonical: "https://hireorbitai.in/gov",
  },
};

// Force dynamic rendering so every request hits live Supabase data.
// This page must NOT be statically generated at build time.
export const dynamic = "force-dynamic";

/**
 * Async Server Component — fetches CURRENT notices from Supabase before rendering HTML.
 * The initial HTML sent to the browser already contains the latest database records.
 * No client-side stale data, no delayed replacement.
 *
 * Static sections (hero, ticker) are rendered server-side.
 * Interactive sections (filters, tabs, grid) are delegated to GovHubListing (client component).
 */
export default async function GovJobsPage() {
  // Fetch all current notices (all types) server-side.
  // fetchGovNotifications returns [] on error — never a static array.
  const initialNotifications = await fetchGovNotifications();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 pt-16 lg:pt-20">
      <Navigation />

      {/* Breaking News Ticker */}
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

          {/* Interactive hub (lead story + tabs + filters + grid) — client component */}
          <GovHubListing initialNotifications={initialNotifications} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
