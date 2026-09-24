import { AlertTriangle, ShieldCheck, CheckCircle2, ServerCrash, FileCheck, HelpCircle } from 'lucide-react';

interface ResultAdvisoryProps {
  authority: string;
}

export function ResultAdvisory({ authority }: ResultAdvisoryProps) {
  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Important Candidate Advisory & Commission Guidelines
          </h2>
          <p className="text-xs text-zinc-400">
            Critical instructions regarding result checking, scorecard verification &amp; next steps
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Portal Congestion Handling */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <ServerCrash className="w-4 h-4" />
            <span>Heavy Portal Traffic &amp; 503 Errors</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Immediately following result declaration, official commission servers experience intense candidate volume. If the site times out or displays error codes, do not panic. Try accessing the portal in non-peak hours (early morning or late night) or download the offline PDF mirror directly from our command center table.
          </p>
        </div>

        {/* Scorecard Verification */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <FileCheck className="w-4 h-4" />
            <span>Verify Personal Details on Scorecard</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Upon downloading your scorecard, immediately verify that your Candidate Name, Father&apos;s Name, Roll Number, Category, and Date of Birth match your Class 10 certificate. If there is any discrepancy, notify {authority} helpdesk immediately.
          </p>
        </div>

        {/* Answer Key & Grievances */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <HelpCircle className="w-4 h-4" />
            <span>Final Answer Key &amp; Marks Finality</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Results are computed based on the Final Answer Key vetted by expert committees. Unless explicitly announced by the commission, requests for re-evaluation, re-checking, or scrutiny of OMR/CBT answer sheets are generally not entertained.
          </p>
        </div>

        {/* Document Readiness */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Document Readiness for Qualified Aspirants</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Candidates who have qualified must immediately ensure that valid category certificates (OBC-NCL, EWS, SC/ST) are up-to-date and issued within the financial year mandated by the commission. Original marksheets and degrees will be verified strictly during subsequent stages.
          </p>
        </div>
      </div>
    </div>
  );
}
