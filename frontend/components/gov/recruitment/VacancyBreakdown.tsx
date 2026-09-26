import { UniversalRecruitmentNotice } from "@/lib/universal-notice-model";
import { Award, Users, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

interface VacancyBreakdownProps {
  vacancy: UniversalRecruitmentNotice['vacancy'];
}

export function VacancyBreakdown({ vacancy }: VacancyBreakdownProps) {
  const isKnown = vacancy && vacancy.isKnown && !!vacancy.total;
  const category = isKnown ? vacancy!.categoryDistribution : undefined;
  const posts = isKnown ? vacancy!.postHierarchy : undefined;

  return (
    <div className="rounded-2xl glass border border-white/10 mb-8 bg-zinc-900/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Award className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-white leading-tight">
            Official Vacancy Breakdown
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
            Post-wise and category-wise distribution verified from gazette notification
          </p>
        </div>
        {isKnown ? (
          <div className="hidden sm:flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{vacancy!.total} Posts</span>
          </div>
        ) : (
          <span className="hidden sm:inline-flex shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-zinc-500">
            Awaiting Data
          </span>
        )}
      </div>

      {/* No Data State */}
      {!isKnown && (
        <div className="flex flex-col items-center justify-center py-10 px-5 text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-400">Vacancy Data Not Yet Available</p>
            <p className="text-[11px] text-zinc-600 mt-1 max-w-xs">
              Post-wise vacancy numbers are yet to be released by the official gazette. Check the official portal or notification PDF for the latest update.
            </p>
          </div>
        </div>
      )}

      {/* Category-Wise Reservation Matrix (if verified) */}
      {isKnown && category && (
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Category-Wise Vacancy Distribution
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm border-collapse rounded-xl overflow-hidden border border-white/5">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  {[
                    { label: "UR", full: "Unreserved (UR)", val: category.ur, color: "text-white" },
                    { label: "OBC", full: "OBC (NCL)", val: category.obc, color: "text-blue-400" },
                    { label: "EWS", full: "EWS", val: category.ews, color: "text-amber-400" },
                    { label: "SC", full: "SC", val: category.sc, color: "text-purple-400" },
                    { label: "ST", full: "ST", val: category.st, color: "text-rose-400" },
                    { label: "Total", full: "Total Posts", val: category.total, color: "text-emerald-400" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className="text-center text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2.5"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="divide-x divide-white/[0.04]">
                  {[
                    { val: category.ur, color: "text-white", bg: "" },
                    { val: category.obc, color: "text-blue-400", bg: "" },
                    { val: category.ews, color: "text-amber-400", bg: "" },
                    { val: category.sc, color: "text-purple-400", bg: "" },
                    { val: category.st, color: "text-rose-400", bg: "" },
                    { val: category.total, color: "text-emerald-400", bg: "bg-emerald-500/[0.05]" },
                  ].map((col, i) => (
                    <td
                      key={i}
                      className={`text-center py-4 px-4 ${col.bg}`}
                    >
                      <span className={`text-xl font-black ${col.color}`}>
                        {col.val ?? '—'}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post-Wise Details Table (if verified) */}
      {isKnown && posts && posts.length > 0 && (
        <div className={`px-5 pt-4 pb-4 ${category ? 'border-t border-white/5 mt-4' : ''}`}>
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Post-Wise Details &amp; Educational Qualification
          </h3>
          <div className="w-full overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5 text-zinc-500 font-semibold">
                  <th className="py-2.5 px-4">Post Name / Cadre</th>
                  <th className="py-2.5 px-4">Department / Ministry</th>
                  <th className="py-2.5 px-4 text-center">Vacancies</th>
                  <th className="py-2.5 px-4">Pay Scale / Level</th>
                  <th className="py-2.5 px-4">Eligibility / Qualification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {posts.map((post, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {post.postName}
                      {post.classification && (
                        <span className="block text-[10px] text-zinc-500 font-normal mt-0.5">
                          {post.classification}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                      {post.department || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 text-center whitespace-nowrap">
                      {post.vacancies || 'As Notified'}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                      {post.payScale || '7th CPC Matrix'}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 min-w-[200px]">
                      {post.qualification || 'Relevant Qualification'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* If known total but no category or post breakdown */}
      {isKnown && !category && (!posts || posts.length === 0) && (
        <div className="px-5 py-5">
          <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15">
            <span className="text-xs font-semibold text-zinc-400">Total Announced Vacancies</span>
            <span className="text-xl font-black text-emerald-400">{vacancy!.total}</span>
          </div>
          <p className="text-[11px] text-zinc-600 mt-3 px-1">
            Category-wise and post-wise breakdown to be updated once official gazette is published.
          </p>
        </div>
      )}
    </div>
  );
}
