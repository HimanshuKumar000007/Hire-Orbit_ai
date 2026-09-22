import { GovJobNotification } from "./gov-jobs-data";

export interface PostWiseVacancy {
  postName: string;
  department?: string;
  classification?: string;
  vacancies?: string;
  ageLimit: string;
  qualification: string;
  payScale?: string;
}

export interface ExamSubject {
  name: string;
  questions: number | string;
  marks: number | string;
}

export interface ExamPatternTier {
  tierName: string;
  mode: string;
  totalQuestions: string | number;
  totalMarks: string | number;
  duration: string;
  negativeMarking: string;
  subjects: ExamSubject[];
}

export interface PhysicalStandardCriteria {
  maleHeight?: string;
  maleChest?: string;
  malePhysicalTest?: string;
  femaleHeight?: string;
  femaleChest?: string;
  femalePhysicalTest?: string;
}

export interface JobFaqItem {
  question: string;
  answer: string;
}

export interface ImportantLinkItem {
  title: string;
  description: string;
  url: string;
  isExternal: boolean;
  badge?: string;
  badgeColor?: 'emerald' | 'blue' | 'amber' | 'purple';
}

export interface EnrichedJobDetails {
  postWiseDetails: PostWiseVacancy[];
  categoryDistribution: {
    ur: string;
    ews: string;
    obc: string;
    sc: string;
    st: string;
    total: string;
  };
  examPatterns: ExamPatternTier[];
  physicalStandards?: PhysicalStandardCriteria;
  applicationSteps: string[];
  faqs: JobFaqItem[];
  usefulLinks: ImportantLinkItem[];
}

