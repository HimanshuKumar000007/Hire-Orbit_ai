"use client";

import { UniversalRecruitmentNotice, isRealDateString } from "@/lib/universal-notice-model";
import { Calendar, CreditCard, GraduationCap, Sparkles } from "lucide-react";

interface GazetteOverviewPanelProps {
  notice: UniversalRecruitmentNotice;
}

// ─── HELPER: render a single label-value row ─────────────────────────────────
function OverviewRow({
  label,
  value,
  valueClass = "text-white font-bold",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      <span className="text-[11px] text-zinc-500 leading-snug shrink-0 pt-0.5 max-w-[110px]">
        {label}
      </span>
      <span className={`text-xs leading-snug text-right ${valueClass}`}>{value}</span>
    </div>
  );
}

// ─── DATE VALUE: maps raw strings to a colored human label ───────────────────
function DateValue({ raw }: { raw: string | undefined }) {
  if (!raw) return <span className="text-zinc-600 italic text-[11px]">—</span>;

  if (isRealDateString(raw)) {
    return <span className="text-emerald-400 font-bold">{raw}</span>;
  }

  // Not a real date: could be a status string from Supabase / DB
  const lower = raw.toLowerCase();

  if (/closed|ended|over|expired|completed/i.test(lower)) {
    return (
      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
        {raw}
      </span>
    );
  }
  if (/soon|upcoming|expected|notified|announced|check/i.test(lower)) {
    return (
      <span className="inline-flex items-center gap-1 text-blue-400 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block animate-pulse" />
        {raw}
      </span>
    );
  }
  if (/available|released|out|download/i.test(lower)) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
        {raw}
      </span>
    );
  }

  return <span className="text-zinc-300 font-semibold">{raw}</span>;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function GazetteOverviewPanel({ notice }: GazetteOverviewPanelProps) {
  const { dates, fee, ageLimit, eligibility } = notice;

  // Build the date rows — always shown (even if value is a status string)
  const dateRows: Array<{ label: string; raw: string | undefined }> = [
    { label: "Application Begin:", raw: dates.applicationStart },
    { label: "Last Date to Apply:", raw: dates.applicationLastDate },
    { label: "Fee Payment Last Date:", raw: dates.feeLastDate },
    { label: "Exam Date:", raw: dates.examDate },
    { label: "Admit Card Release:", raw: dates.admitCardDate },
  ];

  const hasAnyDate = dateRows.some((r) => !!r.raw);
  const hasFee = fee && fee.rawRows && fee.rawRows.length > 0;
  const hasAge = ageLimit && (ageLimit.rawText || ageLimit.maxAge);

  // Don't render this section at all if we have no data
  if (!hasAnyDate && !hasFee && !hasAge) return null;

  // Category label for the top-right badge
  const categoryBadge =
    notice.category === "state"
      ? "State Civil Services"
      : notice.category === "railway"
      ? "Railway Recruitment"
      : notice.category === "banking"
      ? "Banking & Finance"
      : notice.category === "police"
      ? "Police & Paramilitary"
      : notice.category === "defense"
      ? "Defence Services"
      : notice.category === "teaching"
      ? "Teaching & Education"
      : "State & Central Civil Services";

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Official Gazette Overview &amp; Key Specifications
          </span>
        </div>
        <span className="hidden sm:inline-flex shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[11px] font-semibold">
          {categoryBadge}
        </span>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* ── Card 1: Important Dates ────────────────────────────────── */}
        <div className="rounded-2xl glass bg-zinc-900/50 border border-white/10 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Important Dates</p>
              <p className="text-[10px] text-zinc-500">Official schedule &amp; deadlines</p>
            </div>
          </div>

          <div className="flex-1 space-y-0">
            {dateRows.map((row, i) =>
              row.raw ? (
                <OverviewRow
                  key={i}
                  label={row.label}
                  value={<DateValue raw={row.raw} />}
                />
              ) : null
            )}
            {!hasAnyDate && (
              <p className="text-[11px] text-zinc-600 italic py-2">
                Date details are being verified — check official notification.
              </p>
            )}
          </div>
        </div>

        {/* ── Card 2: Application Fee ────────────────────────────────── */}
        <div className="rounded-2xl glass bg-zinc-900/50 border border-white/10 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Application Fee</p>
              <p className="text-[10px] text-zinc-500">Category-wise prescribed charges</p>
            </div>
          </div>

          <div className="flex-1 space-y-0">
            {hasFee ? (
              <>
                {fee.rawRows.map((row, i) => {
                  const valueClass = row.isExempt
                    ? "text-emerald-400 font-bold"
                    : !row.isKnown
                    ? "text-blue-400 font-semibold"
                    : "text-white font-bold";
                  return (
                    <OverviewRow
                      key={i}
                      label={row.category + ":"}
                      value={row.amount}
                      valueClass={valueClass}
                    />
                  );
                })}

                {/* Payment Gateway box */}
                {fee.paymentGatewayNote && (
                  <div className="mt-3 pt-2 border-t border-white/5">
                    <p className="text-[10px] text-zinc-500 mb-1.5">Payment Gateway Options:</p>
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-zinc-300 leading-relaxed">
                      {fee.paymentGatewayNote}
                    </div>
                  </div>
                )}

                {/* Correction charge */}
                {fee.correctionCharge && (
                  <OverviewRow
                    label="Correction Charge:"
                    value={fee.correctionCharge}
                    valueClass="text-zinc-300 font-semibold"
                  />
                )}
              </>
            ) : (
              <p className="text-[11px] text-zinc-600 italic py-2">
                Fee details are being verified — refer official notification.
              </p>
            )}
          </div>
        </div>

        {/* ── Card 3: Age Limit & Eligibility ───────────────────────── */}
        <div className="rounded-2xl glass bg-zinc-900/50 border border-white/10 p-4 flex flex-col sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Age Limit &amp; Eligibility</p>
              <p className="text-[10px] text-zinc-500">Minimum requirements as on cutoff date</p>
            </div>
          </div>

          <div className="flex-1 space-y-0">
            {hasAge && (
              <>
                <OverviewRow
                  label="Prescribed Age Limit:"
                  value={ageLimit!.rawText || `${ageLimit!.minAge ?? "—"} – ${ageLimit!.maxAge ?? "—"}`}
                  valueClass="text-white font-bold"
                />
                <OverviewRow
                  label="SC / ST Age Relaxation:"
                  value="+5 Years (Standard)"
                  valueClass="text-emerald-400 font-bold"
                />
                <OverviewRow
                  label="OBC (Non-Creamy):"
                  value="+3 Years"
                  valueClass="text-emerald-400 font-bold"
                />
                <OverviewRow
                  label="PwBD Candidates:"
                  value="+10 to 15 Years"
                  valueClass="text-purple-400 font-bold"
                />
              </>
            )}

            {/* Key Qualification */}
            {eligibility?.minimumQualification && (
              <div className="mt-3 pt-2 border-t border-white/5">
                <p className="text-[10px] text-zinc-500 mb-1.5">Key Qualification:</p>
                <div className="bg-emerald-500/[0.07] border border-emerald-500/20 rounded-lg px-3 py-2 text-[11px] text-emerald-300 font-semibold leading-relaxed">
                  {eligibility.minimumQualification}
                </div>
              </div>
            )}

            {!hasAge && !eligibility?.minimumQualification && (
              <p className="text-[11px] text-zinc-600 italic py-2">
                Eligibility details are being verified — refer official notification.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
