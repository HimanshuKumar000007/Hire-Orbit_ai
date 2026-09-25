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
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case '12th':
        return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'graduate':
        return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
      case 'postgraduate':
        return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'diploma':
      case 'iti':
        return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
      default:
        return { text: 'text-zinc-300', bg: 'bg-white/5', border: 'border-white/10' };
    }
  };

  const badge = getLevelBadge(eligibility.qualificationLevel);

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 border border-white/10 mb-8 bg-zinc-900/40">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-white leading-tight">
            Educational Eligibility
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
            Prescribed qualifications as on cutoff date
          </p>
        </div>
        {eligibility.qualificationLevel && (
          <span className={`hidden sm:inline-flex shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badge.text} ${badge.bg} ${badge.border}`}>
            {eligibility.qualificationLevel}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Minimum Qualification */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Minimum Qualification
            </div>
            <div className="text-sm font-medium text-white leading-relaxed">
              {eligibility.minimumQualification}
            </div>
          </div>
        </div>

        {/* Mandatory Subjects */}
        {eligibility.requiredSubjects && eligibility.requiredSubjects.length > 0 && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Required Subjects / Streams
              </div>
              <div className="flex flex-wrap gap-1.5">
                {eligibility.requiredSubjects.map((sub, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {eligibility.experience && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
            <Briefcase className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Experience Required
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                {eligibility.experience}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
