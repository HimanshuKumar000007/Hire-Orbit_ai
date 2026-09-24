import { UniversalResultNotice } from "@/lib/universal-notice-model";
import { TrendingUp, CheckCircle2, ChevronRight, Sparkles, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface NextStagePanelProps {
  nextStage: UniversalResultNotice['nextStage'];
  examName: string;
}

export function NextStagePanel({ nextStage, examName }: NextStagePanelProps) {
  if (!nextStage) return null;

  return (
    <div className="rounded-2xl glass p-6 border border-emerald-500/20 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Next Stage & What to Do After Qualifying
            </h2>
            <p className="text-xs text-zinc-400">
              Actionable roadmap for candidates shortlisted in this result
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Upcoming Phase
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Shortlisted Candidates Advance To
            </div>
            <div className="text-lg font-black text-white mb-2">
              {nextStage.stageName}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {nextStage.description}
            </p>
          </div>

          {/* Sequential Stages Flow if available */}
          {nextStage.stagesFlow && nextStage.stagesFlow.length > 0 && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="text-xs font-semibold text-zinc-400">
                Full Recruitment Progression Pathway
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {nextStage.stagesFlow.map((stageItem, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                      {stageItem}
                    </span>
                    {idx < nextStage.stagesFlow!.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key reminders for candidates */}
          <div className="space-y-2 text-xs text-zinc-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Keep your original academic marksheets, caste certificates, and photo ID proofs organized for upcoming verification.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Admit cards for {nextStage.stageName} will be issued separately to qualified candidates 7-10 days before the exam date.</span>
            </div>
          </div>
        </div>

        {/* AI Preparation Copilot Promo */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-zinc-900/60 to-zinc-950 border border-emerald-500/30 flex flex-col justify-between text-center gap-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">
              Start Next Stage Revision
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use HireOrbitAI Copilot to generate a customized topic-by-topic study plan and practice tests for {nextStage.stageName}.
            </p>
          </div>

          <Link
            href="/copilot"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow"
          >
            <span>Launch AI Prep Assistant</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
