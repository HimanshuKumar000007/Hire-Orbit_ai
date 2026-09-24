import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CandidateAdvisoryProps {
  authority: string;
}

export function CandidateAdvisory({ authority }: CandidateAdvisoryProps) {
  return (
    <section className="glass p-6 sm:p-7 rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 space-y-4">
      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
        <AlertTriangle className="w-4 h-4" /> महत्वपूर्ण निर्देश | Candidate Caution &amp; Advisory Notice
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
          Mandatory Verification Instructions Before Exam Day
        </h3>
        <p className="text-xs text-zinc-400">
          Adhere strictly to official verification standards to avoid entry denial at the examination center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Box A: Official Commission Instructions */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official {authority} Instructions
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
              <span><strong>Photograph &amp; Signature Clarity:</strong> Ensure your downloaded hall ticket has a crisp, recognizable photograph and signature. Blurred prints may lead to disqualification.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
              <span><strong>Matching Name Spelling:</strong> The name on your Admit Card must match the character spelling on your Photo Identity Proof exactly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
              <span><strong>Exam Center Confirmation:</strong> Verify the full address, landmark, and center code to avoid last-minute transit confusion.</span>
            </li>
          </ul>
        </div>

        {/* Box B: HireOrbitAI Practical Guidance */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider pb-1 border-b border-white/5">
            <Sparkles className="w-4 h-4" />
            HireOrbitAI Practical Advisory
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <span><strong>Take 2 Color Printouts:</strong> Keep an extra copy in your backpack and a digital PDF copy securely stored in your email / cloud drive.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <span><strong>Pre-Visit Center:</strong> If the exam venue is in an unfamiliar locality or city, locate it on maps or visit the day before to estimate travel time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <span><strong>Discrepancy Reporting:</strong> In case of errors in your category, gender, or roll number, immediately email the official authority helpdesk with your application proof.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
