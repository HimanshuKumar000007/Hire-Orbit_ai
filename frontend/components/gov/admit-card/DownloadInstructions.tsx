import React from 'react';
import { UniversalNotice } from '@/lib/universal-notice-model';
import { ListOrdered, KeyRound, CheckCircle2 } from 'lucide-react';

interface DownloadInstructionsProps {
  notice: UniversalNotice;
}

export function DownloadInstructions({ notice }: DownloadInstructionsProps) {
  return (
    <section className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
        <ListOrdered className="w-4 h-4" /> Official Candidate Portal Steps
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
          How to Download {notice.examName} Admit Card
        </h3>
        <p className="text-xs text-zinc-400">
          Follow these official steps to access your examination hall ticket from the {notice.authority} portal.
        </p>
      </div>

      {/* Mandatory Credentials Callout */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium block">Required Login Credentials:</span>
            <span className="text-sm font-bold text-white">{notice.credentials.label}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {notice.credentials.requiredCredentials.map((c, cIdx) => (
            <span
              key={cIdx}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/5 text-zinc-300 border border-white/5"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Step by step list */}
      <div className="space-y-3 pt-1">
        {notice.downloadSteps.map((step, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 flex items-start gap-3.5 text-xs sm:text-sm text-zinc-200"
          >
            <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
              {idx + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
