import { UniversalRecruitmentNotice } from "@/lib/universal-notice-model";
import { Award, Users, Layers, ShieldCheck } from 'lucide-react';

interface VacancyBreakdownProps {
  vacancy: UniversalRecruitmentNotice['vacancy'];
}

export function VacancyBreakdown({ vacancy }: VacancyBreakdownProps) {
  // STRICT DATA SAFETY: If vacancy is null or not known, return null (never invent numbers)
  if (!vacancy || !vacancy.total || !vacancy.isKnown) {
    return null;
  }

  const category = vacancy.categoryDistribution;
  const posts = vacancy.postHierarchy;

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Official Vacancy Breakdown
            </h2>
            <p className="text-xs text-zinc-400">
              Post-wise and category-wise distribution verified from gazette notification
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{vacancy.total} Posts</span>
        </div>
      </div>

      {/* Category-wise Reservation Matrix (if verified) */}
      {category && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Category-Wise Vacancy Distribution
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { label: "Unreserved (UR)", count: category.ur, color: "text-white" },
              { label: "OBC (NCL)", count: category.obc, color: "text-blue-400" },
              { label: "EWS", count: category.ews, color: "text-amber-400" },
              { label: "SC", count: category.sc, color: "text-purple-400" },
              { label: "ST", count: category.st, color: "text-rose-400" },
              { label: "Total Posts", count: category.total, color: "text-emerald-400", highlight: true }
            ].map((cat, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-xl border text-center ${
                  cat.highlight 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="text-[11px] text-zinc-400 font-medium truncate">{cat.label}</div>
                <div className={`text-base font-black mt-1 ${cat.color}`}>{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post-Wise Vacancy & Specs Table (if verified) */}
      {posts && posts.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Post-Wise Details &amp; Educational Qualification
          </h3>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-zinc-400 font-semibold border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Post Name / Cadre</th>
                  <th className="py-3 px-4">Department / Ministry</th>
                  <th className="py-3 px-4 text-center">Vacancies</th>
                  <th className="py-3 px-4">Pay Scale / Level</th>
                  <th className="py-3 px-4">Eligibility / Qualification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
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
    </div>
  );
}
