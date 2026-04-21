"use client";

import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Comparison } from "@/components/sections/Comparison";
import { Check, Sparkles, Zap, Star, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for exploring the platform and starting your job search.",
    features: [
      "Basic AI Job Matching",
      "Daily Job Alerts",
      "Standard Profile Visibility",
      "Community Access",
    ],
    buttonText: "Get Started Free",
    buttonLink: "/signup",
    highlight: false,
  },
  {
    name: "Premium",
    price: "1,000",
    period: "/month",
    description: "Ultimate tools for serious professionals looking to advance fast.",
    features: [
      "Deep Semantic AI Matching",
      "AI Skill Gap Analysis",
      "Resume Score & Optimization",
      "Real-time Priority Alerts",
      "Personalized Career Roadmap",
      "Direct Export to ATS",
    ],
    buttonText: "Go Premium",
    buttonLink: "/signup",
    highlight: true,
  },
];

const faqs = [
  {
    q: "How does the AI matching work?",
    a: "Our AI uses vector embeddings to understand the context of your skills and the nuances of job descriptions, going far beyond simple keyword matching."
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel your Premium subscription at any time from your settings page. You'll keep access until the end of your billing period."
  },
  {
    q: "What is Skill Gap Analysis?",
    a: "It's a deep-dive tool that compares your current profile with your dream job requirements, highlighting exactly what you need to learn next."
  },
  {
    q: "Is there a free trial for Premium?",
    a: "We offer a 7-day money-back guarantee if you're not satisfied with the Premium features."
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
          >
            Simple, Transparent <br />
            <span className="gradient-text">Pricing for Everyone</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Choose the plan that fits your career goals. Whether you're just starting 
            or looking for your next big move, we've got you covered.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative group ${plan.highlight ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -inset-px bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.5rem] opacity-50 blur-xl group-hover:opacity-100 transition-opacity" />
                )}
                
                <div className={`relative h-full glass-strong rounded-[2.5rem] p-8 lg:p-12 border ${
                  plan.highlight ? 'border-emerald-500/50 bg-black/60' : 'border-white/10 bg-black/40'
                } flex flex-col`}>
                  
                  {plan.highlight && (
                    <div className="absolute top-6 right-8">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-emerald-400" />
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                      {plan.period && <span className="text-zinc-500">{plan.period}</span>}
                    </div>
                    <p className="text-zinc-400 mt-4 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.highlight ? 'bg-emerald-500/20' : 'bg-white/5'
                        }`}>
                          <Check className={`w-3 h-3 ${plan.highlight ? 'text-emerald-400' : 'text-zinc-500'}`} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className={`w-full py-7 rounded-2xl text-lg font-bold transition-all ${
                      plan.highlight 
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow hover:shadow-glow-lg' 
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Comparison */}
      <Comparison />

      {/* FAQ Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400 text-sm">Everything you need to know about our plans.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  {faq.q}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed ml-6">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950">
        <FinalCTA />
      </section>
      
      <Footer />
    </main>
  );
}
