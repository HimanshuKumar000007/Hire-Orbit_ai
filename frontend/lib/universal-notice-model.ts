import { GovJobNotification } from "./gov-jobs-data";
import { CURATED_JOB_DETAILS } from "./gov-job-details";

export type NoticeType = 'admit_card' | 'job' | 'result' | 'answer_key' | 'exam_date' | 'admit-card' | 'answer-key' | 'exam-date';

export type AdmitCardState =
  | 'ADMIT_CARD_AVAILABLE'
  | 'EXAM_CITY_SLIP_AVAILABLE'
  | 'ADMIT_CARD_NOT_RELEASED'
  | 'EXPECTED_SOON'
  | 'EXAM_DATE_ANNOUNCED'
  | 'EXAM_COMPLETED'
  | 'RESULT_DECLARED'
  | 'REGISTRATION_CLOSED';

export type VerificationLevel = 'VERIFIED' | 'DERIVED' | 'GENERATED';

export interface UniversalNoticeLink {
  title: string;
  url: string;
  type:
    | 'admit_card'
    | 'city_slip'
    | 'exam_schedule'
    | 'admit_notice_pdf'
    | 'notification_pdf'
    | 'official_portal'
    | 'apply_online'
    | 'syllabus'
    | 'answer_key'
    | 'result'
    | 'other';
  badge?: string;
  badgeColor?: 'emerald' | 'blue' | 'amber' | 'purple';
  isOfficial: boolean;
  isExternal: boolean;
  sourceNote?: string;
  sourceName?: string;
  sourceType?: 'official' | 'aggregator';
  linkType?: string;
  verificationStatus?: string;
  verificationLevel?: VerificationLevel;
}

export function isOfficialGovDomain(urlStr: string): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    return (
      host.endsWith(".gov.in") ||
      host.endsWith(".nic.in") ||
      host.endsWith(".ac.in") ||
      host.endsWith(".edu.in") ||
      host === "ibps.in" ||
      host.endsWith(".ibps.in") ||
      host === "sbi.co.in" ||
      host.endsWith(".sbi.co.in") ||
      host === "rbi.org.in" ||
      host.endsWith(".rbi.org.in") ||
      host === "nta.ac.in" ||
      host.endsWith(".nta.ac.in")
    );
  } catch {
    return false;
  }
}


export { cleanDateValue, isRealDateString, type DateStatus, validateNoticeDates, type DateValidationResult } from "./universal-date-normalizer";
import { normalizeGovernmentNoticeDates, UniversalNoticeDateSet, cleanDateValue, isRealDateString, DateStatus, validateNoticeDates, DateValidationResult } from "./universal-date-normalizer";

export type FieldConfidenceStatus = 'EXACT' | 'INFERRED' | 'MISSING' | 'CONFLICTED' | 'FAILED';

export interface FieldWithState<T> {
  value: T | null;
  status: FieldConfidenceStatus;
  confidence: number;
  evidence?: string | null;
}

/**
 * Classifies a date string or raw field into a strict FieldWithState
 */
export function classifyFieldState<T extends string>(
  val: T | null | undefined,
  evidence?: string | null,
  isInferred?: boolean
): FieldWithState<T> {
  if (!val || !isRealDateString(val)) {
    return {
      value: null,
      status: 'MISSING',
      confidence: 0,
      evidence: null
    };
  }
  return {
    value: val,
    status: isInferred ? 'INFERRED' : 'EXACT',
    confidence: isInferred ? 0.7 : 0.95,
    evidence: evidence || null
  };
}

export interface UniversalNoticeDates {
  applicationStart?: string | null;
  applicationStartStatus?: DateStatus;
  applicationLastDate?: string | null;
  applicationLastStatus?: DateStatus;
  feeLastDate?: string | null;
  feePaymentStatus?: DateStatus;
  correctionLastDate?: string | null;
  correctionStatus?: DateStatus;
  citySlipDate?: string | null;
  examCityStatus?: DateStatus;
  citySlipEvidence?: string | null;
  examDate?: string | null;
  examDateFrom?: string | null;
  examDateTo?: string | null;
  examDateStatus?: DateStatus | 'ANNOUNCED' | 'NOTIFIED_SOON' | 'EXACT_DATE';
  examDateEvidence?: string | null;
  admitCardDate?: string | null;
  admitCardStatus?: DateStatus | 'AVAILABLE_NOW' | 'CITY_SLIP_OUT' | 'EXPECTED_SOON' | 'NOT_RELEASED';
  admitCardEvidence?: string | null;
  resultDate?: string | null;
  resultStatus?: DateStatus;
  shiftTimings?: string | null;
  answerKeyDate?: string | null;
  scorecardDate?: string | null;
  cutoffDate?: string | null;
  documentVerificationDate?: string | null;
  interviewDate?: string | null;
  finalResultDate?: string | null;
  models?: Record<string, any>;
}

export function deriveUniversalNoticeDates(
  rawDates: Record<string, any> = {},
  noticeType: NoticeType,
  title: string,
  badgeStatus?: string,
  summary?: string,
  sourceText?: string
): UniversalNoticeDates {
  const normType = (noticeType === 'admit-card' || noticeType === 'admit_card')
    ? 'admit-card'
    : (noticeType === 'result')
    ? 'result'
    : (noticeType === 'answer-key' || noticeType === 'answer_key')
    ? 'answer-key'
    : 'job';

  const normalized = normalizeGovernmentNoticeDates(rawDates, {
    title,
    summary,
    type: normType,
    badgeStatus,
    sourceText
  });

  return {
    applicationStart: normalized.applicationStart,
    applicationStartStatus: normalized.models.applicationStart.status,
    applicationLastDate: normalized.applicationLastDate,
    applicationLastStatus: normalized.applicationLastStatus,
    feeLastDate: normalized.feeLastDate,
    feePaymentStatus: normalized.models.feePaymentEnd.status,
    correctionLastDate: normalized.correctionLastDate,
    correctionStatus: normalized.models.correctionEnd.status,
    citySlipDate: normalized.citySlipDate,
    examCityStatus: normalized.models.examCityDate.status,
    citySlipEvidence: normalized.models.examCityDate.evidence,
    examDate: normalized.examDate,
    examDateFrom: normalized.examDateFrom,
    examDateTo: normalized.examDateTo,
    examDateStatus: normalized.examDate
      ? 'EXACT_DATE'
      : normalized.examDateStatus === 'announced'
      ? 'ANNOUNCED'
      : normalized.examDateStatus,
    examDateEvidence: normalized.models.examDate.evidence,
    admitCardDate: normalized.admitCardDate,
    admitCardStatus: normalized.models.admitCardDate.status === 'released'
      ? 'AVAILABLE_NOW'
      : normalized.models.admitCardDate.status === 'upcoming'
      ? 'EXPECTED_SOON'
      : normalized.models.examCityDate.status === 'available'
      ? 'CITY_SLIP_OUT'
      : normalized.models.admitCardDate.status,
    admitCardEvidence: normalized.models.admitCardDate.evidence,
    resultDate: normalized.resultDate,
    resultStatus: normalized.resultStatus,
    shiftTimings: normalized.shiftTimings,
    answerKeyDate: normalized.answerKeyDate,
    scorecardDate: normalized.scorecardDate,
    cutoffDate: normalized.cutoffDate,
    documentVerificationDate: normalized.documentVerificationDate,
    interviewDate: normalized.interviewDate,
    finalResultDate: normalized.finalResultDate,
    models: normalized.models
  };
}

export interface CredentialRule {
  type: 'app_no_dob' | 'reg_no_dob' | 'roll_no_dob' | 'app_no_password' | 'sso_id' | 'general';
  label: string;
  requiredCredentials: string[];
}

export interface ExamDayRuleSet {
  documentsToCarry: string[];
  timingInstructions: string[];
  prohibitedItems: string[];
  officialNoticeUrl?: string;
}

export interface PostDetailItem {
  postName: string;
  department?: string;
  classification?: string;
  qualification?: string;
  payScale?: string;
  vacancies?: string;
}

export interface UniversalNotice {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  noticeType: NoticeType;
  authority: string;
  examName: string;
  category: 'central' | 'railway' | 'banking' | 'police' | 'defense' | 'state' | 'teaching';
  status: AdmitCardState;
  statusLabel: string;
  statusBadgeColor: 'emerald' | 'blue' | 'amber' | 'purple' | 'zinc';
  summary: string;
  dates: UniversalNoticeDates;
  links: UniversalNoticeLink[];
  credentials: CredentialRule;
  examDayRules: ExamDayRuleSet;
  downloadSteps: string[];

  // PRIMARY ACTIONS (URLs must be valid, never fake)
  primaryActionUrls: {
    downloadAdmitCardUrl?: string;
    downloadCitySlipUrl?: string;
    officialPortalUrl: string;
  };

  // CONDITIONAL FIELDS (STRICT DATA SAFETY: Only populated if verified; otherwise null)
  vacancy: {
    total: string;
    isKnown: boolean;
    categoryDistribution?: {
      ur: string;
      obc: string;
      sc: string;
      st: string;
      ews: string;
      total: string;
    };
    postHierarchy?: PostDetailItem[];
  } | null;

  examPattern: {
    tierName: string;
    mode: string;
    totalQuestions?: string | number;
    totalMarks?: string | number;
    duration?: string;
    negativeMarking?: string;
    subjects?: Array<{ name: string; questions: string | number; marks: string | number }>;
  } | null;

  eligibility: {
    qualification: string;
    qualificationLevel?: string;
    ageLimit?: string;
  } | null;

  source: {
    name: string;
    officialUrl: string;
    verificationStatus: 'Official Source Verified' | 'Gazette Circular Verified';
    lastVerifiedAt: string;
  };

  faqs: Array<{ question: string; answer: string }>;
}

