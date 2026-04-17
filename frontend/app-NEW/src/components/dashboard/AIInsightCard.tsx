import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import type { AIInsight } from '@/types';
import { Button } from '@/components/ui/button';

interface AIInsightCardProps {
  insight: AIInsight;
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Function to highlight keywords in the message
  const renderHighlightedMessage = (message: string, keywords: string[]) => {
    let result = message;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(regex, '___HIGHLIGHT___$1___END___');
    });

    const parts = result.split('___');
    return parts.map((part, index) => {
      if (part === 'HIGHLIGHT___') {
        const keyword = parts[index + 1];
        parts[index + 1] = ''; // Clear the next part as it's consumed
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0.8 }}
            animate={{ 
              opacity: 1,
              scale: isHovered ? 1.05 : 1 
            }}
            className="inline-block px-2 py-0.5 mx-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30"
          >
            {keyword}
          </motion.span>
        );
      }
      if (part === 'END___' || part === '') return null;
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Animated background glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.5 : 0.2,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-emerald-500/10 to-teal-500/20 rounded-3xl blur-xl"
      />

      <div className="relative glass rounded-3xl p-6 h-full overflow-hidden">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-violet-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          style={{ padding: '1px' }} 
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
              animate={{
                y: [-20, -100],
                x: [0, (i - 1) * 20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeOut',
              }}
              style={{
                left: `${30 + i * 25}%`,
                bottom: '0%',
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: isHovered ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl bg-violet-500/30 blur-md"
              />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">Powered by AI</span>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isHovered ? 15 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </motion.div>
        </div>

        {/* Insight Message */}
        <div className="mb-6">
          <p className="text-zinc-300 leading-relaxed text-base">
            {renderHighlightedMessage(insight.message, insight.highlightedWords)}
          </p>
        </div>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
          
          <div className="relative flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-300 mb-1">
                <span className="text-white font-medium">Suggested Action:</span>{' '}
                {insight.action}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                  {insight.impact}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5"
        >
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium py-5 rounded-xl transition-all duration-300 shadow-glow-sm hover:shadow-glow group/btn"
          >
            <span>Take Action</span>
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
