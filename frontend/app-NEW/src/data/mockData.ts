import type { DashboardData } from '@/types';

export const mockDashboardData: DashboardData = {
  user: {
    name: 'Alex Chen',
    role: 'Electrical Engineer',
  },
  matchScore: {
    score: 65,
    label: 'Your Profile Strength',
    improvement: 15,
  },
  aiInsight: {
    title: '🧠 AI Insight',
    message: 'You are strong in MATLAB but missing PLC programming skills',
    action: 'Add PLC certification',
    impact: '+18% match increase',
    highlightedWords: ['MATLAB', 'PLC'],
  },
  skills: [
    { name: 'MATLAB', level: 90, category: 'matched' },
    { name: 'Circuit Design', level: 85, category: 'matched' },
    { name: 'AutoCAD', level: 75, category: 'matched' },
    { name: 'PLC Programming', level: 0, category: 'missing' },
    { name: 'SCADA Systems', level: 0, category: 'missing' },
    { name: 'Python', level: 40, category: 'suggested' },
  ],
  jobMatches: [
    {
      id: '1',
      title: 'Senior Electrical Engineer',
      company: 'Tesla',
      location: 'Austin, TX',
      salary: '$120k - $160k',
      matchScore: 92,
      matchLabel: 'strong',
      matchedSkills: ['MATLAB', 'Circuit Design', 'AutoCAD', 'Power Systems'],
      missingSkills: ['PLC'],
      postedAt: '2 days ago',
    },
    {
      id: '2',
      title: 'Electrical Design Engineer',
      company: 'Siemens',
      location: 'Remote',
      salary: '$95k - $125k',
      matchScore: 78,
      matchLabel: 'good',
      matchedSkills: ['MATLAB', 'Circuit Design', 'AutoCAD'],
      missingSkills: ['PLC', 'SCADA'],
      postedAt: '3 days ago',
    },
    {
      id: '3',
      title: 'Controls Engineer',
      company: 'Boeing',
      location: 'Seattle, WA',
      salary: '$110k - $145k',
      matchScore: 58,
      matchLabel: 'weak',
      matchedSkills: ['MATLAB', 'Circuit Design'],
      missingSkills: ['PLC', 'SCADA', 'HMI Design', 'Ladder Logic'],
      postedAt: '1 week ago',
    },
    {
      id: '4',
      title: 'Power Systems Engineer',
      company: 'General Electric',
      location: 'Boston, MA',
      salary: '$105k - $140k',
      matchScore: 85,
      matchLabel: 'good',
      matchedSkills: ['MATLAB', 'Power Systems', 'Circuit Design', 'AutoCAD'],
      missingSkills: ['ETAP'],
      postedAt: '5 days ago',
    },
  ],
  improvements: [
    {
      id: '1',
      title: 'Learn PLC Programming',
      description: 'Complete Siemens PLC certification course',
      impact: '+18% match',
      difficulty: 'medium',
      timeEstimate: '4 weeks',
    },
    {
      id: '2',
      title: 'Add SCADA Experience',
      description: 'Learn Wonderware or Ignition SCADA systems',
      impact: '+12% match',
      difficulty: 'medium',
      timeEstimate: '3 weeks',
    },
    {
      id: '3',
      title: 'Python for Automation',
      description: 'Learn Python scripting for test automation',
      impact: '+8% match',
      difficulty: 'easy',
      timeEstimate: '2 weeks',
    },
  ],
  weeklyPlan: [
    {
      day: 1,
      title: 'Foundation',
      tasks: ['Complete PLC basics module', 'Practice ladder logic exercises'],
      completed: true,
    },
    {
      day: 2,
      title: 'Hands-on',
      tasks: ['Build simple PLC project', 'Simulate industrial scenario'],
      completed: false,
    },
    {
      day: 3,
      title: 'Advanced',
      tasks: ['Complete certification exam', 'Update resume with new skills'],
      completed: false,
    },
  ],
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const getMatchLabel = (score: number): 'strong' | 'good' | 'weak' => {
  if (score >= 85) return 'strong';
  if (score >= 70) return 'good';
  return 'weak';
};

export const getMatchLabelText = (label: 'strong' | 'good' | 'weak'): string => {
  const labels = {
    strong: '🔥 Strong Match',
    good: '👍 Good Match',
    weak: '⚠️ Weak Match',
  };
  return labels[label];
};

export const getMatchColor = (score: number): string => {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-rose-400';
};

export const getMatchBgColor = (score: number): string => {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-rose-500';
};

export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const colors = {
    easy: 'text-emerald-400 bg-emerald-400/10',
    medium: 'text-amber-400 bg-amber-400/10',
    hard: 'text-rose-400 bg-rose-400/10',
  };
  return colors[difficulty];
};
