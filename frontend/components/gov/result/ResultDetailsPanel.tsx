import { FileText, CheckCircle2, Award, Users, Monitor, ShieldCheck } from 'lucide-react';

interface ResultDetailsPanelProps {
  details: {
    stage: string;
    resultDeclared: boolean;
    declarationDate?: string;
    resultFormat?: 'PDF Roll Number List' | 'Individual Scorecard Login' | 'Merit List PDF' | 'OMR Scorecard';
    totalCandidates?: string;
    qualifiedCandidates?: string;
    totalPosts?: string;
    examMode?: string;
  };
  authority: string;
}

export function ResultDetailsPanel({ details, authority }: ResultDetailsPanelProps) {
  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Official Result Breakdown & Format
          </h2>
          <p className="text-xs text-zinc-400">
            Certified publication details released by {authority}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stage */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Examination Stage</span>
          </div>
          <div className="text-white font-bold text-sm sm:text-base">
            {details.stage}
          </div>
        </div>

        {/* Format */}
        {details.resultFormat && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Result Publication Format</span>
            </div>
            <div className="text-white font-bold text-sm sm:text-base">
              {details.resultFormat}
            </div>
          </div>
        )}

        {/* Mode */}
        {details.examMode && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium">
              <Monitor className="w-4 h-4 text-purple-400" />
              <span>Mode of Examination</span>
            </div>
            <div className="text-white font-bold text-sm sm:text-base">
              {details.examMode}
            </div>
          </div>
        )}

        {/* Qualified Candidates */}
        {details.qualifiedCandidates && (
          <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Candidates Shortlisted</span>
            </div>
            <div className="text-emerald-400 font-extrabold text-sm sm:text-base">
              {details.qualifiedCandidates} Qualified
            </div>
          </div>
        )}

        {/* Total Posts */}
        {details.totalPosts && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium">
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Total Available Posts</span>
            </div>
            <div className="text-white font-bold text-sm sm:text-base">
              {details.totalPosts}
            </div>
          </div>
        )}

        {/* Declaration Status */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verification Status</span>
          </div>
          <div className="text-emerald-400 font-semibold text-sm sm:text-base">
            Commission Verified
          </div>
        </div>
      </div>
    </div>
  );
}
