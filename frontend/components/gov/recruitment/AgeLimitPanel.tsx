import { AgeLimitStructure } from "@/lib/universal-notice-model";
import { Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface AgeLimitPanelProps {
  ageLimit: AgeLimitStructure | null;
}

export function AgeLimitPanel({ ageLimit }: AgeLimitPanelProps) {
  if (!ageLimit || (!ageLimit.minAge && !ageLimit.maxAge && !ageLimit.rawText)) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Age Limit &amp; Relaxation Criteria
            </h2>
            <p className="text-xs text-zinc-400">
              Age eligibility as calculated on the official commission cutoff date
            </p>
          </div>
        </div>

        {ageLimit.cutoffDate && (
          <span className="text-xs text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
            Cutoff: {ageLimit.cutoffDate}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {ageLimit.minAge && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
              Minimum Age
            </div>
            <div className="text-xl font-bold text-white">
              {ageLimit.minAge}
            </div>
          </div>
        )}

        {ageLimit.maxAge && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
              Maximum Age (Unreserved)
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {ageLimit.maxAge}
            </div>
          </div>
        )}

        {!ageLimit.minAge && !ageLimit.maxAge && ageLimit.rawText && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 col-span-2">
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
              Prescribed Age Bracket
            </div>
            <div className="text-lg font-bold text-white">
              {ageLimit.rawText}
            </div>
          </div>
        )}
      </div>

      {ageLimit.relaxationDetails && (
        <div className="p-4 rounded-xl bg-purple-500/[0.03] border border-purple-500/20 text-xs text-zinc-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-purple-300">Category Relaxation: </span>
            {ageLimit.relaxationDetails}
          </div>
        </div>
      )}
    </div>
  );
}
