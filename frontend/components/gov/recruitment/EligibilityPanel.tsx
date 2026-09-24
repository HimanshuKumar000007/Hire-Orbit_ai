import { UniversalRecruitmentNotice } from "@/lib/universal-notice-model";
import { GraduationCap, CheckCircle2, BookOpen, Briefcase } from 'lucide-react';

interface EligibilityPanelProps {
  eligibility: UniversalRecruitmentNotice['eligibility'];
}

export function EligibilityPanel({ eligibility }: EligibilityPanelProps) {
  if (!eligibility || !eligibility.minimumQualification) {
    return null;
  }

  const getLevelBadge = (level?: string) => {
    switch (level?.toLowerCase()) {
      case '10th':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case '12th':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'graduate':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'postgraduate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'diploma':
      case 'iti':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-white/5 text-zinc-300 border-white/10';
    }
  };

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Educational Qualification &amp; Eligibility Criteria
            </h2>
            <p className="text-xs text-zinc-400">
              Prescribed academic qualifications as on the cutoff date
            </p>
          </div>
        </div>

        {eligibility.qualificationLevel && (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider shrink-0 ${getLevelBadge(eligibility.qualificationLevel)}`}>
            {eligibility.qualificationLevel} Level
          </span>
        )}
      </div>

      <div className="space-y-4 text-sm">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">
              Minimum Educational Qualification
            </div>
            <div className="text-white font-medium leading-relaxed">
              {eligibility.minimumQualification}
            </div>
          </div>
        </div>

        {eligibility.requiredSubjects && eligibility.requiredSubjects.length > 0 && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Mandatory Subjects / Streams
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {eligibility.requiredSubjects.map((sub, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-300">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {eligibility.experience && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                Experience Requirement
              </div>
              <div className="text-zinc-300 text-xs leading-relaxed">
                {eligibility.experience}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
