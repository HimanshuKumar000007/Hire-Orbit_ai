import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buqkdtnffjoiwwtfxiek.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";

// ─── KEYWORD FILTER ────────────────────────────────────────────────────────
const GOV_KEYWORDS = [
  "recruitment","vacancy","vacancies","notification","advertise",
  "admit card","hall ticket","call letter","e-admit",
  "result","merit list","scorecard","score card",
  "exam","examination","written test",
  "answer key","provisional answer key",
  "cut off","cutoff","bharti","online form","apply online",
  "syllabus","exam date","schedule","document verification",
  "upsssc","uppsc","upprpb","bpsc","bssc","rpsc","rsmssb",
  "mppsc","mpesb","vyapam","mpsc","gpsc","gsssb",
  "wbpsc","opsc","jpsc","cgpsc","kpsc","tnpsc","tspsc",
  "appsc","kerala psc","hppsc","apsc","jkssb","jkpsc","ukpsc",
  "ssc","upsc","rrb","rrc","ibps","sbi","rbi",
  "nda","cds","afcat","crpf","bsf","cisf","itbp",
  "agniveer","agneepath",
  "police constable","head constable","sub inspector",
  "ctet","kvs","nvs","ugc net","state tet","reet","super tet",
  "isro","drdo","barc","epfo","esic",
  "forensic","laboratory","technician","assistant","clerk","steno",
  "patwari","lekhpal","anganwadi","asha","health worker",
  "nurse","pharmacist","aiims","nhm"
];

// ─── ORG MAP: extract organisation from title ──────────────────────────────
const ORG_MAP: [RegExp, string, string][] = [
  [/upsssc/i, "UPSSSC", "state"],
  [/uppsc/i, "UPPSC", "state"],
  [/upprpb|up police/i, "UP Police", "police"],
  [/bpsc/i, "BPSC", "state"],
  [/bssc/i, "BSSC", "state"],
  [/rpsc|rsmssb/i, "RPSC / RSMSSB", "state"],
  [/mppsc|mpesb|vyapam/i, "MPPSC / MP Vyapam", "state"],
  [/hssc/i, "HSSC", "state"],
  [/dsssb/i, "DSSSB", "state"],
  [/mpsc/i, "MPSC", "state"],
  [/gpsc|gsssb/i, "GPSC / GSSSB", "state"],
  [/wbpsc/i, "WBPSC", "state"],
  [/opsc/i, "OPSC", "state"],
  [/jpsc/i, "JPSC", "state"],
  [/cgpsc/i, "CGPSC", "state"],
  [/kpsc/i, "KPSC", "state"],
  [/tnpsc|tnusrb/i, "TNPSC", "state"],
  [/tspsc/i, "TSPSC", "state"],
  [/appsc/i, "APPSC", "state"],
  [/kerala psc/i, "Kerala PSC", "state"],
  [/hppsc/i, "HPPSC", "state"],
  [/apsc/i, "APSC", "state"],
  [/jkssb|jkpsc/i, "JKSSB / JKPSC", "state"],
  [/ukpsc/i, "UKPSC", "state"],
  [/\bssc\b/i, "Staff Selection Commission (SSC)", "central"],
  [/\bupsc\b/i, "UPSC", "central"],
  [/\brrb\b|\brrc\b|indian railway/i, "Indian Railways (RRB/RRC)", "railway"],
  [/\bibps\b/i, "IBPS", "banking"],
  [/\bsbi\b/i, "State Bank of India (SBI)", "banking"],
  [/\brbi\b/i, "Reserve Bank of India (RBI)", "banking"],
  [/\blic\b/i, "Life Insurance Corporation (LIC)", "banking"],
  [/\bnda\b/i, "NDA", "defense"],
  [/\bcds\b/i, "CDS / UPSC", "defense"],
  [/afcat/i, "Indian Air Force (AFCAT)", "defense"],
  [/crpf/i, "CRPF", "defense"],
  [/\bbsf\b/i, "BSF", "defense"],
  [/cisf/i, "CISF", "defense"],
  [/\bitbp\b/i, "ITBP", "defense"],
  [/agniveer|agneepath/i, "Indian Army (Agniveer)", "defense"],
  [/\bctet\b/i, "CTET / CBSE", "teaching"],
  [/\bkvs\b/i, "Kendriya Vidyalaya Sangathan (KVS)", "teaching"],
  [/\bnvs\b/i, "Navodaya Vidyalaya Samiti (NVS)", "teaching"],
  [/ugc net/i, "UGC NET", "teaching"],
  [/\bisro\b/i, "ISRO", "central"],
  [/\bdrdo\b/i, "DRDO", "central"],
  [/\bbarc\b/i, "BARC", "central"],
  [/\bepfo\b/i, "EPFO", "central"],
  [/\besic\b/i, "ESIC", "central"],
  [/high court/i, "High Court", "state"],
  [/aiims/i, "AIIMS", "central"],
  [/\bnhm\b/i, "NHM", "state"],
];

