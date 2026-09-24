"use client";

import Link from 'next/link';
import { useState } from 'react';
import { UniversalResultNotice } from "@/lib/universal-notice-model";
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  Share2, 
  Check, 
  MapPin, 
  Award,
  ChevronRight,
  Send,
  GraduationCap
} from 'lucide-react';

interface ResultHeroProps {
  notice: UniversalResultNotice;
}

export function ResultHero({ notice }: ResultHeroProps) {
  const [copied, setCopied] = useState(false);

  const getStatusBadgeStyle = (color: UniversalResultNotice['statusBadgeColor']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-white/10 text-zinc-300 border-white/10';
    }
  };

  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://hireorbitai.in/gov/${notice.slug}`;

  const shareText = `🚨 *${notice.title}*\n🏢 Organization: ${notice.authority}\n📊 Stage: ${notice.stage}\n✅ Status: ${notice.statusLabel}\nCheck result, download scorecard & cutoff marks: ${shareUrl}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any).share({
        title: notice.title,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="relative pt-6 pb-6 overflow-hidden border-b border-white/5">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[250px] bg-emerald-500/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-10 right-10 w-[400px] h-[200px] bg-blue-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-4 overflow-x-auto pb-1 scrollbar-none">
          <Link href="/" className="hover:text-emerald-400 transition-colors whitespace-nowrap">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/gov" className="hover:text-emerald-400 transition-colors whitespace-nowrap">Govt Newsroom</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-zinc-300 font-medium truncate max-w-[280px] sm:max-w-md">
            {notice.shortTitle || notice.examName}
          </span>
        </nav>

        {/* Verification Ribbon & Type Pill */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            {notice.source.verificationStatus}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-emerald-400" />
            RESULT DECLARED
          </span>

          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            {notice.category.toUpperCase()}
          </span>

          {notice.region && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {notice.region}
            </span>
          )}
        </div>

        {/* Dynamic H1 Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          {notice.title}
        </h1>

        {/* Under Title Meta Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-white font-semibold">{notice.authority}</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Award className="w-4 h-4 shrink-0" />
              <span>{notice.stage}</span>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(notice.statusBadgeColor)}`}>
              {notice.statusLabel}
            </span>

            <div className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{notice.updatedAt}</span>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3 h-3 rotate-45" />
              WhatsApp
            </a>

            <button
              onClick={handleNativeShare}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
              title="Share link"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
