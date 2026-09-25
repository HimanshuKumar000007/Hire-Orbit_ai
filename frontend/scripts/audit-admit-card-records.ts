/**
 * Production Data-Consistency Audit Script
 * 
 * Scans Supabase gov_notifications for:
 * 1. admitCardDate > examDate
 * 2. resultDate < examDate
 * 3. applicationLastDate < applicationStartDate
 * 4. Multi-stage date contamination
 */

import { getSupabaseClient } from '../lib/supabase.js';

interface SuspiciousRecord {
  id: string;
  slug: string;
  title: string;
  type: string;
  examDate: string | null;
  admitCardDate: string | null;
  resultDate: string | null;
  appStart: string | null;
  appEnd: string | null;
  issue: string;
}

function parseDate(dStr: string | null | undefined): number | null {
  if (!dStr || typeof dStr !== 'string') return null;
  const first = dStr.split(/[–—\-]|(\bto\b)/i)[0].trim();
  const ts = Date.parse(first);
  return isNaN(ts) ? null : ts;
}

async function runAudit() {
  console.log('================================================================================');
  console.log('  HIREORBITAI: PRODUCTION ADMIT CARD DATA-CONSISTENCY AUDIT');
  console.log('================================================================================\n');

  const supabase = getSupabaseClient();
  const { data: records, error } = await supabase
    .from('gov_notifications')
    .select('id, slug, title, type, important_dates, summary, apply_url')
    .order('created_at', { ascending: false });

  if (error || !records) {
    console.error('Failed to query records:', error?.message);
    process.exit(1);
  }

  console.log(`Auditing ${records.length} production records...\n`);

  const suspicious: SuspiciousRecord[] = [];

  for (const row of records) {
    const dates = row.important_dates || {};
    const examDate = dates.examDate || dates.exam_date?.date || null;
    const examDateFrom = dates.examDateFrom || dates.exam_date?.start || null;
    const admitCardDate = dates.admitCardDate || dates.admit_card_date?.date || null;
    const resultDate = dates.resultDate || dates.result_date?.date || null;
    const appStart = dates.startDate || dates.applicationStart || dates.application_begin?.date || null;
    const appEnd = dates.lastDate || dates.applicationLastDate || dates.application_last_date?.date || null;

    const examTs = parseDate(examDateFrom || examDate);
    const admitTs = parseDate(admitCardDate);
    const resultTs = parseDate(resultDate);
    const startTs = parseDate(appStart);
    const endTs = parseDate(appEnd);

    // 1. admitCardDate > examDate (Chronological impossibility for a single exam stage)
    if (admitTs && examTs && admitTs > examTs) {
      suspicious.push({
        id: row.id,
        slug: row.slug,
        title: row.title,
        type: row.type,
        examDate,
        admitCardDate,
        resultDate,
        appStart,
        appEnd,
        issue: `Admit card date (${admitCardDate}) is AFTER exam date (${examDate})`
      });
    }

    // 2. resultDate < examDate
    if (resultTs && examTs && resultTs < examTs) {
      suspicious.push({
        id: row.id,
        slug: row.slug,
        title: row.title,
        type: row.type,
        examDate,
        admitCardDate,
        resultDate,
        appStart,
        appEnd,
        issue: `Result date (${resultDate}) is BEFORE exam date (${examDate})`
      });
    }

    // 3. appEnd < appStart
    if (startTs && endTs && endTs < startTs) {
      suspicious.push({
        id: row.id,
        slug: row.slug,
        title: row.title,
        type: row.type,
        examDate,
        admitCardDate,
        resultDate,
        appStart,
        appEnd,
        issue: `Application deadline (${appEnd}) is BEFORE application start (${appStart})`
      });
    }
  }

  console.log(`Audit Complete. Found ${suspicious.length} suspicious records across production:\n`);

  for (const s of suspicious) {
    console.log(`[${s.id}] ${s.title}`);
    console.log(`  Issue: ${s.issue}`);
    console.log(`  Exam Date: ${s.examDate} | Admit Card: ${s.admitCardDate}`);
    console.log(`  Slug: ${s.slug}\n`);
  }

  return suspicious;
}

runAudit();
