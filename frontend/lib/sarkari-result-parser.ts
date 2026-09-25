/**
 * Universal Sarkari Result & Tabular Government Notice Extractor
 *
 * Extracts structured data from standardized government job portals (especially
 * Sarkari Result, Sarkari Naukri, and similar tabular layouts):
 * - Important Dates (Application Start, Last Date, Fee Deadline, Correction, Exam, Admit Card, Result)
 * - Application Fee (General/OBC/EWS, SC/ST/PH, Female, Payment Mode)
 * - Age Limit (Min Age, Max Age, As-on Cutoff Date, Relaxation)
 * - Educational Qualification & Level ('10th' | '12th' | 'diploma' | 'graduate' | 'postgraduate')
 * - Vacancy Counts & Post-wise details
 * - Official Links (Apply Online, Notification PDF, Official Portal)
 *
 * All brand footprints (e.g. "Sarkari Result", watermarks) are stripped completely.
 */

import { cleanDateValue, isRealDateString } from "./universal-date-normalizer";

const MONTHS_MAP: Record<string, string> = {
  "01": "January", "1": "January",
  "02": "February", "2": "February",
  "03": "March", "3": "March",
  "04": "April", "4": "April",
  "05": "May", "5": "May",
  "06": "June", "6": "June",
  "07": "July", "7": "July",
  "08": "August", "8": "August",
  "09": "September", "9": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

export interface ExtractedSarkariNotice {
  isSarkariLayout: boolean;
  importantDates: {
    startDate: string | null;
    lastDate: string | null;
    feeLastDate: string | null;
    correctionStartDate: string | null;
    correctionLastDate: string | null;
    examDate: string | null;
    examDateFrom?: string | null;
    examDateTo?: string | null;
    admitCardDate: string | null;
    answerKeyDate: string | null;
    resultDate: string | null;
    examDateStatus?: "not_announced" | "announced" | "completed";
    admitCardStatus?: "not_announced" | "released" | "upcoming" | "completed";
  };
  applicationFee: {
    generalOBC: string;
    scStPh: string;
    female: string;
    paymentMode?: string;
  };
  ageLimit: {
    minAge: string | null;
    maxAge: string | null;
    asOnDate: string | null;
    rawText: string;
  };
  vacancies: string | null;
  qualification: string | null;
  qualificationLevel: "10th" | "12th" | "diploma" | "graduate" | "postgraduate";
  postWiseDetails?: Array<{
    postName: string;
    totalPost?: string;
    eligibility?: string;
  }>;
  officialLinks: {
    applyOnlineUrl: string | null;
    notificationPdfUrl: string | null;
    officialWebsiteUrl: string | null;
  };
}

/**
 * Normalizes date formats like "20/07/2026", "20-07-2026", "20 July 2026" into "DD Month YYYY"
 */
export function normalizeSarkariDateString(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const s = raw.replace(/\s+/g, " ").trim();

  // Pattern A: DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = s.match(/\b([0-3]?\d)[\/\-]([0-1]?\d)[\/\-](20\d\d)\b/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1], 10);
    const monthKey = slashMatch[2].padStart(2, "0");
    const year = slashMatch[3];
    const monthName = MONTHS_MAP[monthKey];
    if (day >= 1 && day <= 31 && monthName) {
      return `${day} ${monthName} ${year}`;
    }
  }

  // Pattern B: Already standard or Month Name e.g. "20 August 2026", "August 2026"
  const clean = cleanDateValue(s);
  if (clean) return clean;

  return null;
}

/**
 * Normalizes date ranges e.g. "16-18 February 2026" or "16/02/2026 to 18/02/2026"
 */
function normalizeSarkariDateRange(raw: string): { dateStr: string | null; from: string | null; to: string | null } {
  // Check DD-DD Month YYYY
  const sameMonthRange = raw.match(/\b([0-3]?\d)\s*(?:to|-)\s*([0-3]?\d)\s+([A-Za-z]+)\s+(20\d\d)\b/i);
  if (sameMonthRange) {
    const fromDay = parseInt(sameMonthRange[1], 10);
    const toDay = parseInt(sameMonthRange[2], 10);
    const m = sameMonthRange[3];
    const y = sameMonthRange[4];
    const fullFrom = `${fromDay} ${m} ${y}`;
    const fullTo = `${toDay} ${m} ${y}`;
    return {
      dateStr: `${fullFrom} – ${fullTo}`,
      from: fullFrom,
      to: fullTo,
    };
  }

  // Check DD/MM/YYYY to DD/MM/YYYY
  const slashRange = raw.match(/\b([0-3]?\d[\/\-][0-1]?\d[\/\-]20\d\d)\s*(?:to|-)\s*([0-3]?\d[\/\-][0-1]?\d[\/\-]20\d\d)\b/i);
  if (slashRange) {
    const fromNorm = normalizeSarkariDateString(slashRange[1]);
    const toNorm = normalizeSarkariDateString(slashRange[2]);
    if (fromNorm && toNorm) {
      return {
        dateStr: `${fromNorm} – ${toNorm}`,
        from: fromNorm,
        to: toNorm,
      };
    }
  }

  const single = normalizeSarkariDateString(raw);
  return { dateStr: single, from: single, to: single };
}

