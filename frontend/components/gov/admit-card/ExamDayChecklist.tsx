import React from 'react';
import { ExamDayRuleSet } from '@/lib/universal-notice-model';
import { 
  ShieldCheck, 
  FileCheck2, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Download 
} from 'lucide-react';

interface ExamDayChecklistProps {
  rules: ExamDayRuleSet;
  examName: string;
}

export function ExamDayChecklist({ rules, examName }: ExamDayChecklistProps) {
  return (
    <section className="glass p-6 sm:p-8 rounded-3xl border border-blue-500/20 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Exam Venue &amp; Hall Ticket Guidelines
        </div>
        <span className="text-[11px] font-semibold text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
          Official Hall Rules
        </span>
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
          {examName} Exam Day Checklist &amp; Instructions
        </h3>
        <p className="text-xs text-zinc-400">
          Candidates must strictly comply with the following instructions to ensure hassle-free entry at the examination center.
        </p>
      </div>

      {/* 3 Clear Sections: Documents to Carry, Exam-Day Timing, Prohibited Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* 1. DOCUMENTS TO CARRY */}
        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Documents to Carry
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              {rules.documentsToCarry.map((doc, dIdx) => (
                <li key={dIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
            Mandatory at Entry Gate
          </div>
        </div>

        {/* 2. EXAM-DAY TIMING */}
        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <Clock className="w-4 h-4 text-blue-400" />
              Exam-Day Timing
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              {rules.timingInstructions.map((timing, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{timing}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
            No Late Entry Allowed
          </div>
        </div>

        {/* 3. IMPORTANT RESTRICTIONS & BANNED ITEMS */}
        <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Important Restrictions
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              {rules.prohibitedItems.map((item, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
            Strictly Prohibited
          </div>
        </div>
      </div>

      {rules.officialNoticeUrl && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-zinc-400">
            For specific center guidelines, scribe rules, and COVID/health advisories, refer to the official circular:
          </span>
          <a
            href={rules.officialNoticeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> View Official Guidelines PDF
          </a>
        </div>
      )}
    </section>
  );
}
