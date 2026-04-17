import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { Skill } from '@/types';
import { Target, TrendingUp } from 'lucide-react';

interface SkillsRadarProps {
  skills: Skill[];
}

export function SkillsRadar({ skills }: SkillsRadarProps) {
  // Transform skills data for the radar chart
  const radarData = skills.map((skill) => ({
    subject: skill.name,
    A: skill.level,
    fullMark: 100,
    category: skill.category,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass rounded-xl p-3 border border-white/10">
          <p className="text-white font-medium">{data.subject}</p>
          <p className="text-emerald-400 text-sm">Level: {data.A}%</p>
          <p className={`text-xs capitalize mt-1 ${
            data.category === 'matched' ? 'text-emerald-400' :
            data.category === 'missing' ? 'text-rose-400' : 'text-amber-400'
          }`}>
            {data.category}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate stats
  const matchedSkills = skills.filter((s) => s.category === 'matched');
  const missingSkills = skills.filter((s) => s.category === 'missing');
  const avgLevel = Math.round(
    matchedSkills.reduce((acc, s) => acc + s.level, 0) / matchedSkills.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative glass rounded-3xl p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-emerald-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Skills Analysis</h3>
              <p className="text-xs text-zinc-500">Your technical competency</p>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="h-64 -mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid 
                stroke="rgba(255,255,255,0.1)" 
                radialLines={true}
              />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#a1a1aa', fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Skills"
                dataKey="A"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#radarGradient)"
                fillOpacity={0.3}
              />
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xl font-bold text-white">{avgLevel}%</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Avg Level
            </span>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold text-emerald-400">
              {matchedSkills.length}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-1">
              Matched
            </span>
          </div>
          <div className="text-center">
            <span className="text-xl font-bold text-rose-400">
              {missingSkills.length}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-1">
              Missing
            </span>
          </div>
        </div>

        {/* Skill Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill.name}
              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                skill.category === 'matched'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : skill.category === 'missing'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {skill.name}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white/5 text-zinc-400">
              +{skills.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
