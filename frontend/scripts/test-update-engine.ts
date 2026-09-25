/**
 * test-update-engine.ts
 *
 * Verifies Phase 5 Production Freshness & Universal Notice Update Engine:
 * 1. ACTION_CREATE: Fresh notice gets created with initial audit log & timestamps
 * 2. ACTION_UPDATE: Field changes generate precise diffs and append to change history
 * 3. ACTION_NOOP: Identical crawl produces ACTION_NOOP without unnecessary writes
 * 4. FieldConfidenceStatus: Validates EXACT, INFERRED, and MISSING (clean null) states
 * 5. Audit History Capping: Ensures change_history stays sorted and capped to maxHistory
 */

import { diffNoticeFields, appendChangeHistory, createInitialNoticeLog } from "../lib/notice-audit-engine";
import { classifyFieldState } from "../lib/universal-notice-model";

function runTests() {
  console.log("==================================================");
  console.log("RUNNING PRODUCTION UPDATE ENGINE & AUDIT TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  function assert(desc: string, condition: boolean, details?: any) {
    total++;
    if (condition) {
      console.log(`✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${desc}`, details !== undefined ? details : "");
    }
  }

  // ── TEST 1: Initial Discovery (ACTION_CREATE) ──
  console.log("--- TEST 1: ACTION_CREATE Initial Audit Log ---");
  const initLog = createInitialNoticeLog("RRB NTPC Recruitment 2026", "Sarkari Result");
  assert("Initial log has 1 entry", initLog.length === 1);
  assert("Initial log field is notice_created", initLog[0].field === "notice_created");
  assert("Initial log oldValue is null", initLog[0].oldValue === null);
  assert("Initial log newValue is Indexed", initLog[0].newValue === "Indexed");

  // ── TEST 2: Existing Match with Exam Date Announced (ACTION_UPDATE) ──
  console.log("\n--- TEST 2: ACTION_UPDATE Exam Date & Fee ---");
  const existingNotice = {
    id: "auto-12345",
    slug: "rrb-ntpc-recruitment-2026",
    title: "RRB NTPC Recruitment 2026",
    badge_status: "Applications Open",
    important_dates: {
      startDate: "15 June 2026",
      lastDate: "15 July 2026",
      examDate: null,
      admitCardDate: null,
      change_history: initLog
    },
    application_fee: { generalOBC: "See Notification", scStPh: "See Notification", female: "See Notification" },
    age_limit: "18 - 40 Years (as per category)",
    vacancies: "See Notification"
  };

  const incomingParsed = {
    badge_status: "Exam Date Announced",
    important_dates: {
      startDate: "15 June 2026",
      lastDate: "15 July 2026",
      examDate: "27 September 2026",
      admitCardDate: "18 September 2026"
    },
    application_fee: { generalOBC: "₹500/-", scStPh: "₹250/-", female: "₹250/-" },
    age_limit: "18 - 30 Years (as on 01/07/2026)",
    vacancies: "11558"
  };

  const diffResult = diffNoticeFields(
    existingNotice,
    incomingParsed,
    "Sarkari Result",
    "https://www.sarkariresult.com/2026/rrb-ntpc"
  );

  assert("Action is ACTION_UPDATE", diffResult.action === "ACTION_UPDATE");
  assert("hasChanges is true", diffResult.hasChanges === true);
  assert("Detects examDate change", diffResult.changes.some(c => c.field === "examDate" && c.newValue === "27 September 2026"));
  assert("Detects admitCardDate change", diffResult.changes.some(c => c.field === "admitCardDate" && c.newValue === "18 September 2026"));
  assert("Detects badge_status change", diffResult.changes.some(c => c.field === "badge_status" && c.newValue === "Exam Date Announced"));
  assert("Detects vacancies change", diffResult.changes.some(c => c.field === "vacancies" && c.newValue === "11558"));
  assert("Detects application_fee change", diffResult.changes.some(c => c.field === "application_fee" && c.newValue === "₹500/-"));
  assert("Detects age_limit change", diffResult.changes.some(c => c.field === "age_limit" && c.newValue === "18 - 30 Years (as on 01/07/2026)"));

  // ── TEST 3: Duplicate Crawl with No Changes (ACTION_NOOP) ──
  console.log("\n--- TEST 3: ACTION_NOOP for Identical Data ---");
  const identicalIncoming = {
    badge_status: "Exam Date Announced",
    important_dates: {
      startDate: "15 June 2026",
      lastDate: "15 July 2026",
      examDate: "27 September 2026",
      admitCardDate: "18 September 2026"
    },
    application_fee: { generalOBC: "₹500/-", scStPh: "₹250/-", female: "₹250/-" },
    age_limit: "18 - 30 Years (as on 01/07/2026)",
    vacancies: "11558"
  };

  // Compare notice already having the updated data with identical incoming data
  const updatedNotice = {
    ...existingNotice,
    badge_status: "Exam Date Announced",
    important_dates: incomingParsed.important_dates,
    application_fee: incomingParsed.application_fee,
    age_limit: incomingParsed.age_limit,
    vacancies: incomingParsed.vacancies
  };

  const noopResult = diffNoticeFields(
    updatedNotice,
    identicalIncoming,
    "Sarkari Result",
    "https://www.sarkariresult.com/2026/rrb-ntpc"
  );

  assert("Action is ACTION_NOOP", noopResult.action === "ACTION_NOOP");
  assert("hasChanges is false", noopResult.hasChanges === false);
  assert("Changes list is empty", noopResult.changes.length === 0);

  // ── TEST 4: Audit History Management & Capping ──
  console.log("\n--- TEST 4: Audit History Capping ---");
  const mergedHistory = appendChangeHistory(existingNotice.important_dates.change_history, diffResult.changes, 5);
  assert("History merged successfully", mergedHistory.length > 1);
  assert("History is capped to 5 entries", mergedHistory.length <= 5);
  // First item must be the newest
  assert("Newest entry is first in history", new Date(mergedHistory[0].timestamp).getTime() >= new Date(mergedHistory[mergedHistory.length - 1].timestamp).getTime());

  // ── TEST 5: FieldConfidenceStatus Classification ──
  console.log("\n--- TEST 5: Field Confidence States ---");
  const exactDate = classifyFieldState("27 September 2026", "Official Exam Notice");
  assert("Exact date classified as EXACT", exactDate.status === "EXACT");
  assert("Exact date value is preserved", exactDate.value === "27 September 2026");
  assert("Exact date confidence >= 0.9", exactDate.confidence >= 0.9);

  const missingDate = classifyFieldState(null);
  assert("Null date classified as MISSING", missingDate.status === "MISSING");
  assert("Missing date value is null", missingDate.value === null);
  assert("Missing date confidence is 0", missingDate.confidence === 0);

  const placeholderDate = classifyFieldState("To Be Announced");
  assert("Placeholder string classified as MISSING (null)", placeholderDate.status === "MISSING" && placeholderDate.value === null);

  const inferredDate = classifyFieldState("15 October 2026", "Inferred from month schedule", true);
  assert("Inferred date classified as INFERRED", inferredDate.status === "INFERRED");
  assert("Inferred date confidence is 0.7", inferredDate.confidence === 0.7);

  console.log(`\n==================================================`);
  console.log(`RESULTS: ${passed} / ${total} tests passed.`);
  console.log(`==================================================`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
