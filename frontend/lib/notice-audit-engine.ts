/**
 * Universal Notice Audit & Change Tracking Engine for HireOrbitAI
 *
 * Tracks every factual change to a government notice across hourly sync crawls:
 * - Compares existing Supabase record vs incoming crawled data
 * - Classifies action: ACTION_CREATE, ACTION_UPDATE, ACTION_NOOP
 * - Generates structured change log entries with timestamps, old/new values, and sources
 * - Manages first_discovered_at, last_checked_at, and last_changed_at timestamps
 */

export interface NoticeChangeLogEntry {
  id: string;                 // unique change entry ID
  timestamp: string;          // ISO 8601 string
  field: string;              // field name: 'examDate', 'admitCardDate', 'applicationLastDate', 'fee', 'vacancies', etc.
  fieldLabel: string;         // Human readable: e.g. 'Examination Date', 'Admit Card Release'
  oldValue: string | null;    // previous value
  newValue: string;           // updated value
  sourceName: string;         // source that reported change: e.g. 'Sarkari Result', 'UPPSC Gazette'
  sourceUrl?: string | null;
  changeSummary: string;      // Human-readable summary e.g. "Exam date announced as 27 September 2026"
}

export type NoticeSyncAction = 'ACTION_CREATE' | 'ACTION_UPDATE' | 'ACTION_NOOP';

export interface NoticeFieldDiffResult {
  action: NoticeSyncAction;
  hasChanges: boolean;
  changes: NoticeChangeLogEntry[];
  summaryReasons: string[];
}

/**
 * Checks if a string is placeholder text or empty
 */
function isGenericOrEmpty(val: any): boolean {
  if (!val || typeof val !== 'string') return true;
  const s = val.trim().toLowerCase();
  return (
    s === '' ||
    s === 'null' ||
    s === 'undefined' ||
    s === 'see notification' ||
    s === 'check gazette notice' ||
    s === 'to be announced' ||
    s === 'announced (check schedule notice below)' ||
    s === 'available now / upcoming' ||
    s === 'advt released (completed)' ||
    s === 'registration window closed' ||
    s === '18 - 40 years (as per category)' ||
    s.startsWith('as per')
  );
}

/**
 * Compares an existing database notice with incoming newly-crawled notice data.
 * Returns the exact list of differences, human-readable reasons, and the appropriate action.
 */
