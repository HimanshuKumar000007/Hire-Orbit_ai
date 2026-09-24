import { getSupabaseClient } from '../lib/supabase';
import { normalizeToUniversalNotice } from '../lib/universal-notice-model';
import { GovJobNotification } from '../lib/gov-jobs-data';

interface TestCase {
  categoryName: string;
  queryFilter: { column: string; pattern: string };
}

const TEST_CASES: TestCase[] = [
  {
    categoryName: 'TNPSC',
    queryFilter: { column: 'slug', pattern: 'tnpsc-group-1-admit-card-2026-out-download-hall-ticket' }
  },
  {
    categoryName: 'SSC',
    queryFilter: { column: 'title', pattern: '%SSC%admit%' }
  },
  {
    categoryName: 'RRB',
    queryFilter: { column: 'title', pattern: '%RRB%admit%' }
  },
  {
    categoryName: 'Police',
    queryFilter: { column: 'title', pattern: '%Police%admit%' }
  },
  {
    categoryName: 'NTA / Teaching',
    queryFilter: { column: 'title', pattern: '%UGC NET%admit%' }
  }
];

async function runTestSuite() {
  console.log('=====================================================================');
  console.log('  HIREORBITAI: UNIVERSAL ADMIT CARD DATE EXTRACTION & RENDERING SUITE');
  console.log('=====================================================================\n');

  const supabase = getSupabaseClient();
  let totalTests = 0;
  let passedTests = 0;

  for (const tc of TEST_CASES) {
    console.log(`\n─── Testing Category: ${tc.categoryName} ───`);
    let query = supabase.from('gov_notifications').select('*');
    if (tc.queryFilter.column === 'slug') {
      query = query.eq('slug', tc.queryFilter.pattern);
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

    // Convert Supabase record to GovJobNotification shape
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

    // Normalize to UniversalNotice
    const notice = normalizeToUniversalNotice(job);

    console.log(`  → Normalized Status: ${notice.status} ("${notice.statusLabel}")`);
    console.log(`  → Exam Date: ${notice.dates.examDate ? `"${notice.dates.examDate}"` : 'null / not specified in source'}`);
    console.log(`  → Exam Date Status: ${notice.dates.examDateStatus}`);
    console.log(`  → Admit Card Date: ${notice.dates.admitCardDate ? `"${notice.dates.admitCardDate}"` : 'null'}`);
    console.log(`  → Admit Card Status: ${notice.dates.admitCardStatus}`);
    console.log(`  → First Download Step: "${notice.downloadSteps[0]}"`);

    // Assertions
    let categoryPassed = true;

    // Check 1: No UI sentences inside date fields
    const dateFieldKeys = ['applicationStart', 'applicationLastDate', 'feeLastDate', 'correctionLastDate', 'citySlipDate', 'admitCardDate', 'examDate', 'shiftTimings', 'answerKeyDate', 'resultDate'] as const;
    for (const key of dateFieldKeys) {
      const d = notice.dates[key];
      if (typeof d === 'string' && /announced|upcoming|check schedule|window closed|available now \/|to be notified/i.test(d)) {
        console.error(`  ✗ FAIL: UI sentence found in date field '${key}': "${d}"`);
        categoryPassed = false;
      }
    }

    // Check 2: No conflicting status (cannot say upcoming when released)
    if (notice.status === 'ADMIT_CARD_AVAILABLE') {
      if (notice.statusLabel.toLowerCase().includes('upcoming') || notice.dates.admitCardDate?.includes('Upcoming')) {
        console.error(`  ✗ FAIL: Conflicting upcoming status when admit card is released!`);
        categoryPassed = false;
      }
    }

    // Check 3: Download instructions instead of "How to Apply"
    if (notice.downloadSteps.length === 0 || !notice.downloadSteps[0].toLowerCase().includes('step 1')) {
      console.error(`  ✗ FAIL: Download steps missing!`);
      categoryPassed = false;
    }

    // Check 4: Specific TNPSC verification
    if (tc.categoryName === 'TNPSC') {
      if (notice.dates.examDate !== '27 September 2026') {
        console.error(`  ✗ FAIL: Expected TNPSC exam date '27 September 2026', got: '${notice.dates.examDate}'`);
        categoryPassed = false;
      }
      if (notice.dates.admitCardDate !== '18 September 2026') {
        console.error(`  ✗ FAIL: Expected TNPSC admit card date '18 September 2026', got: '${notice.dates.admitCardDate}'`);
        categoryPassed = false;
      }
    }

    if (categoryPassed) {
      passedTests++;
      console.log(`  ✓ PASSED: Clean dates & download workflow verified for ${tc.categoryName}`);
    }
  }

  console.log('\n=====================================================================');
  console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} CATEGORIES PASSED`);
  console.log('=====================================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite();
