"use client";

import { UniversalRecruitmentNotice, isRealDateString } from "@/lib/universal-notice-model";
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  AlertCircle,
  Calendar,
  Send,
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface RecruitmentStatusCardProps {
  notice: UniversalRecruitmentNotice;
}

export function RecruitmentStatusCard({ notice }: RecruitmentStatusCardProps) {
  const primaryApplyLink = notice.links.find(l => l.type === 'apply_online')?.url || notice.source.officialUrl;
  const primaryPdfLink = notice.links.find(l => l.type === 'notification_pdf')?.url || notice.source.officialUrl;

  const isAnswerKey = notice.status === 'ANSWER_KEY_OUT' || 
    (notice as any).type === 'answer-key' ||
    /answer\s*key/i.test(notice.title) ||
    /answer\s*key/i.test(notice.statusLabel);

  const isLive = notice.status === 'APPLICATION_OPEN' || notice.status === 'ANSWER_KEY_OUT';
  const isStartingSoon = notice.status === 'APPLICATION_STARTING_SOON';
  const isClosed = notice.status === 'APPLICATION_CLOSED';
  const isCorrection = notice.status === 'CORRECTION_OPEN';

  const shareText = `🚨 *${notice.title}*\nStatus: ${notice.statusLabel}\nLast Date: ${notice.dates.applicationLastDate || 'Check Notification'}\nApply: https://hireorbitai.in/gov/${notice.slug}`;

  return (
    <>
      <div className="rounded-3xl p-6 sm:p-8 glass border border-white/10 relative overflow-hidden bg-gradient-to-br from-emerald-950/20 via-zinc-900/60 to-zinc-950 mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* Status Indicator */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-glow-sm ${
                isLive
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : isStartingSoon
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : isCorrection
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isLive ? 'bg-emerald-400 animate-pulse' : isStartingSoon ? 'bg-amber-400' : isCorrection ? 'bg-blue-400' : 'bg-rose-400'
                }`} />
                {notice.statusLabel}
              </span>

              {notice.dates.applicationLastDate && isLive && isRealDateString(notice.dates.applicationLastDate) && !isAnswerKey && (
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  Last Date: {notice.dates.applicationLastDate}
                </span>
              )}
            </div>

            {/* Clear Summary Narrative */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {notice.summary}
            </p>

            {/* Quick Key Specs Pill */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
              {notice.vacancy?.total && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{notice.vacancy.total} Verified Vacancies</span>
                </div>
              )}
              {notice.dates.applicationStart && isRealDateString(notice.dates.applicationStart) && !isAnswerKey && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span>Started: {notice.dates.applicationStart}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-72">
            {!isClosed ? (
              <a
                href={primaryApplyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow hover:scale-[1.02] text-center"
              >
                <span>{isAnswerKey ? "Check Answer Key (Official)" : "Apply Online (Official)"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="w-full py-3 px-4 rounded-xl bg-zinc-800/80 border border-white/10 text-zinc-400 font-semibold text-xs text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Application Window Closed</span>
              </div>
            )}

            <a
              href={primaryPdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-white/10 text-center"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>{isAnswerKey ? "Download Official Circular PDF" : "Download Official Notification PDF"}</span>
            </a>

            <Link
              href="/onboarding"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-300 font-medium text-xs flex items-center justify-center gap-2 transition-all border border-emerald-500/20 text-center"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Check Eligibility with AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-zinc-950/95 backdrop-blur-lg border-t border-white/10 flex items-center gap-2 shadow-2xl">
        {!isClosed ? (
          <a
            href={primaryApplyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow transition-all"
          >
            <span>{isAnswerKey ? "Check Answer Key" : "Apply Online Now"}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <a
            href={primaryPdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Download Notification PDF</span>
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
