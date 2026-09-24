import { KeyRound, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface ResultCredentialsProps {
  credentials: {
    label: string;
    requiredItems: string[];
  };
  authority: string;
}

export function ResultCredentials({ credentials, authority }: ResultCredentialsProps) {
  if (!credentials || credentials.requiredItems.length === 0) return null;

  return (
    <div className="rounded-2xl glass p-6 border border-white/10 mb-8 bg-zinc-900/40">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <KeyRound className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Credentials Required to Check Result & Scorecard
          </h2>
          <p className="text-xs text-zinc-400">
            Keep these details ready before accessing the official {authority} server
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {credentials.requiredItems.map((item, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-xs">
              0{idx + 1}
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-medium">Required Field</div>
              <div className="text-white font-bold text-sm">{item}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Forgot Credentials Guidance */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 leading-relaxed">
          <span className="text-zinc-300 font-semibold">Forgot your Roll Number or Registration ID? </span>
          Check your registered email inbox or SMS history for registration confirmation sent by {authority} during application submission. Most commission portals also provide a &quot;Forgot Registration ID / Password&quot; retrieval link on the candidate login page.
        </div>
      </div>
    </div>
  );
}
