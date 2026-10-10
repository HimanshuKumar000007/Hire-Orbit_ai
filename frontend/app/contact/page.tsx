"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";
import { 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  User, 
  Globe, 
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all fields before sending.');
      return;
    }

    setIsSubmitting(true);
    
    // Construct mailto fallback to guarantee 100% deliverability directly to inbox
    const mailtoSubject = encodeURIComponent(`[HireOrbitAI Contact] ${formData.subject} from ${formData.name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Your message has been initiated. Opening mail client...');
      window.location.href = `mailto:hireorbitai@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    }, 600);
  };

  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-emerald-500/30 text-zinc-100">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8 border border-emerald-500/20 shadow-glow-sm"
          >
            <MessageSquare className="w-8 h-8" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Contact <span className="gradient-text">HireOrbitAI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-xl mx-auto text-base sm:text-lg"
          >
            Have a question, feedback, partnership proposal, or support inquiry? We&apos;re here to assist you.
          </motion.p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct Publisher & Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-strong p-8 rounded-3xl border border-white/10 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Official Desk
                  </div>
                  <h2 className="text-2xl font-bold text-white">Direct Inquiries</h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Reach our editorial, technical, and privacy compliance desk directly.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <a
                    href="mailto:hireorbitai@gmail.com"
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Email Address</div>
                      <div className="text-white font-semibold text-sm truncate">hireorbitai@gmail.com</div>
                      <div className="text-xs text-emerald-400 mt-0.5">Average response: &lt; 24 hours</div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Founder &amp; Publisher</div>
                      <div className="text-white font-semibold text-sm">Himanshu Kumar</div>
                      <div className="text-xs text-zinc-400 mt-0.5">CEO &amp; Lead Architect, HireOrbitAI</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Operational Location</div>
                      <div className="text-white font-semibold text-sm">Mirzapur, Uttar Pradesh - 231305</div>
                      <div className="text-xs text-zinc-400 mt-0.5">India</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Office Hours</div>
                      <div className="text-white font-semibold text-sm">Monday – Saturday</div>
                      <div className="text-xs text-zinc-400 mt-0.5">09:00 AM – 07:00 PM IST</div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-3">Official Channels</div>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://linkedin.com/company/hireorbitai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-white/5"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href="https://twitter.com/hireorbitai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-white/5"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href="https://github.com/HimanshuKumar000007"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-white/5"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="glass-strong p-8 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Send Us a Direct Message</h2>
                  <p className="text-zinc-400 text-sm">
                    Fill out the form below and we will get back to your registered email address promptly.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
                    <p className="text-zinc-300 text-sm max-w-md mx-auto">
                      Thank you for reaching out. We have opened your default mail client with your inquiry details. You may also follow up directly at{" "}
                      <strong className="text-white">hireorbitai@gmail.com</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                      }}
                      className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Alex Johnson"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@example.com"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Inquiry Subject *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 text-sm transition-all"
                      >
                        <option value="General Inquiry">General Platform Inquiry</option>
                        <option value="Support & Bug Report">Technical Support &amp; Bug Report</option>
                        <option value="Partnership & Hiring Labs">Partnership &amp; Enterprise Hiring</option>
                        <option value="AdSense & Advertising Inquiry">AdSense &amp; Advertising Inquiry</option>
                        <option value="Privacy & Data Compliance">Privacy &amp; Data Rights Compliance</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe how we can assist you..."
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 text-sm transition-all resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-sm hover:shadow-glow disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
