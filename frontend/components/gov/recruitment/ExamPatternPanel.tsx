import { UniversalRecruitmentNotice } from "@/lib/universal-notice-model";
import { BookOpen, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ExamPatternPanelProps {
  examPattern: UniversalRecruitmentNotice['examPattern'];
}

export function ExamPatternPanel({ examPattern }: ExamPatternPanelProps) {
  if (!examPattern) {
    return null;
  }

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Official Examination Scheme &amp; Pattern
            </h2>
            <p className="text-xs text-zinc-400">
              {examPattern.tierName || 'Written Examination'} • Marking scheme &amp; subject breakdown
            </p>
          </div>
        </div>

        {examPattern.mode && (
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
            {examPattern.mode}
          </span>
        )}
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {examPattern.totalQuestions && (
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-[11px] text-zinc-400 font-medium">Total Questions</div>
            <div className="text-lg font-black text-white mt-0.5">{examPattern.totalQuestions}</div>
          </div>
        )}
        {examPattern.totalMarks && (
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-[11px] text-zinc-400 font-medium">Total Marks</div>
            <div className="text-lg font-black text-emerald-400 mt-0.5">{examPattern.totalMarks}</div>
          </div>
        )}
        {examPattern.duration && (
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-[11px] text-zinc-400 font-medium">Exam Duration</div>
            <div className="text-lg font-black text-blue-400 mt-0.5">{examPattern.duration}</div>
          </div>
        )}
        {examPattern.negativeMarking && (
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-[11px] text-zinc-400 font-medium">Negative Marking</div>
            <div className="text-lg font-black text-rose-400 mt-0.5">{examPattern.negativeMarking}</div>
          </div>
        )}
      </div>

      {/* Subject-Wise Table */}
      {examPattern.subjects && examPattern.subjects.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 font-semibold border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Subject / Section</th>
                <th className="py-3 px-4 text-center">No. of Questions</th>
                <th className="py-3 px-4 text-center">Maximum Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {examPattern.subjects.map((sub, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{sub.name}</td>
                  <td className="py-3 px-4 text-center font-bold text-zinc-300">{sub.questions}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">{sub.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
