import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, TrendingUp, Zap, Check, Bell, Target } from 'lucide-react';

export function ProductPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            See It In Action
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Your Career Dashboard{' '}
            <span className="gradient-text">Powered by AI</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400"
          >
            Get a complete overview of your job search, match scores, and personalized recommendations—all in one place.
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-violet-500/20 to-teal-500/20 rounded-3xl blur-2xl opacity-50" />
          
          {/* Dashboard Container */}
          <div className="relative glass-strong rounded-3xl overflow-hidden border border-white/10">
            {/* Browser Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="max-w-md mx-auto px-4 py-1.5 rounded-lg bg-black/30 text-center">
                  <span className="text-xs text-zinc-500">app.hireorbit.ai/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 lg:p-8">
              {/* Top Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Profile Strength', value: '85%', icon: Target, color: 'text-emerald-400' },
                  { label: 'Job Matches', value: '24', icon: Zap, color: 'text-violet-400' },
                  { label: 'New Alerts', value: '3', icon: Bell, color: 'text-amber-400' },
                  { label: 'Growth', value: '+23%', icon: TrendingUp, color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="glass rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs text-zinc-500 uppercase">{stat.label}</span>
                    </div>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content - Job Matches */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Top Job Matches</h3>
                    <span className="text-xs text-emerald-400 cursor-pointer hover:underline">View All</span>
                  </div>

                  {/* Job Cards */}
                  {[
                    { company: 'Tesla', role: 'Senior Electrical Engineer', match: 92, location: 'Austin, TX', salary: '$120k - $160k', color: 'bg-emerald-500' },
                    { company: 'Google', role: 'Data Scientist', match: 88, location: 'Remote', salary: '$140k - $180k', color: 'bg-violet-500' },
                    { company: 'Meta', role: 'ML Engineer', match: 85, location: 'Menlo Park, CA', salary: '$150k - $200k', color: 'bg-blue-500' },
                  ].map((job, i) => (
                    <motion.div
                      key={job.company}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer group"
                    >
                      <div className={`w-12 h-12 rounded-xl ${job.color} flex items-center justify-center text-white font-bold`}>
                        {job.company[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium group-hover:text-emerald-400 transition-colors">{job.role}</h4>
                        <p className="text-sm text-zinc-500">{job.company} • {job.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">{job.match}%</p>
                        <p className="text-xs text-zinc-500">{job.salary}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Sidebar - AI Insights */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">AI Insights</h3>
                  
                  {/* Insight Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="glass rounded-xl p-4 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium mb-1">Skill Gap Found</p>
                        <p className="text-xs text-zinc-400">
                          Add <span className="text-emerald-400">Python</span> & <span className="text-emerald-400">TensorFlow</span> to increase match by 15%
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Items */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.9 }}
                    className="glass rounded-xl p-4 border border-white/5"
                  >
                    <p className="text-sm text-white font-medium mb-3">Recommended Actions</p>
                    <ul className="space-y-2">
                      {[
                        'Update resume with ML projects',
                        'Complete Python certification',
                        'Apply to 3 new jobs today',
                      ].map((action, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                          <Check className="w-4 h-4 text-emerald-400" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Weekly Progress */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1 }}
                    className="glass rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-white font-medium">Weekly Progress</p>
                      <span className="text-xs text-emerald-400">4/7 days</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[57%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
