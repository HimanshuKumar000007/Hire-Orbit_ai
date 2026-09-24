import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { UniversalRecruitmentNotice } from "@/lib/universal-notice-model";
import { GovJobNotification } from "@/lib/gov-jobs-data";
import { RecruitmentHero } from "./RecruitmentHero";
import { RecruitmentStatusCard } from "./RecruitmentStatusCard";
import { QuickFacts } from "./QuickFacts";
import { RecruitmentImportantDates } from "./RecruitmentImportantDates";
import { VacancyBreakdown } from "./VacancyBreakdown";
import { EligibilityPanel } from "./EligibilityPanel";
import { AgeLimitPanel } from "./AgeLimitPanel";
import { ApplicationFeePanel } from "./ApplicationFeePanel";
import { SalaryPanel } from "./SalaryPanel";
import { SelectionProcessPanel } from "./SelectionProcessPanel";
import { ExamPatternPanel } from "./ExamPatternPanel";
import { DocumentsRequiredPanel } from "./DocumentsRequiredPanel";
import { HowToApplyPanel } from "./HowToApplyPanel";
import { RecruitmentOfficialLinks } from "./RecruitmentOfficialLinks";
import { RecruitmentAdvisory } from "./RecruitmentAdvisory";
import { RecruitmentFAQ } from "./RecruitmentFAQ";
import { RelatedOpportunities } from "./RelatedOpportunities";

interface UniversalRecruitmentPageProps {
  notice: UniversalRecruitmentNotice;
  allNotices?: GovJobNotification[];
}

export function UniversalRecruitmentPage({ notice, allNotices = [] }: UniversalRecruitmentPageProps) {
  // Construct Google-compliant Structured Data
  const hasJobPostingRequirements = notice.title && notice.authority && notice.dates.applicationLastDate;

  const jobPostingSchema = hasJobPostingRequirements ? {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": notice.title,
    "description": notice.summary,
    "identifier": {
      "@type": "PropertyValue",
      "name": notice.authority,
      "value": notice.fingerprint
    },
    "datePosted": notice.publishedAt !== "Official Gazette Verified" ? notice.publishedAt : new Date().toISOString().split('T')[0],
    "validThrough": notice.dates.applicationLastDate,
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": notice.authority,
      "sameAs": notice.source.officialUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": notice.state
      }
    },
    "baseSalary": notice.salary?.payScale ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "unitText": "MONTH",
        "value": notice.salary.payScale
      }
    } : undefined
  } : null;

  const breadcrumbSchema = {
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
        "name": "Govt Newsroom",
        "item": "https://hireorbitai.in/gov"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": notice.shortTitle || notice.examName,
        "item": `https://hireorbitai.in/gov/${notice.slug}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 pt-16 lg:pt-20">
      <Navigation />

      {/* Structured Data Scripts */}
      {jobPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* A & B. Breadcrumb and Hero Header */}
      <RecruitmentHero notice={notice} />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* C. Current Recruitment Status Card */}
        <RecruitmentStatusCard notice={notice} />

        {/* D. Scannable Quick Facts Overview (Only verified fields) */}
        <QuickFacts facts={notice.quickFacts} />

        {/* E. Important Dates Timeline (No N/A clutter) */}
        <RecruitmentImportantDates dates={notice.dates} />

        {/* F & J. Official Vacancy Breakdown & Post-Wise Specs (Hidden if unknown/entrance) */}
        <VacancyBreakdown vacancy={notice.vacancy} />

        {/* G. Application Fee Structure (Hidden if unavailable) */}
        <ApplicationFeePanel fee={notice.fee} />

        {/* H. Educational Eligibility Criteria (Hidden if generic/missing) */}
        <EligibilityPanel eligibility={notice.eligibility} />

        {/* I. Age Limit & Relaxation (Hidden if unavailable) */}
        <AgeLimitPanel ageLimit={notice.ageLimit} />

        {/* K. Salary Structure & Pay Scale (Hidden if unavailable) */}
        <SalaryPanel salary={notice.salary} />

        {/* L. Selection Process & Assessment Stages (Hidden if unavailable) */}
        <SelectionProcessPanel stages={notice.selectionProcess} />

        {/* M. Official Examination Scheme & Pattern (Hidden if unavailable) */}
        <ExamPatternPanel examPattern={notice.examPattern} />

        {/* N. Documents Required Checklist */}
        <DocumentsRequiredPanel documents={notice.documentsRequired} />

        {/* O. How to Apply Online Steps */}
        <HowToApplyPanel steps={notice.howToApply} authority={notice.authority} />

        {/* P. Official Links Command Center (Verified Links Table) */}
        <RecruitmentOfficialLinks links={notice.links} authority={notice.authority} />

        {/* Q. Candidate Advisory & Commission Rules */}
        <RecruitmentAdvisory authority={notice.authority} />

        {/* R. Dynamic FAQs & Schema.org FAQPage */}
        <RecruitmentFAQ faqs={notice.faqs} examName={notice.examName} />

        {/* S. Related Opportunities (Dynamic Relational Matching) */}
        <RelatedOpportunities currentNotice={notice} allNotices={allNotices} />
      </div>

      <Footer />
    </main>
  );
}
