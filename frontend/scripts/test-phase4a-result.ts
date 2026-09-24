import { 
  normalizeToUniversalResult, 
  generateResultFingerprint,
  isOfficialGovDomain,
  UniversalResultNotice
} from "../lib/universal-notice-model";
import { GovJobNotification } from "../lib/gov-jobs-data";

// ─── TEST HARNESS ────────────────────────────────────────────────────────────
let passedTests = 0;
let failedTests = 0;

function assert(description: string, condition: boolean, details?: string) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${description}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${description}`);
    if (details) console.error(`    Details: ${details}`);
  }
}

async function runPhase4ATests() {
  console.log("=====================================================================");
  console.log("  HIREORBITAI PHASE 4A: UNIVERSAL RESULT DECLARED SYSTEM TEST SUITE  ");
  console.log("=====================================================================\n");

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: RRB Result — Generic Zero-Hardcoded Normalization & Fingerprint
  // ──────────────────────────────────────────────────────────────────────────
  console.log("─── Scenario 1: RRB Result Normalization ───");
  const rrbJob: GovJobNotification = {
    id: "rrb-ntpc-cbt1-result-2026",
    slug: "rrb-ntpc-cbt1-result-2026",
    title: "RRB NTPC CBT-1 Result 2026 Declared for 11,558 Posts",
    shortTitle: "RRB NTPC CBT-1 Result 2026",
    organization: "Railway Recruitment Boards (RRB)",
    category: "railway",
    type: "result",
    badgeStatus: "Result Declared",
    badgeColor: "emerald",
    vacancies: "11,558 Posts",
    qualification: "Graduate / 10+2",
    qualificationLevel: "graduate",
    ageLimit: "18-33 Years",
    payScale: "Level 2 to Level 6",
    applicationFee: { generalOBC: "₹500", scStPh: "₹250", female: "₹250" },
    importantDates: { resultDate: "24 September 2026", examDate: "July 2026" },
    location: "All India",
    summary: "RRB has declared the CBT-1 result for NTPC recruitment. 2,31,160 candidates qualified for CBT-2.",
    keyHighlights: ["CBT-1 Result Live", "Shortlisted for CBT-2"],
    selectionProcess: ["CBT-1", "CBT-2 (Computer Based Test)", "Skill Test / CBAT", "Document Verification"],
    officialPdfUrl: "https://rrbapply.gov.in/notices/ntpc_cbt1_result.pdf",
    applyUrl: "https://rrbapply.gov.in",
    updatedAt: "24 September 2026"
  };

  const rrbResult = normalizeToUniversalResult(rrbJob);
  assert("RRB noticeType is result", rrbResult.noticeType === "result");
  assert("RRB stage parsed as CBT-1", rrbResult.stage.includes("CBT-1"));
  assert("RRB status is RESULT_DECLARED", rrbResult.status === "RESULT_DECLARED");
  assert("RRB canonical fingerprint generated", rrbResult.fingerprint.startsWith("rrb_"));
  assert("RRB fingerprint contains cbt1 stage", rrbResult.fingerprint.includes("_result_cbt1_"));
  assert("RRB next stage identified as CBT-2", rrbResult.nextStage?.stageName.includes("CBT-2") ?? false);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: SSC Result — Zero-Hardcoding Normalization & Fingerprint
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 2: SSC Result Normalization ───");
  const sscJob: GovJobNotification = {
    id: "ssc-cgl-tier1-result-2026",
    slug: "ssc-cgl-tier1-result-2026",
    title: "SSC CGL Tier-1 Result 2026 Declared: Check Writeup & Cutoff",
    shortTitle: "SSC CGL Tier-1 Result 2026",
    organization: "Staff Selection Commission (SSC)",
    category: "central",
    type: "result",
    badgeStatus: "Result & Cutoff Released",
    badgeColor: "emerald",
    vacancies: "14,582 Posts",
    qualification: "Bachelor Degree",
    qualificationLevel: "graduate",
    ageLimit: "18-32 Years",
    payScale: "Level 4 to Level 8",
    applicationFee: { generalOBC: "₹100", scStPh: "₹0", female: "₹0" },
    importantDates: { resultDate: "20 September 2026", examDate: "August 2026" },
    location: "All India",
    summary: "SSC has announced CGL Tier-1 result with category-wise cutoff marks.",
    keyHighlights: ["Tier-1 Result Out", "Cutoff Released"],
    selectionProcess: ["Tier-1", "Tier-2 (Mains)", "Document Verification"],
    officialPdfUrl: "https://ssc.gov.in/writeup/cgl2026_tier1_result.pdf",
    applyUrl: "https://ssc.gov.in",
    updatedAt: "20 September 2026"
  };

  const sscResult = normalizeToUniversalResult(sscJob);
  assert("SSC stage parsed as Tier-1", sscResult.stage.includes("Tier-1"));
  assert("SSC canonical fingerprint generated", sscResult.fingerprint.startsWith("ssc_"));
  assert("SSC fingerprint contains tier1 stage", sscResult.fingerprint.includes("_result_tier1_"));
  assert("SSC authority is Staff Selection Commission", sscResult.authority.includes("Staff Selection Commission"));

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: Police Result (UP Police Final Result)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 3: State Police Result Normalization ───");
  const policeJob: GovJobNotification = {
    id: "up-police-constable-final-result-2026",
    slug: "up-police-constable-final-result-2026",
    title: "UP Police Constable Final Result 2026 Declared: Selection List Out",
    shortTitle: "UP Police Constable Final Result",
    organization: "UP Police Recruitment & Promotion Board (UPPRPB)",
    category: "police",
    type: "result",
    badgeStatus: "Final Selection List",
    badgeColor: "emerald",
    vacancies: "60,244 Posts",
    qualification: "10+2 Intermediate",
    qualificationLevel: "12th",
    ageLimit: "18-25 Years",
    payScale: "Level 3",
    applicationFee: { generalOBC: "₹400", scStPh: "₹400", female: "₹400" },
    importantDates: { resultDate: "15 September 2026" },
    location: "Uttar Pradesh",
    summary: "UPPRPB has declared final result for 60,244 Constable posts.",
    keyHighlights: ["Final Result Live", "Merit List PDF Released"],
    selectionProcess: ["Written Exam", "PST/PET", "Document Verification", "Medical Examination"],
    officialPdfUrl: "https://uppbpb.gov.in/final_result_constable.pdf",
    applyUrl: "https://uppbpb.gov.in",
    updatedAt: "15 September 2026"
  };

  const policeResult = normalizeToUniversalResult(policeJob);
  assert("Police status is FINAL_RESULT_DECLARED", policeResult.status === "FINAL_RESULT_DECLARED");
  assert("Police merit list is active for final result", policeResult.meritList?.isReleased === true);
  assert("Police canonical fingerprint generated", policeResult.fingerprint.startsWith("up_police_"));
  assert("Police fingerprint contains final stage", policeResult.fingerprint.includes("_result_final_"));

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Banking Result (IBPS PO Mains)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 4: Banking Result Normalization ───");
  const bankJob: GovJobNotification = {
    id: "ibps-po-mains-result-2026",
    slug: "ibps-po-mains-result-2026",
    title: "IBPS PO Mains Result 2026 Declared: Interview Shortlist Out",
    shortTitle: "IBPS PO Mains Result 2026",
    organization: "Institute of Banking Personnel Selection (IBPS)",
    category: "banking",
    type: "result",
    badgeStatus: "Mains Result Declared",
    badgeColor: "emerald",
    vacancies: "4,450 Posts",
    qualification: "Graduate Degree",
    qualificationLevel: "graduate",
    ageLimit: "20-30 Years",
    payScale: "₹36,000 basic",
    applicationFee: { generalOBC: "₹850", scStPh: "₹175", female: "₹850" },
    importantDates: { resultDate: "10 September 2026" },
    location: "All India",
    summary: "IBPS PO Mains result announced for Probationary Officer vacancies.",
    keyHighlights: ["Mains Result Active", "Interview Shortlist Available"],
    selectionProcess: ["Prelims", "Mains Examination", "Interview"],
    officialPdfUrl: "",
    applyUrl: "https://ibps.in/crp-po-xiv/mains-result",
    updatedAt: "10 September 2026"
  };

  const bankResult = normalizeToUniversalResult(bankJob);
  assert("Banking stage parsed as Mains", bankResult.stage.includes("Mains"));
  assert("Banking canonical fingerprint generated", bankResult.fingerprint.startsWith("ibps_"));
  assert("Banking fingerprint contains mains stage", bankResult.fingerprint.includes("_result_mains_"));

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: NTA Result (UGC NET)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 5: NTA Testing Agency Result Normalization ───");
  const ntaJob: GovJobNotification = {
    id: "ugc-net-result-2026",
    slug: "ugc-net-result-2026",
    title: "UGC NET Examination Result 2026 Declared: Scorecard Live",
    shortTitle: "UGC NET Result 2026",
    organization: "National Testing Agency (NTA)",
    category: "teaching",
    type: "result",
    badgeStatus: "Scorecard & Marks Available",
    badgeColor: "emerald",
    vacancies: "JRF & Assistant Professor",
    qualification: "Master Degree",
    qualificationLevel: "postgraduate",
    ageLimit: "As per rules",
    payScale: "UGC Scale",
    applicationFee: { generalOBC: "₹1150", scStPh: "₹325", female: "₹600" },
    importantDates: { resultDate: "05 September 2026" },
    location: "All India",
    summary: "NTA has declared UGC NET exam scorecard and qualifying cutoff percentiles.",
    keyHighlights: ["Scorecard Live", "Cutoff Available"],
    selectionProcess: ["Computer Based Test (CBT)"],
    officialPdfUrl: "https://ugcnet.nta.ac.in/cutoff.pdf",
    applyUrl: "https://ugcnet.nta.ac.in",
    updatedAt: "05 September 2026"
  };

  const ntaResult = normalizeToUniversalResult(ntaJob);
  assert("NTA canonical fingerprint generated", ntaResult.fingerprint.startsWith("nta_"));
  assert("NTA credentials specify Application Number & DOB", ntaResult.credentials.label.includes("Application Number"));

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 6: Scorecard Live Scenario
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 6: Scorecard Live ───");
  const liveScorecardJob: GovJobNotification = {
    ...rrbJob,
    title: "RRB NTPC CBT-1 Scorecard & Marks Out 2026: Download Now",
    applyUrl: "https://rrbapply.gov.in/scorecard-login"
  };
  const liveScorecardNotice = normalizeToUniversalResult(liveScorecardJob);
  assert("Scorecard is marked available", liveScorecardNotice.scorecard?.isAvailable === true);
  assert("Scorecard download URL is populated", liveScorecardNotice.primaryActionUrls.downloadScorecardUrl === "https://rrbapply.gov.in/scorecard-login");
  assert("Scorecard login requires credentials", (liveScorecardNotice.scorecard?.requiredCredentials.length ?? 0) > 0);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 7: Scorecard Missing Scenario (Clean Disappearance)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 7: Scorecard Not Released (Strict Null) ───");
  const noScorecardJob: GovJobNotification = {
    ...rrbJob,
    title: "RRB NTPC CBT-1 Result 2026 Declared: Roll Number List Published"
  };
  const noScorecardNotice = normalizeToUniversalResult(noScorecardJob);
  assert("Scorecard is strictly null when not live", noScorecardNotice.scorecard === null);
  assert("downloadScorecardUrl is undefined", noScorecardNotice.primaryActionUrls.downloadScorecardUrl === undefined);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 8: Cutoff Live Scenario
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 8: Cutoff Marks Released ───");
  const liveCutoffJob: GovJobNotification = {
    ...sscJob,
    title: "SSC CGL Tier-1 Result 2026: Category-wise Cutoff Marks Released",
    officialPdfUrl: "https://ssc.gov.in/writeup/cgl_cutoff_2026.pdf"
  };
  const liveCutoffNotice = normalizeToUniversalResult(liveCutoffJob);
  assert("Cutoff is marked released", liveCutoffNotice.cutoff?.isReleased === true);
  assert("checkCutoffUrl is populated with cutoff PDF", liveCutoffNotice.primaryActionUrls.checkCutoffUrl === "https://ssc.gov.in/writeup/cgl_cutoff_2026.pdf");

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 9: Cutoff Missing Scenario (Strict Null, Never Invent Numbers)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 9: Cutoff Not Released (Strict Null) ───");
  const noCutoffJob: GovJobNotification = {
    ...sscJob,
    title: "SSC CGL Tier-1 Result 2026 Declared",
    officialPdfUrl: ""
  };
  const noCutoffNotice = normalizeToUniversalResult(noCutoffJob);
  assert("Cutoff is strictly null when not announced", noCutoffNotice.cutoff === null);
  assert("checkCutoffUrl is undefined", noCutoffNotice.primaryActionUrls.checkCutoffUrl === undefined);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 10: Merit List Released Scenario
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 10: Merit List PDF Released ───");
  const meritListJob: GovJobNotification = {
    ...policeJob,
    title: "UP Police Constable Merit List 2026 Out: Selection List PDF",
    officialPdfUrl: "https://uppbpb.gov.in/merit_list_constable_2026.pdf"
  };
  const meritNotice = normalizeToUniversalResult(meritListJob);
  assert("Merit list is marked released", meritNotice.meritList?.isReleased === true);
  assert("downloadMeritListUrl is populated", meritNotice.primaryActionUrls.downloadMeritListUrl === "https://uppbpb.gov.in/merit_list_constable_2026.pdf");

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 11: Regional Result Differentiation
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 11: Regional Result Differentiation ───");
  const fpBhopal = generateResultFingerprint("RRB", "NTPC Graduate", "2026", "CBT-1", "Bhopal");
  const fpPatna = generateResultFingerprint("RRB", "NTPC Graduate", "2026", "CBT-1", "Patna");
  assert("Regional results produce distinct fingerprints", fpBhopal !== fpPatna);
  assert("Bhopal fingerprint contains bhopal region", fpBhopal.endsWith("_bhopal"));
  assert("Patna fingerprint contains patna region", fpPatna.endsWith("_patna"));

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 12: Sarkari Result Candidate Access Link RETAINED (Never Blocked)
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 12: Sarkari Result Unofficial Link Retained & Transparent ───");
  const sarkariResultJob: GovJobNotification = {
    id: "rrb-ntpc-sarkari-result-2026",
    slug: "rrb-ntpc-sarkari-result-2026",
    title: "RRB NTPC CBT-1 Result 2026 Declared",
    shortTitle: "RRB NTPC Result 2026",
    organization: "Railway Recruitment Boards (RRB)",
    category: "railway",
    type: "result",
    badgeStatus: "Result Declared",
    badgeColor: "emerald",
    vacancies: "11,558 Posts",
    qualification: "Graduation",
    qualificationLevel: "graduate",
    ageLimit: "18-33",
    payScale: "Level 2-6",
    applicationFee: { generalOBC: "₹500", scStPh: "₹250", female: "₹250" },
    importantDates: { resultDate: "Declared" },
    location: "All India",
    summary: "RRB NTPC CBT-1 result declared as reported by Sarkari Result.",
    keyHighlights: ["Result Announced"],
    selectionProcess: ["CBT-1", "CBT-2"],
    officialPdfUrl: "",
    // Note: applyUrl is from Sarkari Result aggregator
    applyUrl: "https://www.sarkariresult.com/railway/rrb-ntpc-result-2026.php",
    updatedAt: "24 September 2026"
  };

  const sarkariNotice = normalizeToUniversalResult(sarkariResultJob);
  assert("Sarkari Result link is NOT recognized as official gov domain", !isOfficialGovDomain(sarkariResultJob.applyUrl));
  assert("Sarkari Result candidate link is RETAINED as checkResultUrl", sarkariNotice.primaryActionUrls.checkResultUrl === sarkariResultJob.applyUrl);
  assert("Sarkari Result source is marked NOT official", sarkariNotice.source.isOfficial === false);
  assert("Sarkari Result sourceName is Sarkari Result", sarkariNotice.source.name === "Sarkari Result");
  assert("Sarkari Result verificationStatus is Source Confirmed", sarkariNotice.source.verificationStatus === "Source Confirmed");
  assert("Candidate result link badge reflects Sarkari Result Source", sarkariNotice.links.some(l => l.badge === "Sarkari Result Link" && l.isOfficial === false));

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 13: Official Source Verification Upgrade
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 13: Upgrade from Aggregator to Official Commission Link ───");
  const upgradedOfficialJob: GovJobNotification = {
    ...sarkariResultJob,
    applyUrl: "https://rrbapply.gov.in/result/cbt1",
    officialPdfUrl: "https://rrbapply.gov.in/result/cbt1.pdf"
  };

  const upgradedNotice = normalizeToUniversalResult(upgradedOfficialJob);
  assert("Official domain recognized", isOfficialGovDomain(upgradedOfficialJob.applyUrl));
  assert("Upgraded source is marked official", upgradedNotice.source.isOfficial === true);
  assert("Upgraded verification status is Official Source Verified", upgradedNotice.source.verificationStatus === "Official Source Verified");
  assert("Result link in table marked Official Link with emerald badge", upgradedNotice.links.some(l => l.badge === "Official Link" && l.isOfficial === true));

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 14: Canonical Fingerprint Deduplication Across Feeds
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n─── Scenario 14: Fingerprint Deduplication Across Multiple Aggregators ───");
  const fp1 = generateResultFingerprint("Railway Recruitment Boards (RRB)", "RRB NTPC CBT-1 Result 2026 Declared", "2026", "CBT-1", "All India");
  const fp2 = generateResultFingerprint("Indian Railways (RRB/RRC)", "Railway NTPC Stage 1 CBT 1 Result Announced 2026", "2026", "CBT-1", "all");
  const fp3 = generateResultFingerprint("RRB", "NTPC CBT 1 Examination Result 2026", "2026", "CBT-1", "All");

  assert("Sarkari Result and PW variations yield same authority key", fp1.startsWith("rrb_") && fp2.startsWith("rrb_") && fp3.startsWith("rrb_"));
  assert("Fingerprint 1 and 3 match canonical structure", fp1 === fp3, `fp1=${fp1}, fp3=${fp3}`);
  assert("CBT-1 vs CBT-2 produces distinct fingerprints", 
    generateResultFingerprint("RRB", "NTPC", "2026", "CBT-1") !== generateResultFingerprint("RRB", "NTPC", "2026", "CBT-2")
  );

  console.log("\n=====================================================================");
  console.log(`  PHASE 4A TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED  `);
  console.log("=====================================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runPhase4ATests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
