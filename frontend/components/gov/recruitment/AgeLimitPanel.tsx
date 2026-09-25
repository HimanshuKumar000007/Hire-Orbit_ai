import { AgeLimitStructure } from "@/lib/universal-notice-model";
import { Users, ShieldCheck } from 'lucide-react';

interface AgeLimitPanelProps {
  ageLimit: AgeLimitStructure | null;
}

export function AgeLimitPanel({ ageLimit }: AgeLimitPanelProps) {
  if (!ageLimit || (!ageLimit.minAge && !ageLimit.maxAge && !ageLimit.rawText)) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 border border-white/10 mb-8 bg-zinc-900/40">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-purple-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-white leading-tight">
            Age Limit &amp; Relaxation
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
            As calculated on the official cutoff date
          </p>
        </div>
        {ageLimit.cutoffDate && (
          <span className="hidden sm:inline-flex shrink-0 text-[10px] font-semibold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            Cutoff: {ageLimit.cutoffDate}
          </span>
        )}
      </div>

      {/* Age bracket display */}
      <div className="mb-4">
        {(ageLimit.minAge || ageLimit.maxAge) ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            {ageLimit.minAge && (
              <div className="flex-1 text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Min Age</div>
                <div className="text-2xl font-black text-white">{ageLimit.minAge}</div>
              </div>
            )}
            {ageLimit.minAge && ageLimit.maxAge && (
              <div className="text-zinc-700 text-2xl font-light">—</div>
            )}
            {ageLimit.maxAge && (
              <div className="flex-1 text-center">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Max Age</div>
                <div className="text-2xl font-black text-emerald-400">{ageLimit.maxAge}</div>
              </div>
            )}
          </div>
        ) : ageLimit.rawText ? (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Age Bracket</div>
            <div className="text-base font-bold text-white">{ageLimit.rawText}</div>
          </div>
        ) : null}
      </div>

      {/* Cutoff date row (mobile only — desktop is in header badge) */}
      {ageLimit.cutoffDate && (
        <div className="sm:hidden text-[11px] text-zinc-500 mb-3 px-1">
          Cutoff date: <span className="text-zinc-300 font-semibold">{ageLimit.cutoffDate}</span>
        </div>
      )}

      {/* Relaxation details */}
      {ageLimit.relaxationDetails && (
        <div className="p-3.5 rounded-xl bg-purple-500/[0.04] border border-purple-500/15 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-relaxed">
            <span className="block text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">
              Category Relaxation
            </span>
            {ageLimit.relaxationDetails}
          </div>
        </div>
      )}
    </div>
  );
}
