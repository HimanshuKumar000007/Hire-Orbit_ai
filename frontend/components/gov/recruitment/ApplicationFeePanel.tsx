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
    <div className="rounded-2xl glass border border-white/10 mb-8 bg-zinc-900/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4 text-blue-400" />
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

      {/* Proper Fee Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-2.5">
                Category
              </th>
              <th className="text-right text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-2.5">
                Application Fee
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {fee.categories.map((cat, idx) => {
              const isExempt =
                cat.amount.toLowerCase().includes('exempt') ||
                cat.amount.toLowerCase().includes('nil') ||
                cat.amount === '0' ||
                cat.amount === '₹0';

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isExempt
                      ? 'bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06]'
                      : 'bg-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-zinc-300">
                      {cat.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-sm font-bold ${isExempt ? 'text-emerald-400' : 'text-white'}`}>
                      {cat.amount}
                    </span>
                    {isExempt && (
                      <span className="ml-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                        EXEMPT
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment mode and exemption note — compact footer */}
      {(fee.paymentMode || fee.exemptionNote) && (
        <div className="px-5 py-3.5 bg-white/[0.01] border-t border-white/5 space-y-2">
          {fee.paymentMode && (
            <div className="flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-[11px] text-zinc-400 leading-snug">
                <span className="font-semibold text-zinc-300">Mode: </span>
                {fee.paymentMode}
              </span>
            </div>
          )}
          {fee.exemptionNote && (
            <div className="flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-zinc-500 leading-relaxed">{fee.exemptionNote}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
