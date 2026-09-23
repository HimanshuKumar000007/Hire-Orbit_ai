import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "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";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buqkdtnffjoiwwtfxiek.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";

// ─── EXPANDED: ALL Gov Job Keywords (wide net like Sarkari Result) ───────────
const GOV_KEYWORDS = [
  "recruitment", "vacancy", "vacancies", "notification", "advertise",
  "admit card", "hall ticket", "call letter", "e-admit",
  "result", "merit list", "final result", "scorecard", "score card",
  "exam", "examination", "written test",
  "answer key", "provisional answer key", "objection",
  "cut off", "cutoff",
  "bharti", "online form", "apply online",
  "syllabus", "exam date", "schedule",
  "document verification", "dv",
  "upsssc", "uppsc", "upprpb", "bpsc", "bssc", "rpsc", "rsmssb",
  "mppsc", "mpesb", "vyapam", "mpsc", "gpsc", "gsssb",
  "wbpsc", "opsc", "jpsc", "cgpsc", "kpsc", "tnpsc", "tspsc",
  "appsc", "kerala psc", "hppsc", "apsc", "jkssb", "jkpsc",
  "ssc", "upsc", "rrb", "rrc", "ibps", "sbi", "rbi",
  "nda", "cds", "afcat", "crpf", "bsf", "cisf", "itbp",
  "agneepath", "agniveer",
  "police constable", "head constable", "sub inspector",
  "teacher", "ctet", "kvs", "nvs", "ugc net",
  "isro", "drdo", "barc", "epfo", "esic",
  "forensic", "laboratory", "technician", "assistant", "clerk",
  "patwari", "lekhpal", "anganwadi", "asha"
];

