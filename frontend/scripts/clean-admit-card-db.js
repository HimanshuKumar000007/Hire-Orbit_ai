const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY'], {
  auth: { persistSession: false }
});

const MONTHS_REGEX = /jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?/i;
const NUMERIC_DATE_REGEX = /\b[0-3]?\d[./-][0-1]?\d[./-](?:20)?\d\d\b/;

function cleanDateValue(val) {
  if (!val || typeof val !== 'string') return null;
  const s = val.trim();
  if (s.length < 4) return null;
  const isPlaceholder = /announced|upcoming|notified|check|available|window closed|as per|active \/|tba|soon|released|completed|same as/i.test(s);
  if (isPlaceholder && !MONTHS_REGEX.test(s) && !NUMERIC_DATE_REGEX.test(s)) {
    return null;
  }
  if (!MONTHS_REGEX.test(s) && !NUMERIC_DATE_REGEX.test(s)) {
    return null;
  }
  return s;
}

async function cleanRecords() {
  console.log('--- Cleaning TNPSC & Admit Card Records in DB ---');

  // Specific fix for target TNPSC record: auto-1790259211814-p8um9
  const { data: targetRecord, error: targetErr } = await supabase
    .from('gov_notifications')
    .select('*')
    .eq('id', 'auto-1790259211814-p8um9')
    .single();

  if (targetRecord) {
    console.log('Updating target TNPSC record auto-1790259211814-p8um9...');
    const updatedDates = {
      examDate: '27 September 2026',
      admitCardDate: '18 September 2026',
      startDate: null,
      lastDate: null,
      feeLastDate: null,
      resultDate: null
    };

    const { error: updErr } = await supabase
      .from('gov_notifications')
      .update({
        important_dates: updatedDates,
        type: 'admit-card',
        badge_status: 'Admit Card Out'
      })
      .eq('id', 'auto-1790259211814-p8um9');

    if (updErr) {
      console.error('Failed to update target record:', updErr);
    } else {
      console.log('Target TNPSC record auto-1790259211814-p8um9 successfully updated with clean dates!');
    }
  }

  // Also clean any other records that have legacy UI placeholders in important_dates
  const { data: allAdmitCards } = await supabase
    .from('gov_notifications')
    .select('id, slug, title, type, badge_status, important_dates')
    .or('type.eq.admit-card,badge_status.ilike.%admit%');

  let cleanedCount = 0;
  for (const row of (allAdmitCards || [])) {
    const dates = row.important_dates || {};
    let needsUpdate = false;
    const sanitized = {};

    for (const [key, val] of Object.entries(dates)) {
      const cleaned = cleanDateValue(val);
      if (cleaned !== val) {
        needsUpdate = true;
      }
      sanitized[key] = cleaned;
    }

    if (needsUpdate && row.id !== 'auto-1790259211814-p8um9') {
      const { error } = await supabase
        .from('gov_notifications')
        .update({ important_dates: sanitized })
        .eq('id', row.id);

      if (!error) {
        cleanedCount++;
        console.log(`Cleaned placeholder dates for: ${row.slug}`);
      }
    }
  }

  console.log(`Finished. Cleaned ${cleanedCount} additional records.`);
}

cleanRecords();
