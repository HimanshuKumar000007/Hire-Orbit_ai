import { UniversalResultNotice } from "@/lib/universal-notice-model";
import { TrendingUp, FileText, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface CutoffPanelProps {
  cutoff: UniversalResultNotice['cutoff'];
  authority: string;
}

export function CutoffPanel({ cutoff, authority }: CutoffPanelProps) {
  if (!cutoff || !cutoff.isReleased) return null;

  const hasCategoryCutoffs = cutoff.categoryCutoffs && cutoff.categoryCutoffs.length > 0;
  const hasPostCutoffs = cutoff.postCutoffs && cutoff.postCutoffs.length > 0;

  return (
    <div className="rounded-2xl glass p-6 border border-amber-500/20 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Official Category Cutoff Marks
            </h2>
            <p className="text-xs text-zinc-400">
              Verified qualifying marks and minimum threshold released by {authority}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
          Official Cutoff Released
        </span>
      </div>

      {/* Official Note */}
      <div className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 mb-5 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 leading-relaxed">
          {cutoff.officialNote || "The cut-off marks for shortlisting candidates have been officially declared in the examination write-up notice. Normalized scores have been considered wherever applicable."}
        </div>
      </div>

      {/* Category Cutoff Table if explicitly available */}
      {hasCategoryCutoffs && (
        <div className="overflow-x-auto mb-5 rounded-xl border border-white/5">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/[0.03] text-zinc-400 font-semibold border-b border-white/5 uppercase">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Qualifying Cutoff Marks</th>
                <th className="py-3 px-4">Qualifying Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {cutoff.categoryCutoffs!.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-white">{item.category}</td>
                  <td className="py-3 px-4 text-amber-400 font-extrabold text-sm">{item.cutoffMarks}</td>
                  <td className="py-3 px-4 text-emerald-400">{item.qualifyingStatus || "Shortlisted for Next Stage"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Post Wise Cutoff Table if available */}
      {hasPostCutoffs && (
        <div className="space-y-4 mb-5">
          {cutoff.postCutoffs!.map((post, pIdx) => (
            <div key={pIdx} className="rounded-xl border border-white/5 overflow-hidden">
              <div className="bg-white/[0.03] px-4 py-2 text-xs font-bold text-white border-b border-white/5">
                {post.postName}
              </div>
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="text-zinc-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Cutoff Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {post.categoryCutoffs.map((c, cIdx) => (
                    <tr key={cIdx}>
                      <td className="py-2.5 px-4 font-semibold text-zinc-200">{c.category}</td>
                      <td className="py-2.5 px-4 text-amber-400 font-bold">{c.cutoffMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* PDF Writeup CTA */}
      {cutoff.cutoffPdfUrl && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-xs text-zinc-400">
            For detailed category-wise cut-off breakdown, tie-breaking criteria, and normalization formulae, consult the official PDF notice.
          </div>
          <a
            href={cutoff.cutoffPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Official Cutoff Notice PDF</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
