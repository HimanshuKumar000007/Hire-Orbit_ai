"use client";

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Zap, TrendingUp, Award } from 'lucide-react';
import type { MatchScore } from '@/lib/types';
import { getMatchColor, getMatchBgColor } from '@/lib/mock-data';

interface MatchScoreCardProps {
  matchScore: MatchScore;
}

export function MatchScoreCard({ matchScore }: MatchScoreCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  // Animated number
  const springScore = useSpring(0, { stiffness: 100, damping: 30 });
  const roundedScore = useTransform(springScore, (latest) => Math.round(latest));

  useEffect(() => {
    springScore.set(matchScore?.score || 0);
    const unsubscribe = roundedScore.on('change', (latest) => {
      setDisplayScore(latest);
    });
    return () => unsubscribe();
  }, [matchScore?.score, springScore, roundedScore]);

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const scoreColor = getMatchColor(matchScore?.score || 0);
  const scoreBgColor = getMatchBgColor(matchScore?.score || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative glass rounded-3xl p-6 h-full overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-zinc-300">{matchScore?.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Award className="w-5 h-5 text-zinc-500" />
          </motion.div>
        </div>

        {/* Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-44 h-44">
            {/* Outer glow ring */}
            <motion.div
              animate={{ 
                scale: isHovered ? 1.05 : 1,
                opacity: isHovered ? 0.3 : 0.1 
              }}
              className={`absolute inset-0 rounded-full ${scoreBgColor} blur-xl`}
            />
            
            {/* SVG Circle */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="88"
                cy="88"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-white/5"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="88"
                cy="88"
                r="70"
                fill="none"
                stroke="url(#gradient-match-score)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  filter: 'drop-shadow(0 0 10px hsl(142 71% 45% / 0.5))',
                }}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient-match-score" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={displayScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-5xl font-bold ${scoreColor}`}
              >
                {displayScore}
                <span className="text-2xl text-zinc-500">%</span>
              </motion.span>
              <span className="text-xs text-zinc-500 mt-1">Match Score</span>
            </div>
          </div>

          {/* Improvement indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              +{matchScore?.improvement}% possible improvement
            </span>
          </motion.div>
        </div>

        {/* Score breakdown */}
        <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Skills Match</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <span className="text-zinc-300 font-medium">78%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Experience</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
              <span className="text-zinc-300 font-medium">65%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Education</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '90%' }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="h-full bg-teal-500 rounded-full"
                />
              </div>
              <span className="text-zinc-300 font-medium">90%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
