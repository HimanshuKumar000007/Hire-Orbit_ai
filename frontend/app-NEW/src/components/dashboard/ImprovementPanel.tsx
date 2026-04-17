import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Target, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  Zap,
  BookOpen,
  Award
} from 'lucide-react';
import type { ImprovementAction, WeeklyPlan } from '@/types';
import { getDifficultyColor } from '@/data/mockData';
import { Button } from '@/components/ui/button';

interface ImprovementPanelProps {
  improvements: ImprovementAction[];
  weeklyPlan: WeeklyPlan[];
}

export function ImprovementPanel({ improvements, weeklyPlan }: ImprovementPanelProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (dayId: string) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayId)) {
        newSet.delete(dayId);
      } else {
        newSet.add(dayId);
      }
      return newSet;
    });
  };

  const completedCount = completedTasks.size;
  const totalTasks = weeklyPlan.reduce((acc, day) => acc + day.tasks.length, 0);
  const progress = (completedCount / totalTasks) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Improve Your Profile</h2>
          <p className="text-sm text-zinc-500">
            Boost your match score with these actions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Improvement Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Recommended Actions
          </h3>
          
          {improvements.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group"
            >
              <div
                onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                className="glass rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getDifficultyColor(action.difficulty)}`}>
                    <Target className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                        {action.title}
                      </h4>
                      <motion.div
                        animate={{ rotate: expandedAction === action.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                      {action.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {action.impact}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Clock className="w-3 h-3" />
                        {action.timeEstimate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedAction === action.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-400 text-white"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Start Learning
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Find Course
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Plan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Weekly Learning Plan
            </h3>
            <span className="text-xs text-zinc-500">
              {completedCount}/{totalTasks} completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>

          {/* Days */}
          <div className="space-y-3">
            {weeklyPlan.map((day, dayIndex) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 + 0.4 }}
                className={`glass rounded-2xl p-4 border transition-all duration-300 ${
                  day.completed 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Day Number */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    day.completed 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-white/5 text-zinc-400'
                  }`}>
                    {day.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-bold text-sm">D{day.day}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{day.title}</h4>
                    <ul className="mt-2 space-y-2">
                      {day.tasks.map((task, taskIndex) => {
                        const taskId = `${day.day}-${taskIndex}`;
                        const isCompleted = completedTasks.has(taskId);
                        
                        return (
                          <motion.li
                            key={taskIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: taskIndex * 0.05 + 0.5 }}
                            onClick={() => toggleTask(taskId)}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                              )}
                            </motion.div>
                            <span className={`text-sm transition-all duration-200 ${
                              isCompleted 
                                ? 'text-zinc-500 line-through' 
                                : 'text-zinc-300 group-hover:text-white'
                            }`}>
                              {task}
                            </span>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Motivation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  Complete this week's plan
                </p>
                <p className="text-xs text-emerald-400">
                  +23% match score increase possible
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
