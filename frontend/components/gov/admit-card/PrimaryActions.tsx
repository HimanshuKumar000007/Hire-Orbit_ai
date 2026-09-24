import React from 'react';
import { UniversalNotice } from '@/lib/universal-notice-model';
import { Download, ExternalLink, MapPin, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PrimaryActionsProps {
  notice: UniversalNotice;
}

export function PrimaryActions({ notice }: PrimaryActionsProps) {
  const { downloadAdmitCardUrl, downloadCitySlipUrl, officialPortalUrl } = notice.primaryActionUrls;

  return (
    <>
      {/* ── DESKTOP & TABLET PRIMARY COMMAND BUTTONS ── */}
      <section className="flex flex-wrap items-center gap-3 p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-lg">
        {/* Priority 1: Download Admit Card */}
        {downloadAdmitCardUrl ? (
          <a
            href={downloadAdmitCardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-glow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Admit Card
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        ) : (
          <div className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-semibold text-xs flex items-center justify-center gap-2">
            <span>Admit Card Link:</span>
            <span className="text-amber-400 font-medium">To be activated 3-4 days before exam</span>
          </div>
        )}

        {/* Priority 2: Download Exam City Slip (Only if present and distinct) */}
        {downloadCitySlipUrl && (
          <a
            href={downloadCitySlipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-sm cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            Check Exam City / Center Slip
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        )}

        {/* Priority 3: Official Authority Portal */}
        {officialPortalUrl && (
          <a
            href={officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            Official Authority Portal
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        )}

        {/* Quick AI Compatibility Check */}
        <Link
          href="/onboarding"
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-emerald-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Verify Eligibility with AI
        </Link>
      </section>

      {/* ── MOBILE STICKY BOTTOM ACTION BAR ── */}
      <aside 
        aria-label="Quick Actions"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-zinc-950/95 backdrop-blur-md border-t border-white/15 shadow-2xl flex items-center gap-2"
      >
        {downloadAdmitCardUrl ? (
          <a
            href={downloadAdmitCardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-glow-sm"
          >
            <Download className="w-4 h-4" />
            Download Admit Card ↗
          </a>
        ) : downloadCitySlipUrl ? (
          <a
            href={downloadCitySlipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-glow-sm"
          >
            <MapPin className="w-4 h-4" />
            Exam City Slip ↗
          </a>
        ) : (
          <a
            href={officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            Official Portal ↗
          </a>
        )}

        <a
          href={officialPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-3 rounded-xl bg-white/10 text-white font-semibold text-xs flex items-center justify-center border border-white/10"
          title="Official Website"
        >
          <Building2 className="w-4 h-4" />
        </a>
      </aside>
    </>
  );
}
