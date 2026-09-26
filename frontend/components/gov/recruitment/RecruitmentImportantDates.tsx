import { UniversalNoticeDates, isRealDateString } from "@/lib/universal-notice-model";
import { Calendar } from 'lucide-react';

interface RecruitmentImportantDatesProps {
  dates: UniversalNoticeDates;
}

export function RecruitmentImportantDates({ dates }: RecruitmentImportantDatesProps) {
  // Collect only valid calendar dates — isRealDateString blocks all placeholder strings
  const items: Array<{
    label: string;
    date: string;
    tag?: string;
    accent: string;
    tagBg: string;
    isImportant?: boolean;
  }> = [];

  if (dates.applicationStart && isRealDateString(dates.applicationStart)) {
    items.push({
      label: "Application Begin",
      date: dates.applicationStart,
      tag: "Opens",
      accent: "text-emerald-400",
      tagBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    });
  }

  if (dates.applicationLastDate && isRealDateString(dates.applicationLastDate)) {
    const isClosed = dates.applicationLastStatus === 'closed';
    items.push({
      label: "Last Date to Apply",
      date: dates.applicationLastDate,
      tag: isClosed ? "Closed" : "Deadline",
      accent: isClosed ? "text-rose-400" : "text-amber-400",
      tagBg: isClosed
        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
        : "bg-amber-500/10 text-amber-400 border-amber-500/20",
      isImportant: true,
    });
  }

  if (dates.feeLastDate && isRealDateString(dates.feeLastDate)) {
    items.push({
      label: "Fee Payment Last Date",
      date: dates.feeLastDate,
      tag: "Fee",
      accent: "text-zinc-300",
      tagBg: "bg-white/5 text-zinc-400 border-white/10",
    });
  }

  if (dates.correctionLastDate && isRealDateString(dates.correctionLastDate)) {
    items.push({
      label: "Form Correction Window",
      date: dates.correctionLastDate,
      tag: "Correction",
      accent: "text-blue-400",
      tagBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    });
  }

  if (dates.citySlipDate && isRealDateString(dates.citySlipDate)) {
    items.push({
      label: "Exam City Slip Release",
      date: dates.citySlipDate,
      tag: "City Slip",
      accent: "text-blue-400",
      tagBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    });
  }

  if (dates.admitCardDate && isRealDateString(dates.admitCardDate)) {
    items.push({
      label: "Admit Card Release",
      date: dates.admitCardDate,
      tag: "Hall Ticket",
      accent: "text-purple-400",
      tagBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    });
  }

  if (dates.examDate && isRealDateString(dates.examDate)) {
    items.push({
      label: "Written Exam / CBT Date",
      date: dates.examDate,
      tag: "Exam",
      accent: "text-purple-400",
      tagBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    });
  }

  if (dates.answerKeyDate && isRealDateString(dates.answerKeyDate)) {
    items.push({
      label: "Provisional Answer Key",
      date: dates.answerKeyDate,
      tag: "Answer Key",
      accent: "text-zinc-300",
      tagBg: "bg-white/5 text-zinc-400 border-white/10",
    });
  }

  if (dates.resultDate && isRealDateString(dates.resultDate)) {
    items.push({
      label: "Result & Merit List",
      date: dates.resultDate,
      tag: "Result",
      accent: "text-emerald-400",
      tagBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl glass border border-white/10 mb-8 bg-zinc-900/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
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

      {/* Proper Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-2.5 w-1/2">
                Event
              </th>
              <th className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2.5">
                Date
              </th>
              <th className="text-right text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-2.5 hidden sm:table-cell">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {items.map((item, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  item.isImportant
                    ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.07]'
                    : 'bg-transparent hover:bg-white/[0.02]'
                }`}
              >
                {/* Event label */}
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold ${item.isImportant ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {item.isImportant && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2 mb-0.5 align-middle" />
                    )}
                    {item.label}
                  </span>
                </td>

                {/* Date value */}
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-bold ${item.accent}`}>
                    {item.date}
                  </span>
                </td>

                {/* Tag badge */}
                <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                  {item.tag && (
                    <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.tagBg}`}>
                      {item.tag}
                    </span>
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
