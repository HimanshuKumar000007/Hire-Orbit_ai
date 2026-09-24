import React from 'react';
import { UniversalNoticeDates, isRealDateString } from '@/lib/universal-notice-model';
import { Calendar, Clock, CheckCircle2, Flame, MapPin } from 'lucide-react';

interface ImportantDatesCardProps {
  dates: UniversalNoticeDates;
}

export function ImportantDatesCard({ dates }: ImportantDatesCardProps) {
  // Build a list of active date items (only include fields that actually exist and are real dates or explicit statuses)
  const items: Array<{ label: string; value: string; isHighlight?: boolean; highlightColor?: string; icon?: any }> = [];

  if (dates.applicationStart && isRealDateString(dates.applicationStart)) {
    items.push({
      label: "Application Window Opened",
      value: dates.applicationStart
    });
  }

  if (dates.applicationLastDate && isRealDateString(dates.applicationLastDate)) {
    items.push({
      label: "Registration Last Date",
      value: dates.applicationLastDate,
      isHighlight: true,
      highlightColor: "text-amber-400"
    });
  }

  if (dates.correctionLastDate && isRealDateString(dates.correctionLastDate)) {
    items.push({
      label: "Application Correction Window",
      value: dates.correctionLastDate
    });
  }

  if (dates.citySlipDate && isRealDateString(dates.citySlipDate)) {
    items.push({
      label: "Exam City Slip Release",
      value: dates.citySlipDate,
      isHighlight: true,
      highlightColor: "text-blue-400",
      icon: MapPin
    });
  } else if (dates.admitCardStatus === 'CITY_SLIP_OUT') {
    items.push({
      label: "Exam City Slip",
      value: "City Intimation Active",
      isHighlight: true,
      highlightColor: "text-blue-400",
      icon: MapPin
    });
  }

  if (dates.admitCardDate && isRealDateString(dates.admitCardDate)) {
    items.push({
      label: "Admit Card Download Date",
      value: dates.admitCardDate,
      isHighlight: true,
      highlightColor: "text-emerald-400",
      icon: CheckCircle2
    });
  } else if (dates.admitCardStatus === 'AVAILABLE_NOW') {
    items.push({
      label: "Admit Card Download",
      value: "Available Now",
      isHighlight: true,
      highlightColor: "text-emerald-400",
      icon: CheckCircle2
    });
  }

  if (dates.examDate && isRealDateString(dates.examDate)) {
    items.push({
      label: "Examination Schedule Date",
      value: dates.examDate,
      isHighlight: true,
      highlightColor: "text-blue-400",
      icon: Flame
    });
  } else if (dates.examDateStatus === 'ANNOUNCED') {
    items.push({
      label: "Examination Schedule",
      value: "Official Schedule Announced",
      isHighlight: true,
      highlightColor: "text-blue-400",
      icon: Flame
    });
  }

  if (dates.shiftTimings) {
    items.push({
      label: "Exam Shifts & Timings",
      value: dates.shiftTimings
    });
  }

  if (dates.answerKeyDate && isRealDateString(dates.answerKeyDate)) {
    items.push({
      label: "Provisional Answer Key",
      value: dates.answerKeyDate,
      highlightColor: "text-purple-400"
    });
  }

  if (dates.resultDate && isRealDateString(dates.resultDate)) {
    items.push({
      label: "Scorecard / Result Date",
      value: dates.resultDate,
      highlightColor: "text-purple-400"
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="glass p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" /> Official Examination Schedule
        </div>
        <span className="text-[11px] font-semibold text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
          Chronological Order
        </span>
      </div>

      <h3 className="text-xl font-bold text-white">Important Dates &amp; Deadlines</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-zinc-950/60 border ${
              item.isHighlight ? 'border-white/15 shadow-sm' : 'border-white/5'
            } flex flex-col justify-between space-y-1.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">
                {item.label}
              </span>
              {item.icon && (
                <item.icon className={`w-3.5 h-3.5 ${item.highlightColor || 'text-zinc-400'}`} />
              )}
            </div>

            <div className={`text-sm sm:text-base font-bold ${item.highlightColor || 'text-white'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
