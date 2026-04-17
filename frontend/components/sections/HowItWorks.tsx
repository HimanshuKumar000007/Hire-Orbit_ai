import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Brain, Briefcase, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Simply upload your resume or LinkedIn profile. Our AI extracts your skills, experience, and career goals in seconds.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Analyzes Profile',
    description: 'Our advanced AI analyzes your profile, identifies your strengths, and finds skill gaps compared to your target roles.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    number: '03',
    icon: Briefcase,
    title: 'Get Jobs + Alerts + Plan',
    description: 'Receive personalized job matches, instant alerts, and a step-by-step career improvement plan tailored just for you.',
    color: 'from-amber-500 to-orange-500',
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6"
          >
            <Brain className="w-4 h-4" />
            Simple 3-Step Process
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            How <span className="gradient-text">HireOrbitAI</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400"
          >
            Get started in minutes and let AI do the heavy lifting for your job search.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/30 via-emerald-500/30 to-amber-500/30 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative glass rounded-2xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-8">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${step.color} text-white font-bold text-sm shadow-lg`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mt-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Arrow (except last) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-emerald-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-400 mb-4">
            Ready to accelerate your career?
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-xl shadow-glow hover:shadow-glow-lg transition-all group">
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
