/**
 * test-sarkari-result-parser.ts
 *
 * Comprehensive test suite verifying that parseSarkariResultHtml extracts:
 * 1. Important Dates (Application Begin, Last Date, Fee Date, Correction, Exam Date, Admit Card)
 * 2. Application Fee (General/OBC, SC/ST, Female, Payment Mode)
 * 3. Age Limit (Min, Max, As-on Date, Formatted summary)
 * 4. Qualification & Level (Graduate, 12th, 10th, etc.)
 * 5. Vacancy Count
 * 6. Direct Official Links (Apply Online, Notification PDF, Official Website)
 */

import { parseSarkariResultHtml } from "../lib/sarkari-result-parser";

const SAMPLE_RECRUITMENT_HTML = `
<!DOCTYPE html>
<html>
<head><title>UP Police Constable Recruitment 2026 Online Form - Sarkari Result</title></head>
<body>
  <h1>Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)</h1>
  <h2>UP Police Constable Recruitment 2026</h2>
  <div class="post">
    <table>
      <tr>
        <td>
          <h3>Important Dates</h3>
          <ul>
            <li>Application Begin : <b>15/07/2026</b></li>
            <li>Last Date for Apply Online : <b>14/08/2026</b></li>
            <li>Pay Exam Fee Last Date : <b>15/08/2026</b></li>
            <li>Correction Date : <b>16-18 August 2026</b></li>
            <li>Exam Date : <b>20-25 October 2026</b></li>
            <li>Admit Card Available : <b>10/10/2026</b></li>
            <li>Answer Key Available : <b>05/11/2026</b></li>
            <li>Result Declared : <b>20/12/2026</b></li>
          </ul>
        </td>
        <td>
          <h3>Application Fee</h3>
          <ul>
            <li>General / OBC : <b>₹ 400/-</b></li>
            <li>SC / ST : <b>₹ 400/-</b></li>
            <li>All Category Female : <b>₹ 400/-</b></li>
            <li>Pay the Examination Fee Through Cast at E Challan or Debit Card, Credit Card, Net Banking</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h3>UP Police Constable Age Limit as on 01/07/2026</h3>
          <ul>
            <li>Minimum Age : <b>18 Years.</b></li>
            <li>Maximum Age : <b>25 Years for Male.</b></li>
            <li>Maximum Age : <b>28 Years for Female.</b></li>
            <li>Age Relaxation Extra as per UPPRPB Constable Rules.</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h3>Vacancy Details Total : 19,500 Post</h3>
          <p>Eligibility: 10+2 Intermediate Exam in Any Recognized Board in India.</p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h3>Some Useful Important Links</h3>
          <p><a href="https://uppbpb.gov.in/apply-constable-2026">Apply Online</a></p>
          <p><a href="https://uppbpb.gov.in/notices/constable-notification-2026.pdf">Download Notification</a></p>
          <p><a href="https://uppbpb.gov.in">Official Website</a></p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

const SAMPLE_ADMIT_CARD_HTML = `
<!DOCTYPE html>
<html>
<head><title>SSC CGL Tier 1 Admit Card 2026 - Sarkari Result</title></head>
<body>
  <h1>Staff Selection Commission (SSC)</h1>
  <h2>Combined Graduate Level CGL Examination 2026</h2>
  <table>
    <tr>
      <td>
        <h3>Important Dates</h3>
        <ul>
          <li>Application Begin : <b>24/06/2026</b></li>
          <li>Last Date for Apply Online : <b>27/07/2026</b></li>
          <li>Tier I Exam Date : <b>09-26 September 2026</b></li>
          <li>Admit Card Available : <b>02/09/2026</b></li>
        </ul>
      </td>
      <td>
        <h3>Application Fee</h3>
        <ul>
          <li>General / OBC / EWS : <b>100/-</b></li>
          <li>SC / ST / PH : <b>0/-</b></li>
          <li>All Category Female : <b>0/- (Exempted)</b></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <a href="https://ssc.gov.in/login">Apply Online</a>
        <a href="https://ssc.gov.in/notices/cgl_notice_2026.pdf">Download Notification</a>
        <a href="https://ssc.gov.in">Official Website</a>
      </td>
    </tr>
  </table>
