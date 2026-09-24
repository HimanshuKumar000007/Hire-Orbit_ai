import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { UniversalResultNotice } from "@/lib/universal-notice-model";
import { GovJobNotification } from "@/lib/gov-jobs-data";
import { ResultHero } from "./ResultHero";
import { ResultStatusCard } from "./ResultStatusCard";
import { ResultPrimaryActions } from "./ResultPrimaryActions";
import { ResultQuickFacts } from "./ResultQuickFacts";
import { ResultImportantDates } from "./ResultImportantDates";
import { ResultDetailsPanel } from "./ResultDetailsPanel";
import { ScorecardPanel } from "./ScorecardPanel";
import { CutoffPanel } from "./CutoffPanel";
import { MeritListPanel } from "./MeritListPanel";
import { HowToCheckResult } from "./HowToCheckResult";
import { ResultCredentials } from "./ResultCredentials";
import { NextStagePanel } from "./NextStagePanel";
import { ResultOfficialLinks } from "./ResultOfficialLinks";
import { ResultAdvisory } from "./ResultAdvisory";
import { ResultFAQ } from "./ResultFAQ";
import { ResultRelatedOpportunities } from "./ResultRelatedOpportunities";

interface UniversalResultPageProps {
  notice: UniversalResultNotice;
  allNotices?: GovJobNotification[];
}

export function UniversalResultPage({ notice, allNotices = [] }: UniversalResultPageProps) {
  // Construct Google-compliant Structured Data (Results are WebPage/NewsArticle, NEVER JobPosting!)
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": notice.title,
    "description": notice.summary,
    "url": `https://hireorbitai.in/gov/${notice.slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "HireOrbitAI Government Intelligence Desk",
      "url": "https://hireorbitai.in",
      "logo": "https://hireorbitai.in/icon.png"
    },
    "about": {
      "@type": "EducationalOccupationalCredential",
      "name": notice.examName,
      "credentialCategory": "Government Examination Result"
    }
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* A & B. Breadcrumb and Hero Header */}
      <ResultHero notice={notice} />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* C. Current Result Status Card */}
        <ResultStatusCard notice={notice} />

        {/* D. Prominent Primary Actions (Check Result, Scorecard, Cutoff, Merit List) */}
        <ResultPrimaryActions notice={notice} />

        {/* E. Scannable Quick Facts Overview (Only verified fields) */}
        <ResultQuickFacts facts={notice.quickFacts} />

        {/* E. Important Dates Timeline (No N/A clutter) */}
        <ResultImportantDates dates={notice.dates} />

        {/* F. Official Result Breakdown & Format */}
        <ResultDetailsPanel details={notice.resultDetails} authority={notice.authority} />

        {/* G. Scorecard & Marks Login (Conditional: only if available) */}
        <ScorecardPanel scorecard={notice.scorecard} examName={notice.examName} />

        {/* H. Official Category Cutoff Marks (Conditional: only if released; never guess) */}
        <CutoffPanel cutoff={notice.cutoff} authority={notice.authority} />

        {/* I. Official Merit List PDF (Conditional: only if released) */}
        <MeritListPanel meritList={notice.meritList} examName={notice.examName} />

        {/* J. Step-by-Step How to Check Result */}
        <HowToCheckResult steps={notice.howToCheckSteps} authority={notice.authority} portalUrl={notice.source.officialUrl} />

        {/* K. Credentials Required to Check Result */}
        <ResultCredentials credentials={notice.credentials} authority={notice.authority} />

        {/* L. Next Stage & Further Process (Conditional: only if available) */}
        <NextStagePanel nextStage={notice.nextStage} examName={notice.examName} />

        {/* M. Official Links Command Center (Verified Links Table) */}
        <ResultOfficialLinks links={notice.links} authority={notice.authority} />

        {/* N. Candidate Advisory & Commission Rules */}
        <ResultAdvisory authority={notice.authority} />

        {/* O. Dynamic FAQs & Schema.org FAQPage */}
        <ResultFAQ faqs={notice.faqs} examName={notice.examName} />

        {/* P. Related Opportunities & Active Notices */}
        <ResultRelatedOpportunities currentNotice={notice} allNotices={allNotices} />
      </div>

      <Footer />
    </main>
  );
}
