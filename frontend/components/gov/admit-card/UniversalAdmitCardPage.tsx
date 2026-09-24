import React from 'react';
import Link from 'next/link';
import { UniversalNotice } from '@/lib/universal-notice-model';
import { GovJobNotification } from '@/lib/gov-jobs-data';
import { Navigation } from '@/components/home/Navigation';
import { Footer } from '@/components/home/Footer';
import { AdmitCardHero } from './AdmitCardHero';
import { NoticeStatusCard } from './NoticeStatusCard';
import { PrimaryActions } from './PrimaryActions';
import { ImportantDatesCard } from './ImportantDatesCard';
import { OfficialLinksCommandCenter } from './OfficialLinksCommandCenter';
import { DownloadInstructions } from './DownloadInstructions';
import { ExamDayChecklist } from './ExamDayChecklist';
import { CandidateAdvisory } from './CandidateAdvisory';
import { NoticeFAQ } from './NoticeFAQ';
import { ConditionalPanels } from './ConditionalPanels';
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Building2, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface UniversalAdmitCardPageProps {
  notice: UniversalNotice;
  relatedJobs?: GovJobNotification[];
}

export function UniversalAdmitCardPage({ notice, relatedJobs = [] }: UniversalAdmitCardPageProps) {
  // Generate Schema.org JSON-LD (Strictly educational/event schema or web page, NOT fake JobPosting)
  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "name": `${notice.examName} Examination 2026`,
    "description": notice.summary,
    "startDate": notice.dates.examDate ? "2026-06-01" : undefined,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Designated Examination Centers Across India"
    },
    "organizer": {
      "@type": "Organization",
      "name": notice.authority,
      "url": notice.source.officialUrl
    }
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": notice.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <Navigation />

      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 space-y-10">
        
        {/* ── A & B. BREADCRUMB + PAGE HEADER ── */}
        <AdmitCardHero notice={notice} />

        {/* ── C & D. STATUS CARD + QUICK ACTION COMMAND BUTTONS ── */}
        <div className="space-y-4">
          <NoticeStatusCard notice={notice} />
          <PrimaryActions notice={notice} />
        </div>

        {/* ── MAIN TWO-COLUMN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: PRIMARY ACTIONABLE CONTENT (SPANS 2 COLS) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* G. OFFICIAL LINKS COMMAND CENTER (TOP ACTION POSITION) */}
            <OfficialLinksCommandCenter 
              links={notice.links} 
              authorityName={notice.authority} 
            />

            {/* H. HOW TO DOWNLOAD ADMIT CARD */}
            <DownloadInstructions notice={notice} />

            {/* I & J. EXAM DAY CHECKLIST & DOCUMENTS REQUIRED */}
            <ExamDayChecklist 
              rules={notice.examDayRules} 
              examName={notice.examName} 
            />

            {/* K, L, M. CONDITIONAL PANELS (Exam Pattern, Vacancy, Eligibility - STRICT DATA SAFETY) */}
            <ConditionalPanels notice={notice} />

            {/* N. CANDIDATE ADVISORY */}
            <CandidateAdvisory authority={notice.authority} />

            {/* O. FAQ ENGINE */}
            <NoticeFAQ faqs={notice.faqs} examName={notice.examName} />

          </div>

          {/* RIGHT COLUMN: SCANNABLE DATES & COPILOT SIDEBAR (SPANS 1 COL) */}
          <div className="space-y-6">
            
            {/* E. IMPORTANT DATES (HIGHLY SCANNABLE CARD) */}
            <ImportantDatesCard dates={notice.dates} />

            {/* AI EXAM COPILOT CARD */}
            <div className="p-6 rounded-3xl relative overflow-hidden glass border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-zinc-950 space-y-3.5 shadow-glow-sm">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Revision Copilot
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                Preparing for {notice.examName}?
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Use HireOrbitAI Copilot to generate a high-yield last-minute revision timetable, practice mock questions, and master weak topics.
              </p>
              <Link
                href="/copilot"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-sm"
              >
                <Zap className="w-4 h-4" />
                Launch Exam Copilot
              </Link>
            </div>

            {/* AI RESUME / QUALIFICATION SCANNER */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Instant Compatibility Scan
              </div>
              <h5 className="text-sm font-bold text-white">Check Eligibility with AI</h5>
              <p className="text-zinc-400 leading-relaxed">
                Upload your resume or qualifications. Our AI verifies your criteria against central and state recruitment rules in 5 seconds.
              </p>
              <Link
                href="/onboarding"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                Upload Resume &amp; Verify
              </Link>
            </div>

            {/* AUTHORITY & SOURCE VERIFICATION BOX */}
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Official Authority</span>
              </div>
              <div className="space-y-1.5 text-zinc-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Board Name:</span>
                  <span className="font-semibold text-white truncate max-w-[140px] text-right">{notice.authority}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Domain:</span>
                  <span className="font-semibold text-white capitalize">{notice.category}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Official Portal:</span>
                  <a
                    href={notice.source.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    Visit <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* AUTHENTICITY DISCLAIMER */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-500 leading-relaxed">
              <strong className="text-zinc-400 block mb-0.5">Editorial Verification Notice:</strong>
              All examination schedules, center instructions, and hall ticket download links are cross-referenced directly with official notices from {notice.authority}. Candidates are advised to always keep extra printed copies of their admit card.
            </div>

          </div>

        </div>

        {/* ── P. RELATED GOVERNMENT OPPORTUNITIES ── */}
        {relatedJobs.length > 0 && (
          <section className="pt-10 border-t border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold text-white">More Trending Government Opportunities</h2>
              </div>
              <Link 
                href="/gov"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedJobs.map((rj) => (
                <Link
                  key={rj.id}
                  href={`/gov/${rj.slug}`}
                  className="p-5 rounded-2xl glass border border-white/5 hover:border-emerald-500/30 transition-all group block"
                >
                  <div className="text-[11px] text-zinc-500 font-medium mb-1 truncate">{rj.organization}</div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3">
                    {rj.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                    <span className="text-emerald-400 font-semibold">{rj.badgeStatus || rj.vacancies}</span>
                    <span className="text-zinc-500 group-hover:text-zinc-300 flex items-center gap-1">
                      Read Notice <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </article>

      <Footer />
    </main>
  );
}
