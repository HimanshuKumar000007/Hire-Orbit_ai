import React from 'react';
import { UniversalNotice } from '@/lib/universal-notice-model';
import { 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Info,
  Sparkles
} from 'lucide-react';

interface NoticeStatusCardProps {
  notice: UniversalNotice;
}

export function NoticeStatusCard({ notice }: NoticeStatusCardProps) {
  const getStatusConfig = () => {
    switch (notice.status) {
      case 'ADMIT_CARD_AVAILABLE':
        return {
          icon: CheckCircle2,
          headline: '🟢 ADMIT CARD AVAILABLE NOW',
          colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
          badgeText: 'Live Download Active'
        };
      case 'EXAM_CITY_SLIP_AVAILABLE':
        return {
          icon: MapPin,
          headline: '🔵 EXAM CITY SLIP AVAILABLE (Admit Card Pending)',
          colorClass: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
          badgeText: 'City Intimation Live'
        };
      case 'EXAM_DATE_ANNOUNCED':
        return {
          icon: Calendar,
          headline: '🔵 OFFICIAL EXAM DATE ANNOUNCED',
          colorClass: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
          badgeText: 'Schedule Released'
        };
      case 'EXPECTED_SOON':
      case 'ADMIT_CARD_NOT_RELEASED':
        return {
          icon: Clock,
          headline: '🟡 ADMIT CARD NOT RELEASED YET (Expected Soon)',
          colorClass: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
          badgeText: 'Release Pending'
        };
      case 'REGISTRATION_CLOSED':
        return {
          icon: AlertCircle,
          headline: '⚪ REGISTRATION WINDOW CLOSED (Exam Phase)',
          colorClass: 'text-zinc-300 border-zinc-700 bg-zinc-900/40',
          badgeText: 'Exam Cycle Active'
        };
      default:
        return {
          icon: Info,
          headline: `🟢 ${notice.statusLabel.toUpperCase()}`,
          colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
          badgeText: 'Official Notice'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <section className={`rounded-3xl p-6 sm:p-7 border ${config.colorClass} glass space-y-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <StatusIcon className="w-5 h-5 shrink-0" />
          <h2 className="text-base sm:text-lg font-black tracking-wide">
            {config.headline}
          </h2>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white">
          {config.badgeText}
        </span>
      </div>

      {/* Release Date & Exam Date Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Admit Card Status
          </span>
          <span className="text-sm font-bold text-white block">
            {notice.dates.admitCardDate
              ? `Available (${notice.dates.admitCardDate})`
              : (notice.dates.admitCardStatus === 'AVAILABLE_NOW' || notice.dates.admitCardStatus === 'released' || notice.status === 'ADMIT_CARD_AVAILABLE')
              ? "Available Now"
              : (notice.dates.admitCardStatus === 'CITY_SLIP_OUT' || notice.dates.admitCardStatus === 'available' || notice.dates.examCityStatus === 'available' || notice.status === 'EXAM_CITY_SLIP_AVAILABLE')
              ? "Exam City Slip Out"
              : (notice.dates.admitCardStatus === 'EXPECTED_SOON' || notice.dates.admitCardStatus === 'upcoming' || notice.status === 'EXPECTED_SOON')
              ? "Expected Soon"
              : "Release Pending"}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Exam Date &amp; Window
          </span>
          <span className="text-sm font-bold text-blue-400 block">
            {notice.dates.examDate
              ? notice.dates.examDate
              : (notice.dates.examDateStatus === 'ANNOUNCED' || notice.dates.examDateStatus === 'announced' || notice.dates.examDateStatus === 'EXACT_DATE' || notice.status === 'EXAM_DATE_ANNOUNCED' || notice.status === 'ADMIT_CARD_AVAILABLE')
              ? "Official Schedule Announced"
              : "To be Notified Soon"}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1 sm:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Authentication Required
          </span>
          <span className="text-sm font-bold text-emerald-400 block truncate" title={notice.credentials.label}>
            {notice.credentials.label}
          </span>
        </div>
      </div>

      {/* Sanitized Summary Narrative */}
      {notice.summary && (
        <div className="pt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5">
          <span className="font-semibold text-white">Official Notice Summary: </span>
          {notice.summary
            .replace(/<[^>]*>/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, " ")
            .replace(/\s{2,}/g, " ")
            .trim()}
        </div>
      )}
    </section>
  );
}
