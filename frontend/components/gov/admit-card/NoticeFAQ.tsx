import React from 'react';
import { HelpCircle } from 'lucide-react';

interface NoticeFAQProps {
  faqs: Array<{ question: string; answer: string }>;
  examName: string;
}

export function NoticeFAQ({ faqs, examName }: NoticeFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
        <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
          {examName} Admit Card FAQs
        </h3>
        <p className="text-xs text-zinc-400">
          Answers to common candidate questions based on official gazette instructions.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2"
          >
            <h4 className="text-sm sm:text-base font-bold text-white flex items-start gap-2.5">
              <span className="text-emerald-400 font-mono shrink-0">Q{idx + 1}.</span>
              <span>{faq.question}</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-6 sm:pl-7">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
