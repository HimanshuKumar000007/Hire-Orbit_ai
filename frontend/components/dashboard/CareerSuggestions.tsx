"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, ChevronRight } from "lucide-react";

interface Suggestion {
  skill: string;
  impact: string;
  jobCount: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface CareerSuggestionsProps {
  suggestions: Suggestion[];
}

export function CareerSuggestions({ suggestions }: CareerSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "LOW":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-50" />
      
      <div className="relative glass-strong rounded-[2rem] p-8 border border-white/10 hover:border-emerald-500/20 transition-colors duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/20">
              <Zap className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Orbit <span className="text-emerald-400">Boosters</span>
              </h3>
              <p className="text-zinc-500 text-sm font-medium">
                High-impact skills to unlock your next career trajectory
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Top {suggestions.length} Suggestions
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((item, index) => (
            <motion.div
              key={item.skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/item hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border
                  ${getPriorityStyles(item.priority)}
                `}>
                  {item.priority}
                </div>
                <div>
                  <span className="text-white font-bold block">{item.skill}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    {item.jobCount} Orbits Match
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-black text-sm">
                      {item.impact}
                    </span>
                  </div>
                  <span className="text-[9px] text-zinc-600 uppercase tracking-tighter mt-1 font-black">
                    Match Boost
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
          <div className="flex items-center gap-3 px-6 py-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl group/tip">
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">
              Pro Tip
            </span>
            <p className="text-xs text-blue-300/80 font-medium group-hover/tip:text-blue-300 transition-colors">
              Focus on <span className="text-rose-400 font-bold">HIGH</span> priority boosters first for maximum match exponentiality.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
