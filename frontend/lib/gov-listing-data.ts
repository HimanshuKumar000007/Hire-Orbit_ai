/**
 * gov-listing-data.ts
 *
 * Server-side only. Fetches current gov_notifications rows from Supabase.
 * Used by async Server Component pages (gov/jobs, gov/page, etc.).
 *
 * IMPORTANT:
 * - Calls unstable_noStore() on every invocation to bypass Next.js Data Cache.
 * - Returns [] on any error — never falls back to a static hardcoded array.
 * - Do NOT import from this file inside "use client" components.
 */

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { GovJobNotification } from "@/lib/gov-jobs-data";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://buqkdtnffjoiwwtfxiek.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";

/**
 * Creates a fresh Supabase client for each server request.
 * A new client per-request avoids singleton caching across SSR invocations.
 */
function createServerClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      // Bypass Next.js fetch cache so every page request hits the live DB.
      fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
    },
  });
}

/** Maps a raw Supabase row to the GovJobNotification shape. */
function mapRow(d: Record<string, unknown>): GovJobNotification {
  return {
    id: d.id as string,
    slug: d.slug as string,
    title: d.title as string,
    shortTitle: (d.short_title as string | undefined) || (d.title as string),
    organization: (d.organization as string) || "",
    category: (d.category as GovJobNotification["category"]) || "central",
    type: (d.type as GovJobNotification["type"]) || "job",
    badgeStatus: (d.badge_status as string) || "",
    badgeColor: (d.badge_color as GovJobNotification["badgeColor"]) || "emerald",
    vacancies: (d.vacancies as string) || "",
    qualification: (d.qualification as string) || "",
    qualificationLevel:
      (d.qualification_level as GovJobNotification["qualificationLevel"]) ||
      "graduate",
    ageLimit: (d.age_limit as string) || "",
    payScale: (d.pay_scale as string) || "",
    applicationFee: (d.application_fee as GovJobNotification["applicationFee"]) || {
      generalOBC: "",
      scStPh: "",
      female: "",
    },
    importantDates: (d.important_dates as GovJobNotification["importantDates"]) || {},
    location: (d.location as string) || "",
    summary: (d.summary as string) || "",
    keyHighlights: (d.key_highlights as string[]) || [],
    selectionProcess: (d.selection_process as string[]) || [],
    officialPdfUrl: (d.official_pdf_url as string) || "",
    applyUrl: (d.apply_url as string) || "",
    updatedAt: "Live Gazette Verified",
    isTrending: (d.is_trending as boolean | undefined) || false,
    isLeadStory: (d.is_lead_story as boolean | undefined) || false,
    categoryDistribution:
      (d.category_distribution as GovJobNotification["categoryDistribution"]) ||
      undefined,
    postWiseDetails:
      (d.post_wise_details as GovJobNotification["postWiseDetails"]) || undefined,
    examPattern:
      (d.exam_pattern as GovJobNotification["examPattern"]) || undefined,
    applicationInstructions:
      (d.application_instructions as GovJobNotification["applicationInstructions"]) ||
      undefined,
    documentsRequired:
      (d.documents_required as GovJobNotification["documentsRequired"]) || undefined,
  };
}

export interface FetchGovNotificationsOptions {
  /** Filter by one or more `type` values, e.g. ['job','recruitment'] */
  types?: string[];
  /** Max rows to return. Defaults to 200. */
  limit?: number;
}

/**
 * Fetches current government notices from Supabase.
 *
 * Always uses cache:'no-store' — every call hits the live database.
 * Returns an empty array if the query fails; NEVER returns static fallback data.
 *
 * @param opts.types  Optional array of `type` values to filter by.
 * @param opts.limit  Max rows (default 200).
 */
export async function fetchGovNotifications(
  opts: FetchGovNotificationsOptions = {}
): Promise<GovJobNotification[]> {
  // Explicitly opt out of Next.js Data Cache on every invocation.
  // This ensures the listing pages always show the CURRENT Supabase state,
  // not a cached snapshot from a previous build or request.
  noStore();

  const { types, limit = 200 } = opts;

  try {
    const supabase = createServerClient();

    let query = supabase
      .from("gov_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (types && types.length > 0) {
      // e.g. .or('type.eq.job,type.eq.recruitment')
      const orFilter = types.map((t) => `type.eq.${t}`).join(",");
      query = query.or(orFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[gov-listing-data] Supabase fetch error:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as Record<string, unknown>[]).map(mapRow);
  } catch (err) {
    console.error("[gov-listing-data] Unexpected fetch error:", err);
    return [];
  }
}
