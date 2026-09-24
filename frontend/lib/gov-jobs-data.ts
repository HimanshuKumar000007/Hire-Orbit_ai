export interface GovJobNotification {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  organization: string;
  category: 'central' | 'railway' | 'banking' | 'police' | 'defense' | 'state' | 'teaching';
  type: 'job' | 'recruitment' | 'admit-card' | 'result' | 'answer-key';
  badgeStatus: string;
  badgeColor: 'emerald' | 'blue' | 'amber' | 'purple' | 'red';
  vacancies: string;
  qualification: string;
  qualificationLevel: '10th' | '12th' | 'graduate' | 'diploma' | 'postgraduate';
  ageLimit: string;
  payScale: string;
  applicationFee: {
    generalOBC: string;
    scStPh: string;
    female: string;
  };
  importantDates: {
    notificationDate?: string;
    startDate?: string;
    lastDate?: string;
    feeLastDate?: string;
    correctionStartDate?: string;
    correctionLastDate?: string;
    citySlipDate?: string;
    examDate?: string;
    shiftTimings?: string;
    admitCardDate?: string;
    answerKeyDate?: string;
    resultDate?: string;
  };
  location: string;
  summary: string;
  keyHighlights: string[];
  selectionProcess: string[];
  officialPdfUrl: string;
  applyUrl: string;
  updatedAt: string;
  isTrending?: boolean;
  isLeadStory?: boolean;
}

