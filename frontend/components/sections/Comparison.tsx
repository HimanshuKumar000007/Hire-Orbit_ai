import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X, Sparkles, Crown } from 'lucide-react';

const features = [
  { name: 'AI Job Matching', hireorbit: true, others: false, highlight: true },
  { name: 'Instant Job Alerts', hireorbit: true, others: false, highlight: true },
  { name: 'Skill Gap Analysis', hireorbit: true, others: false, highlight: true },
  { name: 'Personalized Career Plan', hireorbit: true, others: false, highlight: false },
  { name: 'Resume Score & Optimization', hireorbit: true, others: false, highlight: false },
  { name: 'Smart Recommendations', hireorbit: true, others: false, highlight: false },
  { name: 'Real-time Notifications', hireorbit: true, others: true, highlight: false },
  { name: 'Basic Job Search', hireorbit: true, others: true, highlight: false },
];

export function Comparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6"
          >
            <Crown className="w-4 h-4" />
            Why Choose Us
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            The <span className="gradient-text">HireOrbitAI</span> Advantage
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400"
          >
            See how we compare to traditional job boards and career platforms.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative glass-strong rounded-2xl overflow-hidden border border-white/10">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 bg-white/5">
              <div className="text-zinc-400 font-medium">Feature</div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  HireOrbitAI
                </span>
              </div>
              <div className="text-center text-zinc-500 font-medium">Others</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`grid grid-cols-3 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${
                    feature.highlight ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <div className={`text-sm ${feature.highlight ? 'text-white font-medium' : 'text-zinc-400'}`}>
                    {feature.name}
                    {feature.highlight && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded">
                        AI
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {feature.hireorbit ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-rose-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {feature.others ? (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Check className="w-5 h-5 text-zinc-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-rose-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center text-zinc-500 text-sm mt-8"
        >
          * Comparison based on publicly available features from major job platforms as of 2024.
        </motion.p>
      </div>
    </section>
  );
}
