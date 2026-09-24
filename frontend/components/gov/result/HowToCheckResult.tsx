import { CheckCircle2, Search, ExternalLink, KeyRound, Monitor, Smartphone } from 'lucide-react';

interface HowToCheckResultProps {
  steps: string[];
  authority: string;
  portalUrl: string;
}

export function HowToCheckResult({ steps, authority, portalUrl }: HowToCheckResultProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              How to Check Your Official Result & Download Scorecard
            </h2>
            <p className="text-xs text-zinc-400">
              Step-by-step verified verification guide for candidates
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-zinc-400">
          Official Guide
        </span>
      </div>

      {/* Two Methods Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Monitor className="w-4 h-4" />
            <span>Method 1: Search Roll Number in PDF</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Open the official result PDF. Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[11px]">Ctrl + F</kbd> (or use mobile PDF search) and enter your Roll Number. If your roll number is highlighted, you are shortlisted.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <KeyRound className="w-4 h-4" />
            <span>Method 2: Candidate Login Scorecard</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Visit the official {authority} candidate login portal. Enter your Registration Number and Date of Birth / Password to view individual subject-wise marks and qualifying percentile.
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
