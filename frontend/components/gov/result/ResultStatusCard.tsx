"use client";

import { UniversalResultNotice } from "@/lib/universal-notice-model";
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  AlertCircle,
  Calendar,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface ResultStatusCardProps {
  notice: UniversalResultNotice;
}

export function ResultStatusCard({ notice }: ResultStatusCardProps) {
  const checkResultUrl = notice.primaryActionUrls.checkResultUrl || notice.source.officialUrl;
  const scorecardUrl = notice.primaryActionUrls.downloadScorecardUrl;
  const cutoffUrl = notice.primaryActionUrls.checkCutoffUrl;
  const meritListUrl = notice.primaryActionUrls.downloadMeritListUrl;

  const isDeclared = notice.status !== 'EXPECTED_SOON';
  const isExpectedSoon = notice.status === 'EXPECTED_SOON';
  const isScorecardLive = notice.status === 'SCORECARD_AVAILABLE' || !!scorecardUrl;
  const isCutoffLive = notice.status === 'CUTOFF_RELEASED' || !!cutoffUrl;

  const shareText = `🚨 *${notice.title}*\nStatus: ${notice.statusLabel}\nAuthority: ${notice.authority}\nCheck Result & Cutoff: https://hireorbitai.in/gov/${notice.slug}`;

  return (
    <>
      <div className="rounded-3xl p-6 sm:p-8 glass border border-white/10 relative overflow-hidden bg-gradient-to-br from-emerald-950/25 via-zinc-900/60 to-zinc-950 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* Status Indicator Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-glow-sm ${
                isDeclared
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isDeclared ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`} />
                {notice.statusLabel}
              </span>

              {notice.dates.resultDate && (
                <span className="text-xs text-zinc-300 font-semibold flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Declared: {notice.dates.resultDate}
                </span>
              )}

              {notice.resultDetails.qualifiedCandidates && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {notice.resultDetails.qualifiedCandidates} Qualified
                </span>
              )}
            </div>

            {/* Clear Summary Narrative */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {notice.summary}
            </p>

            {/* Quick Key Facts Pill */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <span className="text-zinc-500">Stage:</span>
                <span className="text-emerald-400 font-semibold">{notice.stage}</span>
              </div>
              {notice.resultDetails.resultFormat && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-zinc-500">Format:</span>
                  <span>{notice.resultDetails.resultFormat}</span>
                </div>
              )}
              {notice.nextStage && (
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Next: {notice.nextStage.stageName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs Desktop */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-72">
            {isDeclared ? (
              <a
                href={checkResultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-glow hover:scale-[1.02] text-center"
              >
                <span>Check Official Result</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="w-full py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-xs text-center flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Result Announcement Expected Shortly</span>
              </div>
            )}

            {scorecardUrl && (
              <a
                href={scorecardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-blue-500/30 text-center"
              >
                <Award className="w-4 h-4 text-blue-400" />
                <span>Download Scorecard & Marks</span>
              </a>
            )}

            {cutoffUrl && (
              <a
                href={cutoffUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-white/10 text-center"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>View Cutoff Marks PDF</span>
              </a>
            )}

            {meritListUrl && !cutoffUrl && (
              <a
                href={meritListUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-white/10 text-center"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Download Merit List PDF</span>
              </a>
            )}

            <Link
              href="/copilot"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-300 font-medium text-xs flex items-center justify-center gap-2 transition-all border border-emerald-500/20 text-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prepare Next Stage with AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-zinc-950/95 backdrop-blur-lg border-t border-white/10 flex items-center gap-2 shadow-2xl">
        {isDeclared ? (
          <a
            href={checkResultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow transition-all"
          >
            <span>Check Result Now</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <a
            href={notice.source.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2"
          >
            <span>Check Commission Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {scorecardUrl && (
          <a
            href={scorecardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0"
            title="Download Scorecard"
          >
            <Award className="w-4 h-4" />
          </a>
        )}

        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-400 border border-white/10 shrink-0"
          title="Share to WhatsApp"
        >
          <Send className="w-4 h-4 rotate-45" />
        </a>
      </div>
    </>
  );
}
