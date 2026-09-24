import { ListOrdered, CheckCircle2, ChevronRight } from 'lucide-react';

interface SelectionProcessPanelProps {
  stages: string[] | null;
}

export function SelectionProcessPanel({ stages }: SelectionProcessPanelProps) {
  if (!stages || stages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ListOrdered className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Recruitment Selection Process &amp; Stages
            </h2>
            <p className="text-xs text-zinc-400">
              Prescribed assessment phases to qualify for final appointment
            </p>
          </div>
        </div>

        <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg font-medium">
          {stages.length} Stages
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative flex flex-col justify-between group hover:border-emerald-500/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Stage {idx + 1}
                </span>
                <CheckCircle2 className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="text-sm font-semibold text-white leading-snug">
                {stage}
              </div>
            </div>

            {idx < stages.length - 1 && (
              <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
