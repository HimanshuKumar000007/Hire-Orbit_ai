import React from 'react';
import { UniversalNotice } from '@/lib/universal-notice-model';
import { Layers, BookOpen, GraduationCap, Users } from 'lucide-react';

interface ConditionalPanelsProps {
  notice: UniversalNotice;
}

export function ConditionalPanels({ notice }: ConditionalPanelsProps) {
  const { vacancy, examPattern, eligibility } = notice;

  return (
    <>
      {/* ── 1. VACANCY PANEL (STRICTLY HIDDEN IF NULL OR NOT APPLICABLE, e.g. UGC NET) ── */}
      {vacancy && vacancy.postHierarchy && vacancy.postHierarchy.length > 0 && (
        <section className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" /> Verified Recruitment Hierarchy
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Post-Wise Vacancy &amp; Cadre Breakdown
              </h3>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-zinc-400 border border-white/10">
              Total: {vacancy.total}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/10 text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Post Name</th>
                  <th className="py-3 px-4">Pay Scale</th>
                  <th className="py-3 px-4 sm:px-6">Criteria / Requirements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {vacancy.postHierarchy.map((post, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span>{post.postName}</span>
                      </div>
                      {post.classification && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {post.classification}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-semibold text-xs">
                      {post.payScale || "As per rules"}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-zinc-300 text-xs">
                      {post.qualification || "Refer Gazette Notice"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 2. EXAM PATTERN & SCHEME (ONLY SHOWN WHEN VERIFIED DATA EXISTS) ── */}
      {examPattern && (
        <section className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" /> Examination Scheme
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {examPattern.tierName || "Exam Pattern & Scheme of Examination"}
              </h3>
            </div>
            {examPattern.mode && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {examPattern.mode}
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5 text-xs">
              {examPattern.duration && (
                <span className="px-2.5 py-1 rounded bg-white/5 text-zinc-300 font-medium border border-white/5">
                  Duration: {examPattern.duration}
                </span>
              )}
              {examPattern.negativeMarking && (
                <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-medium border border-red-500/20">
                  Marking Scheme: {examPattern.negativeMarking}
                </span>
              )}
            </div>

            {examPattern.subjects && examPattern.subjects.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-zinc-500 border-b border-white/5 font-semibold">
                      <th className="py-2">Subject / Section</th>
                      <th className="py-2 text-center">Questions</th>
                      <th className="py-2 text-right">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {examPattern.subjects.map((sub, sIdx) => (
                      <tr key={sIdx}>
                        <td className="py-2.5 font-medium text-white">{sub.name}</td>
                        <td className="py-2.5 text-center text-zinc-400">{sub.questions}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-400">{sub.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 3. ELIGIBILITY PANEL (ONLY SHOWN WHEN VERIFIED QUALIFICATION EXISTS) ── */}
      {eligibility && (
        <section className="glass p-6 sm:p-7 rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" /> Prescribed Eligibility Standard
          </div>
          <h3 className="text-lg font-bold text-white">Educational Qualification &amp; Criteria</h3>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 text-xs text-zinc-300 space-y-2">
            <p className="leading-relaxed">
              <strong className="text-white">Minimum Qualification: </strong>
              {eligibility.qualification}
            </p>
            {eligibility.ageLimit && (
              <p className="text-zinc-400 border-t border-white/5 pt-2">
                <strong className="text-zinc-200">Prescribed Age Limit: </strong>
                {eligibility.ageLimit}
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}
