/**
 * Comprehensive 10-Scenario Universal Date Extraction, Normalization & Rendering Test Suite
 *
 * Verifies that the universal date normalization pipeline separates dates from statuses,
 * handles single dates, date ranges, sentence-based mentions, and fallback statuses
 * with ZERO exam-specific hardcoding.
 */

import { normalizeGovernmentNoticeDates, cleanDateValue, isRealDateString } from '../lib/universal-date-normalizer';
import { deriveUniversalNoticeDates } from '../lib/universal-notice-model';

interface ScenarioResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: ScenarioResult[] = [];

function assert(scenario: string, condition: boolean, message: string) {
  if (condition) {
    results.push({ name: scenario, passed: true, details: message });
    console.log(`  ✓ PASSED: ${scenario} - ${message}`);
  } else {
    results.push({ name: scenario, passed: false, details: message });
    console.error(`  ✗ FAILED: ${scenario} - ${message}`);
  }
}

console.log('========================================================================================');
console.log('  HIREORBITAI: 10-SCENARIO UNIVERSAL DATE NORMALIZATION VERIFICATION SUITE');
console.log('========================================================================================\n');

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 1: Exact "Exam Date:" Format in Database
// ─────────────────────────────────────────────────────────────────────────────
console.log('─── Scenario 1: Exact "Exam Date:" Field from Database ───');
{
  const rawDates = {
    examDate: '27 September 2026',
    admitCardDate: '18 September 2026'
  };
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'Combined Competitive Examination 2026',
    type: 'admit-card'
  });

  assert('Scenario 1 - Exam Date', norm.examDate === '27 September 2026', `Got: ${norm.examDate}`);
  assert('Scenario 1 - Exam Status', norm.examDateStatus === 'confirmed', `Got: ${norm.examDateStatus}`);
  assert('Scenario 1 - Admit Card Date', norm.admitCardDate === '18 September 2026', `Got: ${norm.admitCardDate}`);
  assert('Scenario 1 - Admit Status', norm.admitCardStatus === 'released', `Got: ${norm.admitCardStatus}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 2: Sentence-Based Exam Date in Title / Context
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 2: Sentence-Based Date ("exam on September 27") ───');
{
  const rawDates = { examDate: null };
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'State Commission Group 1 hall ticket 2026 out; exam on September 27',
    type: 'admit-card'
  });

  assert('Scenario 2 - Extracted Exam Date', norm.examDate === '27 September 2026', `Extracted: ${norm.examDate}`);
  assert('Scenario 2 - Exam Status', norm.examDateStatus === 'confirmed', `Got: ${norm.examDateStatus}`);
  assert('Scenario 2 - Source Attribution', norm.models.examDate.source === 'notice_text', `Source: ${norm.models.examDate.source}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 3: Numeric DD/MM/YYYY Format
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 3: Numeric DD/MM/YYYY Format ───');
{
  const rawDates = { examDate: '15/11/2026' };
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'Recruitment Examination 2026',
    type: 'job'
  });

  assert('Scenario 3 - Numeric Date Preserved', norm.examDate === '15/11/2026', `Got: ${norm.examDate}`);
  assert('Scenario 3 - Real Date Check', isRealDateString(norm.examDate), 'Validated as authentic date');
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 4: Month-Name Format ("14 October 2026")
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 4: Standard Month-Name Format ───');
{
  const rawDates = {
    applicationStart: '10 January 2026',
    applicationLastDate: '10 February 2026',
    feeLastDate: '11 February 2026'
  };
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'Executive Trainee Recruitment 2026',
    type: 'job'
  });

  assert('Scenario 4 - App Start', norm.applicationStart === '10 January 2026', `Got: ${norm.applicationStart}`);
  assert('Scenario 4 - App End', norm.applicationLastDate === '10 February 2026', `Got: ${norm.applicationLastDate}`);
  assert('Scenario 4 - Fee Date', norm.feeLastDate === '11 February 2026', `Got: ${norm.feeLastDate}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 5: Admit-Card Release Statement
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 5: Admit-Card Release Statement in Article ───');
{
  const rawDates = {};
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'National Level CBT Admit Card 2026',
    summary: 'Central Railway Recruitment CBT 2 Admit Card has been released on September 13, 2026 for all registered candidates.',
    type: 'admit-card'
  });

  assert('Scenario 5 - Extracted Admit Card Date', norm.admitCardDate === '13 September 2026', `Extracted: ${norm.admitCardDate}`);
  assert('Scenario 5 - Admit Card Status', norm.admitCardStatus === 'released', `Got: ${norm.admitCardStatus}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 6: Application Start & End Dates with Status
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 6: Application Start & End Deadlines ───');
{
  const rawDates = {
    startDate: '01 March 2026',
    lastDate: '31 March 2026'
  };
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'Graduate Assistant Recruitment 2026',
    type: 'job'
  });

  assert('Scenario 6 - Start Date', norm.applicationStart === '01 March 2026', `Got: ${norm.applicationStart}`);
  assert('Scenario 6 - Last Date', norm.applicationLastDate === '31 March 2026', `Got: ${norm.applicationLastDate}`);
  assert('Scenario 6 - Status Model', norm.models.applicationEnd.status !== undefined, `Status: ${norm.models.applicationEnd.status}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 7: Missing Date (Clean Null + Sensible Status Fallback)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 7: Missing Date with Sensible Status Fallback ───');
{
  // Simulating previous bad data where UI sentences were stored
  const rawDates = {
    examDate: 'Announced (Check Schedule Notice Below)',
    admitCardDate: 'Available Now / Upcoming',
    lastDate: 'Registration Window Closed',
    startDate: 'Advt Released (Completed)'
  };
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'Assistant Professor Recruitment Examination',
    type: 'admit-card',
    badgeStatus: 'Admit Card Out'
  });

  // Strict: DATE VALUES MUST BE NULL, NOT PLACEHOLDER STRINGS
  assert('Scenario 7 - Exam Date Clean Null', norm.examDate === null, `Exam date must be null, got: ${norm.examDate}`);
  assert('Scenario 7 - Admit Card Date Clean Null', norm.admitCardDate === null, `Admit date must be null, got: ${norm.admitCardDate}`);
  assert('Scenario 7 - Start Date Clean Null', norm.applicationStart === null, `Start date must be null, got: ${norm.applicationStart}`);
  assert('Scenario 7 - Last Date Clean Null', norm.applicationLastDate === null, `Last date must be null, got: ${norm.applicationLastDate}`);

  // Machine status and human label preserved cleanly
  assert('Scenario 7 - Sensible Exam Status', norm.examDateStatus === 'announced', `Got: ${norm.examDateStatus}`);
  assert('Scenario 7 - Sensible Admit Status', norm.admitCardStatus === 'released', `Got: ${norm.admitCardStatus}`);
  assert('Scenario 7 - Clean User Status Label', norm.models.admitCardDate.statusLabel === 'Available Now', `Got: ${norm.models.admitCardDate.statusLabel}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 8: "To Be Announced" / "Notified Soon"
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 8: "To Be Announced" Text Handling ───');
{
  const rawDates = {
    examDate: 'To be announced later'
  };
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'New Service Examination 2026',
    type: 'job'
  });

  assert('Scenario 8 - Date Value is Null', norm.examDate === null, `Got: ${norm.examDate}`);
  assert('Scenario 8 - Status is Not Announced', norm.examDateStatus === 'not_announced', `Got: ${norm.examDateStatus}`);
  assert('Scenario 8 - Status Label is TBA', norm.models.examDate.statusLabel === 'To Be Announced', `Got: ${norm.models.examDate.statusLabel}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 9: Multiple Dates in One Notice / Date Range
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 9: Multi-Date Range ("September 9 and 10", "December 12 & 13") ───');
{
  // UGC NET style: same month range
  const ugcNotice = normalizeGovernmentNoticeDates({}, {
    title: 'UGC NET June 2026 admit card out for September 9 and 10 re-examination',
    type: 'admit-card'
  });
  assert('Scenario 9A - Same Month Range', ugcNotice.examDate === '9 September 2026 – 10 September 2026', `Got: ${ugcNotice.examDate}`);
  assert('Scenario 9A - Range From', ugcNotice.examDateFrom === '9 September 2026', `Got: ${ugcNotice.examDateFrom}`);
  assert('Scenario 9A - Range To', ugcNotice.examDateTo === '10 September 2026', `Got: ${ugcNotice.examDateTo}`);

  // CTET style: ampersand range ("December 12 & 13")
  const ctetNotice = normalizeGovernmentNoticeDates({}, {
    title: 'CTET 2026 Exam Date Out: 22nd Edition to Be Held on December 12 & 13',
    type: 'admit-card'
  });
  assert('Scenario 9B - Ampersand Range', ctetNotice.examDate === '12 December 2026 – 13 December 2026', `Got: ${ctetNotice.examDate}`);

  // MP Police style: cross-month range ("from 23 February 2026 to 13 March 2026")
  const policeNotice = normalizeGovernmentNoticeDates({}, {
    title: 'Police Constable Physical Test 2026',
    summary: 'Physical efficiency test conducted from 23 February 2026 to 13 March 2026 at designated state centers.',
    type: 'admit-card'
  });
  assert('Scenario 9C - Cross Month Range', policeNotice.examDate === '23 February 2026 – 13 March 2026', `Got: ${policeNotice.examDate}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 10: Mixed Date Text (Metadata publication vs actual exam/release)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n─── Scenario 10: Mixed Text (Article timestamp vs Exam date) ───');
{
  const rawDates = {};
  const norm = normalizeGovernmentNoticeDates(rawDates, {
    title: 'Combined Exam 2026 Update',
    summary: 'Published on 14 Sep 2026 by Web Correspondent. The commission announced that the exam is scheduled for October 25, 2026.',
    type: 'job'
  });

  assert('Scenario 10 - Ignores Published Timestamp', norm.examDate === '25 October 2026', `Extracted: ${norm.examDate}`);
  assert('Scenario 10 - Does not confuse metadata with release', norm.admitCardDate === null, `Admit date: ${norm.admitCardDate}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n========================================================================================');
const total = results.length;
const passed = results.filter(r => r.passed).length;
const failed = total - passed;
console.log(`  TEST RESULTS: ${passed} / ${total} ASSERTIONS PASSED (${failed} FAILED)`);
console.log('========================================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('  ALL 10 UNIVERSAL DATE SCENARIOS VERIFIED SUCCESSFULLY!\n');
}
