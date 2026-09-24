import React from 'react';
import Link from 'next/link';
import { UniversalNotice } from '@/lib/universal-notice-model';
import { 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Send, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

interface AdmitCardHeroProps {
  notice: UniversalNotice;
}

export function AdmitCardHero({ notice }: AdmitCardHeroProps) {
  const shareUrl = `https://hireorbitai.in/gov/${notice.slug}`;
  const shareText = `🚨 *${notice.title}*\nAuthority: ${notice.authority}\nCheck status, verified download link & instructions: ${shareUrl}`;

  return (
    <header className="space-y-6">
      {/* ── BREADCRUMB & NAVIGATION ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/gov"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Govt Newsroom
        </Link>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20 transition-all"
            title="Share on WhatsApp"
          >
            <Share2 className="w-3 h-3" /> WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(notice.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5 border border-blue-500/20 transition-all"
            title="Share on Telegram"
          >
            <Send className="w-3 h-3" /> Telegram
          </a>
        </div>
      </div>

      {/* ── BADGE PILL RIBBON ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          ADMIT CARD
        </span>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Official Source Verified
        </span>

        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-zinc-400 border border-white/10 uppercase tracking-wide">
          {notice.category}
        </span>

        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Updated: {notice.source.lastVerifiedAt}
        </span>
      </div>

      {/* ── DYNAMIC H1 (DATABASE TITLE) ── */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
        {notice.title}
      </h1>

      {/* ── RECRUITING & EXAM AUTHORITY SUMMARY STRIP ── */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-300 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-zinc-400">Exam Authority:</span>
          <span className="font-semibold text-white">{notice.authority}</span>
        </div>

        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-zinc-400">Exam Name:</span>
          <span className="font-semibold text-white">{notice.examName}</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-zinc-400">Status:</span>
          <span className="font-bold text-emerald-400">{notice.statusLabel}</span>
        </div>
      </div>
    </header>
  );
}