export const CURATED_JOB_DETAILS: Record<string, Partial<EnrichedJobDetails>> = {
  // 1. SSC CGL 2026
  'ssc-cgl-2026': {
    postWiseDetails: [
      {
        postName: "Assistant Section Officer (ASO)",
        department: "Central Secretariat Service (CSS) / DoPT",
        classification: "Group B Non-Gazetted",
        ageLimit: "20 - 30 Years",
        qualification: "Bachelor's Degree in any discipline from a recognized University",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400)"
      },
      {
        postName: "Assistant Section Officer (ASO)",
        department: "Intelligence Bureau (MHA)",
        classification: "Group B Non-Gazetted",
        ageLimit: "18 - 30 Years",
        qualification: "Bachelor's Degree in any stream (Subject to IB security clearance)",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400) + 20% Special Security Allowance"
      },
      {
        postName: "Assistant Section Officer (ASO)",
        department: "Ministry of External Affairs (MEA)",
        classification: "Group B Non-Gazetted",
        ageLimit: "20 - 30 Years",
        qualification: "Bachelor's Degree in any discipline (Foreign posting eligible)",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400) + Foreign allowances"
      },
      {
        postName: "Assistant Section Officer (ASO)",
        department: "Ministry of Railways (Railway Board)",
        classification: "Group B Non-Gazetted",
        ageLimit: "20 - 30 Years",
        qualification: "Bachelor's Degree in any discipline",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400)"
      },
      {
        postName: "Inspector of Central Excise",
        department: "CBIC (Department of Revenue, Ministry of Finance)",
        classification: "Group B Non-Gazetted",
        ageLimit: "18 - 30 Years",
        qualification: "Bachelor's Degree + Mandatory Physical Test (Height 157.5 cm / Walking 1.6 km)",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400)"
      },
      {
        postName: "Inspector (Preventive Officer)",
        department: "CBIC (Airports & Seaports Customs)",
        classification: "Group B Non-Gazetted",
        ageLimit: "18 - 30 Years",
        qualification: "Bachelor's Degree in any discipline + Physical Standards",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400)"
      },
      {
        postName: "Inspector (Examiner)",
        department: "CBIC (Customs Cargo Assessment)",
        classification: "Group B Non-Gazetted",
        ageLimit: "18 - 30 Years",
        qualification: "Bachelor's Degree in any discipline",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400)"
      },
      {
        postName: "Assistant Enforcement Officer (AEO)",
        department: "Directorate of Enforcement (ED)",
        classification: "Group B Non-Gazetted",
        ageLimit: "18 - 30 Years",
        qualification: "Bachelor's Degree in any discipline",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400) + Special Allowance"
      },
      {
        postName: "Sub Inspector (SI)",
        department: "Central Bureau of Investigation (CBI)",
        classification: "Group B Non-Gazetted",
        ageLimit: "20 - 30 Years",
        qualification: "Bachelor's Degree + Physical Fitness (Height Male 165 cm, Female 150 cm)",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400) + 25% Extra Basic Pay"
      },
      {
        postName: "Inspector of Posts",
        department: "Department of Posts (Ministry of Communications)",
        classification: "Group B Non-Gazetted",
        ageLimit: "18 - 30 Years",
        qualification: "Bachelor's Degree in any discipline",
        payScale: "Pay Level 7 (₹44,900 - ₹1,42,400)"
      },
      {
        postName: "Assistant / Sub-Inspector",
        department: "National Investigation Agency (NIA)",
        classification: "Group B Non-Gazetted",
        ageLimit: "18 - 30 Years",
        qualification: "Bachelor's Degree in any discipline + Physical Standards",
        payScale: "Pay Level 6 & 7 (₹35,400 - ₹1,42,400)"
      },
      {
        postName: "Auditor",
        department: "Offices under Comptroller & Auditor General (C&AG) / CGDA",
        classification: "Group C",
        ageLimit: "18 - 27 Years",
        qualification: "Bachelor's Degree from a recognized University",
        payScale: "Pay Level 5 (₹29,200 - ₹92,300)"
      },
      {
        postName: "Accountant / Junior Accountant",
        department: "Controller General of Accounts (CGA) & Other Ministries",
        classification: "Group C",
        ageLimit: "18 - 27 Years",
        qualification: "Bachelor's Degree from a recognized University",
        payScale: "Pay Level 5 (₹29,200 - ₹92,300)"
      },
      {
        postName: "Tax Assistant (Direct Taxes)",
        department: "Central Board of Direct Taxes (CBDT - Income Tax)",
        classification: "Group C",
        ageLimit: "18 - 27 Years",
        qualification: "Bachelor's Degree + Data Entry Speed of 8,000 Key Depressions/Hour",
        payScale: "Pay Level 4 (₹25,500 - ₹81,100)"
      },
      {
        postName: "Tax Assistant (Indirect Taxes)",
        department: "Central Board of Indirect Taxes & Customs (CBIC)",
        classification: "Group C",
        ageLimit: "18 - 27 Years",
        qualification: "Bachelor's Degree + Data Entry Speed of 8,000 Key Depressions/Hour",
        payScale: "Pay Level 4 (₹25,500 - ₹81,100)"
      },
      {
        postName: "Sub-Inspector",
        department: "Central Bureau of Narcotics (Ministry of Finance)",
        classification: "Group C",
        ageLimit: "18 - 27 Years",
        qualification: "Bachelor's Degree + Physical Fitness",
        payScale: "Pay Level 4 (₹25,500 - ₹81,100)"
      }
    ],
    categoryDistribution: {
      ur: "5,835",
      obc: "3,937",
      sc: "2,187",
      st: "1,093",
      ews: "1,530",
      total: "14,582"
    },
    examPatterns: [
      {
        tierName: "Tier-1 Examination (Computer Based Screening)",
        mode: "Online Computer Based Test (Objective MCQ)",
        totalQuestions: 100,
        totalMarks: 200,
        duration: "60 Minutes (80 Minutes for PwBD scribes)",
        negativeMarking: "0.50 Marks per wrong answer",
        subjects: [
          { name: "General Intelligence & Reasoning", questions: 25, marks: 50 },
          { name: "General Awareness (History, Polity, Economy, Science, Current Affairs)", questions: 25, marks: 50 },
          { name: "Quantitative Aptitude (Arithmetic, Advanced Math, Algebra, Geometry)", questions: 25, marks: 50 },
          { name: "English Comprehension & Grammar", questions: 25, marks: 50 }
        ]
      },
      {
        tierName: "Tier-2 Examination (Merit Deciding Paper)",
        mode: "Online Computer Based Test (Objective + Skill Test)",
        totalQuestions: "150 Qs + DEST",
        totalMarks: "390 Marks + Qualifying Modules",
        duration: "2 Hours 15 Minutes (Session 1) + 15 Minutes (Session 2)",
        negativeMarking: "1.00 Mark per wrong answer in Sections I & II",
        subjects: [
          { name: "Section I: Mathematical Abilities (30 Qs) + Reasoning & GI (30 Qs)", questions: 60, marks: 180 },
          { name: "Section II: English Language (45 Qs) + General Awareness (25 Qs)", questions: 70, marks: 210 },
          { name: "Section III: Computer Knowledge Module (Qualifying)", questions: 20, marks: 60 },
          { name: "Data Entry Speed Test (DEST Module - 2,000 Key depressions)", questions: "1 Passage", marks: "Qualifying" }
        ]
      }
    ],
    physicalStandards: {
      maleHeight: "157.5 cms (Relaxable by 5 cms for Garhwalis, Assamese, Gorkhas & ST)",
      maleChest: "81 cms fully expanded with a minimum expansion of 5 cms",
      malePhysicalTest: "Walking: 1,600 metres in 15 minutes | Cycling: 8 Kms in 30 minutes",
      femaleHeight: "152 cms (Relaxable by 2.5 cms for ST / Hill areas)",
      femaleChest: "Weight minimum 48 Kgs (Relaxable by 2 Kgs)",
      femalePhysicalTest: "Walking: 1 Km in 20 minutes | Cycling: 3 Kms in 25 minutes"
    },
    applicationSteps: [
      "Step 1: Complete One-Time Registration (OTR) on the official SSC portal (ssc.gov.in) with basic identity details (Aadhaar / Voter ID).",
      "Step 2: Log in using Registration ID and Password, navigate to 'Apply' tab and select 'Combined Graduate Level Examination 2026'.",
      "Step 3: Verify pre-filled educational data, select 3 preferred examination cities, and choose post preference groups.",
      "Step 4: Capture live photograph using the integrated webcam/mobile camera tool against a plain white background without glasses or cap.",
      "Step 5: Upload clean scanned signature in JPEG/JPG format (file size strictly between 10 KB to 20 KB).",
      "Step 6: Preview the entire form thoroughly, check fee exemption status, and submit the online application.",
      "Step 7: Complete online payment of ₹100 via UPI, Net Banking, or Credit/Debit Card (Exempted for Women, SC, ST, PwBD, ESM) and download the e-Receipt."
    ],
    faqs: [
      {
        question: "When will the SSC CGL 2026 Tier 1 examination be conducted?",
        answer: "As per the official SSC Exam Calendar 2026, the Tier-1 Computer Based Examination is scheduled to be held tentatively across July and August 2026 in multiple shifts."
      },
      {
        question: "What is the educational qualification required for SSC CGL 2026?",
        answer: "Candidates must hold a recognized Bachelor's Degree in any discipline (B.Com, BA, B.Sc, B.Tech, BBA, etc.) from an accredited Indian University before the prescribed cut-off date. Special posts like JSO require 60% in 12th Maths or Statistics in graduation."
      },
      {
        question: "What is the age limit and age relaxation for SSC CGL 2026?",
        answer: "The general age limit is 18 to 32 years (depending on post: 18-27, 18-30, 20-30, and up to 32 for JSO). Upper age relaxations apply: 5 years for SC/ST, 3 years for OBC, 10 years for PwBD, and 15 years for PwBD (SC/ST)."
      },
      {
        question: "Is there negative marking in SSC CGL Tier 1 and Tier 2?",
        answer: "Yes. Tier-1 features a negative marking deduction of 0.50 marks for each incorrect answer. In Tier-2 (Paper 1), there is a penalty of 1 mark for each wrong answer in Section-I and Section-II."
      },
      {
        question: "Can final semester or final year college students apply for SSC CGL 2026?",
        answer: "Yes, final year college students can submit the application form, provided they obtain their qualifying Bachelor's degree and passing certificate on or before the crucial cutoff date specified in the official gazette."
      },
      {
        question: "How can I check if my resume/profile qualifies for SSC CGL?",
        answer: "You can click 'Scan My Resume with AI' right here on HireOrbitAI. Our intelligence engine analyzes your date of birth, educational degrees, and reservation category in 5 seconds to show exactly which of the 16+ SSC CGL posts you qualify for."
      }
    ],
    usefulLinks: [
      { title: "Apply Online (Registration & Login)", description: "Direct link to fill SSC CGL application form", url: "https://ssc.gov.in", isExternal: true, badge: "Active Now", badgeColor: "emerald" },
      { title: "Download Official Notification PDF", description: "Complete 100+ page official employment gazette", url: "https://ssc.gov.in", isExternal: true, badge: "Gazette PDF", badgeColor: "blue" },
      { title: "Staff Selection Commission Official Portal", description: "Official homepage of SSC Central Headquarters", url: "https://ssc.gov.in", isExternal: true, badge: "Official Website", badgeColor: "blue" },
      { title: "Download Syllabus & Exam Scheme PDF", description: "Detailed subject-wise topics for Tier 1 & Tier 2", url: "https://ssc.gov.in", isExternal: true, badge: "Syllabus", badgeColor: "purple" },
      { title: "SSC Revised Examination Calendar 2026", description: "Official exam schedule dates for all 2026 tests", url: "https://ssc.gov.in", isExternal: true, badge: "Calendar", badgeColor: "amber" },
      { title: "Check Eligibility with HireOrbit AI", description: "Instant 5-second degree & age compatibility scan", url: "/onboarding", isExternal: false, badge: "AI Powered", badgeColor: "emerald" }
    ]
  },

  // 2. Railway RRB NTPC 2026
  'rrb-ntpc-2026': {
    postWiseDetails: [
      { postName: "Station Master", department: "Traffic / Operating (Indian Railways)", classification: "Level 6", ageLimit: "18 - 36 Years", qualification: "Bachelor's Degree in any discipline + CBAT Aptitude Test + A2 Medical", payScale: "₹35,400 + Allowances" },
      { postName: "Goods Train Manager (Guard)", department: "Traffic / Operating", classification: "Level 5", ageLimit: "18 - 36 Years", qualification: "Bachelor's Degree in any discipline + A2 Medical", payScale: "₹29,200 + Running Allowances" },
      { postName: "Senior Commercial cum Ticket Clerk", department: "Commercial Branch", classification: "Level 5", ageLimit: "18 - 36 Years", qualification: "Bachelor's Degree in any discipline + B2 Medical", payScale: "₹29,200 + Allowances" },
      { postName: "Junior Accounts Assistant cum Typist", department: "Accounts Department", classification: "Level 5", ageLimit: "18 - 36 Years", qualification: "Bachelor's Degree + Typing Skill (30 wpm English / 25 wpm Hindi)", payScale: "₹29,200 + Allowances" },
      { postName: "Senior Clerk cum Typist", department: "Personnel / General Admin", classification: "Level 5", ageLimit: "18 - 36 Years", qualification: "Bachelor's Degree + Typing Skill Test", payScale: "₹29,200 + Allowances" },
      { postName: "Commercial cum Ticket Clerk", department: "Commercial Branch", classification: "Level 3 (Undergraduate)", ageLimit: "18 - 33 Years", qualification: "12th (+2 Stage) or its equivalent with not less than 50% marks", payScale: "₹21,700 + Allowances" },
      { postName: "Accounts Clerk cum Typist", department: "Accounts Department", classification: "Level 2 (Undergraduate)", ageLimit: "18 - 33 Years", qualification: "12th Pass + Typing Proficiency on Computer", payScale: "₹19,900 + Allowances" },
      { postName: "Junior Clerk cum Typist", department: "All Railway Divisions", classification: "Level 2 (Undergraduate)", ageLimit: "18 - 33 Years", qualification: "12th Pass + Typing Proficiency on Computer", payScale: "₹19,900 + Allowances" },
      { postName: "Trains Clerk", department: "Operating Department", classification: "Level 2 (Undergraduate)", ageLimit: "18 - 33 Years", qualification: "12th (+2 Stage) with minimum 50% aggregate", payScale: "₹19,900 + Allowances" }
    ],
    categoryDistribution: {
      ur: "4,682",
      obc: "3,120",
      sc: "1,734",
      st: "867",
      ews: "1,155",
      total: "11,558"
    },
    examPatterns: [
      {
        tierName: "1st Stage Computer Based Test (CBT-1) - Screening",
        mode: "Online CBT (Objective MCQ)",
        totalQuestions: 100,
        totalMarks: 100,
        duration: "90 Minutes (120 Mins for PwBD)",
        negativeMarking: "1/3rd (0.33) Marks per wrong answer",
        subjects: [
          { name: "General Awareness (Current Affairs, Railway History, Science)", questions: 40, marks: 40 },
          { name: "Mathematics (Arithmetic, Algebra, Mensuration, Trigo)", questions: 30, marks: 30 },
          { name: "General Intelligence & Reasoning", questions: 30, marks: 30 }
        ]
      },
      {
        tierName: "2nd Stage Computer Based Test (CBT-2) - Merit Determining",
        mode: "Online CBT (Separate for each Pay Level)",
        totalQuestions: 120,
        totalMarks: 120,
        duration: "90 Minutes",
        negativeMarking: "1/3rd (0.33) Marks per wrong answer",
        subjects: [
          { name: "General Awareness", questions: 50, marks: 50 },
          { name: "Mathematics", questions: 35, marks: 35 },
          { name: "General Intelligence & Reasoning", questions: 35, marks: 35 }
        ]
      }
    ],
    applicationSteps: [
      "Step 1: Access the official unified Railway portal (rrbapply.gov.in) and create an RRB Recruitment Account.",
      "Step 2: Enter personal details, matriculation roll number, and verify mobile OTP and email confirmation.",
      "Step 3: Select your preferred Railway Recruitment Board (RRB Zone - e.g. RRB Allahabad, RRB Mumbai, RRB Kolkata, etc.).",
      "Step 4: Provide post preferences in order of choice (Level 6 Station Master, Level 5 Goods Train Manager, etc.).",
      "Step 5: Upload clear passport photo and signature as per prescribed RRB dimensions.",
      "Step 6: Pay the application fee (₹500 for General/OBC, of which ₹400 is refunded after appearing in CBT-1; ₹250 for SC/ST/Women with full refund).",
      "Step 7: Download and print the finalized RRB NTPC confirmation form with Application Registration Number."
    ],
    faqs: [
      { question: "Is the RRB NTPC application fee refundable?", answer: "Yes! Candidates who appear for the 1st Stage Computer Based Test (CBT-1) receive a refund: ₹400 is refunded back to the bank account for UR/OBC (from ₹500), and the complete ₹250 fee is refunded for SC, ST, Female, and PwBD candidates." },
      { question: "Can a candidate apply to more than one RRB zone?", answer: "No. A candidate can only select ONE RRB Zone. Submitting multiple applications across different RRB zones leads to rejection of all applications." },
      { question: "What is the medical standard for Station Master in RRB NTPC?", answer: "Station Master requires strict A2 medical fitness (Distant Vision 6/9, 6/9 without glasses, no color blindness or night blindness, and normal binocular vision)." },
      { question: "Is there an interview in RRB NTPC recruitment?", answer: "No. There is no interview for any non-gazetted Railway NTPC posts. Selection is based purely on CBT scores, CBAT/Typing (where applicable), and Document Verification." }
    ],
    usefulLinks: [
      { title: "RRB Centralized Online Portal (rrbapply.gov.in)", description: "Official application submission link", url: "https://rrbapply.gov.in", isExternal: true, badge: "Apply Portal", badgeColor: "emerald" },
      { title: "Download Official RRB NTPC Gazette PDF", description: "Complete CEN employment notice", url: "https://indianrailways.gov.in", isExternal: true, badge: "Official PDF", badgeColor: "blue" },
      { title: "Indian Railways Official Website", description: "Ministry of Railways official headquarters", url: "https://indianrailways.gov.in", isExternal: true, badge: "Railways", badgeColor: "blue" },
      { title: "Check RRB Zone Eligibility with AI", description: "Instant 5-second resume eligibility check", url: "/onboarding", isExternal: false, badge: "AI Powered", badgeColor: "emerald" }
    ]
  },

  // 3. UP Police Constable 2026
  'up-police-constable-2026': {
    postWiseDetails: [
      { postName: "Constable Civil Police (Male & Female)", department: "Uttar Pradesh Police Department", classification: "Level 3", vacancies: "41,440 Posts", ageLimit: "18 - 25 Years (Male) / 18 - 28 Years (Female)", qualification: "10+2 (Intermediate) Pass from any recognized Board in India", payScale: "Pay Band 5200-20200 Grade Pay 2000 (Level 3: ₹21,700 - ₹69,100)" },
      { postName: "Constable PAC (Pradeshik Armed Constabulary)", department: "Uttar Pradesh PAC Battalions", classification: "Level 3", vacancies: "18,804 Posts", ageLimit: "18 - 25 Years (Male Only)", qualification: "10+2 (Intermediate) Pass from any recognized Board in India", payScale: "Pay Band 5200-20200 Grade Pay 2000 (Level 3: ₹21,700 - ₹69,100)" }
    ],
    categoryDistribution: {
      ur: "24,102",
      obc: "16,264",
      sc: "12,650",
      st: "1,204",
      ews: "6,024",
      total: "60,244"
    },
    examPatterns: [
      {
        tierName: "Written Examination (OMR Based)",
        mode: "Offline Pen-and-Paper (OMR Sheet)",
        totalQuestions: 150,
        totalMarks: 300,
        duration: "2 Hours (120 Minutes)",
        negativeMarking: "0.50 Marks (0.25 negative marks per question)",
        subjects: [
          { name: "General Knowledge (Samanya Gyan - UP Special, History, Geography)", questions: 38, marks: 76 },
          { name: "General Hindi (Samanya Hindi - Grammar, Literature, Vocabulary)", questions: 37, marks: 74 },
          { name: "Numerical & Mental Ability (Ankganit / Quantitative)", questions: 38, marks: 76 },
          { name: "Mental Aptitude, IQ & Reasoning Ability", questions: 37, marks: 74 }
        ]
      }
    ],
    physicalStandards: {
      maleHeight: "168 cm (General, OBC, SC) / 160 cm (ST Candidates)",
      maleChest: "79 cm unexpanded (84 cm with 5 cm expansion) / 77-82 cm for ST",
      malePhysicalTest: "Running: 4.8 km in 25 minutes",
      femaleHeight: "152 cm (General, OBC, SC) / 147 cm (ST Candidates) - Min Weight: 40 kg",
      femalePhysicalTest: "Running: 2.4 km in 14 minutes"
    },
    applicationSteps: [
      "Step 1: Visit the official UPPRPB recruitment portal at uppbpb.gov.in.",
      "Step 2: Enter Primary Registration (Name, DOB, Father's Name, 10th & 12th Roll Numbers, Aadhaar).",
      "Step 3: Receive Registration Number and OTP on registered mobile number, then activate your account.",
      "Step 4: Pay application fee of ₹400 via SBI e-pay (Net Banking, UPI, Credit Card, Debit Card).",
      "Step 5: Upload DigiLocker verified documents, photo (20KB - 50KB), and signature (5KB - 20KB) in black ink.",
      "Step 6: Submit final application and download the UP Police Constable confirmation slip."
    ],
    faqs: [
      { question: "How to download the UP Police Constable score card and normalized marks?", answer: "Candidates can visit uppbpb.gov.in, click on 'Constable Civil Police Scorecard 2026', enter their Registration Number and Date of Birth to view normalized marks and qualification status for PST/DV." },
      { question: "What is the physical running criteria for UP Police Constable?", answer: "Male candidates must complete a 4.8 km run in 25 minutes. Female candidates must complete a 2.4 km run in 14 minutes on the standard athletic track." },
      { question: "Can candidates from outside Uttar Pradesh (other states) apply?", answer: "Yes! Candidates from all 28 states and UTs are eligible to apply. Other state candidates are treated under the Unreserved (General) category." }
    ],
    usefulLinks: [
      { title: "UPPRPB Official Result Portal", description: "Direct link to check scorecards and cutoffs", url: "https://uppbpb.gov.in", isExternal: true, badge: "Result Active", badgeColor: "amber" },
      { title: "Download Official Cutoff Gazette PDF", description: "Category-wise normalized cutoff marks list", url: "https://uppbpb.gov.in", isExternal: true, badge: "Cutoff PDF", badgeColor: "blue" },
      { title: "Uttar Pradesh Police Recruitment Board", description: "Official homepage of UPPRPB", url: "https://uppbpb.gov.in", isExternal: true, badge: "Official Portal", badgeColor: "blue" }
    ]
  }
};