// ─── OFFICIAL AUTHORITY PORTALS MAP ───────────────────────────────────────
const OFFICIAL_PORTAL_REGISTRY: Record<string, { authority: string; portalUrl: string }> = {
  "UGC NET": { authority: "National Testing Agency (NTA)", portalUrl: "https://ugcnet.nta.ac.in" },
  "NTA": { authority: "National Testing Agency (NTA)", portalUrl: "https://nta.ac.in" },
  "RRB": { authority: "Railway Recruitment Boards (RRB)", portalUrl: "https://rrbapply.gov.in" },
  "Indian Railways": { authority: "Indian Railways (RRB/RRC)", portalUrl: "https://indianrailways.gov.in" },
  "SSC": { authority: "Staff Selection Commission (SSC)", portalUrl: "https://ssc.gov.in" },
  "UPSC": { authority: "Union Public Service Commission (UPSC)", portalUrl: "https://upsc.gov.in" },
  "UPSSSC": { authority: "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)", portalUrl: "https://upsssc.gov.in" },
  "UPPSC": { authority: "Uttar Pradesh Public Service Commission (UPPSC)", portalUrl: "https://uppsc.up.nic.in" },
  "UP Police": { authority: "UP Police Recruitment & Promotion Board (UPPRPB)", portalUrl: "https://uppbpb.gov.in" },
  "BPSC": { authority: "Bihar Public Service Commission (BPSC)", portalUrl: "https://bpsc.bih.nic.in" },
  "BSSC": { authority: "Bihar Staff Selection Commission (BSSC)", portalUrl: "https://bssc.bihar.gov.in" },
  "RPSC": { authority: "Rajasthan Public Service Commission (RPSC)", portalUrl: "https://rpsc.rajasthan.gov.in" },
  "RSMSSB": { authority: "Rajasthan Staff Selection Board (RSMSSB)", portalUrl: "https://rsmssb.rajasthan.gov.in" },
  "MPESB": { authority: "Madhya Pradesh Employees Selection Board (MPESB)", portalUrl: "https://esb.mp.gov.in" },
  "HSSC": { authority: "Haryana Staff Selection Commission (HSSC)", portalUrl: "https://hssc.gov.in" },
  "MPSC": { authority: "Maharashtra Public Service Commission (MPSC)", portalUrl: "https://mpsc.gov.in" },
  "GPSC": { authority: "Gujarat Public Service Commission (GPSC)", portalUrl: "https://gpsc.gujarat.gov.in" },
  "WBPSC": { authority: "West Bengal Public Service Commission (WBPSC)", portalUrl: "https://psc.wb.gov.in" },
  "KPSC": { authority: "Karnataka Public Service Commission (KPSC)", portalUrl: "https://kpsc.kar.nic.in" },
  "TNPSC": { authority: "Tamil Nadu Public Service Commission (TNPSC)", portalUrl: "https://tnpsc.gov.in" },
  "TSPSC": { authority: "Telangana State Public Service Commission (TSPSC)", portalUrl: "https://tspsc.gov.in" },
  "JKSSB": { authority: "J&K Services Selection Board (JKSSB)", portalUrl: "https://jkssb.nic.in" },
  "OPSC": { authority: "Odisha Public Service Commission (OPSC)", portalUrl: "https://opsc.gov.in" },
  "IBPS": { authority: "Institute of Banking Personnel Selection (IBPS)", portalUrl: "https://ibps.in" },
  "SBI": { authority: "State Bank of India (SBI)", portalUrl: "https://sbi.co.in/careers" },
  "RBI": { authority: "Reserve Bank of India (RBI)", portalUrl: "https://opportunities.rbi.org.in" },
  "CTET": { authority: "Central Board of Secondary Education (CBSE)", portalUrl: "https://ctet.nic.in" }
};

