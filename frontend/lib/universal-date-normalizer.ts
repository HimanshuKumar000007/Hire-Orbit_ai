/**
 * Universal Government Notice Date Normalizer for HireOrbitAI
 *
 * Implements strict separation of date values from statuses, supports
 * date ranges, confidence, source attribution, and evidence tracking.
 *
 * ZERO exam-specific hardcoding. Completely reusable across Latest Jobs,
 * Admit Cards, Results, and Answer Keys.
 */

const MONTH_NAMES = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const MONTH_NAMES_REGEX = /jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?/i;
const NUMERIC_DATE_REGEX = /\b[0-3]?\d[./-][0-1]?\d[./-](?:20)?\d\d\b/;

/**
 * Universal utility to sanitize raw date fields and reject placeholder sentences
 */
export function cleanDateValue(val: any): string | undefined {
  if (!val || typeof val !== 'string') return undefined;
  const s = val.trim();
  if (s.length < 4) return undefined;
  // If it matches placeholder phrases without an explicit day + month/year
  const isPlaceholder = /announced|upcoming|notified|check|available|window closed|as per|active \/|tba|soon|released|completed|same as/i.test(s);
  if (isPlaceholder && !MONTH_NAMES_REGEX.test(s) && !NUMERIC_DATE_REGEX.test(s)) {
    return undefined;
  }
  if (!MONTH_NAMES_REGEX.test(s) && !NUMERIC_DATE_REGEX.test(s)) {
    return undefined;
  }
  return s;
}

/**
 * Check if a date string is an authentic calendar date rather than UI text
 */
export function isRealDateString(val?: string | null): boolean {
  return !!cleanDateValue(val);
}

export type DateStatus =
  | "confirmed"
  | "announced"
  | "not_announced"
  | "released"
  | "available"
  | "closed"
  | "completed"
  | "upcoming"
  | "tba"
  | "not_declared"
  | "unknown";

export interface DateFieldModel {
  value: string | null;           // Clean calendar date, e.g. "27 September 2026" or "9 September 2026 – 10 September 2026"
  valueFrom?: string | null;      // ISO or formatted start date
  valueTo?: string | null;        // ISO or formatted end date
  status: DateStatus;            // Structured machine status
  statusLabel: string;           // Clean user-facing label (e.g. "Confirmed", "Announced", "Available Now", "Registration Closed")
  source: string;                // "database" | "source_text" | "notice_title" | "derived"
  confidence: number;            // 0.0 to 1.0
  evidence?: string | null;      // Exact supporting text snippet from source
}

export interface UniversalNoticeDateSet {
  // Primary date strings (Clean string | null for backward compatibility)
  applicationStart: string | null;
  applicationLastDate: string | null;
  applicationEnd: string | null; // Alias for applicationLastDate
  feeLastDate: string | null;
  feePaymentEnd: string | null; // Alias for feeLastDate
  correctionLastDate: string | null;
  correctionEnd: string | null;
  examCityDate: string | null;
  citySlipDate: string | null;   // Alias for examCityDate
  examDate: string | null;
  examDateFrom: string | null;
  examDateTo: string | null;
  admitCardDate: string | null;
  answerKeyDate: string | null;
  resultDate: string | null;
  scorecardDate: string | null;
  cutoffDate: string | null;
  documentVerificationDate: string | null;
  interviewDate: string | null;
  finalResultDate: string | null;
  shiftTimings: string | null;

  // Status indicators
  examDateStatus: DateStatus;
  admitCardStatus: DateStatus;
  applicationLastStatus: DateStatus;
  resultStatus: DateStatus;

  // Full Rich Models for each date
  models: {
    applicationStart: DateFieldModel;
    applicationEnd: DateFieldModel;
    feePaymentEnd: DateFieldModel;
    correctionEnd: DateFieldModel;
    examCityDate: DateFieldModel;
    examDate: DateFieldModel;
    admitCardDate: DateFieldModel;
    answerKeyDate: DateFieldModel;
    resultDate: DateFieldModel;
    scorecardDate: DateFieldModel;
    cutoffDate: DateFieldModel;
    documentVerificationDate: DateFieldModel;
    interviewDate: DateFieldModel;
    finalResultDate: DateFieldModel;
  };
}

export interface NoticeContext {
  title?: string;
  summary?: string;
  type?: string; // 'admit-card' | 'job' | 'result' | 'answer-key'
  badgeStatus?: string;
  sourceText?: string;
  year?: string;
}

