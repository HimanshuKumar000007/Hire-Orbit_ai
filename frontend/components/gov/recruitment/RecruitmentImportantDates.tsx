import { UniversalNoticeDates, isRealDateString } from "@/lib/universal-notice-model";
import { Calendar, ChevronsRight } from 'lucide-react';

interface RecruitmentImportantDatesProps {
  dates: UniversalNoticeDates;
}

export function RecruitmentImportantDates({ dates }: RecruitmentImportantDatesProps) {
  // Collect only valid calendar dates — isRealDateString blocks all placeholder strings
  // (e.g. "Active / Check Official Portal", "Same as Application Last Date", etc.)
  const items: Array<{ label: string; date: string; tag?: string; accentClass: string; isImportant?: boolean }> = [];

  if (dates.applicationStart && isRealDateString(dates.applicationStart)) {
    items.push({
      label: "Application Start",
      date: dates.applicationStart,
      tag: "Opens",
      accentClass: "border-l-emerald-500 text-emerald-400",
    });
  }

  if (dates.applicationLastDate && isRealDateString(dates.applicationLastDate)) {
    const isClosed = dates.applicationLastStatus === 'closed';
    items.push({
      label: "Last Date to Apply",
      date: dates.applicationLastDate,
      tag: isClosed ? "Closed" : "Deadline",
      accentClass: isClosed ? "border-l-rose-500 text-rose-400" : "border-l-amber-500 text-amber-400",
      isImportant: true,
    });
  }

  if (dates.feeLastDate && isRealDateString(dates.feeLastDate)) {
    items.push({
      label: "Fee Payment Deadline",
      date: dates.feeLastDate,
      tag: "Fee",
      accentClass: "border-l-zinc-500 text-zinc-300",
    });
  }

  if (dates.correctionLastDate && isRealDateString(dates.correctionLastDate)) {
    items.push({
      label: "Form Correction Window",
      date: dates.correctionLastDate,
      tag: "Correction",
      accentClass: "border-l-blue-500 text-blue-400",
    });
  }

  if (dates.citySlipDate && isRealDateString(dates.citySlipDate)) {
    items.push({
      label: "Exam City Slip Release",
      date: dates.citySlipDate,
      tag: "City Slip",
      accentClass: "border-l-blue-500 text-blue-400",
    });
  }

  if (dates.examDate && isRealDateString(dates.examDate)) {
    items.push({
      label: "Written Exam / CBT Date",
      date: dates.examDate,
      tag: "Exam",
      accentClass: "border-l-purple-500 text-purple-400",
    });
  }

  if (dates.admitCardDate && isRealDateString(dates.admitCardDate)) {
    items.push({
      label: "Admit Card Release",
      date: dates.admitCardDate,
      tag: "Hall Ticket",
      accentClass: "border-l-zinc-500 text-zinc-300",
    });
  }

  if (dates.answerKeyDate && isRealDateString(dates.answerKeyDate)) {
    items.push({
      label: "Provisional Answer Key",
      date: dates.answerKeyDate,
      tag: "Answer Key",
      accentClass: "border-l-zinc-500 text-zinc-300",
    });
  }

  if (dates.resultDate && isRealDateString(dates.resultDate)) {
    items.push({
      label: "Result & Merit List",
      date: dates.resultDate,
      tag: "Result",
      accentClass: "border-l-emerald-500 text-emerald-400",
    });
  }

  // If no real calendar dates found, hide the section entirely
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 border border-white/10 mb-8 bg-zinc-900/40">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-white leading-tight">
            Important Dates &amp; Schedule
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
            Official chronological timeline · {items.length} event{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span className="hidden sm:inline-flex shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-zinc-500">
          Gazette Verified
        </span>
      </div>

      {/* Timeline list — full-width rows, no grid wrapping */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl border-l-2 ${
              item.isImportant
                ? 'bg-amber-500/[0.05] border border-amber-500/20 border-l-amber-500'
                : 'bg-white/[0.02] border border-white/5 border-l-white/20 hover:border-l-white/40 transition-colors'
            } ${item.isImportant ? '' : item.accentClass.includes('border-l-') ? item.accentClass.split(' ')[0] : ''}`}
          >
            {/* Label — left, fixed-width on desktop for column alignment */}
            <div className="flex-1 min-w-0">
              <span className="text-xs text-zinc-400 font-medium leading-none">
                {item.label}
              </span>
            </div>

            {/* Date value — center */}
            <div className={`text-sm font-bold shrink-0 ${
              item.isImportant ? 'text-amber-400' : 'text-white'
            }`}>
              {item.date}
            </div>

            {/* Tag badge — right */}
            {item.tag && (
              <span className={`hidden sm:inline-flex shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ${
                item.isImportant ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-zinc-400'
              }`}>
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
