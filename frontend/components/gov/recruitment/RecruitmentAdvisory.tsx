import { AlertTriangle, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface RecruitmentAdvisoryProps {
  authority: string;
}

export function RecruitmentAdvisory({ authority }: RecruitmentAdvisoryProps) {
  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Candidate Advisory &amp; Official Guidelines
          </h2>
          <p className="text-xs text-zinc-400">
            Differentiating statutory commission rules from HireOrbitAI practical advice
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel 1: Official Commission Directives */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Statutory Commission Directives ({authority})</span>
          </div>

          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>One Candidate, One Application:</strong> Submission of multiple application forms for the same post may lead to summary cancellation of all submissions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Name &amp; DOB Match:</strong> Candidate Name, Father&apos;s Name, and Date of Birth must match strictly with the Class 10th (Matriculation) certificate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Category Certificate Validity:</strong> OBC-NCL, EWS, and SC/ST certificates must be issued on or before the cutoff date in the prescribed format.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Non-Refundable Fee:</strong> Application fees once remitted shall not be refunded or adjusted under any normal circumstances.</span>
            </li>
          </ul>
        </div>

        {/* Panel 2: HireOrbitAI Practical Guidance */}
        <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>HireOrbitAI Practical Recommendations</span>
          </div>

          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Beat the Server Rush:</strong> Over 70% of payment failures occur during the final 48 hours. Submit your application at least 5 days prior to the last date.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Preserve Application PDF &amp; Fee Challan:</strong> Keep at least 3 printed copies of your final confirmation page and save the digital PDF in Google Drive.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Safe Photo Guidelines:</strong> Use a recent photograph (under 3 months old) with a white background, without caps, spectacles, or masks. Keep 10 extra copies for exam day.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Active Email &amp; Phone:</strong> Retain the same registered mobile number and email ID until the final appointment order is issued.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
