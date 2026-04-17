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
