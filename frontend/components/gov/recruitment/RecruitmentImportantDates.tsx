import { UniversalNoticeDates, isRealDateString } from "@/lib/universal-notice-model";
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecruitmentImportantDatesProps {
  dates: UniversalNoticeDates;
}

export function RecruitmentImportantDates({ dates }: RecruitmentImportantDatesProps) {
  // Collect only valid calendar dates — isRealDateString blocks all placeholder strings
  // (e.g. "Active / Check Official Portal", "Same as Application Last Date", etc.)
  const items: Array<{ label: string; date: string; tag?: string; tagColor?: string; isImportant?: boolean }> = [];

  if (dates.applicationStart && isRealDateString(dates.applicationStart)) {
    items.push({
      label: "Online Application Start Date",
      date: dates.applicationStart,
      tag: "Started",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    });
  }

  if (dates.applicationLastDate && isRealDateString(dates.applicationLastDate)) {
    const isClosed = dates.applicationLastStatus === 'closed';
    items.push({
      label: "Last Date to Apply Online",
      date: dates.applicationLastDate,
      tag: isClosed ? "Registration Closed" : "Final Deadline",
      tagColor: isClosed ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20",
      isImportant: true
    });
  }

  if (dates.feeLastDate && isRealDateString(dates.feeLastDate)) {
    items.push({
      label: "Last Date to Pay Application Fee",
      date: dates.feeLastDate,
      tag: "Fee Deadline",
      tagColor: "text-zinc-300 bg-white/5 border-white/10"
    });
  }

  if (dates.correctionLastDate && isRealDateString(dates.correctionLastDate)) {
    items.push({
      label: "Application Form Correction Window",
      date: dates.correctionLastDate,
      tag: "Correction Window",
      tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    });
  }

  if (dates.citySlipDate && isRealDateString(dates.citySlipDate)) {
    items.push({
      label: "Exam City Intimation Slip Date",
      date: dates.citySlipDate,
      tag: "City Slip",
      tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    });
  }

  if (dates.examDate && isRealDateString(dates.examDate)) {
    items.push({
      label: "Written Examination / CBT Date",
      date: dates.examDate,
      tag: "Exam Schedule",
      tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    });
  }

  if (dates.admitCardDate && isRealDateString(dates.admitCardDate)) {
    items.push({
      label: "Admit Card / Hall Ticket Release",
      date: dates.admitCardDate,
      tag: "Hall Ticket",
      tagColor: "text-zinc-300 bg-white/5 border-white/10"
    });
  }

  if (dates.answerKeyDate && isRealDateString(dates.answerKeyDate)) {
    items.push({
      label: "Provisional Answer Key Release",
      date: dates.answerKeyDate,
      tag: "Answer Key",
      tagColor: "text-zinc-300 bg-white/5 border-white/10"
    });
  }

  if (dates.resultDate && isRealDateString(dates.resultDate)) {
    items.push({
      label: "Result & Merit List Announcement",
      date: dates.resultDate,
      tag: "Scorecard",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    });
  }

  // If no real calendar dates found, hide the section entirely
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
              Important Recruitment Dates & Schedule
            </h2>
            <p className="text-xs text-zinc-400">
              Verified chronological schedule as per official commission notification
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-zinc-400">
          Official Gazette Timeline
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
              item.isImportant
                ? 'bg-amber-500/[0.04] border-amber-500/30'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            <div className="space-y-1 min-w-0">
              <div className="text-xs text-zinc-400 font-medium truncate" title={item.label}>
                {item.label}
              </div>
              <div className={`font-bold text-sm sm:text-base ${
                item.isImportant ? 'text-amber-400' : 'text-white'
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
