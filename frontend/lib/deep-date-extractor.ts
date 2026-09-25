/**
 * Universal Deep Date Extraction Engine for HireOrbitAI
 *
 * Extracts exact dates, date ranges, and statuses from article text, titles,
 * HTML tables, and JSON-LD schemas without authority-specific hardcoding.
 */

import { cleanDateValue, isRealDateString, detectExamStage, ExamStage } from "./universal-date-normalizer";
import { parseSarkariResultHtml } from "./sarkari-result-parser";

const MONTH_NAMES = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";

export interface ExtractedUniversalDates {
  stage?: ExamStage;
  examDate: string | null;
  examDateFrom: string | null;
  examDateTo: string | null;
  examDateStatus: "not_announced" | "announced" | "completed";
  examDateEvidence: string | null;

  admitCardDate: string | null;
  admitCardStatus: "not_announced" | "released" | "upcoming" | "completed";
  admitCardEvidence: string | null;

  citySlipDate: string | null;
  citySlipStatus: "not_announced" | "available" | "completed";
  citySlipEvidence: string | null;

  applicationStart: string | null;
  applicationStartEvidence?: string | null;
  applicationLastDate: string | null;
  applicationLastDateEvidence?: string | null;
  feeLastDate: string | null;
  feeLastDateEvidence?: string | null;
  resultDate: string | null;
  resultDateEvidence?: string | null;
  resultStatus: "not_declared" | "announced" | "released";
  confidence: number;
  stages?: Record<string, any>;

  // Rich metadata fields (extracted from Sarkari Result and tabular layouts)
  applicationFee?: { generalOBC: string; scStPh: string; female: string; paymentMode?: string };
  ageLimit?: string;
  qualification?: string;
  qualificationLevel?: "10th" | "12th" | "diploma" | "graduate" | "postgraduate";
  vacancies?: string;
  officialPdfUrl?: string | null;
  applyUrl?: string | null;
}

/**
 * Normalizes day, month, and year into standardized format: "DD Month YYYY"
 */
function formatCalendarDate(dayStr: string, monthStr: string, yearStr?: string, defaultYear: string = "2026"): string {
  const day = dayStr.replace(/\D/g, "");
  const y = yearStr && yearStr.match(/20\d\d/) ? yearStr.trim() : defaultYear;
  return `${day} ${monthStr} ${y}`.trim();
}

/**
 * Universal date extractor capable of recognizing single dates and date ranges
 */
