import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { getSupabaseClient } from "@/lib/supabase";
import { 
  GOV_JOB_NOTIFICATIONS, 
  GovJobNotification 
} from "@/lib/gov-jobs-data";
import { 
  Building2, 
  Calendar, 
  Clock, 
  Award, 
  GraduationCap, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Zap, 
  ArrowRight, 
  Layers, 
  ChevronRight, 
  Share2, 
  Sparkles,
  ArrowLeft,
  FileText,
  TrendingUp,
  MapPin,
  Flame,
  Check,
  Send
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return GOV_JOB_NOTIFICATIONS.map((job) => ({
    slug: job.slug,
  }));
}

async function getJobBySlug(slug: string): Promise<GovJobNotification | null> {
  // Check static data first
  const staticJob = GOV_JOB_NOTIFICATIONS.find((j) => j.slug === slug);
  if (staticJob) return staticJob;

  // Fallback to Supabase live database
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('gov_notifications')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        shortTitle: data.short_title || data.title,
        organization: data.organization,
        category: data.category,
        type: data.type,
        badgeStatus: data.badge_status,
        badgeColor: data.badge_color,
        vacancies: data.vacancies,
        qualification: data.qualification,
        qualificationLevel: data.qualification_level,
        ageLimit: data.age_limit,
        payScale: data.pay_scale,
        applicationFee: data.application_fee || {},
        importantDates: data.important_dates || {},
        location: data.location,
        summary: data.summary,
        keyHighlights: data.key_highlights || [],
        selectionProcess: data.selection_process || [],
        officialPdfUrl: data.official_pdf_url,
        applyUrl: data.apply_url,
        updatedAt: 'Official Gazette Verified',
        isTrending: data.is_trending,
        isLeadStory: data.is_lead_story,
      };
    }
  } catch (err) {
    console.warn("Failed to fetch job from Supabase:", err);
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Government Job Notification | HireOrbitAI Gov Desk",
    };
  }

  return {
    title: `${job.title} | HireOrbitAI Gov Desk`,
    description: `${job.summary} Eligibility: ${job.qualification}. Age: ${job.ageLimit}. Vacancies: ${job.vacancies}. Apply online via official portal.`,
    keywords: [
      job.title,
      job.shortTitle,
      job.organization,
      "Sarkari Result 2026",
      "Sarkari Naukri",
      "Eligibility Criteria",
      "Apply Online Link"
    ],
    openGraph: {
      title: `${job.title} | HireOrbitAI`,
      description: job.summary,
      url: `https://hireorbitai.in/gov/${job.slug}`,
      siteName: "HireOrbitAI Gov Desk",
      type: "article",
    },
    alternates: {
      canonical: `https://hireorbitai.in/gov/${job.slug}`,
    },
  };
}