// ─── SMART RULE-BASED PARSER (no AI, instant) ─────────────────────────────
function quickParseNotice(raw: { title: string; link: string; pubDate: string; description: string }) {
  const t = raw.title;
  const tl = t.toLowerCase();
  const desc = raw.description || "";

  // Determine type
  let type: "job" | "admit-card" | "result" | "answer-key" = "job";
  let badge_status = "New Notification";
  let badge_color: "emerald" | "blue" | "amber" | "purple" = "emerald";

  if (/admit card|hall ticket|call letter|e-admit/i.test(t)) {
    type = "admit-card"; badge_status = "Admit Card Out"; badge_color = "blue";
  } else if (/\bresult\b|merit list|final result/i.test(t)) {
    type = "result"; badge_status = "Result Declared"; badge_color = "amber";
  } else if (/answer key|provisional answer|objection/i.test(t)) {
    type = "answer-key"; badge_status = "Answer Key Released"; badge_color = "purple";
  } else if (/recruitment|vacancy|notification|online form|apply online|bharti/i.test(t)) {
    type = "job"; badge_status = "Applications Live"; badge_color = "emerald";
  }

  // Extract organisation & category
  let organization = "Government of India";
  let category: "central" | "railway" | "banking" | "police" | "defense" | "state" | "teaching" = "central";
  for (const [pattern, org, cat] of ORG_MAP) {
    if (pattern.test(t) || pattern.test(desc)) {
      organization = org;
      category = cat as typeof category;
      break;
    }
  }

  // Extract vacancy count from title/desc
  const vacMatch = t.match(/(\d[\d,]+)\s*(posts?|vacancies|seats?)/i) ||
                   desc.match(/(\d[\d,]+)\s*(posts?|vacancies|seats?)/i);
  const vacancies = vacMatch ? `${vacMatch[1]} Posts` : "See Notification";

  // Extract year
  const yearMatch = t.match(/20(2[4-9]|3\d)/);
  const year = yearMatch ? yearMatch[0] : "2026";

  // Build clean title (strip site names in brackets from Google News)
  const cleanTitle = t
    .replace(/\s*-\s*(Sarkari Result|Sarkari Naukri|Fresherslive|Employment News|Govt Jobs|Naukri Uday|Job Alert|Jagran Josh)[^-]*$/i, "")
    .trim();

  // Build slug
  const slug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  // Build short title
  const short_title = cleanTitle.length > 55 ? cleanTitle.slice(0, 55).trim() + "…" : cleanTitle;

  // Qualification guess from title
  let qualification = "Graduate / 12th Pass";
  let qualification_level: "10th" | "12th" | "graduate" | "diploma" | "postgraduate" = "graduate";
  if (/10th|matriculation|class 10|sslc/i.test(t + desc)) {
    qualification = "10th Pass (Matriculation)"; qualification_level = "10th";
  } else if (/12th|intermediate|class 12|higher secondary/i.test(t + desc)) {
    qualification = "12th Pass (Intermediate)"; qualification_level = "12th";
  } else if (/b\.?sc|b\.?tech|b\.?e\b|engineering|graduate|degree/i.test(t + desc)) {
    qualification = "Bachelor's Degree in relevant discipline"; qualification_level = "graduate";
  } else if (/diploma/i.test(t + desc)) {
    qualification = "Diploma in relevant trade"; qualification_level = "diploma";
  } else if (/post.?graduate|master|m\.?sc|m\.?tech/i.test(t + desc)) {
    qualification = "Postgraduate Degree"; qualification_level = "postgraduate";
  }

  // Location guess
  let location = "All India";
  if (/\bup\b|uttar pradesh|upsssc|uppsc|upprpb/i.test(t + desc)) location = "Uttar Pradesh";
  else if (/bihar|bpsc|bssc/i.test(t + desc)) location = "Bihar";
  else if (/rajasthan|rpsc|rsmssb/i.test(t + desc)) location = "Rajasthan";
  else if (/madhya pradesh|mppsc|mpesb|vyapam/i.test(t + desc)) location = "Madhya Pradesh";
  else if (/haryana|hssc/i.test(t + desc)) location = "Haryana";
  else if (/delhi|dsssb/i.test(t + desc)) location = "Delhi";
  else if (/maharashtra|mpsc/i.test(t + desc)) location = "Maharashtra";
  else if (/gujarat|gpsc|gsssb/i.test(t + desc)) location = "Gujarat";
  else if (/west bengal|wbpsc/i.test(t + desc)) location = "West Bengal";
  else if (/karnataka|kpsc/i.test(t + desc)) location = "Karnataka";
  else if (/tamil nadu|tnpsc/i.test(t + desc)) location = "Tamil Nadu";
  else if (/telangana|tspsc/i.test(t + desc)) location = "Telangana";
  else if (/andhra|appsc/i.test(t + desc)) location = "Andhra Pradesh";
  else if (/kerala/i.test(t + desc)) location = "Kerala";
  else if (/assam|apsc/i.test(t + desc)) location = "Assam";
  else if (/jharkhand|jpsc/i.test(t + desc)) location = "Jharkhand";
  else if (/odisha|opsc/i.test(t + desc)) location = "Odisha";
  else if (/chhattisgarh|cgpsc/i.test(t + desc)) location = "Chhattisgarh";
  else if (/himachal|hppsc/i.test(t + desc)) location = "Himachal Pradesh";
  else if (/uttarakhand|ukpsc/i.test(t + desc)) location = "Uttarakhand";
  else if (/jammu|kashmir|jkssb|jkpsc/i.test(t + desc)) location = "J&K / Ladakh";
  else if (/punjab|ppsc/i.test(t + desc)) location = "Punjab";

  // Summary
  const summary = desc
    ? desc.slice(0, 250).replace(/\s+/g, " ").trim() + (desc.length > 250 ? "…" : "")
    : `${organization} has released the ${type === "admit-card" ? "Admit Card" : type === "result" ? "Result" : "Recruitment Notification"} for ${year}. Eligible candidates are advised to visit the official website for details.`;

  // Key highlights
  const highlights: string[] = [
    `${badge_status} — check official notification`,
    location !== "All India" ? `${location} State Level Recruitment` : "Pan-India Recruitment",
    vacancies !== "See Notification" ? `Total Vacancies: ${vacancies}` : "Multiple Posts Available"
  ];

  // Selection process (type-based)
  const selection_process =
    type === "admit-card" ? ["Download Admit Card from official website", "Appear for Written Exam", "Await Result"] :
    type === "result" ? ["Written Exam (Completed)", "Document Verification", "Final Merit List"] :
    type === "answer-key" ? ["Written Exam (Completed)", "Review Answer Key", "Raise Objections if any"] :
    ["Written Examination / Screening Test", "Physical / Skill Test (if applicable)", "Document Verification", "Final Selection"];

  return {
    title: cleanTitle,
    short_title,
    organization,
    category,
    type,
    badge_status,
    badge_color,
    vacancies,
    qualification,
    qualification_level,
    age_limit: "18 - 40 Years (as per category)",
    pay_scale: "As per Government Pay Scale",
    application_fee: { generalOBC: "See notification", scStPh: "See notification", female: "See notification" },
    important_dates: {
      startDate: "Check Official Website",
      lastDate: "As per notification",
      examDate: type === "admit-card" ? "Upcoming" : "As per schedule"
    },
    location,
    summary,
    key_highlights: highlights,
    selection_process,
    official_pdf_url: raw.link,
    apply_url: raw.link,
    slug
  };
}

