import Link from 'next/link';
import { UniversalRecruitmentNotice } from "@/lib/universal-notice-model";
import { GovJobNotification } from "@/lib/gov-jobs-data";
import { Briefcase, ArrowRight, Award, Calendar, ChevronRight } from 'lucide-react';

interface RelatedOpportunitiesProps {
  currentNotice: UniversalRecruitmentNotice;
  allNotices: GovJobNotification[];
}

export function RelatedOpportunities({ currentNotice, allNotices }: RelatedOpportunitiesProps) {
  // DYNAMIC RELATIONAL ALGORITHM (No hardcoded arrays!)
  const related = allNotices
    .filter(n => n.id !== currentNotice.id && n.slug !== currentNotice.slug)
    .map(candidate => {
      let score = 0;

      // 1. Category match (+3 points)
      if (candidate.category === currentNotice.category) score += 3;

      // 2. Qualification level match (+2 points)
      if (candidate.qualificationLevel && currentNotice.eligibility?.qualificationLevel) {
        if (candidate.qualificationLevel.toLowerCase() === currentNotice.eligibility.qualificationLevel.toLowerCase()) {
          score += 2;
        }
      }

      // 3. Location match (+2 points)
      if (candidate.location && currentNotice.location && candidate.location.toLowerCase() === currentNotice.location.toLowerCase()) {
        score += 2;
      }

      // 4. Same organization family (+4 points)
      if (candidate.organization.toLowerCase().includes(currentNotice.authority.toLowerCase().slice(0, 5))) {
        score += 4;
      }

      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.candidate);

  if (related.length === 0) return null;

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Related Government Job Opportunities
            </h2>
            <p className="text-xs text-zinc-400">
              Similar recruitments matching your sector and qualification profile
            </p>
          </div>
        </div>

        <Link 
          href="/gov"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Jobs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((item) => (
          <Link
            key={item.id}
            href={`/gov/${item.slug}`}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between group hover:shadow-glow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="truncate max-w-[140px] font-medium">{item.organization}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase font-semibold text-zinc-300">
                  {item.category}
                </span>
              </div>

              <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 group-hover:text-emerald-400 transition-colors mb-3">
                {item.title}
              </h3>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>{item.vacancies}</span>
              </div>

              <div className="flex items-center gap-1 text-zinc-400 group-hover:text-white transition-colors">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