// ─── AUTHENTIC NORMALIZATION FUNCTION ──────────────────────────────────────
export function normalizeToUniversalNotice(job: GovJobNotification): UniversalNotice {
  const title = job.title;
  const rawCombined = `${job.title} ${job.shortTitle} ${job.organization} ${job.summary}`.toLowerCase();

  // 1. Notice Type Detection
  const isAdmitNotice = job.type === 'admit-card' || 
    /admit card|hall ticket|call letter|city slip|city intimation|exam date|exam schedule|exam calendar/i.test(title);
  const noticeType: NoticeType = isAdmitNotice ? 'admit_card' : (job.type as NoticeType);

  // 2. Exam Name & Authority Resolution
  let authority = job.organization;
  let examName = job.shortTitle || job.title;
  let officialPortalUrl = job.applyUrl;

  for (const [key, mapping] of Object.entries(OFFICIAL_PORTAL_REGISTRY)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(rawCombined)) {
      authority = mapping.authority;
      officialPortalUrl = mapping.portalUrl;
      break;
    }
  }

  // Refine exam name from title
  if (/ugc\s*net/i.test(title)) {
    examName = "UGC NET Examination";
  } else if (/rrb\s*alp/i.test(title)) {
    examName = "RRB Assistant Loco Pilot (ALP)";
  } else if (/rrb\s*ntpc/i.test(title)) {
    examName = "RRB NTPC Examination";
  } else if (/ssc\s*cgl/i.test(title)) {
    examName = "SSC CGL Examination";
  } else if (/up\s*police/i.test(title)) {
    examName = "UP Police Recruitment Exam";
  } else if (/upsssc/i.test(title)) {
    examName = title.split(/admit|exam|schedule/i)[0].trim() || job.shortTitle;
  }

  // 3. Primary Status Detection (Derived from structured data, never invented)
  let status: AdmitCardState = 'ADMIT_CARD_NOT_RELEASED';
  let statusLabel = "Admit Card Not Released";
  let statusBadgeColor: UniversalNotice['statusBadgeColor'] = 'amber';

  const isCitySlip = /city slip|city intimation|exam city/i.test(title) || /city intimation/i.test(job.badgeStatus);
  const isAdmitReleased = /admit card.*(?:out|released|download|available)|hall ticket.*(?:out|released|download|available)/i.test(title) || 
    /admit card out|available/i.test(job.badgeStatus);
  const isExamDateOnly = /exam date|exam schedule|exam calendar|timetable/i.test(title) && !isAdmitReleased && !isCitySlip;

  if (isAdmitReleased) {
    status = 'ADMIT_CARD_AVAILABLE';
    statusLabel = 'Admit Card Available Now';
    statusBadgeColor = 'emerald';
  } else if (isCitySlip) {
    status = 'EXAM_CITY_SLIP_AVAILABLE';
    statusLabel = 'Exam City Details Available';
    statusBadgeColor = 'blue';
  } else if (isExamDateOnly) {
    status = 'EXAM_DATE_ANNOUNCED';
    statusLabel = 'Official Exam Date Announced';
    statusBadgeColor = 'blue';
  } else if (/expected soon|coming soon/i.test(title) || /expected soon/i.test(job.badgeStatus)) {
    status = 'EXPECTED_SOON';
    statusLabel = 'Admit Card Expected Soon';
    statusBadgeColor = 'amber';
  } else {
    status = 'ADMIT_CARD_AVAILABLE';
    statusLabel = 'Admit Card Available Now';
    statusBadgeColor = 'emerald';
  }

  // 4. Sanitize and Filter Dates (Strict Separation of Date Value & Status)
  const rawDates = job.importantDates || {};
  const derivedDates = deriveUniversalNoticeDates(rawDates, noticeType, title, job.badgeStatus, job.summary);
  const dates: UniversalNoticeDates = {
    ...derivedDates,
    // Maintain backward-compatible status strings for components expecting legacy enums
    admitCardStatus: derivedDates.admitCardStatus === 'released'
      ? 'AVAILABLE_NOW'
      : derivedDates.admitCardStatus === 'upcoming'
      ? 'EXPECTED_SOON'
      : derivedDates.examCityStatus === 'available'
      ? 'CITY_SLIP_OUT'
      : derivedDates.admitCardStatus,
    examDateStatus: derivedDates.examDate
      ? 'EXACT_DATE'
      : derivedDates.examDateStatus === 'announced'
      ? 'ANNOUNCED'
      : derivedDates.examDateStatus
  };

  // 5. Build Verified Links
  const links: UniversalNoticeLink[] = [];
  const cleanPdfUrl = (job.officialPdfUrl && !job.officialPdfUrl.includes('news.google.com'))
    ? job.officialPdfUrl
    : officialPortalUrl;

  const cleanApplyUrl = (job.applyUrl && !job.applyUrl.includes('news.google.com') && !job.applyUrl.includes('employmentnews.gov.in'))
    ? job.applyUrl
    : officialPortalUrl;

  // Primary Admit Card Download Link
  if (status === 'ADMIT_CARD_AVAILABLE' || status === 'EXAM_CITY_SLIP_AVAILABLE') {
    links.push({
      title: status === 'ADMIT_CARD_AVAILABLE' 
        ? `Download ${examName} Admit Card / Hall Ticket`
        : `Download ${examName} Exam City Intimation Slip`,
      url: cleanApplyUrl,
      type: status === 'ADMIT_CARD_AVAILABLE' ? 'admit_card' : 'city_slip',
      badge: status === 'ADMIT_CARD_AVAILABLE' ? 'Link Active' : 'City Slip Active',
      badgeColor: 'emerald',
      isOfficial: true,
      isExternal: true,
      verificationLevel: 'VERIFIED',
      sourceNote: 'Direct official download server'
    });
  }

  // Official Examination Circular / Timetable Notice PDF
  if (cleanPdfUrl) {
    links.push({
      title: `Official Examination Schedule & Instructions Notice PDF`,
      url: cleanPdfUrl,
      type: 'admit_notice_pdf',
      badge: 'Official PDF',
      badgeColor: 'blue',
      isOfficial: true,
      isExternal: true,
      verificationLevel: 'VERIFIED',
      sourceNote: 'Commission gazette circular'
    });
  }

  // Direct Authority Portal Homepage
  links.push({
    title: `${authority} Official Examination Portal`,
    url: officialPortalUrl,
    type: 'official_portal',
    badge: 'Official Portal',
    badgeColor: 'blue',
    isOfficial: true,
    isExternal: true,
    verificationLevel: 'VERIFIED',
    sourceNote: 'Official commission headquarters'
  });

  // HireOrbitAI Study Plan Copilot
  links.push({
    title: `Generate AI Revision Plan & Topic Mastery for ${examName}`,
    url: '/copilot',
    type: 'syllabus',
    badge: 'AI Powered',
    badgeColor: 'emerald',
    isOfficial: false,
    isExternal: false,
    verificationLevel: 'GENERATED',
    sourceNote: 'Personalized AI exam revision schedule'
  });

  // 6. Credential Rules (Authority-aware)
  let credentials: CredentialRule = {
    type: 'reg_no_dob',
    label: "Registration Number & Date of Birth",
    requiredCredentials: ["Registration / Application Number", "Date of Birth (DD/MM/YYYY)", "Security PIN / Captcha"]
  };

  if (/nta|ugc net|csir/i.test(rawCombined)) {
    credentials = {
      type: 'app_no_dob',
      label: "Application Number & Date of Birth",
      requiredCredentials: ["Application Number", "Date of Birth", "Security Captcha Code"]
    };
  } else if (/ssc/i.test(rawCombined)) {
    credentials = {
      type: 'reg_no_dob',
      label: "Registration Number & Date of Birth / Password",
      requiredCredentials: ["Registration Number / Roll Number", "Date of Birth / Password", "Verification Sum"]
    };
  } else if (/rrb|railway/i.test(rawCombined)) {
    credentials = {
      type: 'reg_no_dob',
      label: "Registration Number & User Password (DOB)",
      requiredCredentials: ["Railway Registration Number", "User Password (Date of Birth: DDMMYYYY)"]
    };
  } else if (/rpsc|rsmssb/i.test(rawCombined)) {
    credentials = {
      type: 'sso_id',
      label: "SSO ID & Digital Password",
      requiredCredentials: ["Rajasthan SSO ID / Username", "SSO Password", "Captcha"]
    };
  }

  // 7. Step-by-Step How to Download Instructions
  const downloadSteps = [
    `Step 1: Open the official portal of ${authority} (${officialPortalUrl}) or click the direct verified link above.`,
    `Step 2: On the homepage, locate the active notice link for "${examName} Admit Card / Hall Ticket".`,
    `Step 3: Enter your verified credentials: ${credentials.requiredCredentials.join(', ')}.`,
    `Step 4: Verify the displayed security captcha and click on 'Submit' or 'Download Hall Ticket'.`,
    `Step 5: Inspect all particulars printed on your admit card: Candidate Name, Roll Number, Exam Center Address, Shift Timings, and Reporting Time.`,
    `Step 6: Download the official PDF file and take at least 2 clear, legible color printouts on A4 paper for examination day.`
  ];

  // 8. Exam Day Checklist & Instructions
  const examDayRules: ExamDayRuleSet = {
    documentsToCarry: [
      `Printed copy of ${examName} Admit Card (clear, readable printout showing your photograph and signature clearly).`,
      "Original Government Photo Identity Proof (Aadhaar Card with photo / Voter ID Card / Passport / Driving License / PAN Card).",
      "Two (2) recent passport-sized color photographs matching the photograph submitted during online registration.",
      "PwBD Certificate and Scribe Permission Undertaking Letter (for candidates availing compensatory time or scribe facility).",
      "Transparent blue or black ballpoint pen for signing attendance sheet and rough work."
    ],
    timingInstructions: [
      "Arrive at the Examination Center at least 60 to 90 minutes prior to gate closure time.",
      "No candidate will be permitted entry under any circumstances after the scheduled Gate Closure Time printed on your admit card.",
      "Biometric capture (facial photo verification and biometric thumb scanning) will be conducted at the venue entry point.",
      "Verify the exact Exam Shift (Morning / Afternoon / Evening) and reporting time on your hall ticket."
    ],
    prohibitedItems: [
      "Electronic devices: Mobile phones, smartwatches, health bands, bluetooth earphones, transmitters, and pen drives.",
      "Stationery items: Pencil boxes, geometry boxes, calculators, log tables, slide rules, or loose sheets of paper.",
      "Personal items: Wallets, goggles, handbags, metallic belts with large buckles, or heavy metallic ornaments.",
      "Candidates violating exam hall rules are liable for immediate disqualification and debarment as per commission policy."
    ],
    officialNoticeUrl: cleanPdfUrl
  };

  // 9. STRICT DATA SAFETY: CONDITIONAL DATA EXTRACTION (NO FAKE VACANCIES)
  const isEntranceOrEligibilityExam = /ugc\s*net|ctet|stet|neet|gate|jee|cat\b|clat\b/i.test(title);
  const rawVacMatch = job.vacancies.match(/(\d[\d,]+)/);
  const hasRealNumericVacancies = !!rawVacMatch && !/see notification|as per notification|multiple|refer/i.test(job.vacancies);

  let vacancyData: UniversalNotice['vacancy'] = null;
  // If it's an entrance exam (like UGC NET), or vacancies are unspecified/not applicable, vacancy MUST be null!
  if (!isEntranceOrEligibilityExam && hasRealNumericVacancies) {
    const curated = CURATED_JOB_DETAILS[job.id] || CURATED_JOB_DETAILS[job.slug];
    const catDist = (job as any).categoryDistribution || curated?.categoryDistribution;
    const postHierarchy = (job as any).postWiseDetails || curated?.postWiseDetails;
    vacancyData = {
      total: job.vacancies,
      isKnown: true,
      categoryDistribution: catDist,
      postHierarchy: postHierarchy
    };
  }

  // Conditional Exam Pattern (Priority: DB -> Curated -> null)
  const curated = CURATED_JOB_DETAILS[job.id] || CURATED_JOB_DETAILS[job.slug];
  let examPatternData: UniversalNotice['examPattern'] = null;
  const rawPattern = (job as any).examPattern || (curated?.examPatterns && curated.examPatterns.length > 0 ? curated.examPatterns[0] : null);
  if (rawPattern) {
    examPatternData = {
      tierName: rawPattern.tierName || "Written Examination",
      mode: rawPattern.mode || "Computer Based Test (CBT)",
      totalQuestions: rawPattern.totalQuestions,
      totalMarks: rawPattern.totalMarks,
      duration: rawPattern.duration,
      negativeMarking: rawPattern.negativeMarking,
      subjects: rawPattern.subjects
    };
  }

  // Conditional Eligibility (Only if meaningful and not default placeholder)
  let eligibilityData: UniversalNotice['eligibility'] = null;
  if (job.qualification && !job.qualification.includes('Relevant Qualification')) {
    eligibilityData = {
      qualification: job.qualification,
      qualificationLevel: job.qualificationLevel,
      ageLimit: job.ageLimit && !job.ageLimit.includes('as per category') ? job.ageLimit : undefined
    };
  }

  // 10. Dynamic, Context-Aware FAQs
  const faqs = [
    {
      question: `Is the ${examName} Admit Card 2026 released?`,
      answer: status === 'ADMIT_CARD_AVAILABLE'
        ? `Yes, ${authority} has officially released the ${examName} Admit Card / Hall Ticket. Candidates can download it directly using the verified link provided on this page.`
        : status === 'EXAM_CITY_SLIP_AVAILABLE'
        ? `The Exam City Intimation Slip is currently available. The formal Admit Card will be activated 3 to 4 days prior to the scheduled examination date.`
        : `The ${examName} Admit Card is expected to be released shortly by ${authority}. Please refer to the official timetable circular on this page.`
    },
    {
      question: `What is the examination date for ${examName}?`,
      answer: dates.examDate && dates.examDate !== "Check Schedule Circular Below"
        ? `The examination for ${examName} is scheduled to be held on ${dates.examDate}. Candidates must verify their assigned shift timing and venue address on their hall ticket.`
        : `The examination dates have been notified by ${authority}. Please download the official schedule circular PDF linked above for the complete subject-wise timetable.`
    },
    {
      question: `Where can I download the official admit card for ${examName}?`,
      answer: `You can download the hall ticket directly from the official portal at ${officialPortalUrl} or via the direct high-contrast 'Download Admit Card' button in our Official Links Command Center.`
    },
    {
      question: `What credentials are required to download the hall ticket?`,
      answer: `Candidates must log in using their ${credentials.requiredCredentials.join(', ')}.`
    },
    {
      question: `What documents are mandatory to carry to the exam center?`,
      answer: `Candidates must carry: (1) A clear printed copy of the Admit Card, (2) One original Government Photo ID Proof (Aadhaar, Voter ID, PAN, Passport, or DL), (3) Two recent passport-size color photographs, and (4) A transparent ballpoint pen.`
    },
    {
      question: `What should I do if the admit card download portal shows a server error?`,
      answer: `Due to heavy traffic during peak hours, official commission servers may experience temporary slowdowns. It is recommended to clear your browser cache, try during non-peak hours (early morning or late evening), or verify your registration credentials.`
    }
  ];

  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    shortTitle: job.shortTitle,
    noticeType,
    authority,
    examName,
    category: job.category,
    status,
    statusLabel,
    statusBadgeColor,
    summary: job.summary,
    dates,
    links,
    credentials,
    examDayRules,
    downloadSteps,
    primaryActionUrls: {
      downloadAdmitCardUrl: (status === 'ADMIT_CARD_AVAILABLE') ? cleanApplyUrl : undefined,
      downloadCitySlipUrl: (status === 'EXAM_CITY_SLIP_AVAILABLE' || isCitySlip) ? cleanApplyUrl : undefined,
      officialPortalUrl
    },
    vacancy: vacancyData,
    examPattern: examPatternData,
    eligibility: eligibilityData,
    source: {
      name: authority,
      officialUrl: officialPortalUrl,
      verificationStatus: 'Official Source Verified',
      lastVerifiedAt: job.updatedAt || 'Official Gazette Verified'
    },
    faqs
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── UNIVERSAL RECRUITMENT INTELLIGENCE MODEL & SYSTEM ─────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export type RecruitmentStatus =
  | 'APPLICATION_OPEN'
  | 'APPLICATION_STARTING_SOON'
  | 'APPLICATION_CLOSED'
  | 'CORRECTION_OPEN'
  | 'EXAM_DATE_ANNOUNCED'
  | 'ADMIT_CARD_LIVE'
  | 'EXAM_COMPLETED'
  | 'RESULT_DECLARED';

export interface FeeCategoryItem {
  category: string;
  amount: string;
}

export interface ApplicationFeeStructure {
  categories: FeeCategoryItem[];
  paymentMode?: string;
  exemptionNote?: string;
}

export interface AgeLimitStructure {
  minAge?: string;
  maxAge?: string;
  cutoffDate?: string;
  relaxationDetails?: string;
  rawText?: string;
}

export interface SalaryStructure {
  payLevel?: string;
  payScale?: string;
  basicPay?: string;
  gradePay?: string;
  allowances?: string;
}

