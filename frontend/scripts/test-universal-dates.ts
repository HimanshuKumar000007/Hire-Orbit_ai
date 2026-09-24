import { getSupabaseClient } from '../lib/supabase';
import { normalizeToUniversalNotice, normalizeToUniversalRecruitmentNotice, cleanDateValue, isRealDateString } from '../lib/universal-notice-model';
import { GovJobNotification } from '../lib/gov-jobs-data';

interface TestCase {
  categoryName: string;
  isJobNotice?: boolean;
  queryFilter: { column: string; pattern: string };
}

const TEST_CASES: TestCase[] = [
  {
    categoryName: 'TNPSC Admit Card',
    queryFilter: { column: 'slug', pattern: 'tnpsc-group-1-admit-card-2026-out-download-hall-ticket' }
  },
  {
    categoryName: 'SSC Admit Card',
    queryFilter: { column: 'title', pattern: '%SSC%admit%' }
  },
  {
    categoryName: 'RRB Admit Card',
    queryFilter: { column: 'title', pattern: '%RRB%admit%' }
  },
  {
    categoryName: 'Police Admit Card',
    queryFilter: { column: 'title', pattern: '%Police%admit%' }
  },
  {
    categoryName: 'NTA / Teaching Admit Card',
    queryFilter: { column: 'title', pattern: '%UGC NET%admit%' }
  },
  {
    categoryName: 'Recruitment / Job Notice',
    isJobNotice: true,
    queryFilter: { column: 'type', pattern: 'job' }
  }
];

interface TableRow {
  title: string;
  type: string;
  examDate: string;
  examDateStatus: string;
  admitCardDate: string;
  admitCardStatus: string;
  applicationStart: string;
  applicationLastDate: string;
  feeLastDate: string;
  resultStatus: string;
}

