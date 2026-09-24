import { RawAiExtractionResult } from "./ai-recruitment-extractor";

export interface FieldVerificationMatrix {
  categoryDistribution: "verified" | "pending" | "conflicted" | "rejected";
  postWiseDetails: "verified" | "pending" | "conflicted" | "rejected";
  examPattern: "verified" | "pending" | "conflicted" | "rejected";
  applicationInstructions: "verified" | "pending" | "conflicted" | "rejected";
  documentsRequired: "verified" | "pending" | "conflicted" | "rejected";
  overallStatus: "verified" | "pending" | "conflicted";
  rejectionReasons: string[];
}

export interface ValidatedRecruitmentEnrichment {
  categoryDistribution?: {
    ur: string;
    obc: string;
    sc: string;
    st: string;
    ews: string;
    total: string;
    [key: string]: string;
  } | null;
  postWiseDetails?: Array<{
    postName: string;
    department?: string;
    vacancies?: string;
    payScale?: string;
    eligibility?: string;
    classification?: string;
  }> | null;
  examPattern?: {
    tierName: string;
    mode: string;
    totalQuestions?: number | string;
    totalMarks?: number | string;
    duration?: string;
    negativeMarking?: string;
    subjects?: Array<{ name: string; questions: number | string; marks: number | string }>;
  } | null;
  applicationInstructions?: string[] | null;
  documentsRequired?: string[] | null;
  fieldVerification: FieldVerificationMatrix;
}

