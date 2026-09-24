import { Award, ExternalLink, KeyRound, CheckCircle2 } from 'lucide-react';

interface ScorecardPanelProps {
  scorecard: {
    isAvailable: boolean;
    releaseDate?: string;
    downloadUrl?: string;
    loginRequired: boolean;
    requiredCredentials: string[];
  } | null;
  examName: string;
}

export function ScorecardPanel({ scorecard, examName }: ScorecardPanelProps) {
  if (!scorecard || !scorecard.isAvailable) return null;

  return (
    <div className="rounded-2xl glass p-6 border border-blue-500/20 mb-8 bg-gradient-to-br from-blue-950/20 via-zinc-900/40 to-zinc-950">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Individual Scorecard & Candidate Marks
            </h2>
            <p className="text-xs text-zinc-400">
              Check your subject-wise marks, raw score, and normalized final percentile
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400">
          Scorecard Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <div className="text-sm text-zinc-300 leading-relaxed">
            The commission has enabled the online window to check individual marks scored by candidates in the examination. Both qualified and non-qualified candidates can download their scorecards.
          </div>

          {scorecard.requiredCredentials.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                Required Credentials for Scorecard Login:
              </div>
              <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc">
                {scorecard.requiredCredentials.map((cred, i) => (
                  <li key={i}>{cred}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Scorecard includes: Raw Score, Normalized Score, Category Rank & Qualifying Status</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center items-center p-6 rounded-xl bg-blue-500/[0.04] border border-blue-500/20 text-center">
          <div className="text-xs text-blue-300 font-medium">
            Candidate Marks Login Window Active
          </div>
          {scorecard.downloadUrl && (
            <a
              href={scorecard.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-sm flex items-center gap-2 transition-all shadow-glow hover:scale-[1.02]"
            >
              <span>Download Scorecard Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <span className="text-[11px] text-zinc-500">
            Keep your registration slip handy before opening portal
          </span>
        </div>
      </div>
    </div>
  );
}
