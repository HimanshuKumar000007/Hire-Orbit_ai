import Link from 'next/link';
import { GovJobNotification } from "@/lib/gov-jobs-data";
import { isRealDateString } from "@/lib/universal-notice-model";
import { 
  Building2, 
  Award, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface UniversalJobCardProps {
  job: GovJobNotification;
}

export function UniversalJobCard({ job }: UniversalJobCardProps) {
  // Determine recruitment status badge
  const isClosed = /closed|ended/i.test(job.badgeStatus) || 
    (job.importantDates.lastDate && /closed|ended/i.test(job.importantDates.lastDate));
  const isStartingSoon = /starting soon|coming soon|expected|announced/i.test(job.badgeStatus) && 
    !/open|live|apply now/i.test(job.badgeStatus);

  let statusLabel = "🟢 Applications Open";
  let statusBadgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

  if (isClosed) {
    statusLabel = "🔴 Closed";
    statusBadgeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/30";
  } else if (isStartingSoon) {
    statusLabel = "🟡 Starting Soon";
    statusBadgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  }

  // Only show real calendar dates — isRealDateString blocks all placeholder strings
  const lastDate = isRealDateString(job.importantDates.lastDate)
    ? job.importantDates.lastDate
    : undefined;

  const startDate = isRealDateString(job.importantDates.startDate)
    ? job.importantDates.startDate
    : undefined;

  // Real vacancies (suppress "See Notification" or generic)
  const hasRealVacancies = job.vacancies && 
    !/see notification|as per notification|multiple|refer/i.test(job.vacancies);

  // Clean qualification
  const hasRealQual = job.qualification && 
    !/relevant qualification/i.test(job.qualification);

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group hover:shadow-glow-sm bg-zinc-900/40">
      <div>
        {/* Card Header: Organization, Verified Badge, Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-zinc-400 font-medium truncate" title={job.organization}>
              {job.organization}
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${statusBadgeStyle}`}>
            {statusLabel}
          </span>
        </div>

        {/* Card Title */}
        <Link 
          href={`/gov/${job.slug}`}
          className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3.5 block"
        >
          {job.title}
        </Link>

        {/* Dynamic Key Specs (Missing fields disappear cleanly) */}
        <div className="space-y-2 py-3 border-y border-white/5 text-xs text-zinc-300">
          {hasRealVacancies && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Total Posts:
              </span>
              <span className="font-bold text-emerald-400">{job.vacancies}</span>
            </div>
          )}

          {hasRealQual && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Qualification:
              </span>
              <span className="font-medium text-zinc-200 truncate max-w-[180px] text-right" title={job.qualification}>
                {job.qualification}
              </span>
            </div>
          )}

          {lastDate && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Last Date:
              </span>
              <span className="font-semibold text-amber-400">{lastDate}</span>
            </div>
          )}

          {startDate && !lastDate && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Starts:
              </span>
              <span className="font-medium text-zinc-300">{startDate}</span>
            </div>
          )}

          {job.location && (
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Location:
              </span>
              <span className="font-medium text-zinc-300 truncate max-w-[170px]">{job.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-2 flex items-center gap-2">
        <Link
          href={`/gov/${job.slug}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-sm"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {job.applyUrl && (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1 border border-white/10 transition-colors"
            title="Open official portal"
          >
            <span>Portal</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        )}
      </div>
    </div>
  );
}