/**
 * Determine qualification level from text
 */
export function classifyQualificationLevel(text: string): "10th" | "12th" | "diploma" | "graduate" | "postgraduate" {
  const t = text.toLowerCase();
  if (/post\s*graduate|master|m\.?tech|m\.?sc|m\.?com|m\.?a\b|md|ms\b/i.test(t)) {
    return "postgraduate";
  }
  if (/diploma|polytechnic|iti\b/i.test(t) && !/degree|graduate|bachelor/i.test(t)) {
    return /iti\b/i.test(t) ? "10th" : "diploma";
  }
  if (/bachelor|degree|graduate|b\.?tech|b\.?e\b|b\.?sc|b\.?com|b\.?a\b|llb|mbbs/i.test(t)) {
    return "graduate";
  }
  if (/12th|intermediate|10\+2|senior secondary|inter\b/i.test(t)) {
    return "12th";
  }
  if (/10th|matric|high school|class 10|sslc/i.test(t)) {
    return "10th";
  }
  return "graduate";
}

/**
 * Cleans text and strips aggregator watermarks and branding
 */
export function cleanSarkariText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\b(?:sarkari\s*result(?:\.com)?|sarkariresult|sarkari\s*naukri)\b/gi, "")
    .replace(/https?:\/\/(?:www\.)?sarkariresult\.com[^\s]*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Main parser: Parses full Sarkari Result HTML page
 */
export function parseSarkariResultHtml(html: string): ExtractedSarkariNotice {
  const isSarkariLayout = /sarkari\s*result|sarkariresult/i.test(html) ||
    (/Important\s*Dates/i.test(html) && /Application\s*Fee/i.test(html) && /Age\s*Limit/i.test(html));

  // 1. Text normalization
  // Convert table cells to structured lines
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<t[dh][^>]*>/gi, " | ")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&bull;/g, "•");

  const lines = cleanHtml.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 2. Extract Important Dates
  let startDate: string | null = null;
  let lastDate: string | null = null;
  let feeLastDate: string | null = null;
  let correctionStartDate: string | null = null;
  let correctionLastDate: string | null = null;
  let examDate: string | null = null;
  let examDateFrom: string | null = null;
  let examDateTo: string | null = null;
  let admitCardDate: string | null = null;
  let answerKeyDate: string | null = null;
  let resultDate: string | null = null;

  function formatFeeAmount(val: string): string {
    const s = val.trim();
    const digits = s.replace(/[^\d]/g, "");
    if (/nil|free|exempted/i.test(s) || (digits !== "" && parseInt(digits, 10) === 0) || s === "0/-" || s === "0") {
      return "₹0 (Exempted)";
    }
    if (digits) {
      return `₹${digits}/-`;
    }
    return s;
  }

  for (const line of lines) {
    // Application Begin
    if (/Application\s*Begin\s*[:|-]/i.test(line)) {
      const val = line.replace(/.*?Application\s*Begin\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      startDate = normalizeSarkariDateString(val);
    }
    // Last Date for Apply Online
    if (/Last\s*Date\s*(?:for|to)?\s*(?:Apply|Registration)(?:\s*Online)?\s*[:|-]/i.test(line)) {
      const val = line.replace(/.*?Last\s*Date\s*(?:for|to)?\s*(?:Apply|Registration)(?:\s*Online)?\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      lastDate = normalizeSarkariDateString(val);
    }
    // Pay Exam Fee Last Date
    if (/(?:Pay\s*(?:Exam\s*)?Fee(?:\s*Last\s*Date)?|Last\s*Date\s*(?:for\s*)?Fee\s*Payment)\s*[:|-]/i.test(line)) {
      const val = line.replace(/.*?(?:Pay\s*(?:Exam\s*)?Fee(?:\s*Last\s*Date)?|Last\s*Date\s*(?:for\s*)?Fee\s*Payment)\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      feeLastDate = normalizeSarkariDateString(val);
    }
    // Correction Date
    if (/Correction\s*(?:Date|Window)\s*[:|-]/i.test(line)) {
      const val = line.replace(/.*?Correction\s*(?:Date|Window)\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      const range = normalizeSarkariDateRange(val);
      correctionStartDate = range.from;
      correctionLastDate = range.to || range.dateStr;
    }
    // Exam Date
    if (/(?:Exam|CBT|Written\s*Exam)\s*Date\s*[:|-]/i.test(line) && !/Fee|Last\s*Date/i.test(line)) {
      const val = line.replace(/.*?(?:Exam|CBT|Written\s*Exam)\s*Date\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      const range = normalizeSarkariDateRange(val);
      if (range.dateStr) {
        examDate = range.dateStr;
        examDateFrom = range.from;
        examDateTo = range.to;
      }
    }
    // Admit Card Available
    if (/Admit\s*Card\s*Available\s*[:|-]/i.test(line)) {
      const val = line.replace(/.*?Admit\s*Card\s*Available\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      admitCardDate = normalizeSarkariDateString(val);
    }
    // Answer Key Available
    if (/Answer\s*Key\s*Available\s*[:|-]/i.test(line)) {
      const val = line.replace(/.*?Answer\s*Key\s*Available\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      answerKeyDate = normalizeSarkariDateString(val);
    }
    // Result Declared
    if (/Result\s*Declared\s*[:|-]/i.test(line)) {
      const val = line.replace(/.*?Result\s*Declared\s*[:|-]\s*/i, "").split(/[|\n]/)[0];
      resultDate = normalizeSarkariDateString(val);
    }
  }

  // 3. Extract Application Fee
  let generalFee = "See Notification";
  let scStFee = "See Notification";
  let femaleFee = "See Notification";
  let paymentMode = "Online Payment / E-Challan";

  for (const line of lines) {
    if (/(?:General|OBC|EWS|UR)\s*(?:\/|\s)\s*(?:OBC|EWS|General)\s*[:|-]/i.test(line)) {
      const match = line.match(/(?:General|OBC|EWS|UR)[^:]*[:|-]\s*(?:Rs\.?|₹)?\s*([0-9\/-]+|Nil|Free|Exempted)/i);
      if (match) {
        generalFee = formatFeeAmount(match[1]);
      }
    } else if (/(?:General|UR)\s*(?:Candidates)?\s*[:|-]/i.test(line) && !/Age|Post/i.test(line)) {
      const match = line.match(/(?:General|UR)[^:]*[:|-]\s*(?:Rs\.?|₹)?\s*([0-9\/-]+|Nil|Free|Exempted)/i);
      if (match) {
        generalFee = formatFeeAmount(match[1]);
      }
    }

    if (/SC\s*\/\s*ST[^:]*[:|-]/i.test(line)) {
      const match = line.match(/SC\s*\/\s*ST[^:]*[:|-]\s*(?:Rs\.?|₹)?\s*([0-9\/-]+|Nil|Free|Exempted)/i);
      if (match) {
        scStFee = formatFeeAmount(match[1]);
      }
    }

    if (/(?:All\s*Category\s*)?Female\s*[:|-]/i.test(line)) {
      const match = line.match(/(?:All\s*Category\s*)?Female[^:]*[:|-]\s*(?:Rs\.?|₹)?\s*([0-9\/-]+|Nil|Free|Exempted)/i);
      if (match) {
        femaleFee = formatFeeAmount(match[1]);
      }
    }

    if (/Pay\s*(?:the\s*)?(?:Examination\s*)?Fee\s*(?:Through|Mode)\s*[:|-]?\s*(.+)/i.test(line)) {
      const m = line.match(/Pay\s*(?:the\s*)?(?:Examination\s*)?Fee\s*(?:Through|Mode)\s*[:|-]?\s*(.+)/i);
      if (m && m[1].length > 5) {
        paymentMode = cleanSarkariText(m[1].slice(0, 100));
      }
    }
  }

  // 4. Extract Age Limit
  let minAge: string | null = null;
  let maxAge: string | null = null;
  let asOnDate: string | null = null;

  for (const line of lines) {
    if (/Age\s*Limit\s*as\s*on\s*([0-3]?\d[\/\-][0-1]?\d[\/\-]20\d\d|[0-3]?\d\s+[A-Za-z]+\s+20\d\d)/i.test(line)) {
      const m = line.match(/Age\s*Limit\s*as\s*on\s*([0-3]?\d[\/\-][0-1]?\d[\/\-]20\d\d|[0-3]?\d\s+[A-Za-z]+\s+20\d\d)/i);
      if (m) {
        asOnDate = normalizeSarkariDateString(m[1]) || m[1];
      }
    }

    if (/Minimum\s*Age\s*[:|-]\s*(\d{1,2})\s*Years?/i.test(line)) {
      const m = line.match(/Minimum\s*Age\s*[:|-]\s*(\d{1,2})\s*Years?/i);
      if (m && !minAge) minAge = `${m[1]} Years`;
    }

    if (/Maximum\s*Age\s*[:|-]\s*(\d{1,2}(?:\s*-\s*\d{1,2})?)\s*Years?/i.test(line)) {
      const m = line.match(/Maximum\s*Age\s*[:|-]\s*(\d{1,2}(?:\s*-\s*\d{1,2})?)\s*Years?/i);
      if (m && !maxAge) {
        maxAge = `${m[1]} Years`;
      }
    }
  }

  let ageLimitRaw = "18 - 40 Years (as per category)";
  if (minAge && maxAge) {
    ageLimitRaw = `${minAge.replace(/years?/i, "").trim()} - ${maxAge}${asOnDate ? ` (as on ${asOnDate})` : ""}`;
  } else if (minAge) {
    ageLimitRaw = `Min ${minAge}${asOnDate ? ` (as on ${asOnDate})` : ""}`;
  } else if (maxAge) {
    ageLimitRaw = `Max ${maxAge}${asOnDate ? ` (as on ${asOnDate})` : ""}`;
  }

  // 5. Extract Vacancy Total
  let vacancies: string | null = null;
  const vacMatch = cleanHtml.match(/(?:Vacancy\s*Details\s*Total|Total\s*Vacancy|Total\s*Post)\s*[:|-]?\s*([0-9,]+)\s*(?:Post|Vacanc)?/i);
  if (vacMatch) {
    vacancies = vacMatch[1].replace(/,/g, "").trim();
  }

  // 6. Extract Eligibility & Qualification
  let qualificationText = "";
  const eligMatches = cleanHtml.match(/(?:Eligibility|Educational\s*Qualification|Qualification)[^:\n]*[:|-]\s*([^|\n•]{15,300})/gi);
  if (eligMatches && eligMatches.length > 0) {
    // Pick the most comprehensive match
    for (const em of eligMatches) {
      const cleaned = cleanSarkariText(em.replace(/.*?(?:Eligibility|Qualification)[:|-]\s*/i, ""));
      if (cleaned.length > qualificationText.length) {
        qualificationText = cleaned;
      }
    }
  }

  if (!qualificationText) {
    // Search for common degree keywords in table text
    const broadMatch = cleanHtml.match(/(?:Bachelor\s*Degree[^\n|•]+|10\+2\s*Intermediate[^\n|•]+|Class\s*10\s*High\s*School[^\n|•]+|Diploma\s*in[^\n|•]+|Master\s*Degree[^\n|•]+)/i);
    if (broadMatch) {
      qualificationText = cleanSarkariText(broadMatch[0].trim());
    }
  }

  const qualification = qualificationText ? qualificationText.slice(0, 200).trim() : null;
  const qualificationLevel = classifyQualificationLevel(qualification || cleanHtml);

  // 7. Extract Direct Official Links from HTML anchors
  let applyOnlineUrl: string | null = null;
  let notificationPdfUrl: string | null = null;
  let officialWebsiteUrl: string | null = null;

  // Regex to extract <a> tags with text and href (using [\s\S]*? for ES compatibility)
  const linkMatches = html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of linkMatches) {
    const href = match[1]?.trim();
    const anchorText = match[2]?.replace(/<[^>]+>/g, " ").trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;

    // Apply Online link
    if (!applyOnlineUrl && /apply\s*online|registration|login|online\s*application/i.test(anchorText)) {
      applyOnlineUrl = href;
    }
    // Notification PDF link
    if (!notificationPdfUrl && /download\s*notification|notification\s*pdf|detailed\s*notification/i.test(anchorText)) {
      notificationPdfUrl = href;
    }
    // Official Website link
    if (!officialWebsiteUrl && /official\s*website|commission\s*portal|portal/i.test(anchorText)) {
      officialWebsiteUrl = href;
    }
  }

  return {
    isSarkariLayout,
    importantDates: {
      startDate,
      lastDate,
      feeLastDate,
      correctionStartDate,
      correctionLastDate,
      examDate,
      examDateFrom,
      examDateTo,
      admitCardDate,
      answerKeyDate,
      resultDate,
      examDateStatus: examDate ? "announced" : "not_announced",
      admitCardStatus: admitCardDate ? "released" : "not_announced",
    },
    applicationFee: {
      generalOBC: generalFee,
      scStPh: scStFee,
      female: femaleFee,
      paymentMode,
    },
    ageLimit: {
      minAge,
      maxAge,
      asOnDate,
      rawText: ageLimitRaw,
    },
    vacancies,
    qualification,
    qualificationLevel,
    officialLinks: {
      applyOnlineUrl,
      notificationPdfUrl,
      officialWebsiteUrl,
    },
  };
}