export default async function GovJobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const relatedJobs = GOV_JOB_NOTIFICATIONS.filter((j) => j.id !== job.id).slice(0, 3);

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-white/10 text-zinc-300 border-white/10';
    }
  };

  const shareUrl = `https://hireorbitai.in/gov/${job.slug}`;
  const shareText = `🚨 *${job.title}*\nTotal Vacancies: ${job.vacancies}\nEligibility: ${job.qualification}\nCheck full notification & apply here: ${shareUrl}`;

  // Schema.org JobPosting & NewsArticle JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.summary,
    "datePosted": "2026-04-01T00:00:00+05:30",
    "validThrough": job.importantDates.lastDate ? "2026-06-30T23:59:59+05:30" : undefined,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization,
      "sameAs": job.officialPdfUrl,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressLocality": job.location,
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "unitText": "MONTH",
        "value": job.payScale,
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "India"
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 pt-16 lg:pt-20">
      {/* Google Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-zinc-900/60 border-b border-white/5 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <Link href="/gov" className="hover:text-white transition-colors">Govt Newsroom</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span className="text-zinc-200 font-medium truncate">{job.shortTitle}</span>
          </div>

          <Link 
            href="/gov" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold shrink-0 transition-colors border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Newsroom
          </Link>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(job.badgeColor)}`}>
                {job.badgeStatus}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-zinc-300">{job.organization}</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Official Gazette Verified</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{job.updatedAt}</span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20 transition-all"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3 h-3" /> WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(job.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5 border border-blue-500/20 transition-all"
                title="Share on Telegram"
              >
                <Send className="w-3 h-3" /> Telegram
              </a>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {job.title}
          </h1>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-zinc-300 text-sm sm:text-base leading-relaxed">
            {job.summary}
          </div>
        </header>

        {/* Quick Spec Matrix */}
        <section className="py-8">
          <h2 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-4 flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-emerald-400" /> Key Recruitment Specifications
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5">
              <div className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Vacancies
              </div>
              <div className="text-white font-bold text-sm sm:text-base">{job.vacancies}</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5">
              <div className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Pay Scale
              </div>
              <div className="text-emerald-400 font-bold text-xs sm:text-sm truncate" title={job.payScale}>
                {job.payScale}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5">
              <div className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Age Bracket
              </div>
              <div className="text-white font-bold text-xs sm:text-sm">{job.ageLimit}</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5">
              <div className="text-zinc-500 text-xs mb-1">Gen / OBC Fee</div>
              <div className="text-white font-bold text-sm">{job.applicationFee.generalOBC}</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5">
              <div className="text-zinc-500 text-xs mb-1">SC / ST / PH</div>
              <div className="text-emerald-400 font-bold text-sm">{job.applicationFee.scStPh}</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5">
              <div className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location
              </div>
              <div className="text-white font-bold text-xs truncate" title={job.location}>
                {job.location}
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar (Top) */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-10">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-glow-sm"
          >
            Official Online Apply Portal
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={job.officialPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <Download className="w-4 h-4" />
            Download Official PDF
          </a>

          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-emerald-500/20"
          >
            <Zap className="w-4 h-4" />
            Scan My Resume with AI
          </Link>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column (Important Dates + Highlights + Selection) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Qualification & Eligibility Breakdown */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" /> Educational Qualification &amp; Eligibility
              </div>
              <h3 className="text-xl font-bold text-white">Minimum Academic Requirements</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {job.qualification}
              </p>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 text-xs text-zinc-400 space-y-2">
                <div>• Candidates appearing in final semester/year must meet eligibility cut-off date as per the gazette.</div>
                <div>• Category Age Relaxation: SC/ST (5 yrs), OBC (3 yrs), PwBD (10 yrs), Ex-Servicemen as per central norms.</div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" /> Crucial Exam Highlights
              </div>
              <h3 className="text-xl font-bold text-white">What Every Candidate Must Know</h3>
              <ul className="space-y-2.5 text-sm text-zinc-300">
                {job.keyHighlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selection Stages */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" /> Selection Process Stages
              </div>
              <h3 className="text-xl font-bold text-white">Step-by-Step Examination Stages</h3>
              <div className="space-y-3">
                {job.selectionProcess.map((step, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center gap-3 text-sm text-zinc-200">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Dates + AI Conversion Card + Quick Links) */}
          <div className="space-y-6">
            
            {/* Important Dates Card */}
            <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> Important Dates
              </div>
              <h4 className="text-base font-bold text-white">Deadlines &amp; Schedule</h4>
              
              <div className="space-y-2.5 text-xs">
                {job.importantDates.startDate && (
                  <div className="p-3 rounded-xl bg-zinc-950/60 flex justify-between items-center">
                    <span className="text-zinc-400">Applications Open:</span>
                    <span className="text-white font-semibold">{job.importantDates.startDate}</span>
                  </div>
                )}
                {job.importantDates.lastDate && (
                  <div className="p-3 rounded-xl bg-zinc-950/60 flex justify-between items-center border border-amber-500/20">
                    <span className="text-zinc-400">Closing Date:</span>
                    <span className="text-amber-400 font-bold">{job.importantDates.lastDate}</span>
                  </div>
                )}
                {job.importantDates.examDate && (
                  <div className="p-3 rounded-xl bg-zinc-950/60 flex justify-between items-center border border-blue-500/20">
                    <span className="text-zinc-400">Exam Window:</span>
                    <span className="text-blue-400 font-bold">{job.importantDates.examDate}</span>
                  </div>
                )}
                {job.importantDates.resultDate && (
                  <div className="p-3 rounded-xl bg-zinc-950/60 flex justify-between items-center border border-emerald-500/20">
                    <span className="text-zinc-400">Result Date:</span>
                    <span className="text-emerald-400 font-bold">{job.importantDates.resultDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Resume Matcher Box */}
            <div className="rounded-3xl p-6 relative overflow-hidden glass border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-zinc-950 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Compatibility Scanner
              </div>
              <h4 className="text-lg font-bold text-white leading-snug">
                Am I Eligible for {job.shortTitle}?
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Upload your resume or enter your degree &amp; birth year. HireOrbitAI scans your details in 5 seconds to verify if you qualify for this recruitment.
              </p>
              <Link
                href="/onboarding"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-sm"
              >
                <FileText className="w-4 h-4" />
                Upload Resume &amp; Verify Now
              </Link>
            </div>

            {/* AI Exam Copilot Box */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3">
              <div className="text-xs text-zinc-400 font-medium">Preparing for this exam?</div>
              <h5 className="text-sm font-bold text-white">Generate 60-Day Study Plan with AI</h5>
              <p className="text-xs text-zinc-400">
                Use HireOrbitAI Copilot to break down the official syllabus, generate mock questions, and master tough topics.
              </p>
              <Link
                href="/copilot"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Open AI Exam Copilot
              </Link>
            </div>

          </div>
        </div>

        {/* Trending / Related Govt Jobs */}
        <section className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              More Trending Government Opportunities
            </h3>
            <Link href="/gov" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedJobs.map((rj) => (
              <Link
                key={rj.id}
                href={`/gov/${rj.slug}`}
                className="glass p-5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium mb-1 truncate">{rj.organization}</div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                    {rj.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-white/5">
                  <span className="text-emerald-400 font-bold">{rj.vacancies}</span>
                  <span className="text-zinc-500 flex items-center gap-0.5">
                    Read Notice <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </article>

      <Footer />
    </main>
  );
}
