import { ApplicationFeeStructure } from "@/lib/universal-notice-model";
import { CreditCard, CheckCircle2, Info } from 'lucide-react';

interface ApplicationFeePanelProps {
  fee: ApplicationFeeStructure | null;
}

export function ApplicationFeePanel({ fee }: ApplicationFeePanelProps) {
  if (!fee || !fee.categories || fee.categories.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Application Fee &amp; Mode of Payment
            </h2>
            <p className="text-xs text-zinc-400">
              Prescribed examination fees by candidate category
            </p>
          </div>
        </div>

        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-medium">
          Official Fee Structure
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {fee.categories.map((cat, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5">
              <div className="text-xs text-zinc-400 font-medium">
                {cat.category}
              </div>
              <div className="text-lg font-bold text-white">
                {cat.amount}
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-xs text-zinc-400">
        {fee.paymentMode && (
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="font-semibold text-white">Payment Mode:</span>
            <span>{fee.paymentMode}</span>
          </div>
        )}
        {fee.exemptionNote && (
          <div className="flex items-start gap-2 text-zinc-400 pt-1">
            <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">{fee.exemptionNote}</span>
          </div>
        )}
      </div>
    </div>
  );
}
