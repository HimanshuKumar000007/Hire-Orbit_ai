import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "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";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buqkdtnffjoiwwtfxiek.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";

// Extract XML items from RSS
function extractRssItems(xmlText: string): Array<{ title: string; link: string; pubDate: string; description: string }> {
  const items: Array<{ title: string; link: string; pubDate: string; description: string }> = [];
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i);
    const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/i);
    const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i);

    const title = (titleMatch ? titleMatch[1] || titleMatch[2] : "").trim();
    const link = (linkMatch ? linkMatch[1] || linkMatch[2] : "").trim();
    const pubDate = (dateMatch ? dateMatch[1] : "").trim();
    const description = (descMatch ? descMatch[1] || descMatch[2] : "").replace(/<[^>]*>?/gm, "").trim();

    if (title && (
      title.toLowerCase().includes("recruitment") || 
      title.toLowerCase().includes("vacancy") || 
      title.toLowerCase().includes("notification") || 
      title.toLowerCase().includes("admit card") || 
      title.toLowerCase().includes("result") || 
      title.toLowerCase().includes("exam") ||
      title.toLowerCase().includes("bharti") ||
      title.toLowerCase().includes("online form") ||
      title.toLowerCase().includes("cut off") ||
      title.toLowerCase().includes("answer key") ||
      title.toLowerCase().includes("scorecard") ||
      title.toLowerCase().includes("hall ticket")
    )) {
      items.push({ title, link, pubDate, description });
    }
  }

  return items;
}

