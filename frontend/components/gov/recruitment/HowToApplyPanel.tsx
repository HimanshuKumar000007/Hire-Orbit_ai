import { FileText, ChevronRight } from 'lucide-react';

interface HowToApplyPanelProps {
  steps: string[];
  authority: string;
}

export function HowToApplyPanel({ steps, authority }: HowToApplyPanelProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Step-by-Step Instructions: How to Apply Online
            </h2>
            <p className="text-xs text-zinc-400">
              Official application procedure for {authority}
            </p>
          </div>
        </div>

        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-medium">
          {steps.length} Steps
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5 hover:border-white/10 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
