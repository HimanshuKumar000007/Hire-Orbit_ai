"use client";

import { UniversalResultNotice } from "@/lib/universal-notice-model";
import { 
  ExternalLink, 
  Award, 
  FileText, 
  ShieldCheck, 
  Globe, 
  Sparkles,
  Send,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface ResultPrimaryActionsProps {
  notice: UniversalResultNotice;
}

export function ResultPrimaryActions({ notice }: ResultPrimaryActionsProps) {
  const checkResultUrl = notice.primaryActionUrls.checkResultUrl || notice.source.officialUrl;
  const scorecardUrl = notice.primaryActionUrls.downloadScorecardUrl;
  const cutoffUrl = notice.primaryActionUrls.checkCutoffUrl;
  const meritListUrl = notice.primaryActionUrls.downloadMeritListUrl;
  const officialPortalUrl = notice.primaryActionUrls.officialPortalUrl;

  const isDeclared = notice.status !== 'EXPECTED_SOON';
  const isOfficialResult = checkResultUrl ? (
    checkResultUrl.includes(".gov.in") || 
    checkResultUrl.includes(".nic.in") || 
    checkResultUrl.includes(".ac.in") ||
    checkResultUrl.includes("ibps.in") ||
    checkResultUrl.includes("sbi.co.in")
  ) : false;

  const resultSourceLabel = isOfficialResult ? "Official Portal" : "Source Confirmed";

  const shareText = `🚨 *${notice.title}*\nStatus: ${notice.statusLabel}\nAuthority: ${notice.authority}\nCheck Result & Cutoff: https://hireorbitai.in/gov/${notice.slug}`;

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 border border-emerald-500/20 mb-8 bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-950 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Primary Result Action Center
          </h2>
        </div>

        <span className="text-[11px] font-semibold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 w-fit">
          Direct Candidate Gateways • {resultSourceLabel}
        </span>
      </div>

      {/* Grid of Action Buttons (Only rendered when URLs actually exist) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. CHECK RESULT (Most Prominent) */}
        {checkResultUrl && isDeclared && (
          <a
            href={checkResultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-glow hover:scale-[1.02] text-center"
          >
            <span>CHECK RESULT</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* 2. DOWNLOAD SCORECARD */}
        {scorecardUrl && (
          <a
            href={scorecardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-center"
          >
            <Award className="w-4 h-4 text-blue-400" />
            <span>DOWNLOAD SCORECARD</span>
          </a>
        )}

        {/* 3. CHECK CUTOFF */}
        {cutoffUrl && (
          <a
            href={cutoffUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-center"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>CHECK CUTOFF</span>
          </a>
        )}

        {/* 4. DOWNLOAD MERIT LIST */}
        {meritListUrl && (
          <a
            href={meritListUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-center"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>DOWNLOAD MERIT LIST</span>
          </a>
        )}

        {/* 5. OFFICIAL / SOURCE PORTAL */}
        {officialPortalUrl && (
          <a
            href={officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all text-center"
          >
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>OFFICIAL / SOURCE PORTAL</span>
          </a>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-zinc-950/95 backdrop-blur-lg border-t border-white/10 flex items-center gap-2 shadow-2xl">
        {isDeclared && checkResultUrl ? (
          <a
            href={checkResultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow transition-all"
          >
            <span>CHECK RESULT</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <a
            href={officialPortalUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2"
          >
            <span>CHECK COMMISSION PORTAL</span>
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
    </div>
  );
}
