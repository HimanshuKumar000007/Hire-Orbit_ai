/**
 * Comprehensive Test Suite for Universal New-Notice Ingestion Pipeline
 * 
 * Verifies:
 * 1. Single exam date extraction
 * 2. Exam date range extraction
 * 3. Exact admit card date extraction
 * 4. Separation of Date vs Status (Date fields NEVER contain placeholder text)
 * 5. Specific Date > Generic Status (Existing exact dates are never overwritten by weaker generic statuses)
 * 6. Multi-stage date isolation (CBT-1 vs CBT-2 dates do not cross-contaminate)
 * 7. Strict chronological contradiction validation (admitCardDate <= examDate)
 */

import { extractDatesFromText, ExtractedUniversalDates } from "../lib/deep-date-extractor";
import { formatUniversalDatesObject, isPlaceholderText } from "../app/api/gov/sync/route";
import { validateNoticeDates, detectExamStage, cleanDateValue, isRealDateString } from "../lib/universal-date-normalizer";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log("==================================================================");
  console.log("RUNNING UNIVERSAL NEW-NOTICE INGESTION PIPELINE TEST SUITE");
  console.log("==================================================================\n");

  // ── TEST 1: Single Exam Date & Admit Card Extraction ─────────────────────────
  console.log("--- Test 1: Single Exam Date & Admit Card Date ---");
  {
    const title = "Public Service Commission Prelims Admit Card 2026 Out: Download Hall Ticket";
    const desc = "The preliminary examination is scheduled for 27 September 2026. Hall tickets have been made available for download from 18 September 2026.";
    const extracted = extractDatesFromText(desc, title, "2026");
    const formatted = formatUniversalDatesObject(extracted, title, "admit-card");

    assert(formatted.examDate === "27 September 2026", `Exam date should be '27 September 2026', got: ${formatted.examDate}`);
    assert(formatted.admitCardDate === "18 September 2026", `Admit card date should be '18 September 2026', got: ${formatted.admitCardDate}`);
    assert(formatted.exam_date.date === "27 September 2026", `Structured exam_date.date should be '27 September 2026', got: ${formatted.exam_date.date}`);
    assert(formatted.exam_date.status === "announced", `Structured exam_date.status should be 'announced', got: ${formatted.exam_date.status}`);
    assert(formatted.admit_card_date.date === "18 September 2026", `Structured admit_card_date.date should be '18 September 2026', got: ${formatted.admit_card_date.date}`);
    assert(formatted.admit_card_date.status === "released", `Structured admit_card_date.status should be 'released', got: ${formatted.admit_card_date.status}`);

    const val = validateNoticeDates({
      examDate: formatted.examDate,
      admitCardDate: formatted.admitCardDate
    });
    assert(val.isValid, "Validation should pass for chronological dates");
  }

  // ── TEST 2: Exam Date Range (Same Month & Cross-Month) ───────────────────────
  console.log("\n--- Test 2: Exam Date Range Extraction ---");
  {
    const title = "Railway Recruitment Board CBT Examination Schedule 2026";
    const desc = "The Computer Based Test will be conducted from 16 February 2026 to 18 February 2026 across various centers.";
    const extracted = extractDatesFromText(desc, title, "2026");
    const formatted = formatUniversalDatesObject(extracted, title, "admit-card");

    assert(formatted.examDate === "16 February 2026 – 18 February 2026", `Exam date range should be '16 February 2026 – 18 February 2026', got: ${formatted.examDate}`);
    assert(formatted.examDateFrom === "16 February 2026", `examDateFrom should be '16 February 2026', got: ${formatted.examDateFrom}`);
    assert(formatted.examDateTo === "18 February 2026", `examDateTo should be '18 February 2026', got: ${formatted.examDateTo}`);
    assert(formatted.exam_date.start === "16 February 2026", `Structured exam_date.start should match`);
    assert(formatted.exam_date.end === "18 February 2026", `Structured exam_date.end should match`);
  }

  // ── TEST 3: Separation of Date vs Status (No Placeholder in Date Fields) ──────
  console.log("\n--- Test 3: Separation of Date and Status ---");
  {
    const title = "State Police Constable Admit Card 2026 Released";
    const desc = "The written examination date has been announced by the board. Download link active now.";
    const extracted = extractDatesFromText(desc, title, "2026");
    const formatted = formatUniversalDatesObject(extracted, title, "admit-card");

    assert(formatted.examDate === null, `When exact date is absent, examDate must be null, got: ${formatted.examDate}`);
    assert(formatted.exam_date.date === null, `Structured exam_date.date must be null, got: ${formatted.exam_date.date}`);
    assert(formatted.exam_date.status === "announced", `Structured exam_date.status should be 'announced', got: ${formatted.exam_date.status}`);
    assert(formatted.admitCardDate === null, `When exact admit date is absent, admitCardDate must be null, got: ${formatted.admitCardDate}`);
    assert(formatted.admit_card_date.date === null, `Structured admit_card_date.date must be null, got: ${formatted.admit_card_date.date}`);
    assert(formatted.admit_card_date.status === "released", `Structured admit_card_date.status should be 'released', got: ${formatted.admit_card_date.status}`);

    // Verify placeholder check
    assert(!isPlaceholderText("27 September 2026"), "Real date must not be flagged as placeholder");
    assert(isPlaceholderText("Announced (Check Schedule Notice Below)"), "Placeholder text must be flagged");
    assert(isPlaceholderText("Available Now / Upcoming"), "Placeholder text must be flagged");
  }

  // ── TEST 4: Specific Date > Generic Status (Existing Exact Date Preserved) ──
  console.log("\n--- Test 4: Specific Date > Generic Status Overwrite Protection ---");
  {
    // Simulate database record with exact date
    const existingDbRecord = {
      important_dates: {
        examDate: "27 September 2026",
        admitCardDate: "18 September 2026",
        exam_date: {
          date: "27 September 2026",
          status: "announced"
        },
        admit_card_date: {
          date: "18 September 2026",
          status: "released"
        }
      }
    };

    // Incoming notice has generic status with null dates
    const incomingNoticeDates = {
      examDate: null,
      admitCardDate: null,
      exam_date: {
        date: null,
        status: "announced"
      },
      admit_card_date: {
        date: null,
        status: "released"
      }
    };

    // Apply the exact merge logic from sync route
    const oldDates = existingDbRecord.important_dates;
    const newDates = incomingNoticeDates;
    const cleanMergedDates: Record<string, any> = { ...oldDates };

    for (const k of ["startDate", "lastDate", "feeLastDate", "examDate", "examDateFrom", "examDateTo", "examDateEvidence", "admitCardDate", "admitCardEvidence", "citySlipDate", "citySlipEvidence", "resultDate", "resultDateEvidence", "stage", "stages"]) {
      if ((newDates as any)[k] && !isPlaceholderText((newDates as any)[k])) {
        cleanMergedDates[k] = (newDates as any)[k];
      } else if (isPlaceholderText(cleanMergedDates[k])) {
        cleanMergedDates[k] = null;
      }
    }

    for (const sk of ["application_begin", "application_last_date", "fee_payment_last_date", "correction_last_date", "exam_date", "city_intimation_date", "admit_card_date", "answer_key_date", "result_date"]) {
      const existingField = oldDates[sk] || {};
      const incomingField = (newDates as any)[sk] || {};
      const existingDate = existingField.date && !isPlaceholderText(existingField.date) ? existingField.date : null;
      const incomingDate = incomingField.date && !isPlaceholderText(incomingField.date) ? incomingField.date : null;
      const mergedDate = incomingDate || existingDate;

      cleanMergedDates[sk] = {
        ...existingField,
        ...incomingField,
        date: mergedDate,
        start: incomingField.start || existingField.start,
        end: incomingField.end || existingField.end,
        evidence: incomingField.evidence || existingField.evidence,
        status: incomingField.status || existingField.status || "not_announced"
      };
    }

    assert(cleanMergedDates.examDate === "27 September 2026", `Top-level examDate must remain '27 September 2026', got: ${cleanMergedDates.examDate}`);
    assert(cleanMergedDates.admitCardDate === "18 September 2026", `Top-level admitCardDate must remain '18 September 2026', got: ${cleanMergedDates.admitCardDate}`);
    assert(cleanMergedDates.exam_date.date === "27 September 2026", `Structured exam_date.date must preserve '27 September 2026', got: ${cleanMergedDates.exam_date.date}`);
    assert(cleanMergedDates.admit_card_date.date === "18 September 2026", `Structured admit_card_date.date must preserve '18 September 2026', got: ${cleanMergedDates.admit_card_date.date}`);
  }

  // ── TEST 5: Multi-Stage Isolation (CBT 1 vs CBT 2) ──────────────────────────
  console.log("\n--- Test 5: Multi-Stage Isolation ---");
  {
    const title = "RRB ALP CBT 2 Exam Date 2026 Announced";
    const desc = "The CBT 2 examination will be held from 16 February 2026 to 18 February 2026. Earlier, the CBT 1 admit card was made available on 24 July 2025.";
    
    assert(detectExamStage(title) === "cbt2", "Title must be detected as stage cbt2");
    
    const extracted = extractDatesFromText(desc, title, "2026");
    const formatted = formatUniversalDatesObject(extracted, title, "admit-card");

    assert(formatted.stage === "cbt2", `Stage must be 'cbt2', got: ${formatted.stage}`);
    assert(formatted.examDate === "16 February 2026 – 18 February 2026", `CBT-2 exam date must be '16 February 2026 – 18 February 2026', got: ${formatted.examDate}`);
    // The CBT-1 admit card date from July must NOT contaminate CBT-2 admitCardDate
    assert(formatted.admitCardDate === null, `CBT 2 admit card date should be null (not contaminated by CBT 1 July date), got: ${formatted.admitCardDate}`);
    assert(formatted.stages?.cbt1?.admitCardDate === "24 July 2025", `CBT 1 admit card date must be isolated in stages.cbt1, got: ${formatted.stages?.cbt1?.admitCardDate}`);

    const val = validateNoticeDates({
      examDate: formatted.examDate,
      examDateFrom: formatted.examDateFrom,
      admitCardDate: formatted.admitCardDate
    });
    assert(val.isValid, "Validation must pass because CBT 1 date was isolated from CBT 2");
  }

  // ── TEST 6: Strict Chronological Contradiction Validation ───────────────────
  console.log("\n--- Test 6: Strict Chronological Contradiction Validation ---");
  {
    // Impossible case: Admit card released AFTER exam date
    const valContradiction = validateNoticeDates({
      examDate: "16 February 2026 – 18 February 2026",
      examDateFrom: "16 February 2026",
      admitCardDate: "24 July 2026" // 5 months after exam!
    });

    assert(!valContradiction.isValid, "Chronological contradiction (admit card after exam) must be flagged as INVALID");
    assert(valContradiction.errors.some(e => e.includes("Admit card release date")), "Errors list must specify admit card release date issue");

    // Impossible case: Result released BEFORE exam date
    const valResultContradiction = validateNoticeDates({
      examDate: "20 October 2026",
      ...({ resultDate: "10 September 2026" } as any)
    });
    assert(!valResultContradiction.isValid, "Result before exam must be flagged as INVALID");
  }

  console.log("\n==================================================================");
  console.log("ALL 6 INGESTION PIPELINE SUITES PASSED FLAWLESSLY!");
  console.log("==================================================================");
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
