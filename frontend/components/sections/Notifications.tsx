import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Bell, Zap, Check, Building2, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animated notification component
function AnimatedNotification({ delay }: { delay: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-xl p-4 border border-emerald-500/30 shadow-glow-sm hover:shadow-glow transition-shadow cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-medium text-sm">Electrical Engineer</p>
            <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded">
              85% match
            </span>
          </div>
          <p className="text-zinc-400 text-xs">Tesla • Austin, TX</p>
          <p className="text-zinc-500 text-xs mt-1">$120k - $160k • 2 days ago</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Notifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium"
            >
              <Bell className="w-4 h-4" />
              Real-Time Notifications
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            >
              Never Miss an{' '}
              <span className="gradient-text">Opportunity</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-lg text-zinc-400"
            >
              Get instant alerts when new jobs match your profile. Our AI monitors 
              thousands of job postings 24/7 and notifies you the moment your dream 
              job appears.
            </motion.p>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {[
                { icon: Zap, text: 'Instant push notifications' },
                { icon: TrendingUp, text: 'Be the first to apply' },
                { icon: Check, text: 'Customizable alert preferences' },
                { icon: Sparkles, text: 'AI-curated job matches only' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <item.icon className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-zinc-300">{item.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-6 rounded-xl shadow-glow hover:shadow-glow-lg transition-all"
              >
                <Bell className="w-5 h-5 mr-2" />
                Enable Job Alerts
              </Button>
            </motion.div>
          </div>

          {/* Right Content - Notification Stack */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              {/* Phone Frame */}
              <div className="relative mx-auto max-w-sm">
                {/* Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-violet-500/20 rounded-[3rem] blur-2xl opacity-50" />
                
                {/* Phone */}
                <div className="relative glass-strong rounded-[2.5rem] p-4 border border-white/10">
                  {/* Notch */}
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-6 rounded-full bg-black" />
                  </div>

                  {/* Screen Content */}
                  <div className="space-y-3 pb-4">
                    {/* Header */}
                    <div className="flex items-center justify-between px-2">
                      <span className="text-white font-semibold">Notifications</span>
                      <span className="text-xs text-emerald-400">3 new</span>
                    </div>

                    {/* Notification Stack */}
                    <div className="space-y-3">
                      <AnimatedNotification delay={500} />
                      <AnimatedNotification delay={800} />
                      <AnimatedNotification delay={1100} />
                    </div>

                    {/* Bottom indicator */}
                    <div className="flex justify-center pt-2">
                      <div className="w-32 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -right-4 top-1/4 glass rounded-xl p-3 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white font-medium">+156%</p>
                      <p className="text-[10px] text-zinc-500">Response rate</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