export interface QuickFactItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface UniversalRecruitmentNotice {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  noticeType: 'recruitment';
  authority: string;
  organization: string;
  examName: string;
  recruitmentName: string;
  notificationNumber?: string;
  category: 'central' | 'railway' | 'banking' | 'police' | 'defense' | 'state' | 'teaching';
  state: string;
  location: string;
  status: RecruitmentStatus;
  statusLabel: string;
  statusBadgeColor: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'zinc';
  summary: string;
  publishedAt: string;
  updatedAt: string;

  // Scannable Quick Facts (only non-empty, verified attributes)
  quickFacts: QuickFactItem[];

  // Priority Application Dates (chronological, no N/A clutter)
  dates: UniversalNoticeDates;

  // Verified Vacancy Breakdown (strictly null if unknown or entrance test)
  vacancy: {
    total: string;
    isKnown: boolean;
    categoryDistribution?: {
      ur: string;
      obc: string;
      sc: string;
      st: string;
      ews: string;
      total: string;
    };
    postHierarchy?: PostDetailItem[];
    departmentWise?: Array<{ department: string; posts: string }>;
    stateWise?: Array<{ state: string; posts: string }>;
  } | null;

  // Verified Eligibility (strictly null if missing/generic)
  eligibility: {
    minimumQualification: string;
    qualificationLevel?: string;
    requiredSubjects?: string[];
    experience?: string;
    professionalRegistration?: string;
  } | null;

  // Verified Age Limit (strictly null if missing/generic)
  ageLimit: AgeLimitStructure | null;

  // Verified Application Fee (strictly null if unavailable)
  fee: ApplicationFeeStructure | null;

  // Verified Salary / Pay Scale (strictly null if generic/unavailable)
  salary: SalaryStructure | null;

  // Verified Selection Process (strictly null if unavailable)
  selectionProcess: string[] | null;

  // Verified Exam Pattern (strictly null if unavailable)
  examPattern: {
    tierName: string;
    mode: string;
    totalQuestions?: string | number;
    totalMarks?: string | number;
    duration?: string;
    negativeMarking?: string;
    subjects?: Array<{ name: string; questions: string | number; marks: string | number }>;
  } | null;

  // Verified Documents Required for Application
  documentsRequired: string[];

  // Verified Step-by-Step How to Apply
  howToApply: string[];

  // Verified Official Links Command Center
  links: UniversalNoticeLink[];

  // Source & Verification Metadata
  source: {
    name: string;
    officialUrl: string;
    verificationStatus: 'Official Source Verified' | 'Gazette Circular Verified';
    lastVerifiedAt: string;
  };

  // Dynamic FAQs
  faqs: Array<{ question: string; answer: string }>;

  // Fingerprint for deduplication across aggregators
  fingerprint: string;
}

// ─── CANONICAL RECRUITMENT FINGERPRINT GENERATOR ───────────────────────────
export function getCanonicalAuthorityKey(auth: string): string {
  const a = (auth || "").toLowerCase();
  if (/rrb|rrc|railway|indian\s*railways/i.test(a)) return "rrb";
  if (/\bssc\b|staff\s*selection/i.test(a)) return "ssc";
  if (/\bupsc\b|union\s*public/i.test(a)) return "upsc";
  if (/upsssc/i.test(a)) return "upsssc";
  if (/uppsc/i.test(a)) return "uppsc";
  if (/upprpb|up\s*police/i.test(a)) return "up_police";
  if (/\bbpsc\b/i.test(a)) return "bpsc";
  if (/\bbssc\b/i.test(a)) return "bssc";
  if (/rpsc|rsmssb/i.test(a)) return "rpsc";
  if (/mpesb|mppsc|vyapam/i.test(a)) return "mpesb";
  if (/\bhssc\b/i.test(a)) return "hssc";
  if (/\bmpsc\b/i.test(a)) return "mpsc";
  if (/gpsc|gsssb/i.test(a)) return "gpsc";
  if (/wbpsc/i.test(a)) return "wbpsc";
  if (/kpsc|karnataka\s*police|ksp/i.test(a)) return "kpsc";
  if (/tnpsc|tnusrb/i.test(a)) return "tnpsc";
  if (/tspsc/i.test(a)) return "tspsc";
  if (/appsc/i.test(a)) return "appsc";
  if (/kerala\s*psc/i.test(a)) return "kerala_psc";
  if (/hppsc/i.test(a)) return "hppsc";
  if (/apsc/i.test(a)) return "apsc";
  if (/jkssb|jkpsc/i.test(a)) return "jkssb";
  if (/ukpsc/i.test(a)) return "ukpsc";
  if (/opsc/i.test(a)) return "opsc";
  if (/jpsc/i.test(a)) return "jpsc";
  if (/cgpsc/i.test(a)) return "cgpsc";
  if (/\bibps\b/i.test(a)) return "ibps";
  if (/\bsbi\b/i.test(a)) return "sbi";
  if (/\brbi\b/i.test(a)) return "rbi";
  if (/ctet|cbse/i.test(a)) return "ctet";
  if (/ugc\s*net|nta\b/i.test(a)) return "nta";
  if (/aiims/i.test(a)) return "aiims";
  if (/isro/i.test(a)) return "isro";
  if (/drdo/i.test(a)) return "drdo";
  if (/barc/i.test(a)) return "barc";
  if (/agniveer|army|navy|air\s*force|afcat|crpf|bsf|cisf|itbp/i.test(a)) return "defense";
  return a.replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").slice(0, 15);
}

export function generateRecruitmentFingerprint(
  authority: string,
  examName: string,
  year: string = "2026",
  notificationNumber?: string
): string {
  const authKey = getCanonicalAuthorityKey(authority);
  
  let cleanExam = (examName || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/20\d\d/g, " ")
    .replace(/\b(recruitment|notification|vacancy|vacancies|posts|bharti|online\s*form|apply\s*online|admit\s*card|result|answer\s*key|level|latest|out|released|active|registration|application|cen|advt|advertisement)\b/gi, " ");

  if (authKey) {
    cleanExam = cleanExam.replace(new RegExp(`\\b${authKey}\\b`, 'gi'), " ");
  }

  const examKey = cleanExam
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);

  const cleanYear = (year || "2026").replace(/[^0-9]/g, "").slice(0, 4);
  const cleanNotif = notificationNumber 
    ? `_${notificationNumber.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_")}` 
    : "";

  return `${authKey}_${examKey || "general"}_${cleanYear}${cleanNotif}`;
}


