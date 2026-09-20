import { BlogPost, TableOfContentItem, FAQItem } from "./types";
export type { BlogPost, TableOfContentItem, FAQItem };

import { atsResumeOptimizationGuide2026 } from "./blog-content/ats-resume-optimization-guide-2026";
import { masteringStarMethodTechInterviews } from "./blog-content/mastering-star-method-tech-interviews";
import { semanticJobSearchVsKeywordMatching } from "./blog-content/semantic-job-search-vs-keyword-matching";
import { tailorResumeForMultipleJobsFast } from "./blog-content/tailor-resume-for-multiple-jobs-fast";
import { techSalaryNegotiationPlaybook2026 } from "./blog-content/tech-salary-negotiation-playbook-2026";
import { careerSwitchToAiMachineLearningRoadmap } from "./blog-content/career-switch-to-ai-machine-learning-roadmap";
import { highImpactSoftwareEngineerPortfolio } from "./blog-content/high-impact-software-engineer-portfolio";
import { beatHiringFreezeAndGhostingStrategies } from "./blog-content/beat-hiring-freeze-and-ghosting-strategies";
import { systemDesignInterviewCheatSheet } from "./blog-content/system-design-interview-cheat-sheet";
import { riseOfAiCareerCopilotFutureOfWork } from "./blog-content/rise-of-ai-career-copilot-future-of-work";
import { howAiIsRevolutionizingSemanticJobMatching } from "./blog-content/how-ai-is-revolutionizing-semantic-job-matching";
import { tenSkillsEveryFrontendDeveloperNeedsIn2024 } from "./blog-content/10-skills-every-frontend-developer-needs-in-2024";
import { understandingAtsWhyYourResumeMightBeGettingFiltered } from "./blog-content/understanding-ats-why-your-resume-might-be-getting-filtered";
import { thePowerOfNetworkingInTheAgeOfRemoteWork } from "./blog-content/the-power-of-networking-in-the-age-of-remote-work";
import { howToUseChatGptToWriteAnAtsResumePrompts } from "./blog-content/how-to-use-chatgpt-to-write-an-ats-resume-prompts";
import { whyFindingJobsOnLinkedinIsDeadHireorbitAi } from "./blog-content/why-finding-jobs-on-linkedin-is-dead-hireorbit-ai";
import { latestGovtJobsIndia2026RecruitmentGuide } from "./blog-content/latest-govt-jobs-india-2026-recruitment-guide";

export const BLOG_POSTS: BlogPost[] = [
  // High-Converting Growth & Search Guides (Live Today)
  latestGovtJobsIndia2026RecruitmentGuide,
  whyFindingJobsOnLinkedinIsDeadHireorbitAi,
  howToUseChatGptToWriteAnAtsResumePrompts,

  // Scheduled 10-Day Series
  atsResumeOptimizationGuide2026,            // Day 1 - Live Today (Sep 20, 2026)
  masteringStarMethodTechInterviews,          // Day 2 - Sep 21, 2026
  semanticJobSearchVsKeywordMatching,         // Day 3 - Sep 22, 2026
  tailorResumeForMultipleJobsFast,            // Day 4 - Sep 23, 2026
  techSalaryNegotiationPlaybook2026,          // Day 5 - Sep 24, 2026
  careerSwitchToAiMachineLearningRoadmap,     // Day 6 - Sep 25, 2026
  highImpactSoftwareEngineerPortfolio,        // Day 7 - Sep 26, 2026
  beatHiringFreezeAndGhostingStrategies,      // Day 8 - Sep 27, 2026
  systemDesignInterviewCheatSheet,            // Day 9 - Sep 28, 2026
  riseOfAiCareerCopilotFutureOfWork,          // Day 10 - Sep 29, 2026

  // Live Comprehensive Product Guides (4 Homepage Cards)
  howAiIsRevolutionizingSemanticJobMatching,
  tenSkillsEveryFrontendDeveloperNeedsIn2024,
  understandingAtsWhyYourResumeMightBeGettingFiltered,
  thePowerOfNetworkingInTheAgeOfRemoteWork,
];

/**
 * Filter all posts that are published as of the current time.
 * If includePreview is true (e.g. ?preview=true), all 14 articles are returned.
 */
export function getPublishedPosts(includePreview = false): BlogPost[] {
  if (includePreview) {
    return [...BLOG_POSTS].sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
  }

  const now = new Date();
  return BLOG_POSTS.filter((post) => new Date(post.publishedAt) <= now).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Retrieve a specific blog post by slug.
 * Checks publishDate unless includePreview is set.
 */
export function getPostBySlug(slug: string, includePreview = false): BlogPost | undefined {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return undefined;

  if (includePreview) return post;

  const now = new Date();
  if (new Date(post.publishedAt) <= now) {
    return post;
  }

  return undefined;
}

/**
 * Get upcoming scheduled posts that have not yet reached their release date.
 */
export function getUpcomingPosts(): BlogPost[] {
  const now = new Date();
  return BLOG_POSTS.filter((post) => new Date(post.publishedAt) > now).sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
}

/**
 * Get related posts for a given blog post.
 */
export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  const published = getPublishedPosts();
  return published
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => (a.category === category ? -1 : 1))
    .slice(0, limit);
}

/**
 * Get all posts regardless of date (for sitemaps / admin / indexing).
 */
export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS];
}
