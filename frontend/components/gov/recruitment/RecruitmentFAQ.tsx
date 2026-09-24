"use client";

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface RecruitmentFAQProps {
  faqs: Array<{ question: string; answer: string }>;
  examName: string;
}

export function RecruitmentFAQ({ faqs, examName }: RecruitmentFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Frequently Asked Questions ({examName})
          </h2>
          <p className="text-xs text-zinc-400">
            Common candidate queries verified against the official recruitment notification
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className={`rounded-xl border transition-all ${
                isOpen 
                  ? 'bg-white/[0.03] border-white/15' 
                  : 'bg-white/[0.01] border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full py-4 px-4 sm:px-5 flex items-center justify-between gap-4 text-left font-semibold text-xs sm:text-sm text-white"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
