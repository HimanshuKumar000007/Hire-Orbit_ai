import { SalaryStructure } from "@/lib/universal-notice-model";
import { IndianRupee, ShieldCheck, Sparkles } from 'lucide-react';

interface SalaryPanelProps {
  salary: SalaryStructure | null;
}

export function SalaryPanel({ salary }: SalaryPanelProps) {
  if (!salary || (!salary.payScale && !salary.payLevel && !salary.basicPay)) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Salary Structure &amp; Pay Scale (7th CPC)
            </h2>
            <p className="text-xs text-zinc-400">
              Government remuneration matrix and applicable central/state allowances
            </p>
          </div>
        </div>

        {salary.payLevel && (
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
            {salary.payLevel}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {salary.payScale && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
              Pay Matrix Band
            </div>
            <div className="text-lg font-bold text-white">
              {salary.payScale}
            </div>
          </div>
        )}

        {salary.basicPay && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
              Entry Basic Pay
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {salary.basicPay}
            </div>
          </div>
        )}

        {salary.gradePay && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
              Grade Pay
            </div>
            <div className="text-lg font-bold text-white">
              {salary.gradePay}
            </div>
          </div>
        )}
      </div>

      {salary.allowances && (
        <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 text-xs text-zinc-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-emerald-400">Additional Benefits &amp; Allowances: </span>
            {salary.allowances}
          </div>
        </div>
      )}
    </div>
  );
}