// ─── RSS EXTRACTOR ────────────────────────────────────────────────────────
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

    if (!title || title.length < 15) continue;

    const combined = (title + " " + description).toLowerCase();
    const isGovRelated = GOV_KEYWORDS.some(kw => combined.includes(kw));

    if (isGovRelated) {
      items.push({ title, link, pubDate, description });
    }
  }
  return items;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────
export async function GET(_request: Request) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const feeds = [
      // Direct official RSS feeds
      "https://upsssc.gov.in/rss/rss.aspx",
      "https://uppsc.up.nic.in/rss/rss.aspx",
      "https://www.employmentnews.gov.in/RSS/GetLatestRss",
      "https://pib.gov.in/RssMain.aspx?ModId=6",
      // UPSSSC + UPPRPB (Google News dedicated)
      "https://news.google.com/rss/search?q=%22UPSSSC%22+OR+%22UPPRPB%22+admit+card+result+recruitment&hl=en-IN&gl=IN&ceid=IN:en",
      // SSC & UPSC
      "https://news.google.com/rss/search?q=(%22SSC+CGL%22+OR+%22SSC+CHSL%22+OR+%22SSC+MTS%22+OR+%22SSC+GD%22+OR+%22UPSC+CSE%22)+2026+admit+card+result+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // Railway
      "https://news.google.com/rss/search?q=(%22RRB%22+OR+%22RRC%22+OR+%22NTPC%22)+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // Banking
      "https://news.google.com/rss/search?q=(%22IBPS+PO%22+OR+%22IBPS+Clerk%22+OR+%22SBI+PO%22+OR+%22SBI+Clerk%22+OR+%22RBI+Grade%22)+2026+result+admit+card&hl=en-IN&gl=IN&ceid=IN:en",
      // Defense
      "https://news.google.com/rss/search?q=(%22Agniveer%22+OR+%22NDA+2026%22+OR+%22CDS+2026%22+OR+%22CRPF+recruitment%22)+admit+card+result+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // North India states
      "https://news.google.com/rss/search?q=(%22UPPSC%22+OR+%22BPSC%22+OR+%22RPSC%22+OR+%22MPPSC%22+OR+%22HSSC%22+OR+%22DSSSB%22)+2026+admit+card+result+recruitment&hl=en-IN&gl=IN&ceid=IN:en",
      // West / East states
      "https://news.google.com/rss/search?q=(%22MPSC%22+OR+%22GPSC%22+OR+%22WBPSC%22+OR+%22OPSC%22+OR+%22JPSC%22+OR+%22CGPSC%22)+2026+admit+card+result+recruitment&hl=en-IN&gl=IN&ceid=IN:en",
      // South states
      "https://news.google.com/rss/search?q=(%22KPSC%22+OR+%22TNPSC%22+OR+%22TSPSC%22+OR+%22APPSC%22+OR+%22Kerala+PSC%22)+2026+admit+card+result+recruitment&hl=en-IN&gl=IN&ceid=IN:en",
      // Northeast & Himalayan states
      "https://news.google.com/rss/search?q=(%22APSC%22+OR+%22JKSSB%22+OR+%22HPPSC%22+OR+%22UKPSC%22+OR+%22Assam+Police%22)+2026+admit+card+result+recruitment&hl=en-IN&gl=IN&ceid=IN:en",
      // Teaching
      "https://news.google.com/rss/search?q=(%22CTET%22+OR+%22KVS+Recruitment%22+OR+%22NVS+Recruitment%22+OR+%22UGC+NET%22+OR+%22REET%22)+2026+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
      // PSU / Science bodies
      "https://news.google.com/rss/search?q=(%22ISRO+Recruitment%22+OR+%22DRDO+Recruitment%22+OR+%22BARC+Recruitment%22+OR+%22EPFO+Recruitment%22)+2026&hl=en-IN&gl=IN&ceid=IN:en",
      // Police Bharti
      "https://news.google.com/rss/search?q=(%22Police+Constable%22+OR+%22Police+Bharti%22+OR+%22Head+Constable%22+OR+%22Sub+Inspector%22)+2026+admit+card+result+notification&hl=en-IN&gl=IN&ceid=IN:en",
      // Medical
      "https://news.google.com/rss/search?q=(%22AIIMS+Recruitment%22+OR+%22NHM+Recruitment%22+OR+%22Staff+Nurse%22+OR+%22Lab+Technician%22)+2026+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
      // High Courts
      "https://news.google.com/rss/search?q=(%22High+Court%22+OR+%22District+Court%22)+clerk+stenographer+recruitment+2026+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
      // State Patwari / Lekhpal / VDO
      "https://news.google.com/rss/search?q=(%22Lekhpal%22+OR+%22Patwari%22+OR+%22VDO%22+OR+%22Anganwadi+Recruitment%22)+2026+notification+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
      // State PSC general catch-all
      "https://news.google.com/rss/search?q=%22State+PSC%22+OR+%22Public+Service+Commission%22+recruitment+notification+2026+admit+card&hl=en-IN&gl=IN&ceid=IN:en"
    ];

    // ── Fetch ALL feeds in PARALLEL (much faster than sequential) ──────────
    const feedResults = await Promise.allSettled(
      feeds.map(url =>
        fetch(url, {
          next: { revalidate: 0 },
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; HireOrbitAI-GovBot/2.0; +https://hireorbitai.in)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*"
          },
          signal: AbortSignal.timeout(8000)
        }).then(r => r.ok ? r.text() : "")
          .catch(() => "")
      )
    );

    let foundItems: Array<{ title: string; link: string; pubDate: string; description: string }> = [];
    for (const result of feedResults) {
      if (result.status === "fulfilled" && result.value) {
        foundItems = foundItems.concat(extractRssItems(result.value));
      }
    }

    // Deduplicate by title (first 50 chars)
    const uniqueItems = Array.from(
      new Map(foundItems.map(item => [item.title.toLowerCase().slice(0, 50), item])).values()
    );

    // Get existing titles/slugs from DB
    const { data: existingRows } = await supabase
      .from("gov_notifications")
      .select("id, slug, title");

    const existingTitles = (existingRows || []).map(r => r.title.toLowerCase().slice(0, 30));
    const existingSlugs = new Set((existingRows || []).map(r => r.slug));

    // Filter only new items
    const newItems = uniqueItems.filter(item => {
      const key = item.title.toLowerCase().slice(0, 30);
      return !existingTitles.some(t => t === key);
    });

    // Process up to 25 new items per run (all via fast rule-based parser — no AI calls)
    const toProcess = newItems.slice(0, 25);
    const newlyAdded: string[] = [];

    for (const item of toProcess) {
      const parsed = quickParseNotice(item);
      if (!parsed.slug || parsed.title.length < 10) continue;

      // Ensure slug uniqueness
      let slug = parsed.slug;
      if (existingSlugs.has(slug)) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      const id = `auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const { error } = await supabase.from("gov_notifications").insert({
        id,
        slug,
        title: parsed.title,
        short_title: parsed.short_title,
        organization: parsed.organization,
        category: parsed.category,
        type: parsed.type,
        badge_status: parsed.badge_status,
        badge_color: parsed.badge_color,
        vacancies: parsed.vacancies,
        qualification: parsed.qualification,
        qualification_level: parsed.qualification_level,
        age_limit: parsed.age_limit,
        pay_scale: parsed.pay_scale,
        application_fee: parsed.application_fee,
        important_dates: parsed.important_dates,
        location: parsed.location,
        summary: parsed.summary,
        key_highlights: parsed.key_highlights,
        selection_process: parsed.selection_process,
        official_pdf_url: parsed.official_pdf_url,
        apply_url: parsed.apply_url,
        source_feed: "Automated Gazette Sync v3",
        is_trending: true,
        is_lead_story: false
      });

      if (!error) {
        newlyAdded.push(parsed.title);
        existingSlugs.add(slug);
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
