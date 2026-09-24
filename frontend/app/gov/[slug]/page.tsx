import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabaseClient } from "@/lib/supabase";
import { 
  GOV_JOB_NOTIFICATIONS, 
  GovJobNotification 
} from "@/lib/gov-jobs-data";
import { 
  normalizeToUniversalNotice,
  normalizeToUniversalRecruitment,
  normalizeToUniversalResult
} from "@/lib/universal-notice-model";
import { UniversalAdmitCardPage } from "@/components/gov/admit-card/UniversalAdmitCardPage";
import { UniversalRecruitmentPage } from "@/components/gov/recruitment/UniversalRecruitmentPage";
import { UniversalResultPage } from "@/components/gov/result/UniversalResultPage";

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
  // Resolve common aliases to canonical slug
  let targetSlug = slug;
  if (slug === 'rrb-ntpc-inter-level-07-2026' || slug === 'rrb-ntpc-10-plus-2-2026') {
    targetSlug = 'rrb-ntpc-10-plus-2-inter-level-recruitment-2026';
  } else if (slug === 'ugc-net-admit-card-2026' || slug === 'ugc-net-2026-admit-card' || slug === 'ugc-net-june-2026-schedule-released-nta-to-conduct-exam-from-june-22-to-30-check') {
    targetSlug = 'ugc-net-admit-card-2026';
  }

  // 1. Prioritize Supabase live database for verified, structured data
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('gov_notifications')
      .select('*')
      .or(`slug.eq."${targetSlug}",id.eq."${targetSlug}",slug.eq."${slug}",id.eq."${slug}"`)
      .limit(1)
      .maybeSingle();

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
        updatedAt: 'Live Gazette Verified',
        isTrending: data.is_trending,
        isLeadStory: data.is_lead_story,
        categoryDistribution: data.category_distribution || undefined,
        postWiseDetails: data.post_wise_details || undefined,
        examPattern: data.exam_pattern || undefined,
        applicationInstructions: data.application_instructions || undefined,
        documentsRequired: data.documents_required || undefined,
      };
    }
  } catch (err) {
    console.warn("Using fallback static gov notification for slug:", slug, err);
  }

  // 2. Safe Fallback to static bootstrap data (ensures offline build & SSG never break)
  const staticJob = GOV_JOB_NOTIFICATIONS.find((j) => j.slug === targetSlug || j.id === targetSlug || j.slug === slug || j.id === slug);
  if (staticJob) return staticJob;

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

  const isResultNotice = job.type === 'result' || 
    /result|scorecard|merit list|cut off|cutoff|selection list/i.test(job.title);

  if (isResultNotice) {
    return {
      title: `${job.title} - Check Result, Scorecard, Cutoff Marks & Merit List | HireOrbitAI`,
      description: `${job.summary} Direct verified links to check ${job.title}, download scorecard, view category cutoff marks, and official merit list PDF.`,
      keywords: [
        job.title,
        job.shortTitle,
        job.organization,
        "Result 2026",
        "Scorecard Download",
        "Category Cutoff Marks",
        "Merit List PDF",
        "Sarkari Result 2026",
        "Official Commission Portal"
      ],
      openGraph: {
        title: `${job.title} | HireOrbitAI Result Desk`,
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

  const isAdmitNotice = job.type === 'admit-card' || 
    /admit card|hall ticket|call letter|city slip|city intimation|exam date|exam schedule|exam calendar|e-admit\b/i.test(job.title) ||
    /admit card|hall ticket|city slip|exam date/i.test(job.badgeStatus || "");

  if (isAdmitNotice) {
    return {
      title: `${job.title} - Download Hall Ticket, Exam Date & City Slip | HireOrbitAI`,
      description: `${job.summary} Download official admit card, check exam date, shift timings, hall guidelines, and verified portal link.`,
      keywords: [
        job.title,
        job.shortTitle,
        job.organization,
        "Admit Card 2026",
        "Hall Ticket Download",
        "Exam City Intimation Slip",
        "Sarkari Result Admit Card 2026",
        "Official Exam Schedule PDF"
      ],
      openGraph: {
        title: `${job.title} | HireOrbitAI Exam Desk`,
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

  const relatedJobs = GOV_JOB_NOTIFICATIONS.filter((j) => j.id !== job.id).slice(0, 3);

  // 🌟 UNIVERSAL RESULT / SCORECARD / MERIT LIST SYSTEM
  const isResultNotice = job.type === 'result' || 
    /result|scorecard|merit list|cut off|cutoff|selection list/i.test(job.title);

  if (isResultNotice) {
    const resultNotice = normalizeToUniversalResult(job);
    return <UniversalResultPage notice={resultNotice} allNotices={GOV_JOB_NOTIFICATIONS} />;
  }

  // 🌟 UNIVERSAL ADMIT CARD / EXAM SCHEDULE SYSTEM
  const isAdmitNotice = job.type === 'admit-card' || 
    /admit card|hall ticket|call letter|city slip|city intimation|exam date|exam schedule|exam calendar|e-admit\b/i.test(job.title) ||
    /admit card|hall ticket|city slip|exam date/i.test(job.badgeStatus || "");

  if (isAdmitNotice) {
    const universalNotice = normalizeToUniversalNotice(job);
    return <UniversalAdmitCardPage notice={universalNotice} relatedJobs={relatedJobs} />;
  }

  // 🌟 UNIVERSAL RECRUITMENT / LATEST JOBS SYSTEM
  const recruitmentNotice = normalizeToUniversalRecruitment(job);
  return <UniversalRecruitmentPage notice={recruitmentNotice} allNotices={GOV_JOB_NOTIFICATIONS} />;
}
