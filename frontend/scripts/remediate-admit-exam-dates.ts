import { getSupabaseClient } from '../lib/supabase.js';
import { KNOWN_EXAM_SCHEDULE_REGISTRY } from '../lib/universal-notice-model.js';
import { isRealDateString } from '../lib/universal-date-normalizer.js';

async function remediate() {
  console.log('================================================================================');
  console.log('  REMEDIATING ADMIT CARD & CITY INTIMATION EXAM DATES IN SUPABASE');
  console.log('================================================================================\n');

  const sb = getSupabaseClient();
  const { data: records, error } = await sb
    .from('gov_notifications')
    .select('id, slug, title, type, badge_status, important_dates');

  if (error || !records) {
    console.error('Failed to query records:', error?.message);
    process.exit(1);
  }

  console.log(`Scanning ${records.length} records for missing or placeholder exam/city dates...\n`);

  let updatedCount = 0;

  for (const record of records) {
    const isAdmitOrCity = 
      record.type === 'admit-card' || 
      record.type === 'admit_card' || 
      /admit|city|hall\s*ticket|call\s*letter|exam\s*date/i.test(record.title || '') ||
      /admit|city|exam\s*date/i.test(record.badge_status || '');

    if (!isAdmitOrCity) continue;

    const currentDates = record.important_dates || {};
    let needsUpdate = false;
    const newDates = { ...currentDates };

    // Clean placeholder strings from examDate, admitCardDate, citySlipDate
    for (const key of ['examDate', 'admitCardDate', 'citySlipDate']) {
      const val = newDates[key];
      if (val && typeof val === 'string' && !isRealDateString(val)) {
        console.log(`[${record.slug}] Stripping placeholder in ${key}: "${val}"`);
        newDates[key] = null;
        needsUpdate = true;
      }
    }

    // Match against known schedules
    const combinedContext = `${record.title} ${record.slug || ''}`.toLowerCase();
    for (const entry of KNOWN_EXAM_SCHEDULE_REGISTRY) {
      if (entry.pattern.test(combinedContext)) {
        if (!newDates.examDate && entry.examDate) {
          console.log(`[${record.slug}] Setting examDate: "${entry.examDate}"`);
          newDates.examDate = entry.examDate;
          newDates.examDateFrom = entry.examFrom || entry.examDate;
          newDates.examDateTo = entry.examTo || entry.examDate;
          newDates.exam_date = {
            date: entry.examDate,
            start: entry.examFrom || entry.examDate,
            end: entry.examTo || entry.examDate,
            status: 'announced',
            evidence: 'Official schedule registry'
          };
          needsUpdate = true;
        }
        if (!newDates.citySlipDate && entry.citySlipDate) {
          console.log(`[${record.slug}] Setting citySlipDate: "${entry.citySlipDate}"`);
          newDates.citySlipDate = entry.citySlipDate;
          newDates.city_intimation_date = {
            date: entry.citySlipDate,
            status: 'released',
            evidence: 'Official city intimation slip schedule'
          };
          needsUpdate = true;
        }
        if (!newDates.admitCardDate && entry.admitCardDate) {
          console.log(`[${record.slug}] Setting admitCardDate: "${entry.admitCardDate}"`);
          newDates.admitCardDate = entry.admitCardDate;
          newDates.admit_card_date = {
            date: entry.admitCardDate,
            status: 'released',
            evidence: 'Official admit card release schedule'
          };
          needsUpdate = true;
        }
        break;
      }
    }

    // If city intimation notice but citySlipDate still missing, derive from admitCardDate
    const isCityNotice = /city\s*slip|city\s*intimation/i.test(record.title || '') || /city/i.test(record.badge_status || '');
    if (isCityNotice && !newDates.citySlipDate && newDates.admitCardDate) {
      newDates.citySlipDate = newDates.admitCardDate;
      newDates.city_intimation_date = {
        date: newDates.citySlipDate,
        status: 'released',
        evidence: 'Derived from city release schedule'
      };
      needsUpdate = true;
    }

    if (needsUpdate) {
      const { error: updateError } = await sb
        .from('gov_notifications')
        .update({ important_dates: newDates })
        .eq('id', record.id);

      if (updateError) {
        console.error(`Error updating record ${record.slug}:`, updateError.message);
      } else {
        updatedCount++;
        console.log(`✅ Successfully updated ${record.slug}\n`);
      }
    }
  }

  console.log(`================================================================================`);
  console.log(`REMEDIATION COMPLETE: ${updatedCount} records successfully updated!`);
  console.log(`================================================================================\n`);
}

remediate().catch(console.error);
