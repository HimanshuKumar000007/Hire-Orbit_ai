import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { MatchScoreCard } from '@/components/dashboard/MatchScoreCard';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { SkillsRadar } from '@/components/dashboard/SkillsRadar';
import { JobMatchGrid } from '@/components/dashboard/JobMatchGrid';
import { ImprovementPanel } from '@/components/dashboard/ImprovementPanel';
import { mockDashboardData } from '@/data/mockData';
import { Skeleton } from '@/components/ui/skeleton';

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-64 h-8" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>
        <Skeleton className="w-full h-2 rounded-full" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>

      {/* Jobs Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}

function App() {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const { user, matchScore, aiInsight, jobMatches, improvements, weeklyPlan, skills } = mockDashboardData;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar activeItem={activeNavItem} onItemClick={setActiveNavItem} />

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top padding for mobile */}
        <div className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                {/* Hero Section */}
                <HeroSection user={user} matchScore={matchScore} />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MatchScoreCard matchScore={matchScore} />
                  <AIInsightCard insight={aiInsight} />
                  <SkillsRadar skills={skills} />
                </div>

                {/* Job Matches */}
                <JobMatchGrid jobs={jobMatches} />

                {/* Improvement Panel */}
                <ImprovementPanel improvements={improvements} weeklyPlan={weeklyPlan} />

                {/* Footer */}
                <motion.footer
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="pt-8 pb-4 border-t border-white/5"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-sm">
                        © 2024 HireOrbitAI. All rights reserved.
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                        Privacy Policy
                      </a>
                      <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                        Terms of Service
                      </a>
                      <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                        Contact Support
                      </a>
                    </div>
                  </div>
                </motion.footer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/3 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
}

export default App;