async function runUniversalDateSuite() {
  console.log('========================================================================================');
  console.log('  HIREORBITAI: 6-CATEGORY UNIVERSAL STRUCTURED-DATE & WORKFLOW TEST SUITE');
  console.log('========================================================================================\n');

  const supabase = getSupabaseClient();
  let totalTests = 0;
  let passedTests = 0;
  const tableRows: TableRow[] = [];

  for (const tc of TEST_CASES) {
    console.log(`\n─── Testing Category: ${tc.categoryName} ───`);
    let query = supabase.from('gov_notifications').select('*');
    if (tc.queryFilter.column === 'slug') {
      query = query.eq('slug', tc.queryFilter.pattern);
    } else if (tc.queryFilter.column === 'type') {
      query = query.eq('type', tc.queryFilter.pattern);
    } else {
      query = query.ilike(tc.queryFilter.column, tc.queryFilter.pattern);
    }

    const { data, error } = await query.limit(1).maybeSingle();
    if (error || !data) {
      console.error(`  ✗ Failed to retrieve record for ${tc.categoryName}:`, error?.message || 'No record found');
      continue;
    }

    totalTests++;
    console.log(`  Found record: [${data.id}] ${data.title}`);
    console.log(`  Raw DB important_dates:`, JSON.stringify(data.important_dates));

    const job: GovJobNotification = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      shortTitle: data.short_title || data.title,
      organization: data.organization,
      category: data.category,
      type: data.type,
      badgeStatus: data.badge_status,
      badgeColor: data.badge_color,
      vacancies: data.vacancies,
      qualification: data.qualification,
      qualificationLevel: data.qualification_level,
      ageLimit: data.age_limit,
      payScale: data.pay_scale,
      applicationFee: data.application_fee || {},
      importantDates: data.important_dates || {},
      location: data.location,
      summary: data.summary,
      keyHighlights: data.key_highlights || [],
      selectionProcess: data.selection_process || [],
      officialPdfUrl: data.official_pdf_url,
      applyUrl: data.apply_url,
      updatedAt: 'Live Gazette Verified',
      isTrending: data.is_trending,
      isLeadStory: data.is_lead_story
    };

    let dates: any;
    let noticeTypeStr = job.type;
    let categoryPassed = true;

    if (tc.isJobNotice) {
      const notice = normalizeToUniversalRecruitmentNotice(job);
      dates = notice.dates;
      noticeTypeStr = 'job';
      console.log(`  → Recruitment Notice Status: ${notice.status} ("${notice.statusLabel}")`);
      console.log(`  → Application Window: ${dates.applicationStart || 'null'} to ${dates.applicationLastDate || 'null'} (Status: ${dates.applicationLastStatus})`);
      
      // Assertion for Job notice: must have valid date strings or null, no UI phrases
      if (dates.applicationLastDate && !isRealDateString(dates.applicationLastDate)) {
        console.error(`  ✗ FAIL: UI sentence found in recruitment applicationLastDate: "${dates.applicationLastDate}"`);
        categoryPassed = false;
      }
    } else {
      const notice = normalizeToUniversalNotice(job);
      dates = notice.dates;
      noticeTypeStr = 'admit-card';
      console.log(`  → Admit Card Notice Status: ${notice.status} ("${notice.statusLabel}")`);
      console.log(`  → Exam Date: ${dates.examDate ? `"${dates.examDate}"` : 'null'} (Status: ${dates.examDateStatus})`);
      console.log(`  → Admit Card Date: ${dates.admitCardDate ? `"${dates.admitCardDate}"` : 'null'} (Status: ${dates.admitCardStatus})`);
      console.log(`  → First Download Step: "${notice.downloadSteps[0]}"`);

      // Assertion 1: No UI sentences in date fields
      const dateFieldKeys = ['applicationStart', 'applicationLastDate', 'feeLastDate', 'correctionLastDate', 'citySlipDate', 'admitCardDate', 'examDate'] as const;
      for (const key of dateFieldKeys) {
        const d = dates[key];
        if (typeof d === 'string' && /announced|upcoming|check schedule|window closed|available now \/|to be notified/i.test(d)) {
          console.error(`  ✗ FAIL: UI sentence found in date field '${key}': "${d}"`);
          categoryPassed = false;
        }
      }

      // Assertion 2: Download instructions instead of "How to Apply"
      if (!notice.downloadSteps || notice.downloadSteps.length === 0 || !notice.downloadSteps[0].toLowerCase().includes('step 1')) {
        console.error(`  ✗ FAIL: Download steps missing or invalid!`);
        categoryPassed = false;
      }

      // Assertion 3: Specific TNPSC verification
      if (tc.categoryName === 'TNPSC Admit Card') {
        if (dates.examDate !== '27 September 2026') {
          console.error(`  ✗ FAIL: Expected TNPSC exam date '27 September 2026', got: '${dates.examDate}'`);
          categoryPassed = false;
        }
        if (dates.admitCardDate !== '18 September 2026') {
          console.error(`  ✗ FAIL: Expected TNPSC admit card date '18 September 2026', got: '${dates.admitCardDate}'`);
          categoryPassed = false;
        }
      }
    }

    if (categoryPassed) {
      passedTests++;
      console.log(`  ✓ PASSED: ${tc.categoryName} verified.`);
    }

    // Record for table
    tableRows.push({
      title: job.title.length > 40 ? job.title.substring(0, 37) + '...' : job.title,
      type: noticeTypeStr,
      examDate: dates.examDate || 'null',
      examDateStatus: dates.examDateStatus || 'null',
      admitCardDate: dates.admitCardDate || 'null',
      admitCardStatus: dates.admitCardStatus || 'null',
      applicationStart: dates.applicationStart || 'null',
      applicationLastDate: dates.applicationLastDate || 'null',
      feeLastDate: dates.feeLastDate || 'null',
      resultStatus: dates.resultStatus || 'null'
    });
  }

  // Print exact requested table
  console.log('\n==================================================================================================================================');
  console.log('                                                  UNIVERSAL DATES REPORT TABLE');
  console.log('==================================================================================================================================\n');

  console.log('| TITLE | TYPE | EXAM DATE | EXAM DATE STATUS | ADMIT CARD DATE | ADMIT CARD STATUS | APPLICATION START | APPLICATION LAST DATE | FEE LAST DATE | RESULT STATUS |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');
  for (const row of tableRows) {
    console.log(`| ${row.title} | ${row.type} | ${row.examDate} | ${row.examDateStatus} | ${row.admitCardDate} | ${row.admitCardStatus} | ${row.applicationStart} | ${row.applicationLastDate} | ${row.feeLastDate} | ${row.resultStatus} |`);
  }

  console.log('\n==================================================================================================================================');
  console.log(`  FINAL TEST SUMMARY: ${passedTests} / ${totalTests} CATEGORIES PASSED`);
  console.log('==================================================================================================================================\n');

  if (passedTests === totalTests && totalTests === TEST_CASES.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runUniversalDateSuite();
