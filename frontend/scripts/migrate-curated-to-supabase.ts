import { CURATED_JOB_DETAILS } from "../lib/gov-job-details";

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || "buqkdtnffjoiwwtfxiek";
const SUPABASE_MGMT_TOKEN = process.env.SUPABASE_MGMT_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function runQuery(sql: string) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_MGMT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Query failed: ${txt}`);
  }
  return res.json();
}

async function main() {
  console.log("Starting structured recruitment data migration to Supabase...");

  // Mapping from curated keys to target matching IDs and Slugs in DB
  const jobKeyMapping: Record<string, { ids: string[]; slugs: string[] }> = {
    "ssc-cgl-2026": {
      ids: ["ssc-cgl-2026"],
      slugs: ["ssc-cgl-2026-recruitment-notification"],
    },
    "rrb-ntpc-2026": {
      ids: ["rrb-ntpc-2026"],
      slugs: ["railway-rrb-ntpc-2026-recruitment"],
    },
    "rrb-ntpc-10-plus-2-2026": {
      ids: ["rrb-ntpc-10-plus-2-2026", "rrb-ntpc-inter-level-07-2026"],
      slugs: [
        "rrb-ntpc-10-plus-2-inter-level-recruitment-2026",
        "rrb-ntpc-inter-level-07-2026",
      ],
    },
    "rrb-ntpc-10-plus-2-inter-level-recruitment-2026": {
      ids: ["rrb-ntpc-10-plus-2-2026", "rrb-ntpc-inter-level-07-2026"],
      slugs: [
        "rrb-ntpc-10-plus-2-inter-level-recruitment-2026",
        "rrb-ntpc-inter-level-07-2026",
      ],
    },
    "rrb-ntpc-inter-level-07-2026": {
      ids: ["rrb-ntpc-10-plus-2-2026", "rrb-ntpc-inter-level-07-2026"],
      slugs: [
        "rrb-ntpc-10-plus-2-inter-level-recruitment-2026",
        "rrb-ntpc-inter-level-07-2026",
      ],
    },
    "up-police-constable-2026": {
      ids: ["up-police-constable-2026"],
      slugs: ["up-police-constable-re-exam-result-cutoffs", "up-police-constable-2026"],
    },
    "opsc-app-exam-date-2026-out-check-prelims-exam-date": {
      ids: ["opsc-app-exam-date-2026-out-check-prelims-exam-date"],
      slugs: ["opsc-app-exam-date-2026-out-check-prelims-exam-date"],
    },
  };

  for (const [key, details] of Object.entries(CURATED_JOB_DETAILS)) {
    const mapping = jobKeyMapping[key];
    if (!mapping) continue;

    const categoryDist = details.categoryDistribution ? JSON.stringify(details.categoryDistribution) : null;
    const postDetails = details.postWiseDetails ? JSON.stringify(details.postWiseDetails) : null;
    const examPattern = details.examPatterns && details.examPatterns.length > 0 ? JSON.stringify(details.examPatterns[0]) : null;
    const appInstructions = details.applicationSteps ? JSON.stringify(details.applicationSteps) : null;
    const docRequired = details.requiredDocuments ? JSON.stringify(details.requiredDocuments) : null;

    const escapeSql = (s: string | null) => (s ? `'${s.replace(/'/g, "''")}'::jsonb` : "NULL");

    const sql = `
      UPDATE gov_notifications
      SET 
        category_distribution = COALESCE(${escapeSql(categoryDist)}, category_distribution),
        post_wise_details = COALESCE(${escapeSql(postDetails)}, post_wise_details),
        exam_pattern = COALESCE(${escapeSql(examPattern)}, exam_pattern),
        application_instructions = COALESCE(${escapeSql(appInstructions)}, application_instructions),
        documents_required = COALESCE(${escapeSql(docRequired)}, documents_required)
      WHERE 
        id IN (${mapping.ids.map(id => `'${id}'`).join(", ")})
        OR slug IN (${mapping.slugs.map(slug => `'${slug}'`).join(", ")});
    `;

    console.log(`Migrating curated record for: ${key}...`);
    await runQuery(sql);
    console.log(`✓ Updated DB rows for ${key}`);
  }

  // Also migrate structured data for State PSC and Banking recruitments
  const additionalRecruitments = [
    {
      slug: "bpsc-tre-4-0-recruitment-2026-application-process-to-begin-from-september-21-che",
      category_distribution: {
        ur: "12,450",
        obc: "8,920",
        ews: "3,110",
        sc: "5,420",
        st: "880",
        total: "30,780",
      },
      post_wise_details: [
        {
          postName: "Primary School Teacher (Classes 1-5)",
          department: "Education Department, Govt of Bihar",
          qualification: "10+2 with 50% marks + 2-Yr D.El.Ed + CTET Paper 1 / Bihar STET",
          payScale: "Basic ₹25,000 + DA + HRA (Net ~₹40,000/mo)",
          vacancies: "14,500 Posts",
        },
        {
          postName: "Middle School Teacher (Classes 6-8)",
          department: "Education Department, Govt of Bihar",
          qualification: "Graduation + D.El.Ed / B.Ed + CTET Paper 2 / STET",
          payScale: "Basic ₹28,000 + Allowances (Net ~₹45,000/mo)",
          vacancies: "10,280 Posts",
        },
        {
          postName: "Secondary Teacher (Classes 9-10)",
          department: "Education Department, Govt of Bihar",
          qualification: "Graduation / Post Graduation in relevant subject + B.Ed + STET Paper 1",
          payScale: "Basic ₹31,000 + Allowances (Net ~₹50,000/mo)",
          vacancies: "6,000 Posts",
        },
      ],
      exam_pattern: {
        tierName: "BPSC Written Competitive Examination",
        mode: "Offline (OMR Based)",
        totalQuestions: 150,
        totalMarks: 150,
        duration: "2 Hours 30 Minutes",
        negativeMarking: "No Negative Marking",
        subjects: [
          { name: "Part 1: Language Qualifying (English + Hindi/Urdu/Bengali)", questions: 30, marks: 30 },
          { name: "Part 2: General Studies (Elementary Math, Science, Social Science, Geography)", questions: 40, marks: 40 },
          { name: "Part 3: Subject Specific Domain", questions: 80, marks: 80 },
        ],
      },
      application_instructions: [
        "Visit bpsc.bih.nic.in and click on Online Application.",
        "Complete OTR (One-Time Registration) with Aadhaar and active mobile number.",
        "Fill candidate profile, address, and CTET/STET roll number.",
        "Upload Class 10 certificate, D.El.Ed / B.Ed marksheet, and domicile certificate.",
        "Submit online application fee and print confirmation page.",
      ],
      documents_required: [
        "Aadhaar Card or Photo ID Proof",
        "Class 10th (Matriculation) Certificate & Marksheet for DOB verification",
        "Graduation / Intermediate Passing Certificates & Marksheets",
        "B.Ed / D.El.Ed Degree and Marksheet",
        "CTET / Bihar STET Certificate & Scorecard",
        "Bihar Permanent Resident (Domicile) Certificate",
        "Caste / Creamy Layer / EWS Certificate (if seeking reservation)",
      ],
    },
    {
      slug: "karnataka-police-constable-recruitment-2026-applications-open-for-3-395-posts-ch",
      category_distribution: {
        ur: "1,698",
        obc: "916",
        sc: "509",
        st: "272",
        total: "3,395",
      },
      post_wise_details: [
        {
          postName: "Civil Police Constable (Men & Women)",
          department: "Karnataka State Police (KSP)",
          qualification: "10+2 (PUC / 12th Standard) or equivalent examination",
          payScale: "₹23,500 - ₹47,650 per month",
          vacancies: "3,395 Posts",
        },
      ],
      exam_pattern: {
        tierName: "KSP Written Examination",
        mode: "Offline OMR",
        totalQuestions: 100,
        totalMarks: 100,
        duration: "90 Minutes",
        negativeMarking: "0.25 Marks per wrong answer",
        subjects: [
          { name: "General Knowledge & Current Affairs", questions: 50, marks: 50 },
          { name: "Indian Constitution, History & Geography", questions: 25, marks: 25 },
          { name: "Mental Ability & Logical Reasoning", questions: 25, marks: 25 },
        ],
      },
      application_instructions: [
        "Visit ksp-recruitment.in official portal.",
        "Register with Aadhaar number and basic personal details.",
        "Upload scanned photo (below 40KB) and signature (below 20KB).",
        "Pay application fee online or through HDFC/Post Office challan.",
        "Print out the completed application acknowledgement.",
      ],
      documents_required: [
        "PUC / 12th Class Marks Card",
        "Class 10th Certificate for Date of Birth verification",
        "Kannada Medium Study Certificate (if claiming reservation)",
        "Rural Study Certificate (1st to 10th Std) if applicable",
        "Category Certificate (Cat-1, 2A, 2B, 3A, 3B, SC, ST)",
        "Valid Government ID (Voter ID, Aadhaar, Driving License)",
      ],
    },
  ];

  for (const extra of additionalRecruitments) {
    const escapeSql = (s: any) => (s ? `'${JSON.stringify(s).replace(/'/g, "''")}'::jsonb` : "NULL");
    const sql = `
      UPDATE gov_notifications
      SET 
        category_distribution = ${escapeSql(extra.category_distribution)},
        post_wise_details = ${escapeSql(extra.post_wise_details)},
        exam_pattern = ${escapeSql(extra.exam_pattern)},
        application_instructions = ${escapeSql(extra.application_instructions)},
        documents_required = ${escapeSql(extra.documents_required)}
      WHERE slug = '${extra.slug}';
    `;
    console.log(`Migrating structured data for ${extra.slug}...`);
    await runQuery(sql);
    console.log(`✓ Updated DB rows for ${extra.slug}`);
  }

  console.log("Migration complete!");
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
