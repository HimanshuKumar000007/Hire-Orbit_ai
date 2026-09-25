import { ApplicationFeeStructure } from "@/lib/universal-notice-model";
import { CreditCard, Landmark, Info } from 'lucide-react';

interface ApplicationFeePanelProps {
  fee: ApplicationFeeStructure | null;
}

export function ApplicationFeePanel({ fee }: ApplicationFeePanelProps) {
  if (!fee || !fee.categories || fee.categories.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 border border-white/10 mb-8 bg-zinc-900/40">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-white leading-tight">
            Application Fee Structure
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
            Prescribed fee by candidate category
          </p>
        </div>
        <span className="hidden sm:inline-flex shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          Official Rates
        </span>
      </div>

      {/* Fee table — label | amount in clean rows */}
      <div className="divide-y divide-white/5 rounded-xl overflow-hidden border border-white/5">
        {fee.categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.035] transition-colors"
          >
            <span className="text-xs font-medium text-zinc-300">{cat.category}</span>
            <span className={`text-sm font-bold ${
              cat.amount.toLowerCase().includes('exempt') || cat.amount.toLowerCase().includes('nil') || cat.amount === '0' || cat.amount === '₹0'
                ? 'text-emerald-400'
                : 'text-white'
            }`}>
              {cat.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Payment mode and exemption note — compact footer */}
      {(fee.paymentMode || fee.exemptionNote) && (
        <div className="mt-3 space-y-2">
          {fee.paymentMode && (
            <div className="flex items-center gap-2 px-1">
              <Landmark className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-[11px] text-zinc-400 leading-snug">
                <span className="font-semibold text-zinc-300">Mode: </span>
                {fee.paymentMode}
              </span>
            </div>
          )}
          {fee.exemptionNote && (
            <div className="flex items-start gap-2 px-1">
              <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-zinc-500 leading-relaxed">{fee.exemptionNote}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