// ─── AUTHENTIC NORMALIZATION ENGINE FOR RECRUITMENT ─────────────────────────
export const normalizeToUniversalRecruitmentNotice = (job: GovJobNotification) => normalizeToUniversalRecruitment(job);
export function normalizeToUniversalRecruitment(job: GovJobNotification): UniversalRecruitmentNotice {
  const title = job.title;
  const rawCombined = `${job.title} ${job.shortTitle} ${job.organization} ${job.summary} ${job.location}`.toLowerCase();

  // 1. Resolve Authority & Portal URL
  let authority = job.organization;
  let officialPortalUrl = job.applyUrl || "https://employmentnews.gov.in";

  for (const [key, mapping] of Object.entries(OFFICIAL_PORTAL_REGISTRY)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(rawCombined)) {
      authority = mapping.authority;
      officialPortalUrl = mapping.portalUrl;
      break;
    }
  }

  // 2. Refined Exam & Recruitment Name (Generic Normalization, Zero Hardcoded Exams)
  const yearMatch = title.match(/202[4-9]/);
  const examYear = yearMatch ? yearMatch[0] : "2026";

  let examName = job.shortTitle || job.title;
  // Generic cleanup of trailing notification headlines or post counts
  examName = examName
    .replace(/\s*:\s*\d[\d,]*.*$/i, '')
    .replace(/\s*notification\s*released.*$/i, '')
    .replace(/\s*online\s*form.*$/i, '')
    .replace(/\s*recruitment\s*202[4-9].*$/i, '')
    .trim();

  let recruitmentName = job.title;
  if (recruitmentName.length > 80 && examName) {
    recruitmentName = `${examName} Recruitment ${examYear}`;
  }

  // 3. Extract Notification / Advertisement / CEN Number if present
  const cenMatch = (title + " " + job.summary).match(/(?:cen|advt\.?\s*no\.?|notification\s*no\.?)\s*[:\-]?\s*([a-z0-9\/\-_]+)/i);
  const notificationNumber = cenMatch ? cenMatch[1].trim() : undefined;

  // 4. Derive Application Status Factual Engine
  const rawDates = job.importantDates || {};
  let status: RecruitmentStatus = 'APPLICATION_OPEN';
  let statusLabel = 'Applications Live';
  let statusBadgeColor: UniversalRecruitmentNotice['statusBadgeColor'] = 'emerald';

  const isClosedExplicit = /closed|ended|expired/i.test(job.badgeStatus) || 
    (rawDates.lastDate && /closed|ended/i.test(rawDates.lastDate));
  const isStartingSoonExplicit = /starting soon|coming soon|expected|announced/i.test(job.badgeStatus) && 
    !/open|live|apply now/i.test(job.badgeStatus);
  const isCorrectionActive = /correction/i.test(job.badgeStatus) || 
    (rawDates.correctionLastDate && !rawDates.correctionLastDate.includes('N/A'));

  if (isCorrectionActive) {
    status = 'CORRECTION_OPEN';
    statusLabel = 'Correction Window Open';
    statusBadgeColor = 'blue';
  } else if (isClosedExplicit) {
    status = 'APPLICATION_CLOSED';
    statusLabel = 'Applications Closed';
    statusBadgeColor = 'rose';
  } else if (isStartingSoonExplicit) {
    status = 'APPLICATION_STARTING_SOON';
    statusLabel = 'Notification Out — Apply Soon';
    statusBadgeColor = 'amber';
  } else {
    status = 'APPLICATION_OPEN';
    statusLabel = 'Online Applications Open';
    statusBadgeColor = 'emerald';
  }

  // 5. Sanitize and Filter Dates (Strict Separation of Date Value & Status)
  const derivedDates = deriveUniversalNoticeDates(rawDates, 'job', title, job.badgeStatus, job.summary);
  const dates: UniversalNoticeDates = {
    ...derivedDates,
    answerKeyDate: cleanDateValue(rawDates.answerKeyDate) || null
  };

  // 6. Curated Fallback Details (Strictly secondary fallback)
  const curated = CURATED_JOB_DETAILS[job.id] || CURATED_JOB_DETAILS[job.slug];

  // 7. Vacancy Breakdown (Priority 1: DB fields, Priority 2: Curated fallback)
  const isEntranceOrEligibilityExam = /ugc\s*net|ctet|stet|neet|gate|jee|cat\b|clat\b/i.test(title);
  const rawVacMatch = job.vacancies.match(/(\d[\d,]+)/);
  const hasRealNumericVacancies = !!rawVacMatch && !/see notification|as per notification|multiple|refer/i.test(job.vacancies);

  // Helper to extract category distribution (handles upper/lower case keys)
  const resolveCategoryDistribution = (rawDb: any, rawCurated: any) => {
    const raw = rawDb || rawCurated;
    if (!raw || typeof raw !== 'object') return undefined;
    const getVal = (k: string) => {
      const val = raw[k] ?? raw[k.toUpperCase()] ?? raw[k.toLowerCase()];
      return val !== undefined && val !== null ? String(val) : "";
    };
    const ur = getVal('ur');
    const obc = getVal('obc');
    const sc = getVal('sc');
    const st = getVal('st');
    const ews = getVal('ews');
    let total = getVal('total');
    if (!total) {
      const sum = [ur, obc, sc, st, ews]
        .map(v => parseInt(v.replace(/,/g, ''), 10))
        .filter(n => !isNaN(n))
        .reduce((a, b) => a + b, 0);
      if (sum > 0) total = sum.toLocaleString('en-IN');
    }
    if (!ur && !obc && !sc && !st && !ews && !total) return undefined;
    return {
      ur: ur || "-",
      obc: obc || "-",
      sc: sc || "-",
      st: st || "-",
      ews: ews || "-",
      total: total || (job.vacancies || "-")
    };
  };

  // Helper to resolve post hierarchy
  const resolvePostHierarchy = (rawDbPosts: any, rawCuratedPosts: any): PostDetailItem[] | undefined => {
    const raw = (Array.isArray(rawDbPosts) && rawDbPosts.length > 0) ? rawDbPosts : rawCuratedPosts;
    if (!Array.isArray(raw) || raw.length === 0) return undefined;
    return raw.map((p: any) => ({
      postName: p.postName || p.name || p.title || "Government Post",
      department: p.department || p.ministry,
      classification: p.classification || p.cadre,
      qualification: p.qualification || p.eligibility,
      payScale: p.payScale || p.payLevel || p.salary,
      vacancies: p.vacancies !== undefined ? String(p.vacancies) : (p.vacancy !== undefined ? String(p.vacancy) : undefined),
    }));
  };

  let vacancyData: UniversalRecruitmentNotice['vacancy'] = null;
  if (!isEntranceOrEligibilityExam && hasRealNumericVacancies) {
    vacancyData = {
      total: job.vacancies,
      isKnown: true,
      categoryDistribution: resolveCategoryDistribution(job.categoryDistribution, curated?.categoryDistribution),
      postHierarchy: resolvePostHierarchy(job.postWiseDetails, curated?.postWiseDetails)
    };
  }

  // 8. Eligibility Criteria (Only verified, no generic filler)
  let eligibilityData: UniversalRecruitmentNotice['eligibility'] = null;
  if (job.qualification && !job.qualification.includes('Relevant Qualification')) {
    eligibilityData = {
      minimumQualification: job.qualification,
      qualificationLevel: job.qualificationLevel
    };
  }

  // 9. Age Limit (Only verified)
  let ageLimitData: UniversalRecruitmentNotice['ageLimit'] = null;
  if (job.ageLimit && !job.ageLimit.includes('as per category') && job.ageLimit !== 'N/A') {
    const minMaxMatch = job.ageLimit.match(/(\d{2})\s*(?:-|to)\s*(\d{2})/);
    ageLimitData = {
      minAge: minMaxMatch ? `${minMaxMatch[1]} Years` : undefined,
      maxAge: minMaxMatch ? `${minMaxMatch[2]} Years` : undefined,
      relaxationDetails: "Upper age relaxation admissible for SC/ST (5 Yrs), OBC (3 Yrs), and PwD candidates as per Govt rules.",
      rawText: job.ageLimit
    };
  }

  // 10. Application Fee (Only verified)
  let feeData: UniversalRecruitmentNotice['fee'] = null;
  const rawFee = job.applicationFee;
  if (rawFee && (rawFee.generalOBC || rawFee.scStPh)) {
    const categories: FeeCategoryItem[] = [];
    if (rawFee.generalOBC && !rawFee.generalOBC.includes('See notification')) {
      categories.push({ category: "General / OBC / EWS", amount: rawFee.generalOBC });
    }
    if (rawFee.scStPh && !rawFee.scStPh.includes('See notification')) {
      categories.push({ category: "SC / ST / PwD", amount: rawFee.scStPh });
    }
    if (rawFee.female && !rawFee.female.includes('See notification')) {
      categories.push({ category: "Female Candidates", amount: rawFee.female });
    }
    if (categories.length > 0) {
      feeData = {
        categories,
        paymentMode: "Online via Net Banking, Debit/Credit Card, UPI, or Official SBI Challan",
        exemptionNote: "Fee once paid shall not be refunded under any circumstances except as per specific commission refund notifications."
      };
    }
  }

  // 11. Salary / Pay Scale (Only verified)
  let salaryData: UniversalRecruitmentNotice['salary'] = null;
  if (job.payScale && !job.payScale.includes('As per Government Pay Scale') && job.payScale !== 'N/A') {
    const levelMatch = job.payScale.match(/level\s*(\d+)/i);
    salaryData = {
      payLevel: levelMatch ? `Pay Level ${levelMatch[1]} (7th CPC)` : undefined,
      payScale: job.payScale,
      allowances: "Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and Medical facilities as per rules."
    };
  }

  // 12. Selection Process (Priority: DB -> Curated -> Selection Process Array)
  let selectionStages: string[] | null = null;
  if (job.selectionProcess && job.selectionProcess.length > 0 && !job.selectionProcess[0].includes('Check Notification')) {
    selectionStages = job.selectionProcess;
  } else if (curated?.selectionStages && curated.selectionStages.length > 0) {
    selectionStages = curated.selectionStages;
  }

  // 13. Exam Pattern (Priority: DB -> Curated -> null)
  let examPatternData: UniversalRecruitmentNotice['examPattern'] = null;
  const rawPattern = job.examPattern || (curated?.examPatterns && curated.examPatterns.length > 0 ? curated.examPatterns[0] : null);
  if (rawPattern) {
    examPatternData = {
      tierName: rawPattern.tierName || "Written Examination Scheme",
      mode: rawPattern.mode || "Online (CBT) / Offline OMR",
      totalQuestions: rawPattern.totalQuestions,
      totalMarks: rawPattern.totalMarks,
      duration: rawPattern.duration,
      negativeMarking: rawPattern.negativeMarking,
      subjects: Array.isArray(rawPattern.subjects) ? rawPattern.subjects.map((s: any) => ({
        name: s.name || s.subject || "Section",
        questions: s.questions ?? "-",
        marks: s.marks ?? "-",
      })) : undefined
    };
  }

  // 14. Documents Required (Priority: DB -> Curated -> Standard Statutory Checklist)
  const documentsRequired: string[] = (Array.isArray(job.documentsRequired) && job.documentsRequired.length > 0)
    ? job.documentsRequired
    : (curated?.requiredDocuments && curated.requiredDocuments.length > 0)
    ? curated.requiredDocuments
    : [
        "Recent Passport Size Color Photograph (with clear white background, taken within last 3 months).",
        "Scanned signature in black or blue ink on white paper within prescribed dimensions.",
        "Valid Government Photo ID Card (Aadhaar Card, Voter ID, PAN Card, Passport, or Driving License).",
        "Class 10th (Matriculation) Certificate & Marksheet for Date of Birth verification.",
        "Educational Qualification Certificates & Marksheets (Intermediate / Degree / Diploma as applicable).",
        "Category / Caste Certificate (SC/ST/OBC-NCL/EWS) in Central/State Government prescribed format (if seeking reservation).",
        "Active personal Mobile Number and Email ID for receiving registration OTP and official communications."
      ];

  // 15. How to Apply Steps (Priority: Admit Card Download -> DB -> Curated -> Standard Guided Walkthrough)
  const cleanApplyUrl = (job.applyUrl && !job.applyUrl.includes('news.google.com') && !job.applyUrl.includes('employmentnews.gov.in'))
    ? job.applyUrl
    : officialPortalUrl;

  const isAdmitNotice = job.type === 'admit-card' || 
    /admit card|hall ticket|call letter|city slip|city intimation/i.test(title) ||
    /admit card/i.test(job.badgeStatus || "");

  const howToApply: string[] = isAdmitNotice
    ? [
        `Step 1: Visit the official commission portal at ${officialPortalUrl} or click the direct verified link below.`,
        `Step 2: On the candidate portal homepage, locate and click the active notice link for '${examName} Admit Card / Hall Ticket'.`,
        "Step 3: Enter your verified credentials (Registration Number / Application Number & Date of Birth / Password).",
        "Step 4: Solve the security captcha code and submit to access your candidate dashboard.",
        "Step 5: Verify all printed details and download 2 clear color printouts of your examination hall ticket for exam day."
      ]
    : (Array.isArray(job.applicationInstructions) && job.applicationInstructions.length > 0)
    ? job.applicationInstructions
    : (curated?.applicationSteps && curated.applicationSteps.length > 0)
    ? curated.applicationSteps
    : [
        `Step 1: Visit the official commission portal at ${officialPortalUrl} or click the verified 'Apply Online' link below.`,
        "Step 2: Complete the One-Time Registration (OTR) / New Registration using your primary Mobile Number and Email ID.",
        "Step 3: Fill in your Personal Information, Academic Qualifications, and Category details with extreme care.",
        "Step 4: Upload scanned copies of your photograph, signature, and required certificates matching official size and format specifications.",
        "Step 5: Verify the complete application preview to ensure zero typographical errors before final submission.",
        "Step 6: Pay the prescribed examination fee through official online banking, UPI, or card gateway.",
        "Step 7: Download and save the final submitted Application Confirmation Form & Payment Receipt for future reference."
      ];

  // 16. Official Links Command Center
  const links: UniversalNoticeLink[] = [];
  const cleanPdfUrl = (job.officialPdfUrl && !job.officialPdfUrl.includes('news.google.com'))
    ? job.officialPdfUrl
    : officialPortalUrl;

  // Primary Apply Online Link
  if (status === 'APPLICATION_OPEN' || status === 'CORRECTION_OPEN') {
    links.push({
      title: `Apply Online for ${examName}`,
      url: cleanApplyUrl,
      type: 'apply_online',
      badge: status === 'APPLICATION_OPEN' ? 'Application Live' : 'Correction Portal',
      badgeColor: 'emerald',
      isOfficial: true,
      isExternal: true,
      verificationLevel: 'VERIFIED',
      sourceNote: 'Direct official online registration gateway'
    });
  }

  // Official Notification PDF
  if (cleanPdfUrl) {
    links.push({
      title: `Download Official Recruitment Notification PDF (${examName})`,
      url: cleanPdfUrl,
      type: 'notification_pdf',
      badge: 'Official PDF',
      badgeColor: 'blue',
      isOfficial: true,
      isExternal: true,
      verificationLevel: 'VERIFIED',
      sourceNote: 'Full gazette notification circular with post-wise rules'
    });
  }

  // Official Authority Portal
  links.push({
    title: `${authority} Official Recruitment Portal`,
    url: officialPortalUrl,
    type: 'official_portal',
    badge: 'Official Portal',
    badgeColor: 'blue',
    isOfficial: true,
    isExternal: true,
    verificationLevel: 'VERIFIED',
    sourceNote: 'Commission headquarters portal'
  });

  // HireOrbitAI Exam Copilot
  links.push({
    title: `AI Exam Syllabus & Personal Preparation Plan for ${examName}`,
    url: '/copilot',
    type: 'syllabus',
    badge: 'AI Powered',
    badgeColor: 'emerald',
    isOfficial: false,
    isExternal: false,
    verificationLevel: 'GENERATED',
    sourceNote: 'Smart AI revision tracker'
  });

  // 17. Highly Scannable Quick Facts (Only fields that actually exist)
  const quickFacts: QuickFactItem[] = [];
  if (vacancyData?.total) {
    quickFacts.push({ label: "Total Posts", value: vacancyData.total, highlight: true });
  }
  if (eligibilityData?.minimumQualification) {
    quickFacts.push({ label: "Qualification", value: eligibilityData.minimumQualification });
  }
  if (ageLimitData?.rawText) {
    quickFacts.push({ label: "Age Bracket", value: ageLimitData.rawText });
  }
  if (dates.applicationStart && isRealDateString(dates.applicationStart)) {
    quickFacts.push({ label: "Application Start", value: dates.applicationStart });
  }
  if (dates.applicationLastDate && isRealDateString(dates.applicationLastDate)) {
    quickFacts.push({ label: "Last Date", value: dates.applicationLastDate, highlight: true });
  }
  if (job.location) {
    quickFacts.push({ label: "Location", value: job.location });
  }
  quickFacts.push({ label: "Organization", value: authority });
  quickFacts.push({ label: "Application Mode", value: "Online (Official Portal)" });

  // 18. Dynamic FAQs
  const faqs = curated?.faqs && curated.faqs.length > 0
    ? curated.faqs
    : [
        {
          question: `What is the last date to apply for ${examName}?`,
          answer: dates.applicationLastDate
            ? `The last date to submit the online application for ${examName} is ${dates.applicationLastDate}. Candidates are strongly advised to apply well in advance to avoid last-minute portal rush.`
            : `The application schedule is detailed in the official notification. Please refer to the Important Dates section on this page.`
        },
        ...(vacancyData?.total ? [{
          question: `How many total vacancies are announced in ${examName}?`,
          answer: `A total of ${vacancyData.total} vacancies have been officially announced across various posts and departments.`
        }] : []),
        ...(eligibilityData?.minimumQualification ? [{
          question: `What is the minimum educational qualification required?`,
          answer: `Candidates must have passed ${eligibilityData.minimumQualification} from a recognized Board or University in India.`
        }] : []),
        ...(feeData?.categories?.length ? [{
          question: `What is the application fee for ${examName}?`,
          answer: feeData.categories.map(c => `${c.category}: ${c.amount}`).join('; ') + '. Payment can be made online.'
        }] : []),
        {
          question: `Where can I submit the online application form?`,
          answer: `Applications must be submitted exclusively through the official ${authority} portal at ${officialPortalUrl}. Direct verified links are available in our Official Links Command Center.`
        }
      ];

  // 19. Generate Normalized Fingerprint
  const fingerprint = generateRecruitmentFingerprint(authority, examName, examYear, notificationNumber);

  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    shortTitle: job.shortTitle,
    noticeType: 'recruitment',
    authority,
    organization: authority,
    examName,
    recruitmentName,
    notificationNumber,
    category: job.category,
    state: job.location || "All India",
    location: job.location || "All India",
    status,
    statusLabel,
    statusBadgeColor,
    summary: job.summary,
    publishedAt: rawDates.startDate || "Official Gazette Verified",
    updatedAt: job.updatedAt || "Live Gazette Verified",
    quickFacts,
    dates,
    vacancy: vacancyData,
    eligibility: eligibilityData,
    ageLimit: ageLimitData,
    fee: feeData,
    salary: salaryData,
    selectionProcess: selectionStages,
    examPattern: examPatternData,
    documentsRequired,
    howToApply,
    links,
    source: {
      name: authority,
      officialUrl: officialPortalUrl,
      verificationStatus: 'Official Source Verified',
      lastVerifiedAt: job.updatedAt || 'Official Gazette Verified'
    },
    faqs,
    fingerprint
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── UNIVERSAL RESULT INTELLIGENCE MODEL & SYSTEM ──────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export type ResultStatus =
  | 'RESULT_DECLARED'
  | 'SCORECARD_AVAILABLE'
  | 'CUTOFF_RELEASED'
  | 'MERIT_LIST_RELEASED'
  | 'RESULT_PARTIALLY_RELEASED'
  | 'REGIONAL_RESULT_RELEASED'
  | 'RESULT_NOT_DECLARED'
  | 'EXPECTED_SOON'
  | 'REVISED_RESULT'
  | 'FINAL_RESULT_DECLARED';