// Generates intelligent, comprehensive fallback data for ANY auto-synced government job
export function getEnrichedJobDetails(job: GovJobNotification): EnrichedJobDetails {
  // Check curated dataset first
  const curated = CURATED_JOB_DETAILS[job.id] || CURATED_JOB_DETAILS[job.slug];
  
  // Extract number from vacancies string (e.g. "14,582 Posts" -> 14582)
  const numVacancies = parseInt(job.vacancies.replace(/[^0-9]/g, ''), 10) || 1000;
  
  const defaultCategoryDistribution = {
    ur: Math.round(numVacancies * 0.40).toLocaleString('en-IN'),
    obc: Math.round(numVacancies * 0.27).toLocaleString('en-IN'),
    sc: Math.round(numVacancies * 0.15).toLocaleString('en-IN'),
    st: Math.round(numVacancies * 0.075).toLocaleString('en-IN'),
    ews: Math.round(numVacancies * 0.10).toLocaleString('en-IN'),
    total: job.vacancies
  };

  const defaultPostWiseDetails: PostWiseVacancy[] = [
    {
      postName: `${job.shortTitle} - Executive / Officer Cadre`,
      department: job.organization,
      classification: "Group B / Executive",
      vacancies: Math.round(numVacancies * 0.65).toLocaleString('en-IN') + " Posts",
      ageLimit: job.ageLimit,
      qualification: job.qualification,
      payScale: job.payScale
    },
    {
      postName: `${job.shortTitle} - Ministerial / Assistant Cadre`,
      department: job.organization,
      classification: "Group C / Ministerial",
      vacancies: Math.round(numVacancies * 0.35).toLocaleString('en-IN') + " Posts",
      ageLimit: job.ageLimit,
      qualification: job.qualification,
      payScale: job.payScale
    }
  ];

  const defaultExamPatterns: ExamPatternTier[] = [
    {
      tierName: "Phase 1: Computer Based Screening Examination (Objective)",
      mode: "Online Computer Based Test (CBT)",
      totalQuestions: 100,
      totalMarks: 200,
      duration: "60 to 90 Minutes",
      negativeMarking: "0.25 to 0.50 Marks per wrong answer",
      subjects: [
        { name: "General Intelligence & Reasoning Ability", questions: 25, marks: 50 },
        { name: "General Awareness & Current Affairs", questions: 25, marks: 50 },
        { name: "Quantitative Aptitude & Mathematical Skills", questions: 25, marks: 50 },
        { name: "Language Comprehension (English / Hindi)", questions: 25, marks: 50 }
      ]
    },
    {
      tierName: "Phase 2: Main Examination / Skill & Practical Test",
      mode: "Written Examination / Trade / Typing Skill Test",
      totalQuestions: "Comprehensive Pattern",
      totalMarks: "As per Official Gazette",
      duration: "120 Minutes",
      negativeMarking: "Applicable as per Commission rules",
      subjects: [
        { name: "Domain Knowledge / Subject Specific Paper", questions: 50, marks: 100 },
        { name: "General Studies & Advanced Analytical Aptitude", questions: 50, marks: 100 }
      ]
    }
  ];

  const defaultApplicationSteps = [
    `Step 1: Navigate to the official career portal (${job.organization}) using the official link provided below.`,
    `Step 2: Complete user registration with your Mobile Number, Email Address, and Valid Photo Identity Proof.`,
    `Step 3: Fill in your educational qualifications, communication address, and examination centre preferences.`,
    `Step 4: Upload scanned passport-sized photograph and signature matching official specifications.`,
    `Step 5: Review all entered information thoroughly before final confirmation to avoid discrepancies.`,
    `Step 6: Pay the prescribed application fee (${job.applicationFee.generalOBC || 'As specified in gazette'}) via online payment gateway.`,
    `Step 7: Download and preserve multiple printed copies of the submitted application form and transaction slip.`
  ];

  const defaultFaqs: JobFaqItem[] = [
    {
      question: `What is the last date to apply for ${job.shortTitle}?`,
      answer: job.importantDates.lastDate 
        ? `The official deadline for online application submission is ${job.importantDates.lastDate}. Candidates are advised to submit well before the closing date.`
        : `Applications are currently active. Please verify the official gazette link for the latest closing dates.`
    },
    {
      question: `What educational qualification is required for ${job.shortTitle}?`,
      answer: `Candidates must possess ${job.qualification} from an accredited Board or recognized University in India before the cut-off date.`
    },
    {
      question: `What is the age limit and category age relaxation?`,
      answer: `The prescribed age limit is ${job.ageLimit}. Upper age relaxation applies for reserved categories: SC/ST (5 years), OBC (3 years), PwBD (10 years), and Ex-Servicemen as per government orders.`
    },
    {
      question: `Is there negative marking in the ${job.shortTitle} exam?`,
      answer: `Yes, objective tests under this commission standardly implement negative marking of 0.25 to 0.33 marks deduction for every incorrect response.`
    },
    {
      question: `How can HireOrbitAI help check my eligibility for this post?`,
      answer: `You can upload your resume to HireOrbitAI. Our AI scanner analyzes your degree, age, skills, and background in 5 seconds to give you an instant eligibility verdict with personalized preparation tips.`
    }
  ];

  const defaultUsefulLinks: ImportantLinkItem[] = [
    {
      title: "Official Online Application Portal",
      description: "Direct official registration and login server",
      url: job.applyUrl,
      isExternal: true,
      badge: "Apply Online",
      badgeColor: "emerald"
    },
    {
      title: "Download Official Notification Gazette PDF",
      description: "Complete official recruitment circular and guidelines",
      url: job.officialPdfUrl,
      isExternal: true,
      badge: "Official PDF",
      badgeColor: "blue"
    },
    {
      title: "Official Recruiting Organization Website",
      description: `Homepage of ${job.organization}`,
      url: job.applyUrl,
      isExternal: true,
      badge: "Official Portal",
      badgeColor: "blue"
    },
    {
      title: "Verify Eligibility with HireOrbit AI",
      description: "Instant 5-second degree & age compatibility scan",
      url: "/onboarding",
      isExternal: false,
      badge: "AI Powered",
      badgeColor: "emerald"
    }
  ];

  return {
    postWiseDetails: curated?.postWiseDetails || defaultPostWiseDetails,
    categoryDistribution: curated?.categoryDistribution || defaultCategoryDistribution,
    examPatterns: curated?.examPatterns || defaultExamPatterns,
    physicalStandards: curated?.physicalStandards,
    applicationSteps: curated?.applicationSteps || defaultApplicationSteps,
    faqs: curated?.faqs || defaultFaqs,
    usefulLinks: curated?.usefulLinks || defaultUsefulLinks
  };
}