// AI Extractor using NVIDIA API
async function parseNoticeWithAI(title: string, desc: string, link: string) {
  const prompt = `You are a Senior Government Careers Analyst in India. Parse this raw government announcement into strict JSON matching our official schema.
Raw Announcement Title: "${title}"
Details: "${desc}"
Source Link: "${link}"

Return ONLY valid JSON (no markdown ticks, no commentary) with this exact schema:
{
  "title": "Clear headline in English (e.g. SSC CGL 2026 Notification Released: 14,000+ Posts)",
  "short_title": "Short title (e.g. SSC CGL 2026 Form)",
  "organization": "Exact Organization Name (e.g. Staff Selection Commission / Indian Railways / UPSC / SBI / UP Police / Army)",
  "category": "One of: central, railway, banking, police, defense, state, teaching",
  "type": "One of: job, admit-card, result, answer-key",
  "badge_status": "Short status (e.g. Applications Live, Admit Card Out, Result Declared)",
  "badge_color": "One of: emerald, blue, amber, purple",
  "vacancies": "Total vacancies string (e.g. 5,400 Posts, or Not Specified)",
  "qualification": "Educational requirement (e.g. Bachelor's Degree in any discipline / 12th Pass / 10th Pass)",
  "qualification_level": "One of: 10th, 12th, graduate, diploma, postgraduate",
  "age_limit": "Age range string (e.g. 18 - 30 Years)",
  "pay_scale": "Pay scale string (e.g. Level 4: ₹25,500 - ₹81,100)",
  "application_fee": { "generalOBC": "₹100", "scStPh": "₹0", "female": "₹0" },
  "important_dates": { "startDate": "Active Now", "lastDate": "Date or Upcoming", "examDate": "Tentative month" },
  "location": "All India or State Name",
  "summary": "2-3 sentences concise professional summary of the post, department, and role.",
  "key_highlights": [
    "Highlight 1",
    "Highlight 2",
    "Highlight 3"
  ],
  "selection_process": [
    "Stage 1",
    "Stage 2",
    "Stage 3"
  ],
  "official_pdf_url": "${link}",
  "apply_url": "${link}"
}`;

  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-11b-vision-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1500
      })
    });

    if (!res.ok) {
      console.error("NVIDIA API failed with status:", res.status);
      return null;
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content?.trim() || "";
    // Clean potential markdown wrap
    const cleaned = content.replace(/^```json/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error("Failed to parse notice with AI:", err?.message);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Multi-Stream National Feeds (Central, Railways, Banking, Defense, Police, State, Teaching)
    const feeds = [
      // 1. Central & Staff Selection / UPSC
      "https://news.google.com/rss/search?q=(site:ssc.gov.in+OR+site:upsc.gov.in)+recruitment+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // 2. Indian Railways (RRB / RRC)
      "https://news.google.com/rss/search?q=(site:rrbapply.gov.in+OR+site:indianrailways.gov.in)+recruitment+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // 3. Banking & Financial (IBPS, SBI, RBI, NABARD, LIC)
      "https://news.google.com/rss/search?q=(%22IBPS+PO%22+OR+%22SBI+PO%22+OR+%22SBI+Clerk%22+OR+%22IBPS+Clerk%22+OR+%22RBI+Grade+B%22)+recruitment+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // 4. Defense & Paramilitary (Agniveer, Army, Navy, Air Force, CRPF, BSF, CISF, AFCAT, NDA, CDS)
      "https://news.google.com/rss/search?q=(%22Army+Agniveer%22+OR+%22AFCAT%22+OR+%22NDA+exam%22+OR+%22CRPF+recruitment%22+OR+%22BSF+recruitment%22)+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // 5. State Police & Major State PSCs (UP, Bihar, Rajasthan, MP, Delhi DSSSB)
      "https://news.google.com/rss/search?q=(site:uppbpb.gov.in+OR+site:bpsc.bih.nic.in+OR+%22UP+Police%22+OR+%22Bihar+Police%22+OR+%22DSSSB%22)+recruitment+result+admit+card&hl=en-IN&gl=IN&ceid=IN:en",
      // 6. Teaching & Education (CTET, KVS, NVS, UGC NET)
      "https://news.google.com/rss/search?q=(%22CTET%22+OR+%22KVS+recruitment%22+OR+%22NVS+recruitment%22+OR+%22UGC+NET%22)+notification+admit+card&hl=en-IN&gl=IN&ceid=IN:en",
      // 7. Official Press Information Bureau (PIB)
      "https://pib.gov.in/RssMain.aspx?ModId=6"
    ];

    let foundItems: Array<{ title: string; link: string; pubDate: string; description: string }> = [];

    for (const feedUrl of feeds) {
      try {
        const res = await fetch(feedUrl, { next: { revalidate: 0 }, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
        if (res.ok) {
          const xml = await res.text();
          const items = extractRssItems(xml);
          foundItems = foundItems.concat(items);
        }
      } catch (feedErr) {
        console.warn("Error fetching feed:", feedUrl, feedErr);
      }
    }

    // Deduplicate found items by title
    const uniqueItems = Array.from(new Map(foundItems.map(item => [item.title.toLowerCase().slice(0, 40), item])).values()).slice(0, 8);

    // Get existing slugs from database to avoid re-inserting
    const { data: existingRows } = await supabase
      .from("gov_notifications")
      .select("id, slug, title");

    const existingTitles = (existingRows || []).map(r => r.title.toLowerCase());

    const newlyAdded = [];

    for (const item of uniqueItems) {
      const alreadyExists = existingTitles.some(t => t.includes(item.title.toLowerCase().slice(0, 25)));
      if (alreadyExists) {
        continue;
      }

      // Parse with NVIDIA AI
      const parsed = await parseNoticeWithAI(item.title, item.description, item.link);
      if (!parsed || !parsed.title) continue;

      const slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
      const id = `auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const rowToInsert = {
        id,
        slug,
        title: parsed.title,
        short_title: parsed.short_title || parsed.title.slice(0, 40),
        organization: parsed.organization || "Government of India",
        category: parsed.category || "central",
        type: parsed.type || "job",
        badge_status: parsed.badge_status || "New Notification",
        badge_color: parsed.badge_color || "emerald",
        vacancies: parsed.vacancies || "See Notification",
        qualification: parsed.qualification || "Graduate / 12th Pass",
        qualification_level: parsed.qualification_level || "graduate",
        age_limit: parsed.age_limit || "As per official rules",
        pay_scale: parsed.pay_scale || "Government Scale",
        application_fee: parsed.application_fee || {},
        important_dates: parsed.important_dates || {},
        location: parsed.location || "All India",
        summary: parsed.summary || item.title,
        key_highlights: parsed.key_highlights || [],
        selection_process: parsed.selection_process || [],
        official_pdf_url: parsed.official_pdf_url || item.link,
        apply_url: parsed.apply_url || item.link,
        source_feed: "Automated Gazette Sync",
        is_trending: true,
        is_lead_story: false
      };

      const { error: insertError } = await supabase
        .from("gov_notifications")
        .insert(rowToInsert);

      if (!insertError) {
        newlyAdded.push(rowToInsert.title);
      } else {
        console.error("Insert error:", insertError.message);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      feedsScanned: feeds.length,
      itemsDetected: uniqueItems.length,
      newlyAddedCount: newlyAdded.length,
      newlyAdded
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