// Extract XML items from RSS - No keyword filter, catch EVERYTHING
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

    if (!title) continue;

    const titleLower = title.toLowerCase();
    const descLower = (description || "").toLowerCase();
    const combined = titleLower + " " + descLower;

    // Wide keyword filter - catch anything gov/jobs related
    const isGovRelated = GOV_KEYWORDS.some(kw => combined.includes(kw));

    if (isGovRelated) {
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
  "title": "Clear headline in English (e.g. UPSSSC Forensic Science Lab Admit Card 2026 Released)",
  "short_title": "Short title (e.g. UPSSSC FSL Admit Card 2026)",
  "organization": "Exact Organization Name (e.g. UPSSSC / UPPSC / SSC / UPSC / BPSC / SBI / UP Police)",
  "category": "One of: central, railway, banking, police, defense, state, teaching",
  "type": "One of: job, admit-card, result, answer-key",
  "badge_status": "Short status badge (e.g. Applications Live / Admit Card Out / Result Declared / Answer Key Released)",
  "badge_color": "One of: emerald, blue, amber, purple",
  "vacancies": "Total vacancies string (e.g. 5,400 Posts / Not Specified / Qualifying Exam)",
  "qualification": "Educational requirement (e.g. Bachelor's Degree / 12th Pass / 10th Pass / B.Sc. in relevant subject)",
  "qualification_level": "One of: 10th, 12th, graduate, diploma, postgraduate",
  "age_limit": "Age range string (e.g. 18 - 30 Years / As per official rules)",
  "pay_scale": "Pay scale string (e.g. Level 4: Rs 25,500 - Rs 81,100 / As per rules)",
  "application_fee": { "generalOBC": "Rs 0 or amount", "scStPh": "Rs 0 or amount", "female": "Rs 0 or amount" },
  "important_dates": { "startDate": "Active Now or date", "lastDate": "Date or Upcoming", "examDate": "Date if known", "admitCardDate": "If applicable", "resultDate": "If applicable" },
  "location": "State name or All India",
  "summary": "2-3 sentences professional summary of the exact notification, post details, and what candidates must do.",
  "key_highlights": [
    "Highlight 1 (specific detail from the notification)",
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
        temperature: 0.1,
        max_tokens: 1800
      })
    });

    if (!res.ok) {
      console.error("NVIDIA API failed with status:", res.status);
      return null;
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content?.trim() || "";
    // Clean potential markdown wrap
    const cleaned = content.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error("Failed to parse notice with AI:", err?.message);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ─── EXPANDED: 20+ Targeted Government Feeds (including UPSSSC, SarkariResult type sources) ───
    const feeds = [
      // 1. UPSSSC - Uttar Pradesh Subordinate Service Selection Commission (Direct Gov Feed)
      "https://upsssc.gov.in/rss/rss.aspx",
      // 2. UPPSC - Uttar Pradesh Public Service Commission
      "https://uppsc.up.nic.in/rss/rss.aspx",
      // 3. SSC / UPSC (site-filtered Google News)
      "https://news.google.com/rss/search?q=(site:ssc.gov.in+OR+site:upsc.gov.in)+recruitment+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // 4. UPSSSC + UPPRPB (Google News - State UP boards)
      "https://news.google.com/rss/search?q=%22UPSSSC%22+OR+%22UPPRPB%22+admit+card+result+recruitment&hl=en-IN&gl=IN&ceid=IN:en",
      // 5. Railway RRB/RRC
      "https://news.google.com/rss/search?q=(%22RRB%22+OR+%22RRC%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 6. Banking (IBPS, SBI, RBI, LIC)
      "https://news.google.com/rss/search?q=(%22IBPS%22+OR+%22SBI%22+OR+%22RBI%22+OR+%22LIC%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 7. Defense & Paramilitary (Agniveer, CRPF, BSF, NDA, CDS)
      "https://news.google.com/rss/search?q=(%22Agniveer%22+OR+%22NDA%22+OR+%22CDS%22+OR+%22CRPF%22+OR+%22BSF%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 8. Northern Hindi Belt States (UP, Bihar, MP, Rajasthan, Haryana, Delhi)
      "https://news.google.com/rss/search?q=(%22UPPSC%22+OR+%22UPSSSC%22+OR+%22BPSC%22+OR+%22RPSC%22+OR+%22MPPSC%22+OR+%22HSSC%22+OR+%22DSSSB%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 9. Western & Central States (Maharashtra, Gujarat, CG, Jharkhand)
      "https://news.google.com/rss/search?q=(%22MPSC%22+OR+%22GPSC%22+OR+%22WBPSC%22+OR+%22OPSC%22+OR+%22JPSC%22+OR+%22CGPSC%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 10. Southern States (Karnataka, Tamil Nadu, Telangana, AP, Kerala)
      "https://news.google.com/rss/search?q=(%22KPSC%22+OR+%22TNPSC%22+OR+%22TSPSC%22+OR+%22APPSC%22+OR+%22Kerala+PSC%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 11. Northeast & Himalayan States (Assam, J&K, HP, Tripura, Sikkim)
      "https://news.google.com/rss/search?q=(%22APSC%22+OR+%22JKSSB%22+OR+%22JKPSC%22+OR+%22HPPSC%22+OR+%22Assam+Police%22+OR+%22UKPSC%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 12. Teaching & National Testing (CTET, KVS, NVS, UGC NET, State TET)
      "https://news.google.com/rss/search?q=(%22CTET%22+OR+%22KVS%22+OR+%22NVS%22+OR+%22UGC+NET%22+OR+%22Super+TET%22+OR+%22REET%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 13. Central PSUs & Scientific Bodies (ISRO, DRDO, BARC, EPFO, ESIC)
      "https://news.google.com/rss/search?q=(%22ISRO%22+OR+%22DRDO%22+OR+%22BARC%22+OR+%22EPFO%22+OR+%22ESIC%22+OR+%22IOCL%22+OR+%22ONGC%22)+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 14. State Police & PAC boards
      "https://news.google.com/rss/search?q=(%22Police+Constable%22+OR+%22Head+Constable%22+OR+%22Sub+Inspector%22+OR+%22Police+Bharti%22)+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 15. High Courts & Judicial Recruitment
      "https://news.google.com/rss/search?q=(%22High+Court%22+OR+%22District+Court%22+OR+%22Judiciary%22)+clerk+stenographer+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 16. State Subordinate Boards & Patwari/Lekhpal etc.
      "https://news.google.com/rss/search?q=(%22Patwari%22+OR+%22Lekhpal%22+OR+%22VDO%22+OR+%22Gram+Panchayat%22+OR+%22Anganwadi%22)+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 17. SSC GD Constable, MTS, CHSL, Steno, CPO
      "https://news.google.com/rss/search?q=(%22SSC+GD%22+OR+%22SSC+MTS%22+OR+%22SSC+CHSL%22+OR+%22SSC+CPO%22+OR+%22SSC+Stenographer%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 18. Medical & Para Medical (AIIMS, ESIC, NHM, State Health)
      "https://news.google.com/rss/search?q=(%22AIIMS%22+OR+%22NHM%22+OR+%22Staff+Nurse%22+OR+%22ANM%22+OR+%22Lab+Assistant%22+OR+%22Pharmacist%22)+recruitment+admit+card+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // 19. Employment News (Official Govt Weekly)
      "https://www.employmentnews.gov.in/RSS/GetLatestRss",
      // 20. Official Press Information Bureau (PIB)
      "https://pib.gov.in/RssMain.aspx?ModId=6"
    ];

    let foundItems: Array<{ title: string; link: string; pubDate: string; description: string }> = [];

    for (const feedUrl of feeds) {
      try {
        const res = await fetch(feedUrl, {
          next: { revalidate: 0 },
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; HireOrbitAI-GovBot/2.0; +https://hireorbitai.in)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*"
          },
          signal: AbortSignal.timeout(12000)
        });
        if (res.ok) {
          const xml = await res.text();
          const items = extractRssItems(xml);
          console.log(`Feed ${feedUrl.slice(0, 60)}: ${items.length} items found`);
          foundItems = foundItems.concat(items);
        } else {
          console.warn(`Feed returned ${res.status}: ${feedUrl.slice(0, 60)}`);
        }
      } catch (feedErr) {
        console.warn("Error fetching feed:", feedUrl.slice(0, 60), feedErr);
      }
    }

    // Deduplicate by title (first 50 chars)
    const uniqueItems = Array.from(
      new Map(foundItems.map(item => [item.title.toLowerCase().slice(0, 50), item])).values()
    );

    console.log(`Total unique items found across all feeds: ${uniqueItems.length}`);

    // Get existing titles from database to skip duplicates
    const { data: existingRows } = await supabase
      .from("gov_notifications")
      .select("id, slug, title");

    const existingTitles = (existingRows || []).map(r => r.title.toLowerCase());

    // Filter only genuinely new items
    const newItems = uniqueItems.filter(item => {
      const titleKey = item.title.toLowerCase().slice(0, 30);
      return !existingTitles.some(t => t.includes(titleKey));
    });

    console.log(`New items to process: ${newItems.length}`);

    // Process up to 20 new items per sync run (10x more than before)
    const toProcess = newItems.slice(0, 20);
    const newlyAdded: string[] = [];

    for (const item of toProcess) {
      // Parse with NVIDIA AI
      const parsed = await parseNoticeWithAI(item.title, item.description, item.link);
      if (!parsed || !parsed.title) {
        console.warn("AI parse failed for:", item.title);
        continue;
      }

      const slug = parsed.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);

      // Skip if slug already exists
      const slugExists = (existingRows || []).some(r => r.slug === slug);
      if (slugExists) continue;

      const id = `auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const rowToInsert = {
        id,
        slug,
        title: parsed.title,
        short_title: parsed.short_title || parsed.title.slice(0, 50),
        organization: parsed.organization || "Government of India",
        category: parsed.category || "central",
        type: parsed.type || "job",
        badge_status: parsed.badge_status || "New Notification",
        badge_color: parsed.badge_color || "emerald",
        vacancies: parsed.vacancies || "See Notification",
        qualification: parsed.qualification || "Graduate / 12th Pass",
        qualification_level: parsed.qualification_level || "graduate",
        age_limit: parsed.age_limit || "As per official rules",
        pay_scale: parsed.pay_scale || "Government Pay Scale",
        application_fee: parsed.application_fee || {},
        important_dates: parsed.important_dates || {},
        location: parsed.location || "All India",
        summary: parsed.summary || item.title,
        key_highlights: parsed.key_highlights || [],
        selection_process: parsed.selection_process || [],
        official_pdf_url: parsed.official_pdf_url || item.link,
        apply_url: parsed.apply_url || item.link,
        source_feed: "Automated Gazette Sync v2",
        is_trending: true,
        is_lead_story: false
      };

      const { error: insertError } = await supabase
        .from("gov_notifications")
        .insert(rowToInsert);

      if (!insertError) {
        newlyAdded.push(rowToInsert.title);
        console.log("✅ Added:", rowToInsert.title);
      } else {
        console.error("Insert error:", insertError.message);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      feedsScanned: feeds.length,
      totalItemsFound: uniqueItems.length,
      newItemsQueued: toProcess.length,
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
