import { UniversalNoticeLink } from "@/lib/universal-notice-model";
import { Link2, ExternalLink, ShieldCheck, ArrowRight, Sparkles, FileText, Award } from 'lucide-react';
import Link from 'next/link';

interface ResultOfficialLinksProps {
  links: UniversalNoticeLink[];
  authority: string;
}

export function ResultOfficialLinks({ links, authority }: ResultOfficialLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const getBadgeStyle = (color?: UniversalNoticeLink['badgeColor']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-white/10 text-zinc-300 border-white/10';
    }
  };

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Link2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Official Links Command Center
            </h2>
            <p className="text-xs text-zinc-400">
              Direct official commission gateways verified by HireOrbitAI
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Spam Verified</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-white/5 text-zinc-400 font-semibold border-b border-white/5 text-xs">
            <tr>
              <th className="py-3 px-4">Official Result Resource / Action</th>
              <th className="py-3 px-4 hidden md:table-cell">Source &amp; Verification</th>
              <th className="py-3 px-4 text-right">Access Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {links.map((link, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white flex items-center gap-2">
                    {link.type === 'syllabus' ? (
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : link.type === 'notification_pdf' ? (
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : link.type === 'result' ? (
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    )}
                    <span className="truncate max-w-[260px] sm:max-w-md">{link.title}</span>
                  </div>
                  {link.badge && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStyle(link.badgeColor)}`}>
                      {link.badge}
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 hidden md:table-cell text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    {link.isOfficial && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <span className="truncate max-w-[200px]">{link.sourceNote || authority}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {link.isExternal ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-glow-sm hover:scale-105"
                    >
                      <span>Click Here</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.url}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all hover:scale-105"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
