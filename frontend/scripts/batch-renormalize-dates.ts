/**
 * Safe Batch Re-Normalization & Deep Extraction Script for Supabase
 *
 * Scans all gov_notifications in Supabase, strips legacy placeholder text,
 * applies universal date extraction across titles, summaries, and source articles,
 * and updates important_dates with clean, structured values.
 *
 * ZERO exam-specific hardcoding. Completely universal.
 */

import { getSupabaseClient } from '../lib/supabase';
import { normalizeGovernmentNoticeDates, cleanDateValue, isRealDateString } from '../lib/universal-date-normalizer';
import { deepExtractFromNotice } from '../lib/deep-date-extractor';

async function batchRenormalize() {
  console.log('========================================================================================');
  console.log('  HIREORBITAI: UNIVERSAL BATCH DATE RE-NORMALIZATION & DEEP EXTRACTION');
  console.log('========================================================================================\n');

  const supabase = getSupabaseClient();
  const { data: records, error } = await supabase
    .from('gov_notifications')
    .select('id, slug, title, summary, important_dates, type, badge_status, official_pdf_url, apply_url')
    .order('created_at', { ascending: false });

  if (error || !records) {
    console.error('Failed to fetch records from Supabase:', error);
    process.exit(1);
  }

  console.log(`Fetched ${records.length} records from Supabase for re-normalization.\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const row of records) {
    const rawDates = row.important_dates || {};
    
    // 1. Initial Universal Normalization (from DB dates + Title + Summary)
    let norm = normalizeGovernmentNoticeDates(rawDates, {
      title: row.title,
      summary: row.summary,
      type: row.type,
      badgeStatus: row.badge_status
    });

    // 2. If Exam Date or Admit Card Date missing for admit cards, attempt deep extraction from article
    let deepExamDate = norm.examDate;
    let deepExamFrom = norm.examDateFrom;
    let deepExamTo = norm.examDateTo;
    let deepExamEvidence = norm.models.examDate.evidence;
    let deepAdmitDate = norm.admitCardDate;
    let deepAdmitEvidence = norm.models.admitCardDate.evidence;

    const needsDeep = (!norm.examDate || !norm.admitCardDate) && (row.type === 'admit-card' || /admit/i.test(row.title));
    const targetUrl = row.official_pdf_url || row.apply_url;

    if (needsDeep && targetUrl && (targetUrl.includes('news.google.com') || targetUrl.includes('pw.live') || targetUrl.includes('adda247'))) {
      try {
        const deep = await deepExtractFromNotice(row.title, row.summary || '', targetUrl);
        if (!deepExamDate && deep.examDate) {
          deepExamDate = deep.examDate;
          deepExamFrom = deep.examDateFrom;
          deepExamTo = deep.examDateTo;
          deepExamEvidence = deep.examDateEvidence;
        }
        if (!deepAdmitDate && deep.admitCardDate) {
          deepAdmitDate = deep.admitCardDate;
          deepAdmitEvidence = deep.admitCardEvidence;
        }
      } catch (err: any) {
        // Silently skip network failures for individual records
      }
    }

    // 3. Construct Cleaned Object (Never contains placeholder sentences)
    const cleanedDates: Record<string, any> = {
      examDate: deepExamDate || null,
      examDateFrom: deepExamFrom || null,
      examDateTo: deepExamTo || null,
      examDateEvidence: deepExamEvidence || null,
      admitCardDate: deepAdmitDate || null,
      admitCardEvidence: deepAdmitEvidence || null,
      startDate: cleanDateValue(rawDates.startDate) || norm.applicationStart || null,
      lastDate: cleanDateValue(rawDates.lastDate) || norm.applicationLastDate || null,
      feeLastDate: cleanDateValue(rawDates.feeLastDate) || norm.feeLastDate || null,
      correctionLastDate: cleanDateValue(rawDates.correctionLastDate) || norm.correctionLastDate || null,
      citySlipDate: cleanDateValue(rawDates.citySlipDate) || norm.citySlipDate || null,
      resultDate: cleanDateValue(rawDates.resultDate) || norm.resultDate || null,
      answerKeyDate: cleanDateValue(rawDates.answerKeyDate) || norm.answerKeyDate || null
    };

    // Check if there is any difference between rawDates and cleanedDates
    const hasDiff = 
      rawDates.examDate !== cleanedDates.examDate ||
      rawDates.admitCardDate !== cleanedDates.admitCardDate ||
      rawDates.lastDate !== cleanedDates.lastDate ||
      rawDates.startDate !== cleanedDates.startDate;

    if (hasDiff) {
      const { error: updateErr } = await supabase
        .from('gov_notifications')
        .update({ important_dates: cleanedDates })
        .eq('id', row.id);

      if (!updateErr) {
        updatedCount++;
        console.log(`[UPDATED] ${row.slug}`);
        if (cleanedDates.examDate) console.log(`   └─ Exam Date: "${cleanedDates.examDate}"`);
        if (cleanedDates.admitCardDate) console.log(`   └─ Admit Card: "${cleanedDates.admitCardDate}"`);
      } else {
        console.error(`[ERROR] Failed to update ${row.id}:`, updateErr.message);
      }
    } else {
      skippedCount++;
    }
  }

  console.log('\n========================================================================================');
  console.log(`  RE-NORMALIZATION COMPLETE: ${updatedCount} records updated, ${skippedCount} already clean.`);
  console.log('========================================================================================\n');
}

batchRenormalize().catch(console.error);
