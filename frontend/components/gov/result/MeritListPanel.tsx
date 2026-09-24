import { UniversalResultNotice } from "@/lib/universal-notice-model";
import { ListOrdered, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';

interface MeritListPanelProps {
  meritList: UniversalResultNotice['meritList'];
  examName: string;
}

export function MeritListPanel({ meritList, examName }: MeritListPanelProps) {
  if (!meritList || !meritList.isReleased) return null;

  return (
    <div className="rounded-2xl glass p-6 border border-emerald-500/20 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Official Merit List & Provisionally Selected Candidates
            </h2>
            <p className="text-xs text-zinc-400">
              Roll number-wise selection list for {examName}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Merit List Out
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <p className="text-sm text-zinc-300 leading-relaxed">
            The commission has published the comprehensive merit list containing roll numbers of candidates shortlisted based on their performance in the examination.
          </p>

          {meritList.totalSelected && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Total Candidates in Merit List: {meritList.totalSelected}</span>
            </div>
          )}

          {meritList.selectionCriteria && (
            <div className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-zinc-300 font-medium">Selection Rule: </span>
              {meritList.selectionCriteria}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 justify-center items-center p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center">
          <div className="text-xs text-zinc-300 font-medium">
            Search Roll Number in Official PDF
          </div>
          {meritList.meritListUrl && (
            <a
              href={meritList.meritListUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center gap-2 transition-all shadow-glow hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>Download Official Merit List PDF</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <span className="text-[11px] text-zinc-500">
            Use &apos;Ctrl + F&apos; inside the PDF to quickly search your Roll Number
          </span>
        </div>
      </div>
    </div>
  );
}
