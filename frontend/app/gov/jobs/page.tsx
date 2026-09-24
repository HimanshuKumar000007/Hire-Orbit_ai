import type { Metadata } from 'next';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { LatestJobsListing } from "@/components/gov/jobs/LatestJobsListing";
import { ShieldCheck, Sparkles, Building2, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: "Latest Government Jobs 2026 (Apply Online) | HireOrbitAI Gov Desk",
  description: "Find newly released Central and State government recruitment notifications across India (SSC, Railways RRB, Banking, Police, UPSC). Verify eligibility with AI.",
  keywords: [
    "Latest Government Jobs 2026",
    "Sarkari Result 2026",
    "Sarkari Naukri",
    "SSC CGL 2026",
    "RRB NTPC Recruitment",
    "Railway Jobs 2026",
    "UP Police Recruitment",
    "Bank PO Jobs",
    "Apply Online Govt Jobs"
  ],
  openGraph: {
    title: "Latest Government Jobs 2026 | HireOrbitAI National Gov Desk",
    description: "Verified Central & State recruitment notifications with direct official links, post-wise vacancies, and eligibility criteria.",
    url: "https://hireorbitai.in/gov/jobs",
    siteName: "HireOrbitAI Government Careers",
    type: "website",
  },
  alternates: {
    canonical: "https://hireorbitai.in/gov/jobs",
  },
};

export default function LatestGovJobsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 pt-16 lg:pt-20">
      <Navigation />

      {/* Hero Header Section */}
      <section className="relative pt-12 pb-8 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/3 w-[600px] h-[250px] bg-emerald-500/10 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-20 right-10 w-[400px] h-[250px] bg-blue-500/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified National Recruitment Desk • Official Gazette Sourced
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Latest Government <span className="gradient-text">Jobs</span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Find newly released government recruitment notifications across India. Zero spam ads, 100% verified official portal links, exact vacancy breakdowns, and real-time application trackers.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 text-xs text-zinc-400 shrink-0">
              <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl">
                <div className="text-emerald-400 font-bold text-lg">100,000+</div>
                <div className="text-zinc-500">Active Posts Tracked</div>
              </div>
              <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl">
                <div className="text-blue-400 font-bold text-lg">100%</div>
                <div className="text-zinc-500">Official Portal Links</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LatestJobsListing />
        </div>
      </section>

      <Footer />
    </main>
  );
}