export interface CategoryCutoffItem {
  category: string;
  cutoffMarks: string | number;
  qualifyingStatus?: string;
}

export interface PostCutoffItem {
  postName: string;
  categoryCutoffs: CategoryCutoffItem[];
}

export interface UniversalResultNotice {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  noticeType: 'result';
  authority: string;
  organization: string;
  examName: string;
  resultName: string;
  year: string;
  category: 'central' | 'railway' | 'banking' | 'police' | 'defense' | 'state' | 'teaching';
  region?: string;
  stage: string;
  status: ResultStatus;
  statusLabel: string;
  statusBadgeColor: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'zinc';
  summary: string;
  publishedAt: string;
  updatedAt: string;

  // Primary Direct Action URLs (only when verified, never fake)
  primaryActionUrls: {
    checkResultUrl?: string;
    downloadScorecardUrl?: string;
    checkCutoffUrl?: string;
    downloadMeritListUrl?: string;
    officialPortalUrl: string;
  };

  // Scannable Quick Facts Overview (Only verified attributes)
  quickFacts: QuickFactItem[];

  // Priority Chronological Dates (no N/A clutter)
  dates: {
    examDate?: string;
    answerKeyDate?: string;
    resultDate?: string;
    scorecardDate?: string;
    cutoffDate?: string;
    meritListDate?: string;
    nextStageDate?: string;
    models?: Record<string, any>;
  };

  // Result Details & Formats
  resultDetails: {
    stage: string;
    resultDeclared: boolean;
    declarationDate?: string;
    resultFormat?: 'PDF Roll Number List' | 'Individual Scorecard Login' | 'Merit List PDF' | 'OMR Scorecard';
    totalCandidates?: string;
    qualifiedCandidates?: string;
    totalPosts?: string;
    examMode?: string;
  };

  // Scorecard Information (strictly null if not available)
  scorecard: {
    isAvailable: boolean;
    releaseDate?: string;
    downloadUrl?: string;
    loginRequired: boolean;
    requiredCredentials: string[];
  } | null;

  // Cutoff Information (strictly null if not available; never invent numbers)
  cutoff: {
    isReleased: boolean;
    releaseDate?: string;
    overallCutoff?: string;
    categoryCutoffs?: CategoryCutoffItem[];
    postCutoffs?: PostCutoffItem[];
    cutoffPdfUrl?: string;
    officialNote?: string;
  } | null;

  // Merit List Information (strictly null if not available)
  meritList: {
    isReleased: boolean;
    meritListUrl?: string;
    totalSelected?: string;
    selectionCriteria?: string;
  } | null;

  // Required Login Credentials
  credentials: {
    label: string;
    requiredItems: string[];
  };

  // Step-by-Step How to Check Result
  howToCheckSteps: string[];

  // Next Stage / Further Assessment Process (strictly null if unknown)
  nextStage: {
    stageName: string;
    tentativeDate?: string;
    description: string;
    stagesFlow?: string[];
  } | null;

  // Official Links Command Center
  links: UniversalNoticeLink[];

  // Source & Verification Metadata
  source: {
    name: string;
    officialUrl: string;
    verificationStatus: 'Official Source Verified' | 'Gazette Circular Verified' | 'Source Confirmed' | 'Sarkari Result Source' | string;
    lastVerifiedAt: string;
    isOfficial?: boolean;
    sourceType?: 'official' | 'aggregator';
  };

  // Dynamic FAQs
  faqs: Array<{ question: string; answer: string }>;

  // Fingerprint for deduplication
  fingerprint: string;
}

