import { validateAndAuditAiExtraction } from "../lib/logic-validation-engine";
import { isOfficialGovDomain, computeDocumentHash, resolveOfficialAuthority } from "../lib/official-pdf-resolver";
import { extractTextFromPdfBuffer } from "../lib/pdf-text-extractor";
import { RawAiExtractionResult } from "../lib/ai-recruitment-extractor";

async function runPhase3BTests() {
  console.log("==================================================");
  console.log("PHASE 3B AI ENRICHMENT & LOGIC VALIDATION TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name} - ${details || "Assertion failed"}`);
      failed++;
    }
  }

  // ── TEST 1: Recruitment with Category Table (Valid Arithmetic Sum) ──
  const rawCatValid: RawAiExtractionResult = {
    categoryDistribution: {
      ur: 400,
      obc: 250,
      sc: 150,
      st: 100,
      ews: 100,
      total: 1000 // 400 + 250 + 150 + 100 + 100 = 1000
    }
  };
  const result1 = validateAndAuditAiExtraction(rawCatValid);
  assert(
    "Scenario 1: Valid category sum passes validation",
    result1.fieldVerification.categoryDistribution === "verified" && result1.categoryDistribution !== null,
    `Status: ${result1.fieldVerification.categoryDistribution}`
  );

  // ── TEST 2: Recruitment with Post-Wise Table ──
  const rawPostValid: RawAiExtractionResult = {
    postWiseDetails: [
      { postName: "Assistant Section Officer", department: "Ministry of External Affairs", vacancies: 450, payScale: "Level 7" },
      { postName: "Income Tax Inspector", department: "CBDT", vacancies: 550, payScale: "Level 7" }
    ]
  };
  const result2 = validateAndAuditAiExtraction(rawPostValid, { vacancies: "1000 Posts" });
  assert(
    "Scenario 2: Valid post-wise specs pass validation",
    result2.fieldVerification.postWiseDetails === "verified" && (result2.postWiseDetails?.length || 0) === 2
  );

  // ── TEST 3: Recruitment with Exam Pattern ──
  const rawExamValid: RawAiExtractionResult = {
    examPattern: {
      tierName: "Tier-1 Computer Based Test",
      mode: "Online CBT",
      totalQuestions: 100,
      totalMarks: 200,
      duration: "60 minutes",
      negativeMarking: "0.50 marks",
      subjects: [
        { name: "General Intelligence & Reasoning", questions: 25, marks: 50 },
        { name: "General Awareness", questions: 25, marks: 50 },
        { name: "Quantitative Aptitude", questions: 25, marks: 50 },
        { name: "English Comprehension", questions: 25, marks: 50 }
      ]
    }
  };
  const result3 = validateAndAuditAiExtraction(rawExamValid);
  assert(
    "Scenario 3: Valid exam pattern passes validation",
    result3.fieldVerification.examPattern === "verified" && result3.examPattern?.totalQuestions === 100
  );

  // ── TEST 4: Recruitment with All Structured Fields ──
  const rawAllValid: RawAiExtractionResult = {
    ...rawCatValid,
    ...rawPostValid,
    ...rawExamValid,
    applicationInstructions: [
      "Visit official website and register on One Time Registration (OTR) portal",
      "Fill online application form and select post preferences",
      "Upload scanned photograph and signature in prescribed dimensions",
      "Pay application fee online and print final acknowledgment slip"
    ],
    documentsRequired: [
      "Recent passport-size color photograph with date stamp",
      "Scanned signature in black ink",
      "Class 10th (Matriculation) Certificate for Date of Birth proof",
      "Graduation Degree Certificate / Marksheets"
    ]
  };
  const result4 = validateAndAuditAiExtraction(rawAllValid);
  assert(
    "Scenario 4: Complete recruitment with all fields verified",
    result4.fieldVerification.overallStatus === "verified" &&
    result4.fieldVerification.applicationInstructions === "verified" &&
    result4.fieldVerification.documentsRequired === "verified"
  );

  // ── TEST 5: Recruitment with Missing Tables ──
  const rawMissing: RawAiExtractionResult = {};
  const result5 = validateAndAuditAiExtraction(rawMissing);
  assert(
    "Scenario 5: Missing tables remain null/pending without breaking",
    result5.categoryDistribution === null &&
    result5.postWiseDetails === null &&
    result5.examPattern === null &&
    result5.fieldVerification.overallStatus === "pending"
  );

  // ── TEST 6: Scanned PDF / Binary Extraction ──
  const fakeScannedPdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF");
  const scanResult = extractTextFromPdfBuffer(fakeScannedPdfBuffer);
  assert(
    "Scenario 6: Scanned PDF detected, triggers vision fallback requirement",
    scanResult.isScanned && scanResult.method === "vision_fallback_required"
  );

  // ── TEST 7: Conflicting Data (AI vs Database) ──
  // Existing database has verified category distribution. AI extraction produces conflict.
  const existingVerifiedDb = {
    verification_status: "verified",
    vacancies: "1,000 Posts",
    category_distribution: { ur: "400", obc: "250", sc: "150", st: "100", ews: "100", total: "1,000" }
  };
  const rawConflict: RawAiExtractionResult = {
    categoryDistribution: {
      ur: 999, // Conflicting hallucination
      obc: 50,
      total: 5000 // Mismatch
    }
  };
  const result7 = validateAndAuditAiExtraction(rawConflict, existingVerifiedDb);
  assert(
    "Scenario 7: Conflicting AI values rejected; verified DB record preserved",
    result7.categoryDistribution?.total === "1,000" && result7.fieldVerification.rejectionReasons.length > 0
  );

  // ── TEST 8: Invalid Extracted Vacancy (Arithmetic Mismatch) ──
  const rawBadSum: RawAiExtractionResult = {
    categoryDistribution: {
      ur: 500,
      obc: 300,
      sc: 200,
      st: 100,
      ews: 100,
      total: 9999 // Mismatch: 500+300+200+100+100 = 1200 ≠ 9999
    }
  };
  const result8 = validateAndAuditAiExtraction(rawBadSum);
  assert(
    "Scenario 8: Category sum mismatch rejected completely (categoryDistribution = null)",
    result8.categoryDistribution === null && result8.fieldVerification.categoryDistribution === "rejected"
  );

  // ── TEST 9: Invalid Exam Negative Numbers / Bad Markings ──
  const rawBadExam: RawAiExtractionResult = {
    examPattern: {
      tierName: "Corrupted Tier",
      mode: "Offline",
      totalQuestions: -50, // Impossible negative number
      totalMarks: -100
    }
  };
  const result9 = validateAndAuditAiExtraction(rawBadExam);
  assert(
    "Scenario 9: Negative/invalid exam values rejected",
    result9.examPattern === null && result9.fieldVerification.examPattern === "rejected"
  );

  // ── TEST 10: Updated Official PDF / Document Hashing ──
  const pdfVersion1 = Buffer.from("Official Gazette Version 1: 500 Vacancies");
  const pdfVersion2 = Buffer.from("Official Gazette Version 2: 750 Vacancies (Corrigendum)");

  const hash1 = computeDocumentHash(pdfVersion1);
  const hash2 = computeDocumentHash(pdfVersion2);

  assert(
    "Scenario 10: Document hash detects updated official notification PDF",
    hash1 !== hash2 && hash1.length === 64 && hash2.length === 64
  );

  // ── TEST 11: Official Domain Verification ──
  assert("SSC portal recognized as official gov domain", isOfficialGovDomain("https://ssc.gov.in/notices/cgl.pdf"));
  assert("Aggregator Sarkari Result rejected as official domain", !isOfficialGovDomain("https://sarkariresult.com/pdf"));

  console.log("==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runPhase3BTests().catch(err => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
