import React from 'react';
import { UniversalNoticeLink } from '@/lib/universal-notice-model';
import { FileCheck, ExternalLink, ShieldCheck, Sparkles, Download, Check } from 'lucide-react';
import Link from 'next/link';

interface OfficialLinksCommandCenterProps {
  links: UniversalNoticeLink[];
  authorityName: string;
}

export function OfficialLinksCommandCenter({ links, authorityName }: OfficialLinksCommandCenterProps) {
  if (!links || links.length === 0) return null;

  const getBadgeStyle = (badgeColor?: string) => {
    switch (badgeColor) {
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'blue':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'amber':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'purple':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-white/10 text-zinc-300 border-white/10';
    }
  };

  return (
    <section className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" /> Official Gazette Access
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Some Useful Important Links</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct Verified Portals Only
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-400">
        All links point directly to the authenticated commission servers of {authorityName}. Zero promotional redirects or third-party ads.
      </p>

      {/* ── HIGH-CONTRAST 2-COLUMN COMMAND CENTER TABLE ── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80">
        {/* Table Header */}
        <div className="hidden sm:grid sm:grid-cols-12 px-5 py-3 bg-white/[0.04] border-b border-white/10 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <div className="sm:col-span-8">Document / Official Resource</div>
          <div className="sm:col-span-4 sm:text-right">Action / Direct Link</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {links.map((link, idx) => {
            const isPrimary = link.type === 'admit_card' || link.type === 'city_slip';
            const isAI = link.verificationLevel === 'GENERATED';

            return (
              <div
                key={idx}
                className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
              >
                {/* Resource Info */}
                <div className="sm:max-w-[65%] space-y-1">
                  <div className="font-bold text-white text-sm flex flex-wrap items-center gap-2">
                    <span>{link.title}</span>
                    {link.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStyle(link.badgeColor)}`}>
                        {link.badge}
                      </span>
                    )}
                    {link.verificationLevel === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                        <Check className="w-3 h-3" /> Official
                      </span>
                    )}
                  </div>
                  {link.sourceNote && (
                    <p className="text-xs text-zinc-400">{link.sourceNote}</p>
                  )}
                </div>

                {/* Direct Action Link */}
                <div className="shrink-0 sm:text-right">
                  {link.isExternal ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isPrimary
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-glow-sm'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                      }`}
                    >
                      <span>Click Here</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={link.url}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-xs font-bold transition-all shadow-glow-sm"
                    >
                      <span>AI Exam Copilot</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