</body>
</html>
`;

function runTests() {
  console.log("==================================================");
  console.log("RUNNING SARKARI RESULT PARSER TEST SUITE");
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

  // ── TEST 1: Recruitment Full Notice Parsing ──
  console.log("--- TEST 1: Recruitment / Job Notice ---");
  const parsed1 = parseSarkariResultHtml(SAMPLE_RECRUITMENT_HTML);

  assert("Identifies Sarkari Result layout", parsed1.isSarkariLayout === true);
  assert("Extracts startDate correctly", parsed1.importantDates.startDate === "15 July 2026", parsed1.importantDates.startDate);
  assert("Extracts lastDate correctly", parsed1.importantDates.lastDate === "14 August 2026", parsed1.importantDates.lastDate);
  assert("Extracts feeLastDate correctly", parsed1.importantDates.feeLastDate === "15 August 2026", parsed1.importantDates.feeLastDate);
  assert("Extracts correction window correctly", parsed1.importantDates.correctionLastDate === "18 August 2026", parsed1.importantDates.correctionLastDate);
  assert("Extracts examDate range correctly", parsed1.importantDates.examDate === "20 October 2026 – 25 October 2026", parsed1.importantDates.examDate);
  assert("Extracts admitCardDate correctly", parsed1.importantDates.admitCardDate === "10 October 2026", parsed1.importantDates.admitCardDate);
  assert("Extracts answerKeyDate correctly", parsed1.importantDates.answerKeyDate === "5 November 2026", parsed1.importantDates.answerKeyDate);
  assert("Extracts resultDate correctly", parsed1.importantDates.resultDate === "20 December 2026", parsed1.importantDates.resultDate);

  assert("Extracts General/OBC Fee", parsed1.applicationFee.generalOBC === "₹400/-", parsed1.applicationFee.generalOBC);
  assert("Extracts SC/ST Fee", parsed1.applicationFee.scStPh === "₹400/-", parsed1.applicationFee.scStPh);
  assert("Extracts Female Fee", parsed1.applicationFee.female === "₹400/-", parsed1.applicationFee.female);

  assert("Extracts Min Age", parsed1.ageLimit.minAge === "18 Years", parsed1.ageLimit.minAge);
  assert("Extracts Max Age", parsed1.ageLimit.maxAge === "25 Years", parsed1.ageLimit.maxAge);
  assert("Extracts As-on Date", parsed1.ageLimit.asOnDate === "1 July 2026", parsed1.ageLimit.asOnDate);

  assert("Extracts Vacancies", parsed1.vacancies === "19500", parsed1.vacancies);
  assert("Extracts Qualification", parsed1.qualification?.includes("10+2 Intermediate") === true, parsed1.qualification);
  assert("Classifies Qualification Level as 12th", parsed1.qualificationLevel === "12th", parsed1.qualificationLevel);

  assert("Extracts Apply Online link", parsed1.officialLinks.applyOnlineUrl === "https://uppbpb.gov.in/apply-constable-2026", parsed1.officialLinks.applyOnlineUrl);
  assert("Extracts Notification PDF link", parsed1.officialLinks.notificationPdfUrl === "https://uppbpb.gov.in/notices/constable-notification-2026.pdf", parsed1.officialLinks.notificationPdfUrl);
  assert("Extracts Official Website link", parsed1.officialLinks.officialWebsiteUrl === "https://uppbpb.gov.in", parsed1.officialLinks.officialWebsiteUrl);

  // ── TEST 2: Admit Card Notice Parsing ──
  console.log("\n--- TEST 2: Admit Card Notice ---");
  const parsed2 = parseSarkariResultHtml(SAMPLE_ADMIT_CARD_HTML);

  assert("Extracts SSC examDate range", parsed2.importantDates.examDate === "9 September 2026 – 26 September 2026", parsed2.importantDates.examDate);
  assert("Extracts SSC admitCardDate", parsed2.importantDates.admitCardDate === "2 September 2026", parsed2.importantDates.admitCardDate);
  assert("Extracts SSC General Fee", parsed2.applicationFee.generalOBC === "₹100/-", parsed2.applicationFee.generalOBC);
  assert("Extracts SSC SC/ST Free/Exempted", parsed2.applicationFee.scStPh === "₹0 (Exempted)", parsed2.applicationFee.scStPh);
  assert("Extracts SSC Female Free/Exempted", parsed2.applicationFee.female === "₹0 (Exempted)", parsed2.applicationFee.female);

  // ── TEST 3: Bihar BTSC State Fee Parsing ──
  console.log("\n--- TEST 3: Bihar BTSC Notice Fee Parsing ---");
  const SAMPLE_BTSC_HTML = `
  <table>
    <tr>
      <td><h3>Important Dates</h3><ul><li>Application Begin : <b>24/09/2026</b></li></ul></td>
      <td>
        <h3>Application Fee</h3>
        <ul>
          <li>General / BC/ Other State : <b>100/-</b></li>
          <li>SC / ST / PH : <b>100/-</b></li>
          <li>Female Candidate (Bihar Dom.) : <b>100/-</b></li>
          <li>Pay the Exam Fee Through Online / Offline Fee Mode Only</li>
        </ul>
      </td>
    </tr>
  </table>
  `;
  const parsed3 = parseSarkariResultHtml(SAMPLE_BTSC_HTML);
  assert("Extracts BTSC General/BC/Other State Fee", parsed3.applicationFee.generalOBC === "₹100/-", parsed3.applicationFee.generalOBC);
  assert("Extracts BTSC SC/ST/PH Fee", parsed3.applicationFee.scStPh === "₹100/-", parsed3.applicationFee.scStPh);
  assert("Extracts BTSC Female (Bihar Dom) Fee", parsed3.applicationFee.female === "₹100/-", parsed3.applicationFee.female);

  // ── TEST 4: MPESB SI Fee Parsing ──
  console.log("\n--- TEST 4: MPESB SI Fee Parsing ---");
  const SAMPLE_MPESB_HTML = `
  <table>
    <tr>
      <td><h3>Important Dates</h3><ul><li>Application Begin : <b>09/09/2026</b></li></ul></td>
      <td>
        <h3>Application Fee</h3>
        <ul>
          <li>General / Other State : <b>560/-</b></li>
          <li>OBC / SC / ST : <b>310/-</b></li>
          <li>Portal Charges: Rs. 60/- (Include)</li>
          <li>Pay the Examination Fee Through Cast at E Challan or Debit Card, Credit Card, Net Banking</li>
        </ul>
      </td>
    </tr>
  </table>
  `;
  const parsed4 = parseSarkariResultHtml(SAMPLE_MPESB_HTML);
  assert("Extracts MPESB General/Other State Fee", parsed4.applicationFee.generalOBC === "₹560/-", parsed4.applicationFee.generalOBC);
  assert("Extracts MPESB OBC/SC/ST Fee", parsed4.applicationFee.scStPh === "₹310/-", parsed4.applicationFee.scStPh);

  // ── TEST 5: Patna High Court Multi-Category Fee Parsing ──
  console.log("\n--- TEST 5: Patna High Court Fee Parsing ---");
  const SAMPLE_PATNA_HTML = `
  <table>
    <tr>
      <td><h3>Important Dates</h3><ul><li>Application Begin : <b>15/07/2026</b></li></ul></td>
      <td>
        <h3>Application Fee</h3>
        <ul>
          <li>General / BC / EBC / EWS : <b>1500/-</b></li>
          <li>SC / ST / PH : <b>750/-</b></li>
          <li>Pay the Exam Fee Through Online / Offline Fee Mode Only</li>
        </ul>
      </td>
    </tr>
  </table>
  `;
  const parsed5 = parseSarkariResultHtml(SAMPLE_PATNA_HTML);
  assert("Extracts Patna HC General/BC/EBC/EWS Fee", parsed5.applicationFee.generalOBC === "₹1500/-", parsed5.applicationFee.generalOBC);
  assert("Extracts Patna HC SC/ST/PH Fee", parsed5.applicationFee.scStPh === "₹750/-", parsed5.applicationFee.scStPh);

  // ── TEST 6: Zero Fee / Exempted Notice Parsing ──
  console.log("\n--- TEST 6: Free Form / Zero Fee Parsing ---");
  const SAMPLE_FREE_HTML = `
  <table>
    <tr>
      <td><h3>Important Dates</h3><ul><li>Application Begin : <b>01/08/2026</b></li></ul></td>
      <td>
        <h3>Application Fee</h3>
        <ul>
          <li>No Application Fee for All Candidates : <b>0/-</b></li>
          <li>Only Registration Done Online</li>
        </ul>
      </td>
    </tr>
  </table>
  `;
  const parsed6 = parseSarkariResultHtml(SAMPLE_FREE_HTML);
  assert("Extracts Zero General Fee", parsed6.applicationFee.generalOBC === "₹0 (Exempted)", parsed6.applicationFee.generalOBC);
  assert("Extracts Zero SC/ST Fee", parsed6.applicationFee.scStPh === "₹0 (Exempted)", parsed6.applicationFee.scStPh);
  assert("Extracts Zero Female Fee", parsed6.applicationFee.female === "₹0 (Exempted)", parsed6.applicationFee.female);

  console.log(`\n==================================================`);
  console.log(`RESULTS: ${passed} / ${total} tests passed.`);
  console.log(`==================================================`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
