export interface User {
  name: string;
  role: string;
  avatar?: string;
  skills?: string[];
  experience?: string;
}

export interface MatchScore {
  score: number;
  label: string;
  improvement: number;
}

export interface AIInsight {
  title: string;
  message: string;
  action: string;
  impact: string;
  highlightedWords: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: 'matched' | 'missing' | 'suggested';
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  matchScore: number;
  matchLabel: 'strong' | 'good' | 'weak';
  matchedSkills: string[];
  missingSkills: string[];
  postedAt: string;
  job_apply_link?: string;
  redirect_url?: string;
}

export interface ImprovementAction {
  id: string;
  title: string;
  description: string;
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
}

export interface WeeklyPlan {
  day: number;
  title: string;
  tasks: string[];
  completed: boolean;
}

export interface DashboardData {
  user: User;
  matchScore: MatchScore;
  aiInsight: AIInsight;
  jobMatches: JobMatch[];
  improvements: ImprovementAction[];
  weeklyPlan: WeeklyPlan[];
  skills: Skill[];
}

export interface TableOfContentItem {
  id: string;
  title: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: string;
  readTime: string;
  category: "Resume & ATS" | "Interview Prep" | "AI & Tech" | "Career Growth";
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  seoKeywords: string[];
  gradient: string;
  tableOfContents: TableOfContentItem[];
  faq: FAQItem[];
  cta: {
    headline: string;
    subheadline: string;
    buttonText: string;
    buttonLink: string;
  };
  content: string;
}