export const GOV_JOB_NOTIFICATIONS: GovJobNotification[] = [
  {
    id: 'ssc-cgl-2026',
    slug: 'ssc-cgl-2026-recruitment-notification',
    title: 'SSC CGL 2026 Notification Released: 14,582 Group B & C Vacancies',
    shortTitle: 'SSC CGL 2026 Online Form',
    organization: 'Staff Selection Commission (SSC)',
    category: 'central',
    type: 'job',
    badgeStatus: 'Applications Live',
    badgeColor: 'emerald',
    vacancies: '14,582 Posts',
    qualification: "Bachelor's Degree in any discipline (B.Com, BA, B.Sc, B.Tech)",
    qualificationLevel: 'graduate',
    ageLimit: '18 - 32 Years (Relaxation as per central rules)',
    payScale: 'Level 4 to Level 8 (₹25,500 to ₹1,51,100 per month)',
    applicationFee: {
      generalOBC: '₹100',
      scStPh: 'Exempted (₹0)',
      female: 'Exempted (₹0)',
    },
    importantDates: {
      startDate: 'Active Now',
      lastDate: '30 April 2026',
      feeLastDate: '01 May 2026',
      examDate: 'Tier-1: July 2026',
    },
    location: 'All India (Central Ministries & Departments)',
    summary: 'The Staff Selection Commission has officially notified 14,582 vacancies for Assistant Section Officers, Income Tax Inspectors, Central Excise Inspectors, Sub-Inspectors in CBI, and Auditors across Central Government ministries.',
    keyHighlights: [
      'Huge vacancy jump compared to last recruitment cycle',
      'Two-tier computer-based examination pattern',
      'No interview for Group B non-gazetted and Group C posts',
      'Negative marking: 0.50 marks per wrong answer in Tier 1'
    ],
    selectionProcess: [
      'Tier 1: Computer Based Objective Examination (200 Marks)',
      'Tier 2: Computer Based Examination + Data Entry Speed Test',
      'Document Verification & Medical Examination'
    ],
    officialPdfUrl: 'https://ssc.gov.in',
    applyUrl: 'https://ssc.gov.in',
    updatedAt: '12 mins ago',
    isTrending: true,
    isLeadStory: true,
  },
  {
    id: 'rrb-ntpc-2026',
    slug: 'railway-rrb-ntpc-2026-recruitment',
    title: 'Railway RRB NTPC 2026: 11,558 Graduate & Under-Graduate Posts',
    shortTitle: 'RRB NTPC 2026 Application',
    organization: 'Indian Railways (RRB)',
    category: 'railway',
    type: 'job',
    badgeStatus: 'Apply Online Open',
    badgeColor: 'emerald',
    vacancies: '11,558 Posts',
    qualification: '12th Pass (Undergraduate) OR Bachelor’s Degree (Graduate)',
    qualificationLevel: 'graduate',
    ageLimit: '18 - 36 Years (3 Years General Age Relaxation Included)',
    payScale: 'Level 2 to Level 6 (₹19,900 to ₹92,300 per month)',
    applicationFee: {
      generalOBC: '₹500 (₹400 refunded on appearing in CBT-1)',
      scStPh: '₹250 (Full refund on appearing in CBT-1)',
      female: '₹250 (Full refund on appearing in CBT-1)',
    },
    importantDates: {
      startDate: 'Active Now',
      lastDate: '15 May 2026',
      feeLastDate: '16 May 2026',
      examDate: 'CBT-1: August - September 2026',
    },
    location: 'All 21 RRB Zones Across India',
    summary: 'Railway Recruitment Boards have launched the centralized employment notice for non-technical popular categories including Station Master, Goods Train Manager, Senior Commercial cum Ticket Clerk, and Accounts Clerk.',
    keyHighlights: [
      'Over 8,000 Graduate and 3,400+ 12th Pass vacancies',
      'CBT-1 is screening only; marks not counted in final merit',
      'Full or partial application fee refunded upon taking CBT-1'
    ],
    selectionProcess: [
      '1st Stage Computer Based Test (CBT-1)',
      '2nd Stage Computer Based Test (CBT-2)',
      'Computer Based Aptitude Test (CBAT / Typing Skill Test where applicable)',
      'Document Verification & Medical Fitness Test'
    ],
    officialPdfUrl: 'https://indianrailways.gov.in',
    applyUrl: 'https://rrbapply.gov.in',
    updatedAt: '25 mins ago',
    isTrending: true,
  },
  {
    id: 'rrb-ntpc-10-plus-2-2026',
    slug: 'rrb-ntpc-10-plus-2-inter-level-recruitment-2026',
    title: 'RRB NTPC 10+2 Inter Level Recruitment 2026: 1,688 Posts Notification Out (CEN 07/2026)',
    shortTitle: 'RRB NTPC 10+2 Online Form 2026',
    organization: 'Indian Railways (RRB)',
    category: 'railway',
    type: 'job',
    badgeStatus: 'Apply from 15 Oct',
    badgeColor: 'emerald',
    vacancies: '1,688 Posts',
    qualification: '10+2 Intermediate with minimum 50% Marks (SC/ST/PH Pass Only) + Computer Typing (for Clerk/Typist)',
    qualificationLevel: '12th',
    ageLimit: '18 - 30 Years (As on 01 January 2027) + Relaxation as per rules',
    payScale: 'Level 2 to Level 3 (₹19,900 to ₹69,100 per month)',
    applicationFee: {
      generalOBC: '₹500 (₹400 refunded after appearing in Stage 1 CBT)',
      scStPh: '₹250 (Full ₹250 refunded after appearing in Stage 1 CBT)',
      female: '₹250 (Full ₹250 refunded after appearing in Stage 1 CBT)',
    },
    importantDates: {
      startDate: '15 October 2026',
      lastDate: '13 November 2026',
      feeLastDate: '15 November 2026',
      examDate: 'Notify Later (December 2026 / January 2027)',
      admitCardDate: '4 Days Before Examination',
      resultDate: 'To be Announced Post-Exam'
    },
    location: 'All 21 Railway Recruitment Boards (RRB Zones Across India)',
    summary: 'Railway Recruitment Board (RRB) has officially released the Short Notice for recruitment to Non-Technical Popular Categories (NTPC) 10+2 Under Graduate (Inter Level) posts under CEN 07/2026 for 1,688 positions. Online application starts on 15 October 2026 and closes on 13 November 2026.',
    keyHighlights: [
      '1,688 10+2 Intermediate Level Vacancies across Indian Railways',
      'Posts include Commercial cum Ticket Clerk, Accounts Clerk, Junior Clerk & Trains Clerk',
      'Application fee refunded to bank account after appearing in CBT-1 (₹400 for UR/OBC, ₹250 for SC/ST/Women)',
      'Single Stage 1 CBT common for all posts; Typing test applicable for typist posts only'
    ],
    selectionProcess: [
      '1st Stage Computer Based Test (CBT-1)',
      '2nd Stage Computer Based Test (CBT-2)',
      'Typing Skill Test (30 WPM English / 25 WPM Hindi on Computer for Typist posts)',
      'Document Verification (DV) & Medical Fitness Test'
    ],
    officialPdfUrl: 'https://rrbapply.gov.in',
    applyUrl: 'https://rrbapply.gov.in',
    updatedAt: 'Official Gazette Verified',
    isTrending: true,
  },
  {
    id: 'rrb-ntpc-inter-level-07-2026',
    slug: 'rrb-ntpc-inter-level-07-2026',
    title: 'RRB NTPC 10+2 Inter Level Recruitment 2026: 1,688 Posts Notification Out (CEN 07/2026)',
    shortTitle: 'RRB NTPC 10+2 Online Form 2026',
    organization: 'Indian Railways (RRB)',
    category: 'railway',
    type: 'job',
    badgeStatus: 'Apply from 15 Oct',
    badgeColor: 'emerald',
    vacancies: '1,688 Posts',
    qualification: '10+2 Intermediate with minimum 50% Marks (SC/ST/PH Pass Only) + Computer Typing (for Clerk/Typist)',
    qualificationLevel: '12th',
    ageLimit: '18 - 30 Years (As on 01 January 2027) + Relaxation as per rules',
    payScale: 'Level 2 to Level 3 (₹19,900 to ₹69,100 per month)',
    applicationFee: {
      generalOBC: '₹500 (₹400 refunded after appearing in Stage 1 CBT)',
      scStPh: '₹250 (Full ₹250 refunded after appearing in Stage 1 CBT)',
      female: '₹250 (Full ₹250 refunded after appearing in Stage 1 CBT)',
    },
    importantDates: {
      startDate: '15 October 2026',
      lastDate: '13 November 2026',
      feeLastDate: '15 November 2026',
      examDate: 'Notify Later (December 2026 / January 2027)',
      admitCardDate: '4 Days Before Examination',
      resultDate: 'To be Announced Post-Exam'
    },
    location: 'All 21 Railway Recruitment Boards (RRB Zones Across India)',
    summary: 'Railway Recruitment Board (RRB) has officially released the Short Notice for recruitment to Non-Technical Popular Categories (NTPC) 10+2 Under Graduate (Inter Level) posts under CEN 07/2026 for 1,688 positions. Online application starts on 15 October 2026 and closes on 13 November 2026.',
    keyHighlights: [
      '1,688 10+2 Intermediate Level Vacancies across Indian Railways',
      'Posts include Commercial cum Ticket Clerk, Accounts Clerk, Junior Clerk & Trains Clerk',
      'Application fee refunded to bank account after appearing in CBT-1 (₹400 for UR/OBC, ₹250 for SC/ST/Women)',
      'Single Stage 1 CBT common for all posts; Typing test applicable for typist posts only'
    ],
    selectionProcess: [
      '1st Stage Computer Based Test (CBT-1)',
      '2nd Stage Computer Based Test (CBT-2)',
      'Typing Skill Test (30 WPM English / 25 WPM Hindi on Computer for Typist posts)',
      'Document Verification (DV) & Medical Fitness Test'
    ],
    officialPdfUrl: 'https://rrbapply.gov.in',
    applyUrl: 'https://rrbapply.gov.in',
    updatedAt: 'Official Gazette Verified',
    isTrending: true,
  },
  {
    id: 'up-police-constable-2026',
    slug: 'up-police-constable-re-exam-result-cutoffs',
    title: 'UP Police Constable 60,244 Posts: Scorecard & Category-Wise Cutoff Released',
    shortTitle: 'UP Police Constable Result',
    organization: 'UPPRPB (Uttar Pradesh Police)',
    category: 'police',
    type: 'result',
    badgeStatus: 'Result Declared',
    badgeColor: 'amber',
    vacancies: '60,244 Posts',
    qualification: '10+2 (Intermediate) Pass from any recognized Board',
    qualificationLevel: '12th',
    ageLimit: '18 - 25 Years (Male) / 18 - 28 Years (Female)',
    payScale: 'Pay Band 5200-20200, Grade Pay 2000 (Level 3: ₹21,700 - ₹69,100)',
    applicationFee: {
      generalOBC: '₹400',
      scStPh: '₹400',
      female: '₹400',
    },
    importantDates: {
      resultDate: 'Announced Today',
      examDate: 'Re-Exam Conducted in Aug 2025/2026',
    },
    location: 'Uttar Pradesh',
    summary: 'The Uttar Pradesh Police Recruitment and Promotion Board has published the official normalized merit scorecards and category-wise cutoffs for the 60,244 Constable Civil Police recruitment test.',
    keyHighlights: [
      'Normalised marks calculated using equi-percentile method',
      'Physical Standard Test (PST) & Document Verification call letters starting next week',
      'Total qualified candidates for PST: approx 2.5 times the vacancies'
    ],
    selectionProcess: [
      'Written Examination (300 Marks - Done)',
      'Physical Standard Test (PST) & Document Verification (Upcoming)',
      'Physical Efficiency Test (PET - Running)',
      'Final Merit List & Medical Examination'
    ],
    officialPdfUrl: 'https://uppbpb.gov.in',
    applyUrl: 'https://uppbpb.gov.in',
    updatedAt: '40 mins ago',
    isTrending: true,
  },
  {
    id: 'sbi-po-2026',
    slug: 'sbi-po-2026-prelims-admit-card-download',
    title: 'SBI PO 2026: Preliminary Examination Hall Ticket & Admit Card Active',
    shortTitle: 'SBI PO Prelims Admit Card',
    organization: 'State Bank of India (SBI)',
    category: 'banking',
    type: 'admit-card',
    badgeStatus: 'Admit Card Live',
    badgeColor: 'blue',
    vacancies: '2,000 Posts',
    qualification: 'Graduation in any discipline from a recognized University',
    qualificationLevel: 'graduate',
    ageLimit: '21 - 30 Years',
    payScale: 'Starting basic pay of ₹41,960 + 4 advance increments',
    applicationFee: {
      generalOBC: '₹750',
      scStPh: 'Exempted (₹0)',
      female: '₹750 / Category exempt',
    },
    importantDates: {
      admitCardDate: 'Available Now',
      examDate: '18 - 25 May 2026',
    },
    location: 'Pan India Branches',
    summary: 'State Bank of India has activated the direct download server link for the Probationary Officers Phase-I Preliminary Online Examination call letters.',
    keyHighlights: [
      'Mandatory to carry original government photo ID and photocopy',
      'Sectional timing of 20 minutes for English, Quantitative Aptitude, and Reasoning',
      'No sectional cutoffs in SBI PO Prelims, only overall category cutoff'
    ],
    selectionProcess: [
      'Phase I: Preliminary Exam (100 Marks)',
      'Phase II: Main Exam (Objective + Descriptive 250 Marks)',
      'Phase III: Psychometric Test, Interview & Group Exercises'
    ],
    officialPdfUrl: 'https://sbi.co.in/careers',
    applyUrl: 'https://ibpsonline.ibps.in',
    updatedAt: '1 hour ago',
  },
  {
    id: 'upsc-cse-2026',
    slug: 'upsc-civil-services-ias-ips-2026-prelims-notification',
    title: 'UPSC Civil Services 2026: IAS, IPS, IFS Preliminary Examination',
    shortTitle: 'UPSC IAS / IPS 2026',
    organization: 'Union Public Service Commission (UPSC)',
    category: 'central',
    type: 'admit-card',
    badgeStatus: 'Admit Card Available',
    badgeColor: 'blue',
    vacancies: '1,056 Posts',
    qualification: 'Graduate in any discipline (B.Com, BA, B.Sc, MBBS, B.Tech)',
    qualificationLevel: 'graduate',
    ageLimit: '21 - 32 Years (Up to 6 attempts for General, relaxed for others)',
    payScale: 'Level 10 (₹56,100 to ₹2,50,000 for Cabinet Secretary level)',
    applicationFee: {
      generalOBC: '₹100',
      scStPh: 'Exempted (₹0)',
      female: 'Exempted (₹0)',
    },
    importantDates: {
      examDate: '24 May 2026 (Sunday)',
      admitCardDate: 'Active on e-Summon portal',
    },
    location: 'All India Services & Central Civil Services',
    summary: 'The Union Public Service Commission has released the e-Admit Cards for the Civil Services (Preliminary) Examination 2026 across 77 examination cities nationwide.',
    keyHighlights: [
      'Two objective papers: GS Paper I (Cutoff) and GS Paper II CSAT (Qualifying at 33%)',
      'Negative marking: One-third (0.33) deducted per wrong answer',
      'E-admit card entry gates close 30 minutes prior to session start'
    ],
    selectionProcess: [
      'Civil Services Preliminary Examination (Objective)',
      'Civil Services Main Examination (Written Descriptive - 9 Papers)',
      'Personality Test (Interview - 275 Marks)'
    ],
    officialPdfUrl: 'https://upsc.gov.in',
    applyUrl: 'https://upsconline.nic.in',
    updatedAt: '2 hours ago',
  },
  {
    id: 'ssc-chsl-2026',
    slug: 'ssc-chsl-10-plus-2-2026-notification',
    title: 'SSC CHSL 2026: 3,712 Posts for 10+2 Intermediates (LDC, JSA, DEO)',
    shortTitle: 'SSC CHSL 10+2 Form',
    organization: 'Staff Selection Commission (SSC)',
    category: 'central',
    type: 'job',
    badgeStatus: 'Applications Open',
    badgeColor: 'emerald',
    vacancies: '3,712 Posts',
    qualification: '12th Standard Pass from a recognized Board or University',
    qualificationLevel: '12th',
    ageLimit: '18 - 27 Years',
    payScale: 'Level 2 (₹19,900 - ₹63,200) & Level 4 (₹25,500 - ₹81,100)',
    applicationFee: {
      generalOBC: '₹100',
      scStPh: '₹0',
      female: '₹0',
    },
    importantDates: {
      startDate: 'Active Now',
      lastDate: '20 May 2026',
      examDate: 'Tier-1: July / August 2026',
    },
    location: 'Central Ministries & Offices Nationwide',
    summary: 'Great opportunity for 12th pass students across India. Recruits Lower Division Clerks (LDC), Junior Secretariat Assistants (JSA), and Data Entry Operators (DEO).',
    keyHighlights: [
      'Minimum qualification is only 12th pass',
      'Tier 1 computer-based test of 100 questions (200 marks)',
      'Skill Test / Typing Test conducted in Tier 2'
    ],
    selectionProcess: [
      'Tier-1 Computer Based Examination',
      'Tier-2 Objective + Skill/Typing Test',
      'Document Verification'
    ],
    officialPdfUrl: 'https://ssc.gov.in',
    applyUrl: 'https://ssc.gov.in',
    updatedAt: '3 hours ago',
  },
  {
    id: 'rrb-alp-2026',
    slug: 'railway-rrb-alp-cbt-2-exam-city-admit-card',
    title: 'Railway RRB ALP: 18,799 Assistant Loco Pilot Exam City Intimation & CBT-2 Schedule',
    shortTitle: 'RRB ALP CBT-2 Update',
    organization: 'Railway Recruitment Boards (RRB)',
    category: 'railway',
    type: 'admit-card',
    badgeStatus: 'Exam City Active',
    badgeColor: 'blue',
    vacancies: '18,799 Posts',
    qualification: 'Matriculation (10th) + ITI / Act Apprentice OR Diploma/B.Tech in Engineering',
    qualificationLevel: 'diploma',
    ageLimit: '18 - 33 Years',
    payScale: 'Level 2 (Initial Pay ₹19,900 + Running Allowances)',
    applicationFee: {
      generalOBC: '₹500',
      scStPh: '₹250',
      female: '₹250',
    },
    importantDates: {
      examDate: 'CBT-2: June 2026',
      admitCardDate: '4 Days before exam date',
    },
    location: 'All Railway Zones across India',
    summary: 'RRB has uploaded the Exam City and Date Intimation slip for candidates qualified for the 2nd Stage Computer Based Test (CBT-2) for 18,799 Assistant Loco Pilot vacancies.',
    keyHighlights: [
      'CBT-2 Part A determines merit for next stage',
      'Part B is qualifying in relevant trade (35% marks required)',
      'Free travel pass activated for SC/ST candidates'
    ],
    selectionProcess: [
      'CBT-1 (Done)',
      'CBT-2 (Part A + Part B)',
      'Computer Based Aptitude Test (CBAT)',
      'Document Verification & Medical Exam (A1 Standard)'
    ],
    officialPdfUrl: 'https://indianrailways.gov.in',
    applyUrl: 'https://rrbapply.gov.in',
    updatedAt: '4 hours ago',
  },
  {
    id: 'ctet-2026',
    slug: 'ctet-2026-official-provisional-answer-key-challenge',
    title: 'CTET 2026: Official Provisional Answer Key & OMR Sheet Released by CBSE',
    shortTitle: 'CTET Official Answer Key',
    organization: 'Central Board of Secondary Education (CBSE)',
    category: 'teaching',
    type: 'answer-key',
    badgeStatus: 'Answer Key Out',
    badgeColor: 'purple',
    vacancies: 'National Eligibility Certificate',
    qualification: 'Senior Secondary or Graduation + D.El.Ed / B.Ed',
    qualificationLevel: 'graduate',
    ageLimit: 'No upper age limit',
    payScale: 'Qualifying certificate for PRT/TGT/PGT recruitment in KVS, NVS & State Schools',
    applicationFee: {
      generalOBC: '₹1,000 (Single Paper) / ₹1,200 (Both)',
      scStPh: '₹500 / ₹600',
      female: 'As per category',
    },
    importantDates: {
      resultDate: 'Expected next week',
    },
    location: 'Pan India Exam Centers',
    summary: 'CBSE has hosted the scanned images of OMR answer sheets and provisional answer keys for candidates of the Central Teacher Eligibility Test on ctet.nic.in with objection window open.',
    keyHighlights: [
      'Challenging fee: ₹1,000 per question (refunded if objection accepted)',
      'General category qualifying score: 60% (90/150)',
      'SC/ST/OBC qualifying score: 55% (82/150)',
      'CTET certificate validity is now lifetime'
    ],
    selectionProcess: [
      'Paper 1 (For Classes I to V - Primary Stage)',
      'Paper 2 (For Classes VI to VIII - Elementary Stage)',
      'DigiLocker issuance of Certificate'
    ],
    officialPdfUrl: 'https://ctet.nic.in',
    applyUrl: 'https://ctet.nic.in',
    updatedAt: '5 hours ago',
  },
  {
    id: 'bpsc-70th-cce-2026',
    slug: 'bpsc-70th-combined-competitive-exam-notification',
    title: 'BPSC 70th CCE 2026: 1,957 Administrative & Police Service Vacancies Announced',
    shortTitle: 'BPSC 70th CCE Notification',
    organization: 'Bihar Public Service Commission (BPSC)',
    category: 'state',
    type: 'job',
    badgeStatus: 'Notification Out',
    badgeColor: 'emerald',
    vacancies: '1,957 Posts',
    qualification: 'Bachelor’s Degree in any discipline from a recognized University',
    qualificationLevel: 'graduate',
    ageLimit: '20/21/22 to 37 Years (Male) / 40 Years (Female / BC / EBC)',
    payScale: 'Level 7 & Level 9 (₹44,900 to ₹1,42,400)',
    applicationFee: {
      generalOBC: '₹600',
      scStPh: '₹150 (Bihar Domicile)',
      female: '₹150 (Bihar Domicile)',
    },
    importantDates: {
      startDate: 'Active Now',
      lastDate: '25 May 2026',
      examDate: 'Prelims: August 2026',
    },
    location: 'Bihar',
    summary: 'The Bihar Public Service Commission has released the official advertisement for the 70th Combined Competitive Examination to recruit Sub-Divisional Officers (SDO), Deputy Superintendents of Police (Dy. SP), Revenue Officers, and Block Welfare Officers across Bihar.',
    keyHighlights: [
      'Largest vacancy count in state administrative services this year',
      'Negative marking of 1/3rd (0.33) marks per incorrect answer',
      'Integrated CCE pattern for both General Administrative and Special departments'
    ],
    selectionProcess: [
      'Preliminary Examination (150 Marks Objective)',
      'Mains Written Examination (Subjective GS-1, GS-2, Essay & Optional)',
      'Personality Test / Interview (120 Marks)'
    ],
    officialPdfUrl: 'https://bpsc.bih.nic.in',
    applyUrl: 'https://bpsc.bih.nic.in',
    updatedAt: '6 hours ago',
    isTrending: true,
  },
  {
    id: 'uppsc-pcs-2026',
    slug: 'uppsc-combined-state-upper-subordinate-services-pcs-2026',
    title: 'UPPSC PCS 2026: Combined State / Upper Subordinate Services Prelims Exam',
    shortTitle: 'UPPSC PCS 2026 Prelims',
    organization: 'Uttar Pradesh Public Service Commission (UPPSC)',
    category: 'state',
    type: 'admit-card',
    badgeStatus: 'Exam Date Active',
    badgeColor: 'blue',
    vacancies: '920 Posts',
    qualification: 'Graduate Degree in any discipline (Special criteria for specific posts)',
    qualificationLevel: 'graduate',
    ageLimit: '21 - 40 Years (Relaxation up to 5 years for SC/ST/OBC/State Govt Employees)',
    payScale: 'Pay Band ₹9,300-34,800 Grade Pay ₹4,200 to ₹15,600-39,100 Grade Pay ₹5,400',
    applicationFee: {
      generalOBC: '₹125',
      scStPh: '₹65',
      female: 'As per category',
    },
    importantDates: {
      examDate: 'Prelims: July 2026',
      admitCardDate: '10 Days Prior to Exam',
    },
    location: 'Uttar Pradesh',
    summary: 'Uttar Pradesh Public Service Commission has announced the schedule and exam district verification portal for the PCS Preliminary Examination for executive officer, DSP, ARTO, and District Commandant posts.',
    keyHighlights: [
      'Paper 1 (GS) determines merit for Mains examination',
      'Paper 2 (CSAT) is qualifying with mandatory 33% cutoff',
      'OMR-based multi-city testing across all 75 districts of UP'
    ],
    selectionProcess: [
      'Preliminary Examination (Paper 1 & Paper 2 CSAT)',
      'Mains Written Examination (8 Descriptive Papers including UP Special GS 5 & 6)',
      'Personality Interview (100 Marks)'
    ],
    officialPdfUrl: 'https://uppsc.up.nic.in',
    applyUrl: 'https://uppsc.up.nic.in',
    updatedAt: '8 hours ago',
  },
  {
    id: 'ssc-gd-constable-2026',
    slug: 'ssc-gd-constable-2026-notification-bsf-cisf-crpf',
    title: 'SSC GD Constable 2026: 39,481 Vacancies in BSF, CISF, CRPF, SSB, ITBP, SSF & Assam Rifles',
    shortTitle: 'SSC GD Constable 2026 Form',
    organization: 'Staff Selection Commission (SSC)',
    category: 'central',
    type: 'job',
    badgeStatus: 'Applications Open',
    badgeColor: 'emerald',
    vacancies: '39,481 Posts',
    qualification: 'Matriculation or 10th Class Examination Pass from a recognized Board',
    qualificationLevel: '10th',
    ageLimit: '18 - 23 Years (Relaxation as per central government norms)',
    payScale: 'Pay Level 3 (₹21,700 - ₹69,100)',
    applicationFee: {
      generalOBC: '₹100',
      scStPh: 'Exempted (₹0)',
      female: 'Exempted (₹0)',
    },
    importantDates: {
      startDate: 'Active Now',
      lastDate: '31 May 2026',
      examDate: 'CBE: September - October 2026',
    },
    location: 'All India (Central Armed Police Forces)',
    summary: 'Staff Selection Commission has issued the national open recruitment notification for General Duty Constables across CAPFs including Border Security Force (BSF), Central Industrial Security Force (CISF), Central Reserve Police Force (CRPF), Indo-Tibetan Border Police (ITBP), Sashastra Seema Bal (SSB), and Secretariat Security Force (SSF).',
    keyHighlights: [
      'Massive 39,481 vacancy recruitment drive for 10th pass candidates',
      'Computer Based Examination (CBE) available in 13 regional languages plus English & Hindi',
      'Physical Standard Test (PST) and Physical Efficiency Test (PET) for written qualifiers'
    ],
    selectionProcess: [
      'Computer Based Examination (CBE - 80 Questions / 160 Marks)',
      'Physical Standard Test (PST) & Physical Efficiency Test (PET)',
      'Detailed Medical Examination (DME) & Document Verification'
    ],
    officialPdfUrl: 'https://ssc.gov.in',
    applyUrl: 'https://ssc.gov.in',
    updatedAt: '15 mins ago',
    isTrending: true,
  },
  {
    id: 'ugc-net-admit-card-2026',
    slug: 'ugc-net-admit-card-2026',
    title: 'UGC NET Admit Card 2026 Released, Download Exam Hall Ticket & City Slip',
    shortTitle: 'UGC NET Admit Card 2026',
    organization: 'National Testing Agency (NTA)',
    category: 'teaching',
    type: 'admit-card',
    badgeStatus: 'Admit Card Live',
    badgeColor: 'emerald',
    vacancies: 'Eligibility Test (N/A)',
    qualification: "Master's Degree with minimum 55% marks (50% for SC/ST/OBC/PwD)",
    qualificationLevel: 'postgraduate',
    ageLimit: 'JRF: Max 30 Years | Assistant Professor: No Upper Age Limit',
    payScale: 'JRF Fellowship ₹37,000/pm + HRA | Asst Professor Pay Level 10',
    applicationFee: {
      generalOBC: '₹1,150 (UR) / ₹600 (EWS/OBC-NCL)',
      scStPh: '₹325 (SC/ST/PwD/Third Gender)',
      female: 'As per Category',
    },
    importantDates: {
      startDate: 'Completed',
      lastDate: 'Registration Closed',
      citySlipDate: 'Available Now',
      admitCardDate: 'Available Now',
      examDate: 'June 22 to 30, 2026 (CBT)',
      resultDate: 'To be Announced Post-Exam'
    },
    location: 'All India (National Testing Agency Venues)',
    summary: 'National Testing Agency (NTA) has officially released the Admit Card and Advance City Intimation slip for the UGC NET 2026 examination for Assistant Professor eligibility and Junior Research Fellowship (JRF). Candidates can download their hall ticket by logging in with their Application Number and Date of Birth.',
    keyHighlights: [
      'Official Hall Ticket released by National Testing Agency (NTA)',
      'Examination conducted across 83 subjects in Computer Based Test (CBT) mode',
      'Mandatory to carry printed admit card and original government photo identity proof',
      'Advance Exam City intimation slip active on official portal ugcnet.nta.ac.in'
    ],
    selectionProcess: [
      'Paper 1: General Teaching & Research Aptitude (50 Questions / 100 Marks)',
      'Paper 2: Selected Subject Domain (100 Questions / 200 Marks)',
      'Total Duration: 3 Hours (180 Minutes, No Break Between Papers)',
      'No Negative Marking for Incorrect Answers'
    ],
    officialPdfUrl: 'https://ugcnet.nta.ac.in',
    applyUrl: 'https://ugcnet.nta.ac.in',
    updatedAt: 'Official Gazette Verified',
    isTrending: true,
  }
];

export const BREAKING_TICKER_ITEMS = [
  "🚨 LIVE: SSC CGL 2026 official notification published for 14,582 Group B & C vacancies. Online forms active.",
  "⚡ Railway RRB NTPC 2026 centralized registration open across all 21 zones for 11,558 positions.",
  "📢 UP Police Constable 60,244 recruitment scorecards & normalized cutoffs announced by UPPRPB.",
  "🎟️ State Bank of India (SBI) releases Phase-1 Preliminary Exam Hall Ticket for 2,000 Probationary Officers.",
  "🏛️ UPSC Civil Services IAS/IPS 2026 e-Admit Cards available for download for May 24 exam.",
  "💡 Scan your resume on HireOrbitAI to check instant eligibility for all Central & State government vacancies in 5 seconds."
];
