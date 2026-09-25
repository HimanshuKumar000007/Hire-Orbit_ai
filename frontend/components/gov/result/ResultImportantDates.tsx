import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { isRealDateString } from '@/lib/universal-notice-model';

interface ResultDates {
  examDate?: string;
  answerKeyDate?: string;
  resultDate?: string;
  scorecardDate?: string;
  cutoffDate?: string;
  meritListDate?: string;
  nextStageDate?: string;
  models?: Record<string, any>;
}

interface ResultImportantDatesProps {
  dates: ResultDates;
}

export function ResultImportantDates({ dates }: ResultImportantDatesProps) {
  // Collect only valid dates that actually exist (no N/A or UI placeholder phrases)
  const items: Array<{ label: string; date: string; tag?: string; tagColor?: string; isImportant?: boolean }> = [];

  if (dates.examDate && isRealDateString(dates.examDate)) {
    items.push({
      label: "Examination Held On",
      date: dates.examDate,
      tag: "Conducted",
      tagColor: "text-zinc-300 bg-white/5 border-white/10"
    });
  }

  if (dates.answerKeyDate && isRealDateString(dates.answerKeyDate)) {
    items.push({
      label: "Provisional Answer Key Release",
      date: dates.answerKeyDate,
      tag: "Answer Key",
      tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    });
  }

  if (dates.resultDate && isRealDateString(dates.resultDate)) {
    items.push({
      label: "Official Result Declaration Date",
      date: dates.resultDate,
      tag: "Declared",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      isImportant: true
    });
  }

  if (dates.scorecardDate && isRealDateString(dates.scorecardDate)) {
    items.push({
      label: "Scorecard & Individual Marks Live",
      date: dates.scorecardDate,
      tag: "Scorecard",
      tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      isImportant: true
    });
  }

  if (dates.cutoffDate && isRealDateString(dates.cutoffDate)) {
    items.push({
      label: "Category Cutoff Marks Published",
      date: dates.cutoffDate,
      tag: "Cutoff",
      tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    });
  }

  if (dates.meritListDate && isRealDateString(dates.meritListDate)) {
    items.push({
      label: "Merit List / Selected Candidates PDF",
      date: dates.meritListDate,
      tag: "Merit List",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    });
  }

  if (dates.nextStageDate && isRealDateString(dates.nextStageDate)) {
    items.push({
      label: "Tentative Date for Next Stage / DV",
      date: dates.nextStageDate,
      tag: "Next Phase",
      tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Important Result & Examination Dates
            </h2>
            <p className="text-xs text-zinc-400">
              Verified chronological schedule as per official commission notices
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-zinc-400">
          Official Chronology
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
              item.isImportant
                ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            <div className="space-y-1 min-w-0">
              <div className="text-xs text-zinc-400 font-medium truncate" title={item.label}>
                {item.label}
              </div>
              <div className={`font-bold text-sm sm:text-base ${
                item.isImportant ? 'text-emerald-400' : 'text-white'
              }`}>
                {item.date}
              </div>
            </div>

            {item.tag && (
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border shrink-0 ${item.tagColor}`}>
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