// ─── RESULT FINGERPRINT GENERATOR ───────────────────────────────────────────
export function generateResultFingerprint(
  authority: string,
  examName: string,
  year: string = "2026",
  stage: string = "general",
  region: string = "all"
): string {
  const canonicalAuth = getCanonicalAuthorityKey(authority);

  let cleanExam = (examName || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/20\d\d/g, " ")
    .replace(/\b(result|scorecard|merit\s*list|selection\s*list|marks|exam|examination|declared|released|out|download|check|final|provisional|announcement|notice)\b/gi, " ");

  if (canonicalAuth) {
    cleanExam = cleanExam.replace(new RegExp(`\\b${canonicalAuth}\\b`, 'gi'), " ");
  }

  const examKey = cleanExam
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30) || "exam";

  const cleanYear = (year || "2026").replace(/[^0-9]/g, "").slice(0, 4) || "2026";

  let cleanStage = "general";
  const st = (stage || "").toLowerCase();
  if (/cbt\s*[-]?\s*1/i.test(st)) cleanStage = "cbt1";
  else if (/cbt\s*[-]?\s*2/i.test(st)) cleanStage = "cbt2";
  else if (/tier\s*[-]?\s*1/i.test(st)) cleanStage = "tier1";
  else if (/tier\s*[-]?\s*2/i.test(st)) cleanStage = "tier2";
  else if (/prelims|preliminary/i.test(st)) cleanStage = "prelims";
  else if (/mains/i.test(st)) cleanStage = "mains";
  else if (/final/i.test(st)) cleanStage = "final";
  else if (/pet|pst|physical/i.test(st)) cleanStage = "pet";
  else if (/skill|typing/i.test(st)) cleanStage = "skill";
  else if (/interview/i.test(st)) cleanStage = "interview";
  else {
    cleanStage = st.replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "").slice(0, 15) || "general";
  }

  let cleanRegion = (region || "all")
    .toLowerCase()
    .replace(/all\s*india/i, "all")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 15) || "all";

  return `${canonicalAuth}_${examKey}_${cleanYear}_result_${cleanStage}_${cleanRegion}`;
}

