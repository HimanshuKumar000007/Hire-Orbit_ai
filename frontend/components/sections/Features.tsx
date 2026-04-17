import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Brain, 
  Bell, 
  BarChart3, 
  Rocket, 
  FileText, 
  Target,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Job Matching',
    description: 'Smart matching using embeddings, not just keywords. Our AI understands your skills and finds jobs that truly fit.',
    color: 'from-violet-500 to-purple-500',
    highlight: true,
  },
  {
    icon: Bell,
    title: 'Instant Job Alerts',
    description: 'Get notified instantly when a job matches your profile. Never miss an opportunity again.',
    color: 'from-emerald-500 to-teal-500',
    highlight: true,
  },
  {
    icon: BarChart3,
    title: 'Skill Gap Analysis',
    description: 'See exactly what skills you are missing for your dream job. Get clear actionable insights.',
    color: 'from-amber-500 to-orange-500',
    highlight: false,
  },
  {
    icon: Rocket,
    title: 'Personalized Career Plan',
    description: 'AI suggests what to learn next to improve your chances. Follow a clear path to success.',
    color: 'from-rose-500 to-pink-500',
    highlight: false,
  },
  {
    icon: FileText,
    title: 'Resume Score & Optimization',
    description: 'Improve your resume with real-time AI feedback. Get suggestions to stand out to recruiters.',
    color: 'from-cyan-500 to-blue-500',
    highlight: false,
  },
  {
    icon: Target,
    title: 'Smart Recommendations',
    description: 'Jobs ranked based on your profile strength. Focus on applications with the highest success rate.',
    color: 'from-indigo-500 to-violet-500',
    highlight: false,
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Hover glow */}
      <div className={`absolute -inset-px bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      
      <div className={`relative h-full glass rounded-2xl p-6 border transition-all duration-300 ${
        feature.highlight 
          ? 'border-emerald-500/30 hover:border-emerald-500/50' 
          : 'border-white/5 hover:border-white/20'
      }`}>
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {feature.title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          {feature.description}
        </p>

        {/* Learn more link */}
        <div className="flex items-center gap-1 text-sm text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Highlight badge */}
        {feature.highlight && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 text-[10px] font-medium bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              Popular
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <Brain className="w-4 h-4" />
            Powered by Advanced AI
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Everything You Need to{' '}
            <span className="gradient-text">Land Your Dream Job</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400"
          >
            Our AI-powered platform gives you the tools, insights, and guidance 
            to accelerate your career growth.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
