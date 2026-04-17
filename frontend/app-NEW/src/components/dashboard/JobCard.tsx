import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Check, 
  X, 
  Rocket,
  Building2,
  ExternalLink
} from 'lucide-react';
import type { JobMatch } from '@/types';
import { Button } from '@/components/ui/button';
import { getMatchLabelText, getMatchColor, getMatchBgColor } from '@/data/mockData';

interface JobCardProps {
  job: JobMatch;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const matchColor = getMatchColor(job.matchScore);
  const matchBgColor = getMatchBgColor(job.matchScore);
  const matchLabel = getMatchLabelText(job.matchLabel);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1 + 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Hover glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 ${matchBgColor} rounded-3xl blur-xl`}
      />

      <motion.div
        animate={{
          y: isHovered ? -4 : 0,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative glass rounded-3xl p-6 overflow-hidden border border-white/5 hover:border-white/10 transition-colors duration-300"
      >
        {/* Top gradient line */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          className={`absolute top-0 left-0 right-0 h-1 ${matchBgColor}`}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Company Logo Placeholder */}
            <motion.div
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0 
              }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center"
            >
              <Building2 className="w-6 h-6 text-zinc-400" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-zinc-400">{job.company}</p>
            </div>
          </div>

          {/* Match Score Badge */}
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className="flex flex-col items-end"
          >
            <span className={`text-2xl font-bold ${matchColor}`}>
              {job.matchScore}%
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Match
            </span>
          </motion.div>
        </div>

        {/* Match Label */}
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${matchBgColor}/10 ${matchColor} border border-current border-opacity-20`}>
            {matchLabel}
          </span>
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{job.postedAt}</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-3 mb-5">
          {/* Matched Skills */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Matched Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.matchedSkills.slice(0, 3).map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20"
                >
                  <Check className="w-3 h-3" />
                  {skill}
                </motion.span>
              ))}
              {job.matchedSkills.length > 3 && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                  +{job.matchedSkills.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          {job.missingSkills.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {job.missingSkills.slice(0, 2).map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 + 0.4 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20"
                  >
                    <X className="w-3 h-3" />
                    {skill}
                  </motion.span>
                ))}
                {job.missingSkills.length > 2 && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium">
                    +{job.missingSkills.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleApply}
          disabled={isApplying}
          className={`w-full font-medium py-5 rounded-xl transition-all duration-300 group/btn relative overflow-hidden ${
            job.matchLabel === 'strong'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-glow-sm hover:shadow-glow'
              : job.matchLabel === 'good'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white'
              : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
          }`}
        >
          <motion.span
            className="flex items-center justify-center gap-2"
            animate={{ y: isApplying ? -30 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>Apply Now</span>
            <Rocket className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </motion.span>
          
          {isApplying && (
            <motion.span
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              className="absolute inset-0 flex items-center justify-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              <span>Applying...</span>
            </motion.span>
          )}
        </Button>

        {/* External link indicator */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
          className="absolute top-4 right-4"
        >
          <ExternalLink className="w-4 h-4 text-zinc-500" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