export function extractDatesFromText(
  text: string,
  noticeTitle: string,
  fallbackYear: string = "2026"
): ExtractedUniversalDates {
  const cleanText = `${noticeTitle} ${text}`.replace(/\s+/g, " ");

  // 1. Establish Reliable Year from Surrounding Context
  const yearMatch = noticeTitle.match(/\b(202[4-9]|203\d)\b/) || text.match(/\b(202[4-9]|203\d)\b/);
  const establishedYear = yearMatch ? yearMatch[1] : fallbackYear;

  let examDate: string | null = null;
  let examDateFrom: string | null = null;
  let examDateTo: string | null = null;
  let examDateEvidence: string | null = null;

  let admitCardDate: string | null = null;
  let admitCardEvidence: string | null = null;

  let citySlipDate: string | null = null;
  let citySlipEvidence: string | null = null;

  let applicationStart: string | null = null;
  let applicationLastDate: string | null = null;
  let feeLastDate: string | null = null;
  let resultDate: string | null = null;

  // ─────────────────────────────────────────────────────────────────────────────
  // A. EXAM DATE RANGE PATTERNS
  // e.g.:
  // - "for September 9 and 10" / "on September 9 and 10"
  // - "from September 12 to September 26" / "between September 12 and September 26"
  // - "30 September 2026 to 30 October 2026" / "from 12 September to 26 September 2026"
  // ─────────────────────────────────────────────────────────────────────────────

  // Pattern 1: Same month range ("September 9 and 10", "December 12 & 13", "September 12 to 26")
  const sameMonthRangeRegex = new RegExp(
    `(?:exam(?:ination)?|cbt|test|screening|schedule[d]?|re-examination|physical test|pet|pst)?\\s*(?:for|on|from|between|during)?\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(?:and|&|to|-|–|—)\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );

  // Pattern 2: Same month range day first ("9 and 10 September", "12 & 13 December", "12 to 26 September")
  const dayFirstSameMonthRangeRegex = new RegExp(
    `(?:exam(?:ination)?|cbt|test|screening|schedule[d]?|re-examination|physical test|pet|pst)?\\s*(?:for|on|from|between|during)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(?:and|&|to|-|–|—)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );

  // Pattern 3: Cross month range ("30 September to 30 October", "from 12 September 2026 to 26 September 2026")
  const crossMonthRangeRegex = new RegExp(
    `(?:exam(?:ination)?|cbt|test|screening|schedule[d]?|re-examination|physical test|pet|pst)?\\s*(?:for|on|from|between|conducted from)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*(20\\d\\d))?\\s*(?:to|and|&|-|–|—)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*(20\\d\\d))?`,
    "i"
  );

  const crossMatch = cleanText.match(crossMonthRangeRegex);
  const sameMonthMatch = cleanText.match(sameMonthRangeRegex);
  const dayFirstSameMonthMatch = cleanText.match(dayFirstSameMonthRangeRegex);

  if (crossMatch && crossMatch[1] && crossMatch[2] && crossMatch[4] && crossMatch[5]) {
    const y1 = crossMatch[3] || establishedYear;
    const y2 = crossMatch[6] || crossMatch[3] || establishedYear;
    examDateFrom = formatCalendarDate(crossMatch[1], crossMatch[2], y1, establishedYear);
    examDateTo = formatCalendarDate(crossMatch[4], crossMatch[5], y2, establishedYear);
    examDate = `${examDateFrom} – ${examDateTo}`;
    examDateEvidence = crossMatch[0].trim();
  } else if (sameMonthMatch && sameMonthMatch[1] && sameMonthMatch[2] && sameMonthMatch[3]) {
    const m = sameMonthMatch[1];
    const y = sameMonthMatch[4] || establishedYear;
    examDateFrom = formatCalendarDate(sameMonthMatch[2], m, y, establishedYear);
    examDateTo = formatCalendarDate(sameMonthMatch[3], m, y, establishedYear);
    examDate = `${examDateFrom} – ${examDateTo}`;
    examDateEvidence = sameMonthMatch[0].trim();
  } else if (dayFirstSameMonthMatch && dayFirstSameMonthMatch[1] && dayFirstSameMonthMatch[2] && dayFirstSameMonthMatch[3]) {
    const m = dayFirstSameMonthMatch[3];
    const y = dayFirstSameMonthMatch[4] || establishedYear;
    examDateFrom = formatCalendarDate(dayFirstSameMonthMatch[1], m, y, establishedYear);
    examDateTo = formatCalendarDate(dayFirstSameMonthMatch[2], m, y, establishedYear);
    examDate = `${examDateFrom} – ${examDateTo}`;
    examDateEvidence = dayFirstSameMonthMatch[0].trim();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // B. SINGLE EXAM DATE PATTERNS (If not a range)
  // e.g.:
  // - "exam is scheduled for September 17, 2026"
  // - "conducted on September 27, 2026"
  // - "exam date: 27 September 2026"
  // ─────────────────────────────────────────────────────────────────────────────
  if (!examDate) {
    const singleExamRegex1 = new RegExp(
      `(?:exam(?:ination)?|cbt|written test|physical test|pet|screening|schedule[d]?)\\s*(?:is|will be|date)?\\s*(?:on|held on|scheduled for|from|date[:\\s]+)?\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
      "i"
    );
    const singleExamRegex2 = new RegExp(
      `(?:exam(?:ination)?|cbt|written test|physical test|pet|screening|schedule[d]?)\\s*(?:is|will be|date)?\\s*(?:on|held on|scheduled for|from|date[:\\s]+)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
      "i"
    );

    const m1 = cleanText.match(singleExamRegex1);
    const m2 = cleanText.match(singleExamRegex2);

    if (m1 && m1[1] && m1[2]) {
      examDate = formatCalendarDate(m1[2], m1[1], m1[3], establishedYear);
      examDateEvidence = m1[0].trim();
    } else if (m2 && m2[1] && m2[2]) {
      examDate = formatCalendarDate(m2[1], m2[2], m2[3], establishedYear);
      examDateEvidence = m2[0].trim();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // C. ADMIT CARD / HALL TICKET RELEASE DATE
  // e.g.:
  // - "released on September 13, 2026"
  // - "Admit Card 2026 has been released on September 13, 2026"
  // - "hall tickets were released on September 4"
  // - "Physical Test Admit Card | 13 February 2026"
  // - "admit card released on 18 September 2026"
  // ─────────────────────────────────────────────────────────────────────────────
  const admitCardRegex1 = new RegExp(
    `(?:admit cards?|hall tickets?|call letters?|admission certificates?)[^\r\n.!?]{0,55}?(?:is|was|were|has been|have been)?\\s*(?:out|released|available|issued|download)?\\s*(?:on|from|dated)\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const admitCardRegex2 = new RegExp(
    `(?:admit cards?|hall tickets?|call letters?|admission certificates?)[^\r\n.!?]{0,55}?(?:is|was|were|has been|have been)?\\s*(?:out|released|available|issued|download)?\\s*(?:on|from|dated)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const tableAdmitCardRegex = new RegExp(
    `(?:admit cards?|hall tickets?)[^\r\n|]{0,60}\\|\\s*([0-3]?\\d)\\s*(${MONTH_NAMES})\\s*(20\\d\\d)?`,
    "i"
  );

  const allMatches = [
    ...cleanText.matchAll(new RegExp(tableAdmitCardRegex.source, "gi")),
    ...cleanText.matchAll(new RegExp(admitCardRegex1.source, "gi")),
    ...cleanText.matchAll(new RegExp(admitCardRegex2.source, "gi"))
  ];

  const noticeStage = detectExamStage(noticeTitle);
  const stages: Record<string, any> = {};
  const candidates: Array<{ day: string; month: string; year?: string; raw: string }> = [];

  for (const match of allMatches) {
    if (!match) continue;
    const raw = match[0];
    // Reject publication dates and non-release contexts (e.g. "hall ticket for September 27" where 'for [Date]' is the exam date)
    if (/posted on|published on|web correspondent|author|updated on|byline/i.test(raw)) continue;
    if (new RegExp(`\\bfor\\s+(?:the\\s+)?(?:${MONTH_NAMES}|[0-3]?\\d(?:st|nd|rd|th)?|exam|cbt|test)\\b`, "i").test(raw)) continue;

    let day = "";
    let month = "";
    let yearCandidate: string | undefined;

    if (match[1] && match[2]) {
      if (/\d/.test(match[1])) {
        day = match[1];
        month = match[2];
        yearCandidate = match[3];
      } else {
        day = match[2];
        month = match[1];
        yearCandidate = match[3];
      }
    }

    if (!day || !month) continue;

    // Check snippet stage with surrounding context (e.g. "CBT 1 admit card")
    const matchIndex = match.index || 0;
    const contextStart = Math.max(0, matchIndex - 50);
    const surroundingText = cleanText.slice(contextStart, matchIndex + raw.length);
    const snippetStage = detectExamStage(surroundingText);
    const candidateFormatted = formatCalendarDate(day, month, yearCandidate, establishedYear);

    // If candidate belongs to a different stage than notice target stage, isolate it
    if (noticeStage !== "general" && snippetStage !== "general" && snippetStage !== noticeStage) {
      if (!stages[snippetStage]) stages[snippetStage] = {};
      stages[snippetStage].admitCardDate = candidateFormatted;
      stages[snippetStage].admitCardEvidence = surroundingText.trim();
      continue;
    }

    candidates.push({ day, month, year: yearCandidate, raw });
  }

  // Filter candidates against chronological impossibility: Admit Card CANNOT be after Exam Date!
  const validCandidates = candidates.filter(c => {
    const formatted = formatCalendarDate(c.day, c.month, c.year, establishedYear);
    if (examDate) {
      const examFirst = examDate.split(/[–—\-]|(\bto\b)/i)[0].trim();
      const examTs = Date.parse(examFirst);
      const admitTs = Date.parse(formatted);
      if (!isNaN(examTs) && !isNaN(admitTs) && admitTs > examTs) {
        // Chronological impossibility: admit card released after exam date
        return false;
      }
    }
    return true;
  });

  if (validCandidates.length > 0) {
    // Prefer candidate whose year matches the established year
    const preferred = validCandidates.find(c => c.year === establishedYear) || validCandidates[0];
    admitCardDate = formatCalendarDate(preferred.day, preferred.month, preferred.year, establishedYear);
    admitCardEvidence = preferred.raw.trim();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // D. CITY INTIMATION SLIP DATE
  // e.g.:
  // - "city intimation slips on 22 September 2026"
  // - "city slip released on September 10"
  // ─────────────────────────────────────────────────────────────────────────────
  const citySlipRegex = new RegExp(
    `(?:city slip|city intimation|exam city)\\s*(?:out|released|active)?\\s*(?:on|from)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const csMatch = cleanText.match(citySlipRegex);
  if (csMatch && csMatch[1] && csMatch[2]) {
    citySlipDate = formatCalendarDate(csMatch[1], csMatch[2], csMatch[3], establishedYear);
    citySlipEvidence = csMatch[0].trim();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // D2. APPLICATION START & LAST DATE PATTERNS
  // ─────────────────────────────────────────────────────────────────────────────
  let applicationStartEvidence: string | null = null;
  const appStartRegex1 = new RegExp(
    `(?:apply online from|registration begins?|application starts?|start date[:\\s]+|begins? on|online application from)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const appStartRegex2 = new RegExp(
    `(?:apply online from|registration begins?|application starts?|start date[:\\s]+|begins? on|online application from)\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const as1 = cleanText.match(appStartRegex1);
  const as2 = cleanText.match(appStartRegex2);
  if (as1 && as1[1] && as1[2]) {
    applicationStart = formatCalendarDate(as1[1], as1[2], as1[3], establishedYear);
    applicationStartEvidence = as1[0].trim();
  } else if (as2 && as2[1] && as2[2]) {
    applicationStart = formatCalendarDate(as2[2], as2[1], as2[3], establishedYear);
    applicationStartEvidence = as2[0].trim();
  }

  let applicationLastDateEvidence: string | null = null;
  const appLastRegex1 = new RegExp(
    `(?:apply by|last date(?:\\s+to apply)?|apply online till|closing date|registration ends?|deadline[:\\s]+)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const appLastRegex2 = new RegExp(
    `(?:apply by|last date(?:\\s+to apply)?|apply online till|closing date|registration ends?|deadline[:\\s]+)\\s*(${MONTH_NAMES})\\s*([0-3]?\\d(?:st|nd|rd|th)?)(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const tableLastDateRegex = new RegExp(
    `(?:last date|closing date)[^\r\n|]{0,60}\\|\\s*([0-3]?\\d)\\s*(${MONTH_NAMES})\\s*(20\\d\\d)?`,
    "i"
  );
  const al1 = cleanText.match(appLastRegex1);
  const al2 = cleanText.match(appLastRegex2);
  const alTable = cleanText.match(tableLastDateRegex);
  if (al1 && al1[1] && al1[2]) {
    applicationLastDate = formatCalendarDate(al1[1], al1[2], al1[3], establishedYear);
    applicationLastDateEvidence = al1[0].trim();
  } else if (al2 && al2[1] && al2[2]) {
    applicationLastDate = formatCalendarDate(al2[2], al2[1], al2[3], establishedYear);
    applicationLastDateEvidence = al2[0].trim();
  } else if (alTable && alTable[1] && alTable[2]) {
    applicationLastDate = formatCalendarDate(alTable[1], alTable[2], alTable[3], establishedYear);
    applicationLastDateEvidence = alTable[0].trim();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // D3. FEE PAYMENT LAST DATE
  // ─────────────────────────────────────────────────────────────────────────────
  let feeLastDateEvidence: string | null = null;
  const feeRegex = new RegExp(
    `(?:fee payment last date|pay fee till|fee last date|last date for fee)\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const fMatch = cleanText.match(feeRegex);
  if (fMatch && fMatch[1] && fMatch[2]) {
    feeLastDate = formatCalendarDate(fMatch[1], fMatch[2], fMatch[3], establishedYear);
    feeLastDateEvidence = fMatch[0].trim();
  } else if (applicationLastDate) {
    feeLastDate = applicationLastDate;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // D4. RESULT DATE
  // ─────────────────────────────────────────────────────────────────────────────
  let resultDateEvidence: string | null = null;
  const resultRegex1 = new RegExp(
    `(?:result|scorecard|merit list)\\s*(?:out|declared|released|announced)?\\s*(?:on|from|dated)?\\s*([0-3]?\\d(?:st|nd|rd|th)?)\\s*(${MONTH_NAMES})(?:\\s*,?\\s*(20\\d\\d))?`,
    "i"
  );
  const rMatch = cleanText.match(resultRegex1);
  if (rMatch && rMatch[1] && rMatch[2]) {
    resultDate = formatCalendarDate(rMatch[1], rMatch[2], rMatch[3], establishedYear);
    resultDateEvidence = rMatch[0].trim();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // E. STRICT VALIDATION & DECOUPLING
  // ─────────────────────────────────────────────────────────────────────────────
  const cleanExam = cleanDateValue(examDate) || null;
  const cleanAdmit = cleanDateValue(admitCardDate) || null;
  const cleanCity = cleanDateValue(citySlipDate) || null;
  const cleanAppStart = cleanDateValue(applicationStart) || null;
  const cleanAppLast = cleanDateValue(applicationLastDate) || null;
  const cleanFeeLast = cleanDateValue(feeLastDate) || cleanAppLast || null;
  const cleanResult = cleanDateValue(resultDate) || null;

  const confidence = (cleanExam || cleanAdmit) ? 0.98 : (cleanAppStart || cleanAppLast ? 0.95 : 0.85);

  return {
    examDate: cleanExam,
    examDateFrom: examDateFrom ? cleanDateValue(examDateFrom) || null : null,
    examDateTo: examDateTo ? cleanDateValue(examDateTo) || null : null,
    examDateStatus: cleanExam ? "announced" : "not_announced",
    examDateEvidence: cleanExam ? examDateEvidence : null,

    admitCardDate: cleanAdmit,
    admitCardStatus: cleanAdmit ? "released" : "not_announced",
    admitCardEvidence: cleanAdmit ? admitCardEvidence : null,

    citySlipDate: cleanCity,
    citySlipStatus: cleanCity ? "available" : "not_announced",
    citySlipEvidence: cleanCity ? citySlipEvidence : null,

    applicationStart: cleanAppStart,
    applicationStartEvidence: cleanAppStart ? applicationStartEvidence : null,
    applicationLastDate: cleanAppLast,
    applicationLastDateEvidence: cleanAppLast ? applicationLastDateEvidence : null,
    feeLastDate: cleanFeeLast,
    feeLastDateEvidence: cleanFeeLast ? feeLastDateEvidence : null,
    resultDate: cleanResult,
    resultDateEvidence: cleanResult ? resultDateEvidence : null,
    resultStatus: cleanResult ? "released" : "not_declared",
    confidence,
    stage: noticeStage,
    stages: Object.keys(stages).length > 0 ? stages : undefined
  };
}

/**
 * Resolves Google News RSS or aggregator URL to direct publisher URL
 */
export async function resolveSourceUrl(url: string): Promise<string> {
  if (!url) return url;
  if (!url.includes("news.google.com")) return url;

  try {
    const { execFileSync } = await import("child_process");
    const out = execFileSync(
      "python",
      ["-c", "import googlenewsdecoder, sys, json; res = googlenewsdecoder.gnewsdecoder(sys.argv[1]); print(json.dumps(res))", url],
      { timeout: 4000, encoding: "utf8" }
    );
    const parsed = JSON.parse(out);
    if (parsed.success && parsed.decoded_url) {
      return parsed.decoded_url;
    }
  } catch {
    // Graceful fallback if python or decoder is unavailable
  }
  return url;
}

/**
 * Safely fetches publisher raw HTML with 4.5s timeout
 */
export async function fetchRawHtml(url: string): Promise<string> {
  if (!url || url.includes("news.google.com")) return "";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(4500)
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

/**
 * Converts HTML into clean article text by stripping tags and converting table cells
 */
export function htmlToArticleText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
      if (match.includes("application/ld+json")) {
        return match.replace(/<[^>]+>/g, " ");
      }
      return " ";
    })
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<t[dh][^>]*>/gi, " | ")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50000);
}

/**
 * Safely fetches publisher HTML text with 4.5s timeout and extracts content + tables + schemas
 */
export async function fetchArticleText(url: string): Promise<string> {
  const html = await fetchRawHtml(url);
  return htmlToArticleText(html);
}

/**
 * High-level universal extraction: resolves source URL, fetches text, and extracts dates with evidence.
 * If the source is Sarkari Result or a standardized tabular notice page, it also extracts
 * Application Fees, Age Limits, Educational Qualification, Vacancies, and Official Links.
 */
export async function deepExtractFromNotice(
  title: string,
  rawSnippet: string,
  sourceUrl?: string | null,
  fallbackYear: string = "2026"
): Promise<ExtractedUniversalDates> {
  // 1. Initial extraction from title and snippet
  let extracted = extractDatesFromText(rawSnippet, title, fallbackYear);

  // 2. Deep source fetch if URL is available
  if (sourceUrl) {
    const directUrl = await resolveSourceUrl(sourceUrl);
    if (directUrl && !directUrl.includes("news.google.com")) {
      const rawHtml = await fetchRawHtml(directUrl);
      if (rawHtml) {
        // A. Check if it's a Sarkari Result / standardized tabular portal
        const isSarkariOrTabular = directUrl.includes("sarkariresult") || 
          (/Important\s*Dates/i.test(rawHtml) && (/Application\s*Fee/i.test(rawHtml) || /Age\s*Limit/i.test(rawHtml)));

        if (isSarkariOrTabular) {
          const sarkari = parseSarkariResultHtml(rawHtml);
          if (sarkari.isSarkariLayout) {
            const sd = sarkari.importantDates;
            return {
              examDate: sd.examDate || extracted.examDate,
              examDateFrom: sd.examDateFrom || extracted.examDateFrom,
              examDateTo: sd.examDateTo || extracted.examDateTo,
              examDateStatus: sd.examDate ? "announced" : extracted.examDateStatus,
              examDateEvidence: sd.examDate ? "Official examination schedule" : extracted.examDateEvidence,

              admitCardDate: sd.admitCardDate || extracted.admitCardDate,
              admitCardStatus: sd.admitCardDate ? "released" : extracted.admitCardStatus,
              admitCardEvidence: sd.admitCardDate ? "Official admit card schedule" : extracted.admitCardEvidence,

              citySlipDate: extracted.citySlipDate,
              citySlipStatus: extracted.citySlipStatus,
              citySlipEvidence: extracted.citySlipEvidence,

              applicationStart: sd.startDate || extracted.applicationStart,
              applicationStartEvidence: sd.startDate ? "Official online application begin date" : extracted.applicationStartEvidence,
              applicationLastDate: sd.lastDate || extracted.applicationLastDate,
              applicationLastDateEvidence: sd.lastDate ? "Official online application last date" : extracted.applicationLastDateEvidence,
              feeLastDate: sd.feeLastDate || extracted.feeLastDate,
              feeLastDateEvidence: sd.feeLastDate ? "Official examination fee payment deadline" : extracted.feeLastDateEvidence,
              resultDate: sd.resultDate || extracted.resultDate,
              resultDateEvidence: sd.resultDate ? "Official result declaration" : extracted.resultDateEvidence,
              resultStatus: sd.resultDate ? "released" : extracted.resultStatus,
              confidence: 0.95,
              stage: extracted.stage,
              stages: extracted.stages,

              // Rich metadata from Sarkari Result
              applicationFee: sarkari.applicationFee,
              ageLimit: sarkari.ageLimit.rawText,
              qualification: sarkari.qualification || undefined,
              qualificationLevel: sarkari.qualificationLevel,
              vacancies: sarkari.vacancies || undefined,
              officialPdfUrl: sarkari.officialLinks.notificationPdfUrl,
              applyUrl: sarkari.officialLinks.applyOnlineUrl,
            };
          }
        }

        // B. Standard article text extraction (news portals, blogs, aggregators)
        const articleText = htmlToArticleText(rawHtml);
        if (articleText) {
          const deepDates = extractDatesFromText(articleText, title, fallbackYear);
          return {
            examDate: deepDates.examDate || extracted.examDate,
            examDateFrom: deepDates.examDateFrom || extracted.examDateFrom,
            examDateTo: deepDates.examDateTo || extracted.examDateTo,
            examDateStatus: deepDates.examDate ? "announced" : extracted.examDateStatus,
            examDateEvidence: deepDates.examDateEvidence || extracted.examDateEvidence,

            admitCardDate: deepDates.admitCardDate || extracted.admitCardDate,
            admitCardStatus: deepDates.admitCardDate ? "released" : extracted.admitCardStatus,
            admitCardEvidence: deepDates.admitCardEvidence || extracted.admitCardEvidence,

            citySlipDate: deepDates.citySlipDate || extracted.citySlipDate,
            citySlipStatus: deepDates.citySlipDate ? "available" : extracted.citySlipStatus,
            citySlipEvidence: deepDates.citySlipEvidence || extracted.citySlipEvidence,

            applicationStart: deepDates.applicationStart || extracted.applicationStart,
            applicationStartEvidence: deepDates.applicationStartEvidence || extracted.applicationStartEvidence,
            applicationLastDate: deepDates.applicationLastDate || extracted.applicationLastDate,
            applicationLastDateEvidence: deepDates.applicationLastDateEvidence || extracted.applicationLastDateEvidence,
            feeLastDate: deepDates.feeLastDate || extracted.feeLastDate,
            feeLastDateEvidence: deepDates.feeLastDateEvidence || extracted.feeLastDateEvidence,
            resultDate: deepDates.resultDate || extracted.resultDate,
            resultDateEvidence: deepDates.resultDateEvidence || extracted.resultDateEvidence,
            resultStatus: deepDates.resultDate ? "released" : extracted.resultStatus,
            confidence: Math.max(deepDates.confidence, extracted.confidence),
            stage: deepDates.stage || extracted.stage,
            stages: deepDates.stages || extracted.stages
          };
        }
      }
    }
  }

  return extracted;
}
