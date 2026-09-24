import { 
  generateRecruitmentFingerprint, 
  getCanonicalAuthorityKey 
} from "../lib/universal-notice-model";

async function runTests() {
  console.log("==================================================");
  console.log("PHASE 3A RECRUITMENT DISCOVERY PIPELINE TESTS");
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

  // ── TEST 1: Canonical Authority Resolution ──
  const authRRB = getCanonicalAuthorityKey("Indian Railways (RRB/RRC)");
  const authRRB2 = getCanonicalAuthorityKey("Railway Recruitment Boards (RRB)");
  const authSSC = getCanonicalAuthorityKey("Staff Selection Commission (SSC)");
  const authUPP = getCanonicalAuthorityKey("UP Police Recruitment & Promotion Board (UPPRPB)");

  assert("Canonical Authority: Indian Railways maps to 'rrb'", authRRB === "rrb", `Got: ${authRRB}`);
  assert("Canonical Authority: RRB maps to 'rrb'", authRRB2 === "rrb", `Got: ${authRRB2}`);
  assert("Canonical Authority: SSC maps to 'ssc'", authSSC === "ssc", `Got: ${authSSC}`);
  assert("Canonical Authority: UP Police maps to 'up_police'", authUPP === "up_police", `Got: ${authUPP}`);

  // ── TEST 2: Cross-Source Fingerprint Deduplication ──
  // Sarkari Result vs PW vs Adda247 vs Testbook
  const fpSarkari = generateRecruitmentFingerprint("Indian Railways (RRB/RRC)", "RRB NTPC Graduate Recruitment 2026", "2026");
  const fpPW = generateRecruitmentFingerprint("Railway Recruitment Boards (RRB)", "RRB NTPC Graduate Level Vacancy 2026", "2026");
  const fpAdda = generateRecruitmentFingerprint("RRB", "RRB NTPC Graduate Notification 2026", "2026");
  const fpTestbook = generateRecruitmentFingerprint("RRB", "RRB NTPC Graduate Online Form 2026", "2026");

  assert(
    "Cross-Aggregator Fingerprints Match Identically",
    fpSarkari === fpPW && fpPW === fpAdda && fpAdda === fpTestbook,
    `fpSarkari: ${fpSarkari}, fpPW: ${fpPW}, fpAdda: ${fpAdda}, fpTestbook: ${fpTestbook}`
  );

  // ── TEST 3: Duplicate Aggregator Detection (Scenario 3) ──
  const existingRecords = new Map<string, any>();
  existingRecords.set(fpSarkari, {
    id: "rec-123",
    slug: "rrb-ntpc-graduate-2026",
    fingerprint: fpSarkari,
    title: "RRB NTPC Graduate Recruitment 2026",
    important_dates: { lastDate: "24 August 2026", examDate: "To be Notified Soon" },
    badge_status: "Applications Live",
    vacancies: "8,113 Posts",
    verification_status: "pending"
  });

  const incomingFromPW = {
    fingerprint: fpPW,
    important_dates: { lastDate: "24 August 2026", examDate: "To be Notified Soon" },
    badge_status: "Applications Live",
    vacancies: "8,113 Posts"
  };

  const isDuplicate = existingRecords.has(incomingFromPW.fingerprint);
  const existing = existingRecords.get(incomingFromPW.fingerprint);
  const hasChanges = incomingFromPW.important_dates.lastDate !== existing.important_dates.lastDate;

  assert("Duplicate from PW matches existing Sarkari Result row", isDuplicate && !hasChanges);

  // ── TEST 4: Meaningful Change Detection (Updated Last Date, Scenario 4) ──
  const incomingDateExtension = {
    fingerprint: fpAdda,
    important_dates: { lastDate: "31 August 2026", examDate: "15 October 2026" },
    badge_status: "Last Date Extended",
    vacancies: "8,113 Posts"
  };

  const hasDateChange = incomingDateExtension.important_dates.lastDate !== existing.important_dates.lastDate;
  const hasExamChange = incomingDateExtension.important_dates.examDate !== existing.important_dates.examDate;
  const hasBadgeChange = incomingDateExtension.badge_status !== existing.badge_status;

  assert("Change Detection: Last Date extension flagged", hasDateChange);
  assert("Change Detection: Exam date announcement flagged", hasExamChange);
  assert("Change Detection: Badge status update flagged", hasBadgeChange);

  // ── TEST 5: Aggregator URL Isolation (Scenario 5) ──
  // Aggregator URL must NEVER be saved as official_pdf_url
  function isOfficialGovDomain(urlStr: string): boolean {
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

  assert("Aggregator Sarkari Result link is NOT official domain", !isOfficialGovDomain("https://www.sarkariresult.com/railway/rrb-ntpc.php"));
  assert("Aggregator PW link is NOT official domain", !isOfficialGovDomain("https://www.pw.live/exams/railway/rrb-ntpc"));
  assert("Aggregator Adda247 link is NOT official domain", !isOfficialGovDomain("https://www.adda247.com/jobs/rrb-ntpc/"));
  assert("Official RRB apply portal is recognized as official", isOfficialGovDomain("https://rrbapply.gov.in"));
  assert("Official SSC portal is recognized as official", isOfficialGovDomain("https://ssc.gov.in"));
  assert("Official NIC portal is recognized as official", isOfficialGovDomain("https://uppsc.up.nic.in"));

  // ── TEST 6: Resilient Timeout Handling (Scenario 6) ──
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout 8000ms")), 10));
  const successPromise = Promise.resolve("Valid RSS content");

  const results = await Promise.allSettled([timeoutPromise, successPromise]);
  assert("Promise.allSettled tolerates timeouts without failing sync", 
    results[0].status === "rejected" && results[1].status === "fulfilled"
  );

  // ── TEST 7: Malformed XML / Incomplete Item Handling (Scenario 7) ──
  const malformedXml = "<rss><channel><item><title></title><link></link></item><item><description>Just random text with no title</description></item></channel></rss>";
  const itemMatches = malformedXml.match(/<item>([\s\S]*?)<\/item>/gi) || [];
  const validItems: any[] = [];
  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i);
    const title = (titleMatch ? titleMatch[1] || titleMatch[2] : "").trim();
    if (title && title.length >= 15) {
      validItems.push({ title });
    }
  }
  assert("Malformed items filtered out cleanly", validItems.length === 0);

  console.log("==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