export function diffNoticeFields(
  existingRecord: Record<string, any>,
  incomingParsed: Record<string, any>,
  sourceName: string,
  sourceUrl?: string | null,
  nowIso: string = new Date().toISOString()
): NoticeFieldDiffResult {
  const changes: NoticeChangeLogEntry[] = [];
  const summaryReasons: string[] = [];

  const oldDates = existingRecord.important_dates || {};
  const newDates = incomingParsed.important_dates || {};

  function addChange(field: string, fieldLabel: string, oldVal: any, newVal: any, summary: string) {
    changes.push({
      id: `chg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowIso,
      field,
      fieldLabel,
      oldValue: oldVal ? String(oldVal) : null,
      newValue: String(newVal),
      sourceName,
      sourceUrl,
      changeSummary: summary
    });
    summaryReasons.push(summary);
  }

  // 1. Exam Date
  if (newDates.examDate && newDates.examDate !== oldDates.examDate && !isGenericOrEmpty(newDates.examDate)) {
    addChange(
      'examDate',
      'Examination Date',
      oldDates.examDate,
      newDates.examDate,
      `Exam date updated to ${newDates.examDate}`
    );
  }

  // 2. Admit Card Date
  if (newDates.admitCardDate && newDates.admitCardDate !== oldDates.admitCardDate && !isGenericOrEmpty(newDates.admitCardDate)) {
    addChange(
      'admitCardDate',
      'Admit Card Release Date',
      oldDates.admitCardDate,
      newDates.admitCardDate,
      `Admit card release date updated to ${newDates.admitCardDate}`
    );
  }

  // 3. Application Start Date
  if (newDates.startDate && newDates.startDate !== oldDates.startDate && !isGenericOrEmpty(newDates.startDate)) {
    if (isGenericOrEmpty(oldDates.startDate)) {
      addChange(
        'startDate',
        'Application Begin Date',
        oldDates.startDate,
        newDates.startDate,
        `Application start date confirmed: ${newDates.startDate}`
      );
    }
  }

  // 4. Application Last Date (Deadline extension or announcement)
  if (newDates.lastDate && newDates.lastDate !== oldDates.lastDate && !isGenericOrEmpty(newDates.lastDate)) {
    addChange(
      'lastDate',
      'Application Last Date',
      oldDates.lastDate,
      newDates.lastDate,
      `Application deadline updated to ${newDates.lastDate}`
    );
  }

  // 5. Fee Payment Last Date
  if (newDates.feeLastDate && newDates.feeLastDate !== oldDates.feeLastDate && !isGenericOrEmpty(newDates.feeLastDate)) {
    if (isGenericOrEmpty(oldDates.feeLastDate)) {
      addChange(
        'feeLastDate',
        'Fee Payment Deadline',
        oldDates.feeLastDate,
        newDates.feeLastDate,
        `Fee payment deadline confirmed: ${newDates.feeLastDate}`
      );
    }
  }

  // 6. City Slip Date
  if (newDates.citySlipDate && newDates.citySlipDate !== oldDates.citySlipDate && !isGenericOrEmpty(newDates.citySlipDate)) {
    addChange(
      'citySlipDate',
      'Exam City Slip Date',
      oldDates.citySlipDate,
      newDates.citySlipDate,
      `Exam city slip release scheduled: ${newDates.citySlipDate}`
    );
  }

  // 7. Result Date
  if (newDates.resultDate && newDates.resultDate !== oldDates.resultDate && !isGenericOrEmpty(newDates.resultDate)) {
    addChange(
      'resultDate',
      'Result Declaration Date',
      oldDates.resultDate,
      newDates.resultDate,
      `Result declaration scheduled: ${newDates.resultDate}`
    );
  }

  // 8. Badge Status
  if (incomingParsed.badge_status && incomingParsed.badge_status !== existingRecord.badge_status) {
    addChange(
      'badge_status',
      'Notice Status',
      existingRecord.badge_status,
      incomingParsed.badge_status,
      `Status changed from "${existingRecord.badge_status || 'Active'}" to "${incomingParsed.badge_status}"`
    );
  }

  // 9. Confirmed Vacancies Update
  if (
    incomingParsed.vacancies &&
    incomingParsed.vacancies !== 'See Notification' &&
    existingRecord.vacancies === 'See Notification'
  ) {
    addChange(
      'vacancies',
      'Total Vacancies',
      existingRecord.vacancies,
      incomingParsed.vacancies,
      `Total verified vacancies confirmed: ${incomingParsed.vacancies}`
    );
  }

  // 10. Application Fee Confirmation
  const newFee = incomingParsed.application_fee?.generalOBC;
  const oldFee = existingRecord.application_fee?.generalOBC;
  if (newFee && !isGenericOrEmpty(newFee) && (isGenericOrEmpty(oldFee) || oldFee !== newFee)) {
    addChange(
      'application_fee',
      'Application Fee',
      oldFee,
      newFee,
      `Application fee confirmed: General/OBC ${newFee}`
    );
  }

  // 11. Age Limit Confirmation
  const newAge = incomingParsed.age_limit;
  const oldAge = existingRecord.age_limit;
  if (newAge && !isGenericOrEmpty(newAge) && (isGenericOrEmpty(oldAge) || oldAge !== newAge)) {
    addChange(
      'age_limit',
      'Age Limit',
      oldAge,
      newAge,
      `Age bracket confirmed: ${newAge}`
    );
  }

  // 12. Qualification Details Confirmation
  const newQual = incomingParsed.qualification;
  const oldQual = existingRecord.qualification;
  if (newQual && !isGenericOrEmpty(newQual) && (isGenericOrEmpty(oldQual) || oldQual !== newQual)) {
    addChange(
      'qualification',
      'Eligibility Qualification',
      oldQual,
      newQual,
      `Educational eligibility updated from official notice`
    );
  }

  // 13. Official Verification Upgrade
  if (
    incomingParsed.verification_status === 'verified' &&
    existingRecord.verification_status !== 'verified'
  ) {
    addChange(
      'verification_status',
      'Verification Status',
      existingRecord.verification_status,
      'verified',
      `Notice upgraded to Official Commission Verified`
    );
  }

  // 14. Official Document / Application Links
  if (
    incomingParsed.apply_url &&
    incomingParsed.apply_url !== existingRecord.apply_url &&
    !incomingParsed.apply_url.includes('employmentnews.gov.in')
  ) {
    addChange(
      'apply_url',
      'Application Portal Link',
      existingRecord.apply_url,
      incomingParsed.apply_url,
      `Official portal link verified: ${incomingParsed.apply_url}`
    );
  }

  const hasChanges = changes.length > 0;
  const action: NoticeSyncAction = hasChanges ? 'ACTION_UPDATE' : 'ACTION_NOOP';

  return {
    action,
    hasChanges,
    changes,
    summaryReasons
  };
}

/**
 * Merges new change log entries into the existing change history array,
 * maintaining chronological order and capping history to the last 20 entries.
 */
export function appendChangeHistory(
  existingHistory: any[] | undefined | null,
  newEntries: NoticeChangeLogEntry[],
  maxHistory: number = 20
): NoticeChangeLogEntry[] {
  const current = Array.isArray(existingHistory) ? [...existingHistory] : [];
  const merged = [...current, ...newEntries];
  // Sort latest first
  merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return merged.slice(0, maxHistory);
}

/**
 * Generates an initial change log entry when a notice is first discovered and created.
 */
export function createInitialNoticeLog(
  noticeTitle: string,
  sourceName: string,
  nowIso: string = new Date().toISOString()
): NoticeChangeLogEntry[] {
  return [
    {
      id: `init-${Date.now()}`,
      timestamp: nowIso,
      field: 'notice_created',
      fieldLabel: 'Notice Discovery',
      oldValue: null,
      newValue: 'Indexed',
      sourceName,
      changeSummary: `Notice first discovered and indexed from ${sourceName}`
    }
  ];
}