/**
 * Standardize day, month, and year into "DD Month YYYY"
 */
export function formatStandardDate(dayStr: string, monthStr: string, yearStr?: string, defaultYear: string = "2026"): string {
  const day = dayStr.replace(/\D/g, "");
  const y = yearStr && yearStr.match(/20\d\d/) ? yearStr.trim() : defaultYear;
  return `${day} ${monthStr} ${y}`.trim();
}

/**
 * Extract date value from raw field (handles string or object representation)
 */
function extractRawValue(field: any): string | null {
  if (!field) return null;
  if (typeof field === "string") return cleanDateValue(field) || null;
  if (typeof field === "object") {
    if (typeof field.value === "string") return cleanDateValue(field.value) || null;
    if (typeof field.date === "string") return cleanDateValue(field.date) || null;
  }
  return null;
}

/**
 * Core Universal Date Normalization Function
 * Reusable across Latest Jobs, Admit Cards, Results, and Answer Keys.
 */
export function normalizeGovernmentNoticeDates(
  rawDates: Record<string, any> = {},
  context: NoticeContext = {}
): UniversalNoticeDateSet {
  const title = context.title || "";
  const summary = context.summary || "";
  const sourceText = context.sourceText || "";
  const combinedText = `${title} ${summary} ${sourceText}`.replace(/\s+/g, " ");
  const type = context.type || "job";
  const badge = (context.badgeStatus || "").toLowerCase();

  const isAdmitNotice = type === "admit-card" || type === "admit_card" || /admit card|hall ticket|call letter|city slip|exam date/i.test(title + badge);
  const isResultNotice = type === "result" || /result|merit list|scorecard|cut off|cutoff/i.test(title + badge);
  const isAnswerKeyNotice = type === "answer-key" || type === "answer_key" || /answer key|objection/i.test(title + badge);

  // 1. Establish Established Year
  const yearMatch = combinedText.match(/\b(202[4-9]|203\d)\b/);
  const establishedYear = yearMatch ? yearMatch[1] : (context.year || "2026");

  // Helper to create empty model
  const createEmptyModel = (status: DateStatus, statusLabel: string): DateFieldModel => ({
    value: null,
    status,
    statusLabel,
    source: "derived",
    confidence: 1.0
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. EXAM DATE EXTRACTION & NORMALIZATION
  // ─────────────────────────────────────────────────────────────────────────────
  let rawExamVal = extractRawValue(rawDates.examDate) || extractRawValue(rawDates.exam_date);
  let examFrom: string | null = extractRawValue(rawDates.examDateFrom) || (typeof rawDates.exam_date === 'object' ? extractRawValue(rawDates.exam_date?.start) : null);
  let examTo: string | null = extractRawValue(rawDates.examDateTo) || (typeof rawDates.exam_date === 'object' ? extractRawValue(rawDates.exam_date?.end) : null);
  let examEvidence: string | null = rawDates.examDateEvidence || (typeof rawDates.exam_date === 'object' ? rawDates.exam_date?.evidence : null) || null;
  let examSource = rawExamVal ? "database" : "notice_context";

  // If DB date is missing, search title and source context
  if (!rawExamVal) {
    // Check for date range first ("September 9 and 10", "December 12 & 13", "30 September to 30 October", etc.)
    const rangeRegex1 = new RegExp(
      `(?:exam(?:ination)?|cbt|test|screening|schedule[d]?|re-examination|physical test|pet|pst)?\\s*(?:for|on|from|between|during)?\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(?:and|&|to|-|–|—)\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
      "i"
    );
    const rangeRegex2 = new RegExp(
      `(?:exam(?:ination)?|cbt|test|screening|schedule[d]?|re-examination|physical test|pet|pst)?\\s*(?:for|on|from|between|during)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(?:and|&|to|-|–|—)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
      "i"
    );
    const crossRangeRegex = new RegExp(
      `(?:exam(?:ination)?|cbt|test|screening|schedule[d]?|re-examination|physical test|pet|pst)?\\s*(?:for|on|from|between|conducted from)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*(20\\d\\d))?\\s*(?:to|and|&|-|–|—)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*(20\\d\\d))?`,
      "i"
    );

    const crossMatch = combinedText.match(crossRangeRegex);
    const r1Match = combinedText.match(rangeRegex1);
    const r2Match = combinedText.match(rangeRegex2);

    if (crossMatch && crossMatch[1] && crossMatch[2] && crossMatch[4] && crossMatch[5]) {
      examFrom = formatStandardDate(crossMatch[1], crossMatch[2], crossMatch[3], establishedYear);
      examTo = formatStandardDate(crossMatch[4], crossMatch[5], crossMatch[6] || crossMatch[3], establishedYear);
      rawExamVal = `${examFrom} – ${examTo}`;
      examEvidence = crossMatch[0].trim();
      examSource = "notice_text";
    } else if (r1Match && r1Match[1] && r1Match[2] && r1Match[3]) {
      examFrom = formatStandardDate(r1Match[2], r1Match[1], r1Match[4], establishedYear);
      examTo = formatStandardDate(r1Match[3], r1Match[1], r1Match[4], establishedYear);
      rawExamVal = `${examFrom} – ${examTo}`;
      examEvidence = r1Match[0].trim();
      examSource = "notice_text";
    } else if (r2Match && r2Match[1] && r2Match[2] && r2Match[3]) {
      examFrom = formatStandardDate(r2Match[1], r2Match[3], r2Match[4], establishedYear);
      examTo = formatStandardDate(r2Match[2], r2Match[3], r2Match[4], establishedYear);
      rawExamVal = `${examFrom} – ${examTo}`;
      examEvidence = r2Match[0].trim();
      examSource = "notice_text";
    } else {
      // Single Exam Date Patterns: "exam on September 27", "Exam Date: 27 September 2026", "27/09/2026", etc.
      const singleDateRegex1 = new RegExp(
        `(?:exam(?:ination)?|cbt|written test|physical test|pet|pst|screening|schedule[d]?|re-examination)\\s*(?:is|will be|date)?\\s*(?:on|held on|scheduled for|date[:\\s]+)?\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
        "i"
      );
      const singleDateRegex2 = new RegExp(
        `(?:exam(?:ination)?|cbt|written test|physical test|pet|pst|screening|schedule[d]?|re-examination)\\s*(?:is|will be|date)?\\s*(?:on|held on|scheduled for|date[:\\s]+)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
        "i"
      );
      const numericDateRegex = /(?:exam|held|scheduled|cbt|written|physical).*?([0-3]?\d[./-][0-1]?\d[./-](?:20\d\d))/i;

      const s1 = combinedText.match(singleDateRegex1);
      const s2 = combinedText.match(singleDateRegex2);
      const sNum = combinedText.match(numericDateRegex);

      if (s1 && s1[1] && s1[2]) {
        rawExamVal = formatStandardDate(s1[2], s1[1], s1[3], establishedYear);
        examEvidence = s1[0].trim();
        examSource = "notice_text";
      } else if (s2 && s2[1] && s2[2]) {
        rawExamVal = formatStandardDate(s2[1], s2[2], s2[3], establishedYear);
        examEvidence = s2[0].trim();
        examSource = "notice_text";
      } else if (sNum && sNum[1]) {
        rawExamVal = sNum[1];
        examEvidence = sNum[0].trim();
        examSource = "notice_text";
      }
    }
  }

  let examStatus: DateStatus = "not_announced";
  let examStatusLabel = "To Be Announced";
  if (rawExamVal) {
    examStatus = "confirmed";
    examStatusLabel = "Schedule Confirmed";
  } else if (isAdmitNotice || /exam date|exam schedule|exam calendar|timetable/i.test(combinedText)) {
    examStatus = "announced";
    examStatusLabel = "Official Schedule Announced";
  } else if (isResultNotice || isAnswerKeyNotice) {
    examStatus = "completed";
    examStatusLabel = "Examination Completed";
  }

  const examDateModel: DateFieldModel = {
    value: rawExamVal,
    valueFrom: examFrom,
    valueTo: examTo,
    status: examStatus,
    statusLabel: examStatusLabel,
    source: examSource,
    confidence: rawExamVal ? 0.98 : 0.85,
    evidence: examEvidence
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ADMIT CARD RELEASE DATE
  // ─────────────────────────────────────────────────────────────────────────────
  let rawAdmitVal = extractRawValue(rawDates.admitCardDate) || extractRawValue(rawDates.admit_card_date);
  let admitEvidence = rawDates.admitCardEvidence || (typeof rawDates.admit_card_date === 'object' ? rawDates.admit_card_date?.evidence : null) || null;
  let admitSource = rawAdmitVal ? "database" : "notice_context";

  if (!rawAdmitVal) {
    const admitRegex1 = new RegExp(
      `(?:admit cards?|hall tickets?|call letters?|admission certificates?)[^\r\n.!?]{0,55}?(?:is|was|were|has been|have been)?\\s*(?:out|released|available|issued|download)?\\s*(?:on|from|dated)\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
      "i"
    );
    const admitRegex2 = new RegExp(
      `(?:admit cards?|hall tickets?|call letters?|admission certificates?)[^\r\n.!?]{0,55}?(?:is|was|were|has been|have been)?\\s*(?:out|released|available|issued|download)?\\s*(?:on|from|dated)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
      "i"
    );
    const tableAdmitRegex = new RegExp(
      `(?:admit cards?|hall tickets?)[^\r\n|]{0,60}\\|\\s*([0-3]?\\d)\\s*(${MONTH_NAMES})\\s*(20\\d\\d)?`,
      "i"
    );

    const allAdmitMatches = [
      ...combinedText.matchAll(new RegExp(tableAdmitRegex.source, "gi")),
      ...combinedText.matchAll(new RegExp(admitRegex1.source, "gi")),
      ...combinedText.matchAll(new RegExp(admitRegex2.source, "gi"))
    ];

    const candidates: Array<{ day: string; month: string; year?: string; raw: string }> = [];

    for (const match of allAdmitMatches) {
      if (!match) continue;
      const raw = match[0];
      if (/posted on|published on|web correspondent|author|updated on|byline/i.test(raw)) continue;
      if (/\bfor\b/i.test(raw)) continue;

      if (match[1] && match[2]) {
        if (/\d/.test(match[1])) {
          candidates.push({ day: match[1], month: match[2], year: match[3], raw });
        } else {
          candidates.push({ day: match[2], month: match[1], year: match[3], raw });
        }
      }
    }

    if (candidates.length > 0) {
      const preferred = candidates.find(c => c.year === establishedYear) || candidates[0];
      rawAdmitVal = formatStandardDate(preferred.day, preferred.month, preferred.year, establishedYear);
      admitEvidence = preferred.raw.trim();
      admitSource = "notice_text";
    }
  }

  let admitStatus: DateStatus = "not_announced";
  let admitStatusLabel = "Release Pending";
  if (rawAdmitVal) {
    admitStatus = "released";
    admitStatusLabel = `Available (${rawAdmitVal})`;
  } else if (isAdmitNotice) {
    if (/out|released|download|available|live/i.test(title + badge)) {
      admitStatus = "released";
      admitStatusLabel = "Available Now";
    } else if (/expected soon|coming soon|likely/i.test(title + badge)) {
      admitStatus = "upcoming";
      admitStatusLabel = "Expected Soon";
    } else {
      admitStatus = "released";
      admitStatusLabel = "Available Now";
    }
  } else if (isResultNotice || isAnswerKeyNotice) {
    admitStatus = "completed";
    admitStatusLabel = "Concluded";
  }

  const admitCardDateModel: DateFieldModel = {
    value: rawAdmitVal,
    status: admitStatus,
    statusLabel: admitStatusLabel,
    source: admitSource,
    confidence: rawAdmitVal ? 0.98 : 0.85,
    evidence: admitEvidence
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. APPLICATION WINDOW & FEES
  // ─────────────────────────────────────────────────────────────────────────────
  let rawStartVal = extractRawValue(rawDates.startDate || rawDates.applicationStart) || extractRawValue(rawDates.application_begin);
  let rawLastVal = extractRawValue(rawDates.lastDate || rawDates.applicationLastDate) || extractRawValue(rawDates.application_last_date);
  let rawFeeVal = extractRawValue(rawDates.feeLastDate) || extractRawValue(rawDates.fee_payment_last_date) || rawLastVal;
  let rawCorrectionVal = extractRawValue(rawDates.correctionLastDate) || extractRawValue(rawDates.correction_last_date);

  let appLastStatus: DateStatus = "available";
  let appLastStatusLabel = "Online Applications Open";

  if (isAdmitNotice || isResultNotice || isAnswerKeyNotice || /registration closed|closed|ended|expired/i.test(badge)) {
    appLastStatus = "closed";
    appLastStatusLabel = "Registration Window Closed";
  } else if (rawLastVal) {
    const parsed = Date.parse(rawLastVal);
    if (!isNaN(parsed) && parsed < Date.now()) {
      appLastStatus = "closed";
      appLastStatusLabel = "Registration Window Closed";
    }
  }

  const appStartModel: DateFieldModel = {
    value: rawStartVal,
    status: isAdmitNotice || isResultNotice ? "completed" : "available",
    statusLabel: rawStartVal ? `Started (${rawStartVal})` : (isAdmitNotice || isResultNotice ? "Concluded" : "Active Now"),
    source: rawStartVal ? "database" : "derived",
    confidence: rawStartVal ? 0.95 : 0.8
  };

  const appEndModel: DateFieldModel = {
    value: rawLastVal,
    status: appLastStatus,
    statusLabel: rawLastVal ? (appLastStatus === "closed" ? `${rawLastVal} (Closed)` : `${rawLastVal} (Active)`) : appLastStatusLabel,
    source: rawLastVal ? "database" : "derived",
    confidence: rawLastVal ? 0.95 : 0.8
  };

  const feeModel: DateFieldModel = {
    value: rawFeeVal,
    status: appLastStatus,
    statusLabel: rawFeeVal ? (appLastStatus === "closed" ? `${rawFeeVal} (Closed)` : `${rawFeeVal} (Active)`) : appLastStatusLabel,
    source: rawFeeVal ? "database" : "derived",
    confidence: rawFeeVal ? 0.95 : 0.8
  };

  const correctionModel: DateFieldModel = {
    value: rawCorrectionVal,
    status: rawCorrectionVal ? "available" : (isAdmitNotice || isResultNotice ? "closed" : "not_announced"),
    statusLabel: rawCorrectionVal ? `Window Active (${rawCorrectionVal})` : "Not Applicable / Closed",
    source: rawCorrectionVal ? "database" : "derived",
    confidence: rawCorrectionVal ? 0.9 : 0.8
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. EXAM CITY / INTIMATION SLIP
  // ─────────────────────────────────────────────────────────────────────────────
  let rawCityVal = extractRawValue(rawDates.citySlipDate || rawDates.examCityDate) || extractRawValue(rawDates.city_intimation_date);
  const citySlipStatus: DateStatus = rawCityVal || /city slip|city intimation|exam city/i.test(title + badge)
    ? "available"
    : (isAdmitNotice || isResultNotice ? "completed" : "not_announced");

  const citySlipModel: DateFieldModel = {
    value: rawCityVal,
    status: citySlipStatus,
    statusLabel: rawCityVal ? `Available (${rawCityVal})` : (citySlipStatus === "available" ? "City Intimation Active" : "Not Announced"),
    source: rawCityVal ? "database" : "derived",
    confidence: rawCityVal ? 0.95 : 0.8
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. RESULT, SCORECARD, MERIT LIST, CUTOFF
  // ─────────────────────────────────────────────────────────────────────────────
  let rawResultVal = extractRawValue(rawDates.resultDate) || extractRawValue(rawDates.result_date);
  const resultStatus: DateStatus = isResultNotice ? (rawResultVal || /out|declared|released/i.test(title + badge) ? "released" : "announced") : "not_declared";

  const resultModel: DateFieldModel = {
    value: rawResultVal,
    status: resultStatus,
    statusLabel: rawResultVal ? `Declared (${rawResultVal})` : (resultStatus === "released" ? "Result Declared" : "To be Declared Post-Exam"),
    source: rawResultVal ? "database" : "derived",
    confidence: rawResultVal ? 0.95 : 0.8
  };

  const scorecardModel: DateFieldModel = { ...resultModel, statusLabel: rawResultVal ? `Scorecard Live (${rawResultVal})` : "Scorecard Pending" };
  const cutoffModel: DateFieldModel = { ...resultModel, statusLabel: rawResultVal ? `Cutoff Released (${rawResultVal})` : "Cutoff Pending" };

  // Other milestones
  const answerKeyVal = extractRawValue(rawDates.answerKeyDate) || extractRawValue(rawDates.answer_key_date);
  const answerKeyModel: DateFieldModel = {
    value: answerKeyVal,
    status: answerKeyVal ? "released" : (isResultNotice ? "completed" : "not_announced"),
    statusLabel: answerKeyVal ? `Released (${answerKeyVal})` : "Pending",
    source: answerKeyVal ? "database" : "derived",
    confidence: answerKeyVal ? 0.95 : 0.8
  };

  const dvVal = extractRawValue(rawDates.documentVerificationDate);
  const dvModel: DateFieldModel = {
    value: dvVal,
    status: dvVal ? "announced" : "not_announced",
    statusLabel: dvVal ? `Scheduled (${dvVal})` : "Pending Post-Exam",
    source: dvVal ? "database" : "derived",
    confidence: dvVal ? 0.95 : 0.8
  };

  const interviewVal = extractRawValue(rawDates.interviewDate);
  const interviewModel: DateFieldModel = {
    value: interviewVal,
    status: interviewVal ? "announced" : "not_announced",
    statusLabel: interviewVal ? `Scheduled (${interviewVal})` : "Pending Post-Exam",
    source: interviewVal ? "database" : "derived",
    confidence: interviewVal ? 0.95 : 0.8
  };

  const finalResultVal = extractRawValue(rawDates.finalResultDate);
  const finalResultModel: DateFieldModel = {
    value: finalResultVal,
    status: finalResultVal ? "released" : "not_declared",
    statusLabel: finalResultVal ? `Published (${finalResultVal})` : "Final Result Pending",
    source: finalResultVal ? "database" : "derived",
    confidence: finalResultVal ? 0.95 : 0.8
  };

  return {
    applicationStart: rawStartVal,
    applicationLastDate: rawLastVal,
    applicationEnd: rawLastVal,
    feeLastDate: rawFeeVal,
    feePaymentEnd: rawFeeVal,
    correctionLastDate: rawCorrectionVal,
    correctionEnd: rawCorrectionVal,
    examCityDate: rawCityVal,
    citySlipDate: rawCityVal,
    examDate: rawExamVal,
    examDateFrom: examFrom,
    examDateTo: examTo,
    admitCardDate: rawAdmitVal,
    answerKeyDate: answerKeyVal,
    resultDate: rawResultVal,
    scorecardDate: rawResultVal,
    cutoffDate: rawResultVal,
    documentVerificationDate: dvVal,
    interviewDate: interviewVal,
    finalResultDate: finalResultVal,
    shiftTimings: rawDates.shiftTimings || null,

    examDateStatus: examStatus,
    admitCardStatus: admitStatus,
    applicationLastStatus: appLastStatus,
    resultStatus,

    models: {
      applicationStart: appStartModel,
      applicationEnd: appEndModel,
      feePaymentEnd: feeModel,
      correctionEnd: correctionModel,
      examCityDate: citySlipModel,
      examDate: examDateModel,
      admitCardDate: admitCardDateModel,
      answerKeyDate: answerKeyModel,
      resultDate: resultModel,
      scorecardDate: scorecardModel,
      cutoffDate: cutoffModel,
      documentVerificationDate: dvModel,
      interviewDate: interviewModel,
      finalResultDate: finalResultModel
    }
  };
}

export interface DateValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Universal Temporal Order & Logic Validator
 * Ensures application_begin <= application_last_date <= exam_date,
 * admit_card_date <= exam_date, and flags suspicious or impossible dates.
 */
export function validateNoticeDates(dates: {
  applicationStart?: string | null;
  applicationLastDate?: string | null;
  admitCardDate?: string | null;
  examDate?: string | null;
  examDateFrom?: string | null;
}): DateValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  const parseSafe = (dStr?: string | null): number | null => {
    if (!dStr) return null;
    const clean = cleanDateValue(dStr);
    if (!clean) return null;
    // Extract first day/month/year if date range
    const single = clean.split(/[–—\-]|(\bto\b)/i)[0].trim();
    const ts = Date.parse(single);
    return isNaN(ts) ? null : ts;
  };

  const startTs = parseSafe(dates.applicationStart);
  const lastTs = parseSafe(dates.applicationLastDate);
  const admitTs = parseSafe(dates.admitCardDate);
  const examTs = parseSafe(dates.examDateFrom || dates.examDate);

  // 1. Application start <= Application last date
  if (startTs && lastTs && startTs > lastTs) {
    errors.push(`Application start date (${dates.applicationStart}) is after application last date (${dates.applicationLastDate})`);
  }

  // 2. Application last date <= Exam date
  if (lastTs && examTs && lastTs > examTs) {
    warnings.push(`Application deadline (${dates.applicationLastDate}) is after exam date (${dates.examDate || dates.examDateFrom})`);
  }

  // 3. Admit card <= Exam date
  if (admitTs && examTs && admitTs > examTs) {
    warnings.push(`Admit card release date (${dates.admitCardDate}) is after exam date (${dates.examDate || dates.examDateFrom})`);
  }

  // 4. Sanity check years (must be between 2020 and 2035)
  for (const [name, val] of Object.entries(dates)) {
    if (val && typeof val === 'string') {
      const ym = val.match(/\b(20\d\d)\b/);
      if (ym) {
        const y = parseInt(ym[1], 10);
        if (y < 2020 || y > 2035) {
          errors.push(`Suspicious year ${y} detected in ${name}: "${val}"`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
}
