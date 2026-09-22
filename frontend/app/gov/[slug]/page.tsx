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
import { getEnrichedJobDetails } from "@/lib/gov-job-details";
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
  Send,
  HelpCircle,
  Activity,
  FileCheck,
  ListOrdered,
  Users,
  BookOpen,
  Info
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

  const enriched = getEnrichedJobDetails(job);

  return {
    title: `${job.title} - Notification, Syllabus, Eligibility & Apply Online | HireOrbitAI`,
    description: `${job.summary} Complete post-wise vacancy breakdown, category-wise reservation, eligibility criteria, exam pattern, syllabus, and official apply online link.`,
    keywords: [
      job.title,
      job.shortTitle,
      job.organization,
      "Sarkari Result 2026",
      "Sarkari Naukri 2026",
      `${job.shortTitle} syllabus`,
      `${job.shortTitle} eligibility`,
      `${job.shortTitle} post wise vacancy`,
      `${job.shortTitle} apply online`,
      "Official Gazette Notification PDF"
    ],
    openGraph: {
      title: `${job.title} | HireOrbitAI Gov Newsroom`,
      description: job.summary,
      url: `https://hireorbitai.in/gov/${job.slug}`,
      siteName: "HireOrbitAI Government Careers",
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

  const enriched = getEnrichedJobDetails(job);
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
  const shareText = `🚨 *${job.title}*\nTotal Vacancies: ${job.vacancies}\nEligibility: ${job.qualification}\nCheck full post-wise details, syllabus & apply here: ${shareUrl}`;

  // Schema.org JobPosting, FAQPage & BreadcrumbList JSON-LD
  const jsonLdJobPosting = {
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

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": enriched.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hireorbitai.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Government Jobs Newsroom",
        "item": "https://hireorbitai.in/gov"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": job.shortTitle,
        "item": `https://hireorbitai.in/gov/${job.slug}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 pt-16 lg:pt-20">
      {/* Google Structured Data (SEO Dominance) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdJobPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Navigation />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-zinc-900/60 border-b border-white/5 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-zinc-400">
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
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
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

        {/* Primary Action Bar (Top) */}
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

        {/* 🌟 1. POST-WISE & DEPARTMENT-WISE VACANCY BREAKDOWN TABLE (Better than Sarkari Result) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" /> Complete Post Hierarchy
              </div>
              <h3 className="text-2xl font-bold text-white">Post-Wise Vacancy &amp; Eligibility Breakdown</h3>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-zinc-400 border border-white/10">
              {enriched.postWiseDetails.length} Distinct Positions
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 glass">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/10 text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Post Name</th>
                  <th className="py-3.5 px-4">Department / Ministry</th>
                  <th className="py-3.5 px-4">Age Limit</th>
                  <th className="py-3.5 px-4">Pay Scale</th>
                  <th className="py-3.5 px-4 sm:px-6">Eligibility Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {enriched.postWiseDetails.map((post, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span>{post.postName}</span>
                      </div>
                      {post.classification && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {post.classification}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-zinc-300 font-medium">{post.department || job.organization}</td>
                    <td className="py-4 px-4 text-emerald-400 font-semibold">{post.ageLimit}</td>
                    <td className="py-4 px-4 text-zinc-300 text-xs">{post.payScale || job.payScale}</td>
                    <td className="py-4 px-4 sm:px-6 text-zinc-300 max-w-xs">{post.qualification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 🌟 2. CATEGORY-WISE RESERVATION DISTRIBUTION */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" /> Category-Wise Reservation Matrix
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Official Category Vacancy Distribution</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 text-center">
              <span className="text-xs text-zinc-400 font-medium block mb-1">General (UR)</span>
              <span className="text-lg sm:text-xl font-bold text-white">{enriched.categoryDistribution.ur}</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 text-center">
              <span className="text-xs text-zinc-400 font-medium block mb-1">OBC</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">{enriched.categoryDistribution.obc}</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 text-center">
              <span className="text-xs text-zinc-400 font-medium block mb-1">EWS</span>
              <span className="text-lg sm:text-xl font-bold text-blue-400">{enriched.categoryDistribution.ews}</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 text-center">
              <span className="text-xs text-zinc-400 font-medium block mb-1">SC</span>
              <span className="text-lg sm:text-xl font-bold text-amber-400">{enriched.categoryDistribution.sc}</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 text-center">
              <span className="text-xs text-zinc-400 font-medium block mb-1">ST</span>
              <span className="text-lg sm:text-xl font-bold text-purple-400">{enriched.categoryDistribution.st}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-400 font-bold block mb-1">Total Posts</span>
              <span className="text-lg sm:text-xl font-black text-white">{enriched.categoryDistribution.total}</span>
            </div>
          </div>
        </section>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column (Exam Pattern + Qualification + Steps) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 🌟 3. EXAM PATTERN & SYLLABUS MATRIX */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Comprehensive Examination Scheme
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Exam Pattern &amp; Marks Distribution</h3>
                <p className="text-xs text-zinc-400">Subject-wise question weightage, maximum marks, and duration structure.</p>
              </div>

              <div className="space-y-6">
                {enriched.examPatterns.map((tier, tIdx) => (
                  <div key={tIdx} className="rounded-2xl border border-white/5 bg-zinc-950/60 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
                      <div>
                        <h4 className="text-base font-bold text-white">{tier.tierName}</h4>
                        <span className="text-xs text-zinc-400 font-medium">{tier.mode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded bg-white/5 text-zinc-300 font-medium border border-white/5">
                          Duration: {tier.duration}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-medium border border-red-500/20">
                          Penalty: {tier.negativeMarking}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-zinc-500 border-b border-white/5 font-semibold">
                            <th className="py-2">Subject / Section</th>
                            <th className="py-2 text-center">Questions</th>
                            <th className="py-2 text-right">Max Marks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-zinc-300">
                          {tier.subjects.map((sub, sIdx) => (
                            <tr key={sIdx}>
                              <td className="py-2.5 font-medium text-white">{sub.name}</td>
                              <td className="py-2.5 text-center text-zinc-400">{sub.questions}</td>
                              <td className="py-2.5 text-right font-bold text-emerald-400">{sub.marks}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-white/10 font-bold text-white">
                            <td className="py-2.5">Total Scheme Weightage</td>
                            <td className="py-2.5 text-center text-zinc-200">{tier.totalQuestions}</td>
                            <td className="py-2.5 text-right text-emerald-400">{tier.totalMarks}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🌟 4. PHYSICAL STANDARDS (IF APPLICABLE) */}
            {enriched.physicalStandards && (
              <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" /> Physical Standards &amp; Endurance (PST / PET)
                </div>
                <h3 className="text-xl font-bold text-white">Physical Standard Test &amp; Fitness Test Criteria</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Male Standards */}
                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2 text-xs">
                    <span className="font-bold text-emerald-400 text-sm block">Male Candidates Criteria</span>
                    {enriched.physicalStandards.maleHeight && (
                      <div className="flex justify-between border-b border-white/5 py-1.5">
                        <span className="text-zinc-400">Minimum Height:</span>
                        <span className="font-semibold text-white">{enriched.physicalStandards.maleHeight}</span>
                      </div>
                    )}
                    {enriched.physicalStandards.maleChest && (
                      <div className="flex justify-between border-b border-white/5 py-1.5">
                        <span className="text-zinc-400">Chest Measurement:</span>
                        <span className="font-semibold text-white">{enriched.physicalStandards.maleChest}</span>
                      </div>
                    )}
                    {enriched.physicalStandards.malePhysicalTest && (
                      <div className="pt-1 text-zinc-300">
                        <span className="text-zinc-400 block mb-0.5">Physical Endurance:</span>
                        <span className="font-medium text-white">{enriched.physicalStandards.malePhysicalTest}</span>
                      </div>
                    )}
                  </div>

                  {/* Female Standards */}
                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2 text-xs">
                    <span className="font-bold text-blue-400 text-sm block">Female Candidates Criteria</span>
                    {enriched.physicalStandards.femaleHeight && (
                      <div className="flex justify-between border-b border-white/5 py-1.5">
                        <span className="text-zinc-400">Minimum Height:</span>
                        <span className="font-semibold text-white">{enriched.physicalStandards.femaleHeight}</span>
                      </div>
                    )}
                    {enriched.physicalStandards.femaleChest && (
                      <div className="flex justify-between border-b border-white/5 py-1.5">
                        <span className="text-zinc-400">Weight Standard:</span>
                        <span className="font-semibold text-white">{enriched.physicalStandards.femaleChest}</span>
                      </div>
                    )}
                    {enriched.physicalStandards.femalePhysicalTest && (
                      <div className="pt-1 text-zinc-300">
                        <span className="text-zinc-400 block mb-0.5">Physical Endurance:</span>
                        <span className="font-medium text-white">{enriched.physicalStandards.femalePhysicalTest}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 🌟 5. STEP-BY-STEP HOW TO APPLY ONLINE GUIDE */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ListOrdered className="w-4 h-4" /> Step-by-Step Candidate Instructions
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">How to Fill Online Application Form</h3>
              
              <div className="space-y-3 pt-2">
                {enriched.applicationSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 flex items-start gap-3 text-xs sm:text-sm text-zinc-200">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🌟 6. USEFUL IMPORTANT LINKS TABLE (Sarkari Result Style Command Center) */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <FileCheck className="w-4 h-4" /> Official Gazette Access
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Some Useful Important Links</h3>

              <div className="overflow-hidden rounded-2xl border border-white/10 divide-y divide-white/10 bg-zinc-950/60">
                {enriched.usefulLinks.map((link, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{link.title}</span>
                        {link.badge && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStyle(link.badgeColor || 'emerald')}`}>
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{link.description}</p>
                    </div>

                    {link.isExternal ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-zinc-950 text-white text-xs font-bold transition-all shrink-0 border border-white/10"
                      >
                        Click Here <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link
                        href={link.url}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-xs font-bold transition-all shrink-0 shadow-glow-sm"
                      >
                        Verify with AI <Sparkles className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 🌟 7. FREQUENTLY ASKED QUESTIONS (FAQ with Google FAQ Schema) */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions (FAQ)</h3>

              <div className="space-y-3 pt-2">
                {enriched.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2">
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">Q{fIdx + 1}.</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Deadlines + AI Scanner Bridge + Copilot + Disclaimer) */}
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
              <p className="text-xs text-zinc-400 leading-relaxed">
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

            {/* Age Relaxation Breakdown Matrix */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3 text-xs">
              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Category Age Relaxation
              </h5>
              <div className="space-y-2 text-zinc-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">SC / ST Candidates:</span>
                  <span className="font-semibold text-emerald-400">+5 Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">OBC (Non-Creamy):</span>
                  <span className="font-semibold text-emerald-400">+3 Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">PwBD (General / EWS):</span>
                  <span className="font-semibold text-blue-400">+10 Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">PwBD (OBC):</span>
                  <span className="font-semibold text-blue-400">+13 Years</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">PwBD (SC / ST):</span>
                  <span className="font-semibold text-blue-400">+15 Years</span>
                </div>
              </div>
            </div>

            {/* Official Gazette Disclaimer */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-500 leading-relaxed">
              <span className="font-semibold text-zinc-400 block mb-1">Authenticity &amp; Editorial Disclaimer:</span>
              All examination notices, syllabus patterns, and cutoff details are cross-referenced with official gazettes from government recruitment boards ({job.organization}). For official registration and payments, always rely solely on the official government website.
            </div>

          </div>

        </div>

        {/* More Trending Opportunities Grid */}
        <section className="pt-10 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
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
                  <span className="text-emerald-400 font-semibold">{rj.vacancies}</span>
                  <span className="text-zinc-500 group-hover:text-zinc-300 flex items-center gap-1">
                    Read Notice <ArrowRight className="w-3 h-3" />
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
