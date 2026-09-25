/**
 * Dynamic Gov Notices Sitemap
 *
 * Next.js App Router sitemap.ts convention.
 * Generates URLs for ALL government notice detail pages (/gov/[slug])
 * by fetching slugs from Supabase.
 *
 * Accessible at: https://hireorbitai.in/gov-sitemap
 * Referenced from next-sitemap.config.js additionalPaths / root sitemap.
 *
 * Every new notice ingested via the hourly sync will appear here,
 * making it discoverable by Google on next crawl.
 */

import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://buqkdtnffjoiwwtfxiek.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";

export const revalidate = 3600; // Rebuild this sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://hireorbitai.in";

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, options = {}) =>
          fetch(url, { ...options, cache: "no-store" }),
      },
    });

    // Fetch all slugs for notices published after August 2026
    const { data, error } = await supabase
      .from("gov_notifications")
      .select("slug, type, created_at")
      .gte("created_at", "2026-08-01T00:00:00.000Z")
      .not("slug", "is", null)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      console.error("[gov-sitemap] Supabase error:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((row) => ({
      url: `${BASE_URL}/gov/${row.slug}`,
      lastModified: row.created_at ? new Date(row.created_at) : new Date(),
      changeFrequency: "daily" as const,
      // Recruitment/job pages are highest priority for Google
      priority:
        row.type === "job" || row.type === "recruitment"
          ? 0.9
          : row.type === "admit-card"
          ? 0.85
          : 0.8,
    }));
  } catch (err) {
    console.error("[gov-sitemap] Unexpected error:", err);
    return [];
  }
}