// ─── HELPER: SAFE NUMERIC PARSER ──────────────────────────────────────────
function parseCleanNumber(val: any): number | null {
  if (val === undefined || val === null || val === "") return null;
  const str = String(val).trim();
  const isNegative = str.startsWith("-");
  const num = Number(str.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return null;
  return isNegative ? -num : num;
}

// ─── LOGIC VALIDATION GATEKEEPER ──────────────────────────────────────────
export function validateAndAuditAiExtraction(
  raw: RawAiExtractionResult,
  existingDbRecord?: {
    vacancies?: string;
    verification_status?: string;
    category_distribution?: any;
    post_wise_details?: any;
    exam_pattern?: any;
  }
): ValidatedRecruitmentEnrichment {
  const rejectionReasons: string[] = [];

  const matrix: FieldVerificationMatrix = {
    categoryDistribution: "pending",
    postWiseDetails: "pending",
    examPattern: "pending",
    applicationInstructions: "pending",
    documentsRequired: "pending",
    overallStatus: "pending",
    rejectionReasons: []
  };

  // ── 1. CATEGORY DISTRIBUTION VALIDATION ─────────────────────────────────
  let validatedCategory: ValidatedRecruitmentEnrichment["categoryDistribution"] = null;

  if (raw.categoryDistribution && typeof raw.categoryDistribution === "object") {
    const rawCat = raw.categoryDistribution;
    const ur = parseCleanNumber(rawCat.ur);
    const obc = parseCleanNumber(rawCat.obc);
    const sc = parseCleanNumber(rawCat.sc);
    const st = parseCleanNumber(rawCat.st);
    const ews = parseCleanNumber(rawCat.ews);
    const total = parseCleanNumber(rawCat.total);

    // If total exists and category numbers exist, verify arithmetic sum
    if (total !== null && total > 0) {
      const partsSum = (ur || 0) + (obc || 0) + (sc || 0) + (st || 0) + (ews || 0);

      // If at least 2 categories were provided, check sum
      const categoriesProvided = [ur, obc, sc, st, ews].filter(n => n !== null).length;

      if (categoriesProvided >= 2) {
        if (partsSum === total) {
          validatedCategory = {
            ur: ur !== null ? ur.toLocaleString("en-IN") : "—",
            obc: obc !== null ? obc.toLocaleString("en-IN") : "—",
            sc: sc !== null ? sc.toLocaleString("en-IN") : "—",
            st: st !== null ? st.toLocaleString("en-IN") : "—",
            ews: ews !== null ? ews.toLocaleString("en-IN") : "—",
            total: total.toLocaleString("en-IN")
          };
          matrix.categoryDistribution = "verified";
        } else {
          // REJECT CATEGORY DATA — arithmetic mismatch
          const reason = `Category sum mismatch: UR(${ur || 0}) + OBC(${obc || 0}) + SC(${sc || 0}) + ST(${st || 0}) + EWS(${ews || 0}) = ${partsSum} ≠ Total (${total})`;
          rejectionReasons.push(reason);
          matrix.categoryDistribution = "rejected";
          validatedCategory = null;
        }
      } else {
        // Incomplete category distribution
        matrix.categoryDistribution = "pending";
      }
    } else {
      matrix.categoryDistribution = "pending";
    }
  }

  // Conflict check against existing verified DB record
  if (existingDbRecord?.category_distribution && existingDbRecord.verification_status === "verified") {
    // Preserve existing verified data if AI extraction failed or conflicted
    if (matrix.categoryDistribution !== "verified") {
      validatedCategory = existingDbRecord.category_distribution;
      matrix.categoryDistribution = "verified";
    }
  }

  // ── 2. POST-WISE DETAILS VALIDATION ─────────────────────────────────────
  let validatedPosts: ValidatedRecruitmentEnrichment["postWiseDetails"] = null;

  if (Array.isArray(raw.postWiseDetails) && raw.postWiseDetails.length > 0) {
    const validItems: NonNullable<ValidatedRecruitmentEnrichment["postWiseDetails"]> = [];
    let sumPostVacancies = 0;
    let anyPostVacancyParsed = false;

    for (const post of raw.postWiseDetails) {
      if (post && post.postName && typeof post.postName === "string" && post.postName.trim().length >= 3) {
        const postVacNum = parseCleanNumber(post.vacancies);
        if (postVacNum !== null && postVacNum > 0) {
          sumPostVacancies += postVacNum;
          anyPostVacancyParsed = true;
        }

        validItems.push({
          postName: post.postName.trim(),
          department: post.department ? String(post.department).trim() : undefined,
          vacancies: postVacNum !== null ? `${postVacNum.toLocaleString("en-IN")} Posts` : (post.vacancies ? String(post.vacancies) : undefined),
          payScale: post.payScale ? String(post.payScale).trim() : undefined,
          eligibility: post.eligibility ? String(post.eligibility).trim() : undefined,
          classification: post.classification ? String(post.classification).trim() : undefined
        });
      }
    }

    // Check post vacancies compatibility against stated total vacancy
    const statedTotalVac = parseCleanNumber(existingDbRecord?.vacancies || raw.categoryDistribution?.total);
    if (statedTotalVac !== null && anyPostVacancyParsed && sumPostVacancies > statedTotalVac) {
      const reason = `Post-wise vacancy sum (${sumPostVacancies}) exceeds stated total vacancies (${statedTotalVac})`;
      rejectionReasons.push(reason);
      matrix.postWiseDetails = "conflicted";
      validatedPosts = null;
    } else if (validItems.length > 0) {
      validatedPosts = validItems;
      matrix.postWiseDetails = "verified";
    }
  }

  if (existingDbRecord?.post_wise_details && existingDbRecord.verification_status === "verified") {
    if (matrix.postWiseDetails !== "verified") {
      validatedPosts = existingDbRecord.post_wise_details;
      matrix.postWiseDetails = "verified";
    }
  }

  // ── 3. EXAM PATTERN VALIDATION ──────────────────────────────────────────
  let validatedExam: ValidatedRecruitmentEnrichment["examPattern"] = null;

  if (raw.examPattern && typeof raw.examPattern === "object") {
    const ep = raw.examPattern;
    const questions = parseCleanNumber(ep.totalQuestions);
    const marks = parseCleanNumber(ep.totalMarks);

    // Sanity checks: numbers must be positive and non-negative
    const isNegativeQuestions = questions !== null && questions < 0;
    const isNegativeMarks = marks !== null && marks < 0;

    if (isNegativeQuestions || isNegativeMarks) {
      rejectionReasons.push(`Exam pattern contains invalid negative numbers (Questions: ${questions}, Marks: ${marks})`);
      matrix.examPattern = "rejected";
    } else {
      const validSubjects: Array<{ name: string; questions: number | string; marks: number | string }> = [];

      if (Array.isArray(ep.subjects)) {
        for (const sub of ep.subjects) {
          if (sub && sub.name && typeof sub.name === "string" && sub.name.trim().length > 1) {
            const sq = parseCleanNumber(sub.questions) || sub.questions || "—";
            const sm = parseCleanNumber(sub.marks) || sub.marks || "—";
            validSubjects.push({
              name: sub.name.trim(),
              questions: sq,
              marks: sm
            });
          }
        }
      }

      validatedExam = {
        tierName: ep.tierName ? String(ep.tierName).trim() : "Written Examination",
        mode: ep.mode ? String(ep.mode).trim() : "Computer Based Test (CBT)",
        totalQuestions: questions !== null ? questions : ep.totalQuestions,
        totalMarks: marks !== null ? marks : ep.totalMarks,
        duration: ep.duration ? String(ep.duration).trim() : undefined,
        negativeMarking: ep.negativeMarking ? String(ep.negativeMarking).trim() : undefined,
        subjects: validSubjects.length > 0 ? validSubjects : undefined
      };
      matrix.examPattern = "verified";
    }
  }

  if (existingDbRecord?.exam_pattern && existingDbRecord.verification_status === "verified") {
    if (matrix.examPattern !== "verified") {
      validatedExam = existingDbRecord.exam_pattern;
      matrix.examPattern = "verified";
    }
  }

  // ── 4. APPLICATION INSTRUCTIONS VALIDATION ──────────────────────────────
  let validatedInstructions: string[] | null = null;
  if (Array.isArray(raw.applicationInstructions)) {
    const cleanSteps = raw.applicationInstructions
      .filter(s => typeof s === "string" && s.trim().length >= 10)
      .map(s => s.trim());
    if (cleanSteps.length >= 2) {
      validatedInstructions = cleanSteps;
      matrix.applicationInstructions = "verified";
    }
  }

  // ── 5. DOCUMENTS REQUIRED VALIDATION ────────────────────────────────────
  let validatedDocs: string[] | null = null;
  if (Array.isArray(raw.documentsRequired)) {
    const cleanDocs = raw.documentsRequired
      .filter(d => typeof d === "string" && d.trim().length >= 4)
      .map(d => d.trim());
    if (cleanDocs.length >= 1) {
      validatedDocs = cleanDocs;
      matrix.documentsRequired = "verified";
    }
  }

  // ── OVERALL VERIFICATION DECISION ───────────────────────────────────────
  matrix.rejectionReasons = rejectionReasons;

  const verifiedCount = [
    matrix.categoryDistribution === "verified",
    matrix.postWiseDetails === "verified",
    matrix.examPattern === "verified",
    matrix.applicationInstructions === "verified",
    matrix.documentsRequired === "verified"
  ].filter(Boolean).length;

  if (verifiedCount >= 2) {
    matrix.overallStatus = "verified";
  } else if (rejectionReasons.length > 0) {
    matrix.overallStatus = "conflicted";
  } else {
    matrix.overallStatus = "pending";
  }

  return {
    categoryDistribution: validatedCategory,
    postWiseDetails: validatedPosts,
    examPattern: validatedExam,
    applicationInstructions: validatedInstructions,
    documentsRequired: validatedDocs,
    fieldVerification: matrix
  };
}