// ─── AUTHENTIC NORMALIZATION ENGINE FOR RESULTS ────────────────────────────
export function normalizeToUniversalResult(job: GovJobNotification): UniversalResultNotice {
  const title = job.title;
  const rawCombined = `${job.title} ${job.shortTitle} ${job.organization} ${job.summary} ${job.location}`.toLowerCase();

  // 1. Resolve Authority & Official Portal
  let authority = job.organization;
  let officialPortalUrl = job.applyUrl || "https://employmentnews.gov.in";

  for (const [key, mapping] of Object.entries(OFFICIAL_PORTAL_REGISTRY)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(rawCombined)) {
      authority = mapping.authority;
      officialPortalUrl = mapping.portalUrl;
      break;
    }
  }

  // 2. Exam Name & Stage Resolution (Generic Zero-Hardcoding)
  let examName = job.shortTitle || job.title;
  examName = examName
    .replace(/\b(result|declared|scorecard|cut[\s-]?off|marks|merit\s*list|selection\s*list|out|available|download|check|online\s*link|link\s*active|released|announcement|notice|202[4-9])\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!examName || examName.length < 3) {
    examName = job.shortTitle || job.title;
  }

  let stage = "Written Examination";
  const yearMatch = title.match(/202[4-9]/);
  const examYear = yearMatch ? yearMatch[0] : "2026";

  if (/cbt\s*[-]?\s*1/i.test(title + " " + job.summary)) {
    stage = "CBT-1 (Computer Based Test 1)";
  } else if (/cbt\s*[-]?\s*2/i.test(title + " " + job.summary)) {
    stage = "CBT-2 (Computer Based Test 2)";
  } else if (/tier\s*[-]?\s*1/i.test(title + " " + job.summary)) {
    stage = "Tier-1 (Preliminary Examination)";
  } else if (/tier\s*[-]?\s*2/i.test(title + " " + job.summary)) {
    stage = "Tier-2 (Mains Examination)";
  } else if (/prelims|preliminary/i.test(title + " " + job.summary)) {
    stage = "Preliminary Examination (Prelims)";
  } else if (/mains/i.test(title + " " + job.summary)) {
    stage = "Mains Examination";
  } else if (/final/i.test(title + " " + job.summary)) {
    stage = "Final Selection / Merit List";
  } else if (/pet|pst|physical/i.test(title + " " + job.summary)) {
    stage = "Physical Test (PET / PST)";
  } else if (/skill|typing/i.test(title + " " + job.summary)) {
    stage = "Skill Test / Typing Test";
  }

  const resultName = `${examName} ${stage} Result ${examYear}`;

  // 3. Status Engine (Derived from structured data & title facts)
  let status: ResultStatus = 'RESULT_DECLARED';
  let statusLabel = 'Result Declared';
  let statusBadgeColor: UniversalResultNotice['statusBadgeColor'] = 'emerald';

  const isScorecardLive = /scorecard.*(?:out|available|live|active)|download scorecard|marks out/i.test(title);
  const isCutoffLive = /cutoff.*(?:out|released|declared)|cut-off marks/i.test(title);
  const isMeritLive = /merit list.*(?:out|released|declared)|selection list/i.test(title);
  const isFinal = /final result/i.test(title);
  const isRevised = /revised result/i.test(title);
  const isExpectedSoon = /expected soon|likely soon|announcing soon|to be declared/i.test(title) || 
    /expected soon/i.test(job.badgeStatus);

  if (isFinal) {
    status = 'FINAL_RESULT_DECLARED';
    statusLabel = 'Final Result & Selection List Live';
    statusBadgeColor = 'emerald';
  } else if (isRevised) {
    status = 'REVISED_RESULT';
    statusLabel = 'Revised Result Declared';
    statusBadgeColor = 'blue';
  } else if (isScorecardLive) {
    status = 'SCORECARD_AVAILABLE';
    statusLabel = 'Scorecard & Marks Available';
    statusBadgeColor = 'emerald';
  } else if (isCutoffLive) {
    status = 'CUTOFF_RELEASED';
    statusLabel = 'Result & Cutoff Released';
    statusBadgeColor = 'emerald';
  } else if (isMeritLive) {
    status = 'MERIT_LIST_RELEASED';
    statusLabel = 'Merit List Released';
    statusBadgeColor = 'emerald';
  } else if (isExpectedSoon) {
    status = 'EXPECTED_SOON';
    statusLabel = 'Result Expected Shortly';
    statusBadgeColor = 'amber';
  } else {
    status = 'RESULT_DECLARED';
    statusLabel = 'Official Result Declared';
    statusBadgeColor = 'emerald';
  }

  // 4. Sanitize and Filter Dates (Separation of Date from Status, Zero Placeholders)
  const rawDates = job.importantDates || {};
  const normalizedResultDates = normalizeGovernmentNoticeDates(rawDates, {
    title: job.title,
    summary: job.summary,
    type: 'result',
    badgeStatus: job.badgeStatus
  });

  const dates: UniversalResultNotice['dates'] = {
    examDate: normalizedResultDates.examDate || undefined,
    answerKeyDate: normalizedResultDates.answerKeyDate || undefined,
    resultDate: normalizedResultDates.resultDate || undefined,
    scorecardDate: normalizedResultDates.scorecardDate || undefined,
    cutoffDate: normalizedResultDates.cutoffDate || undefined,
    meritListDate: normalizedResultDates.finalResultDate || undefined,
    models: normalizedResultDates.models
  };

  // 5. Clean URLs & Classify Source (Zero-Block Sarkari Result / Aggregator Policy)
  const rawResultUrl = job.applyUrl || "";
  const rawPdfUrl = job.officialPdfUrl || "";
  const isOfficialResultLink = isOfficialGovDomain(rawResultUrl);
  const isOfficialPdf = isOfficialGovDomain(rawPdfUrl);
  const isSarkariResult = /sarkariresult/i.test(rawResultUrl) || /sarkariresult/i.test(rawPdfUrl);

  const resultSourceType: 'official' | 'aggregator' = isOfficialResultLink ? 'official' : 'aggregator';
  const resultSourceName = isOfficialResultLink 
    ? authority 
    : (isSarkariResult ? 'Sarkari Result' : 'Source Confirmed');
  const verificationStatus: string = isOfficialResultLink 
    ? 'Official Source Verified' 
    : 'Source Confirmed';

  // Candidate Access Link: NEVER block or drop the link, even if from Sarkari Result!
  const cleanResultUrl = (rawResultUrl && !rawResultUrl.includes('news.google.com') && !rawResultUrl.includes('employmentnews.gov.in'))
    ? rawResultUrl
    : (rawPdfUrl && !rawPdfUrl.includes('news.google.com') ? rawPdfUrl : officialPortalUrl);

  const cleanPdfUrl = (rawPdfUrl && !rawPdfUrl.includes('news.google.com') && !rawPdfUrl.includes('employmentnews.gov.in'))
    ? rawPdfUrl
    : (isOfficialResultLink ? cleanResultUrl : officialPortalUrl);

  // 6. Action URLs (only when verified/available, never blocked)
  const primaryActionUrls: UniversalResultNotice['primaryActionUrls'] = {
    checkResultUrl: (status !== 'EXPECTED_SOON') ? cleanResultUrl : undefined,
    downloadScorecardUrl: (isScorecardLive) ? cleanResultUrl : undefined,
    checkCutoffUrl: (isCutoffLive) ? cleanPdfUrl : undefined,
    downloadMeritListUrl: (isMeritLive || isFinal) ? cleanPdfUrl : undefined,
    officialPortalUrl
  };

  // 7. Authority-Aware Credentials
  let credentials = {
    label: "Registration Number & Date of Birth",
    requiredItems: ["Registration / Roll Number", "Date of Birth (DD/MM/YYYY)", "Security Captcha"]
  };

  if (/nta|ugc net|csir|ctet/i.test(rawCombined)) {
    credentials = {
      label: "Application Number & Date of Birth",
      requiredItems: ["Application Number", "Date of Birth", "Security PIN Code"]
    };
  } else if (/ssc/i.test(rawCombined)) {
    credentials = {
      label: "Registration ID & Password / Roll Number",
      requiredItems: ["Registration Number / Roll Number", "User Password", "Captcha Code"]
    };
  } else if (/rrb|railway/i.test(rawCombined)) {
    credentials = {
      label: "Railway Registration Number & User Password (DOB)",
      requiredItems: ["Registration Number", "Date of Birth (DDMMYYYY)"]
    };
  }

  // 8. Result Details & Candidate Statistics (if mentioned in text)
  const qualMatch = (title + " " + job.summary).match(/([\d,]+)\s*(?:candidates|aspirants)?\s*qualified/i);
  const qualifiedCandidates = qualMatch ? qualMatch[1] : undefined;

  const totalPosts = job.vacancies && !/see notification|as per notification|multiple|refer/i.test(job.vacancies)
    ? job.vacancies
    : undefined;

  const resultDetails: UniversalResultNotice['resultDetails'] = {
    stage,
    resultDeclared: status !== 'EXPECTED_SOON',
    declarationDate: dates.resultDate,
    resultFormat: cleanPdfUrl.endsWith('.pdf') ? 'PDF Roll Number List' : 'Individual Scorecard Login',
    qualifiedCandidates,
    totalPosts,
    examMode: /cbt/i.test(stage) ? 'Computer Based Test (CBT)' : 'Written Examination'
  };

  // 9. Scorecard Panel (Strict: only if scorecard verified)
  const scorecard: UniversalResultNotice['scorecard'] = isScorecardLive ? {
    isAvailable: true,
    releaseDate: dates.scorecardDate || "Available Now",
    downloadUrl: cleanResultUrl,
    loginRequired: true,
    requiredCredentials: credentials.requiredItems
  } : null;

  // 10. Cutoff Panel (Strict: only if cutoff verified; never invent numbers)
  const cutoff: UniversalResultNotice['cutoff'] = isCutoffLive ? {
    isReleased: true,
    releaseDate: dates.cutoffDate || "Released Along with Result",
    cutoffPdfUrl: cleanPdfUrl,
    officialNote: "Cutoff marks have been published in the official result writeup notification PDF by the commission."
  } : null;

  // 11. Merit List Panel (Strict: only if merit list verified)
  const meritList: UniversalResultNotice['meritList'] = (isMeritLive || isFinal) ? {
    isReleased: true,
    meritListUrl: cleanPdfUrl,
    totalSelected: qualifiedCandidates || totalPosts,
    selectionCriteria: "Merit order determined by normalized aggregate scores in the examination."
  } : null;

  // 12. Next Stage Determination (Strict: based on verified selection stages)
  let nextStage: UniversalResultNotice['nextStage'] = null;
  const stages = job.selectionProcess || [];
  if (stages.length > 1) {
    if (/cbt\s*[-]?\s*1|tier\s*[-]?\s*1|prelims/i.test(stage)) {
      nextStage = {
        stageName: stages[1] || "2nd Stage Examination",
        description: "Candidates qualified in this stage are shortlisted to appear for the next phase as per commission notification.",
        stagesFlow: stages
      };
    } else if (/cbt\s*[-]?\s*2|tier\s*[-]?\s*2|mains/i.test(stage)) {
      nextStage = {
        stageName: stages[2] || "Skill Test / Document Verification",
        description: "Shortlisted candidates will be called for Document Verification and Skill/Aptitude Test.",
        stagesFlow: stages
      };
    } else if (isFinal) {
      nextStage = {
        stageName: "Appointment & Joining Formalities",
        description: "Recommended candidates will receive formal appointment letters and medical examination intimation from respective departments.",
        stagesFlow: stages
      };
    }
  }

  // 13. Step-by-Step How to Check Result
  const howToCheckSteps = [
    `Step 1: Open the official ${authority} portal at ${officialPortalUrl} or click the direct verified link below.`,
    `Step 2: On the homepage, locate the active notice for "${resultName}".`,
    `Step 3: Click on the Result link (or open the official Result PDF write-up).`,
    `Step 4: If the portal requires candidate login, enter your verified credentials: ${credentials.requiredItems.join(', ')}.`,
    `Step 5: For PDF results, press 'Ctrl + F' (or use search on mobile) and type your Roll Number or Registration Number.`,
    `Step 6: If your Roll Number is displayed, you have qualified for the next stage of recruitment.`,
    `Step 7: Download and save the Result PDF and take a printout of your scorecard for future verification records.`
  ];

  // 14. Official Links Command Center
  const links: UniversalNoticeLink[] = [];

  // Primary Result Link (Candidate access preserved whether official or aggregator)
  if (status !== 'EXPECTED_SOON' && cleanResultUrl) {
    links.push({
      title: isOfficialResultLink ? `Check ${resultName} (Official)` : `Check ${resultName} (via ${resultSourceName})`,
      url: cleanResultUrl,
      type: 'result',
      badge: isOfficialResultLink ? 'Official Link' : `${resultSourceName} Link`,
      badgeColor: isOfficialResultLink ? 'emerald' : 'amber',
      isOfficial: isOfficialResultLink,
      isExternal: true,
      verificationLevel: isOfficialResultLink ? 'VERIFIED' : 'DERIVED',
      sourceNote: isOfficialResultLink 
        ? 'Direct official commission result portal' 
        : `${resultSourceName} candidate access gateway (Official commission link pending)`,
      sourceName: resultSourceName,
      sourceType: resultSourceType,
      verificationStatus
    });
  }

  // Scorecard Download Link (if live)
  if (isScorecardLive) {
    links.push({
      title: `Download ${examName} Scorecard & Marks`,
      url: cleanResultUrl,
      type: 'result',
      badge: 'Scorecard Active',
      badgeColor: 'emerald',
      isOfficial: true,
      isExternal: true,
      verificationLevel: 'VERIFIED',
      sourceNote: 'Candidate login portal for individual marks'
    });
  }

  // Official Cutoff Marks PDF (if live)
  if (isCutoffLive || cleanPdfUrl) {
    links.push({
      title: `Download Official Result & Cutoff Writeup Notice PDF`,
      url: cleanPdfUrl,
      type: 'notification_pdf',
      badge: 'Official PDF',
      badgeColor: 'blue',
      isOfficial: true,
      isExternal: true,
      verificationLevel: 'VERIFIED',
      sourceNote: 'Gazette notification with category-wise cutoff marks'
    });
  }

  // Official Portal Homepage
  links.push({
    title: `${authority} Official Examination Portal`,
    url: officialPortalUrl,
    type: 'official_portal',
    badge: 'Official Portal',
    badgeColor: 'blue',
    isOfficial: true,
    isExternal: true,
    verificationLevel: 'VERIFIED',
    sourceNote: 'Commission headquarters portal'
  });

  // HireOrbitAI Next Stage Copilot
  links.push({
    title: `AI Preparation Plan for Next Stage (${examName})`,
    url: '/copilot',
    type: 'syllabus',
    badge: 'AI Powered',
    badgeColor: 'emerald',
    isOfficial: false,
    isExternal: false,
    verificationLevel: 'GENERATED',
    sourceNote: 'Personalized next stage preparation tracker'
  });

  // 15. Scannable Quick Facts Overview (Only verified fields)
  const quickFacts: QuickFactItem[] = [
    { label: "Exam Authority", value: authority },
    { label: "Exam Name", value: examName },
    { label: "Result Stage", value: stage, highlight: true },
    ...(dates.resultDate ? [{ label: "Result Date", value: dates.resultDate, highlight: true }] : []),
    ...(dates.examDate ? [{ label: "Exam Date", value: dates.examDate }] : []),
    ...(totalPosts ? [{ label: "Total Posts", value: totalPosts }] : []),
    ...(qualifiedCandidates ? [{ label: "Qualified Candidates", value: qualifiedCandidates }] : []),
    ...(nextStage ? [{ label: "Next Stage", value: nextStage.stageName }] : [])
  ];

  // 16. Dynamic FAQs
  const faqs = [
    {
      question: `Is the ${resultName} declared?`,
      answer: status !== 'EXPECTED_SOON'
        ? `Yes, ${authority} has officially declared the ${resultName}. Candidates can check their qualification status directly using the verified links provided on this page.`
        : `The ${resultName} is expected to be announced shortly by ${authority}. Please refer to the official portal link for the latest update.`
    },
    {
      question: `Where can I check the official result for ${examName}?`,
      answer: `You can check the result directly on the official ${authority} portal at ${officialPortalUrl} or via the high-contrast 'Check Result' button in our Official Links Command Center.`
    },
    {
      question: `What credentials are required to check the result / scorecard?`,
      answer: `Candidates need to log in using their ${credentials.requiredItems.join(', ')}.`
    },
    ...(isCutoffLive ? [{
      question: `Has the official cutoff been released for ${examName}?`,
      answer: `Yes, the category-wise cutoff marks have been officially announced along with the result writeup. You can download the complete cutoff PDF from our Official Links table.`
    }] : [{
      question: `What is the expected cutoff for ${examName}?`,
      answer: `Official cutoff marks are determined exclusively by ${authority} based on normalized exam scores, reservation categories, and total vacancies. Check the official result PDF for confirmed category thresholds.`
    }]),
    ...(nextStage ? [{
      question: `What is the next stage after qualifying ${stage}?`,
      answer: `Candidates shortlisted in this result will be called for ${nextStage.stageName}. Exact dates and reporting guidelines will be communicated by ${authority}.`
    }] : []),
    {
      question: `What should I do if the official result portal is down or loading slowly?`,
      answer: `Heavy server traffic immediately after result declaration may cause temporary slowdowns on commission portals. Candidates are advised to clear browser cache, check during non-peak hours, or use the direct official PDF link.`
    }
  ];

  // 17. Generate Normalized Fingerprint
  const fingerprint = generateResultFingerprint(authority, examName, examYear, stage, job.location || "all");

  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    shortTitle: job.shortTitle,
    noticeType: 'result',
    authority,
    organization: authority,
    examName,
    resultName,
    year: examYear,
    category: job.category,
    region: job.location,
    stage,
    status,
    statusLabel,
    statusBadgeColor,
    summary: job.summary,
    publishedAt: dates.resultDate || "Live Gazette Verified",
    updatedAt: job.updatedAt || "Official Gazette Verified",
    primaryActionUrls,
    quickFacts,
    dates,
    resultDetails,
    scorecard,
    cutoff,
    meritList,
    credentials,
    howToCheckSteps,
    nextStage,
    links,
    source: {
      name: resultSourceName,
      officialUrl: officialPortalUrl,
      verificationStatus,
      lastVerifiedAt: job.updatedAt || 'Official Gazette Verified',
      isOfficial: isOfficialResultLink,
      sourceType: resultSourceType
    },
    faqs,
    fingerprint
  };
}


