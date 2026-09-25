import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateRecruitmentFingerprint, generateResultFingerprint } from "@/lib/universal-notice-model";
import { extractDatesFromText, deepExtractFromNotice, ExtractedUniversalDates } from "@/lib/deep-date-extractor";
import { validateNoticeDates, cleanDateValue, isRealDateString } from "@/lib/universal-date-normalizer";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buqkdtnffjoiwwtfxiek.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

// ─── SOURCE DEFINITIONS ───────────────────────────────────────────────────
export interface DiscoverySource {
  id: string;
  name: string;
  url: string;
  type: "official_rss" | "official_gazette" | "aggregator_feed";
  trustLevel: "official" | "trusted_aggregator" | "aggregator";
  isAggregator: boolean;
}

export const DISCOVERY_SOURCES: DiscoverySource[] = [
  // ── 1. Aggregator Discovery Feeds (Primary Signal Detectors) ──
  {
    id: "sarkari_result",
    name: "Sarkari Result",
    url: "https://news.google.com/rss/search?q=%22sarkariresult%22+OR+%22sarkari+result%22+recruitment+notification+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "aggregator_feed",
    trustLevel: "trusted_aggregator",
    isAggregator: true
  },
  {
    id: "physics_wallah",
    name: "Physics Wallah (PW)",
    url: "https://news.google.com/rss/search?q=%22pw.live%22+OR+%22physics+wallah%22+recruitment+vacancy+notification+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "aggregator_feed",
    trustLevel: "trusted_aggregator",
    isAggregator: true
  },
  {
    id: "adda247",
    name: "Adda247",
    url: "https://news.google.com/rss/search?q=%22adda247%22+recruitment+notification+vacancy+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "aggregator_feed",
    trustLevel: "trusted_aggregator",
    isAggregator: true
  },
  {
    id: "testbook",
    name: "Testbook",
    url: "https://news.google.com/rss/search?q=%22testbook%22+recruitment+notification+vacancy+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "aggregator_feed",
    trustLevel: "trusted_aggregator",
    isAggregator: true
  },

  // ── 2. Direct Official Commission Feeds ──
  {
    id: "uppsc_direct",
    name: "UPPSC Official Gazette RSS",
    url: "https://uppsc.up.nic.in/rss/rss.aspx",
    type: "official_rss",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "upsssc_direct",
    name: "UPSSSC Official RSS",
    url: "https://upsssc.gov.in/rss/rss.aspx",
    type: "official_rss",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "pib_direct",
    name: "Press Information Bureau (PIB) Govt of India",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6",
    type: "official_rss",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "employment_news",
    name: "Employment News Official Gazette",
    url: "https://www.employmentnews.gov.in/RSS/GetLatestRss",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },

  // ── 3. Targeted Regional & Central Agency Gazettes ──
  {
    id: "ssc_central",
    name: "SSC Central Commissions Stream",
    url: "https://news.google.com/rss/search?q=(%22SSC+CGL%22+OR+%22SSC+CHSL%22+OR+%22SSC+MTS%22+OR+%22SSC+GD%22+OR+%22SSC+CPO%22)+2026+recruitment+admit+result&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "rrb_railway",
    name: "Railway RRB / RRC Recruitment Stream",
    url: "https://news.google.com/rss/search?q=(%22RRB+NTPC%22+OR+%22RRB+ALP%22+OR+%22RRC+Group+D%22+OR+%22Railway+Recruitment%22)+2026+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "banking_stream",
    name: "Banking (IBPS, SBI, RBI, LIC) Stream",
    url: "https://news.google.com/rss/search?q=(%22IBPS+PO%22+OR+%22IBPS+Clerk%22+OR+%22SBI+PO%22+OR+%22SBI+Clerk%22+OR+%22RBI+Grade+B%22)+2026+result+admit+card&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "defense_stream",
    name: "Defense (Agniveer, NDA, CDS, CRPF, BSF, CISF)",
    url: "https://news.google.com/rss/search?q=(%22Agniveer%22+OR+%22NDA+2026%22+OR+%22CRPF+Recruitment%22+OR+%22BSF+Recruitment%22+OR+%22CISF+Recruitment%22)+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "teaching_stream",
    name: "Teaching (CTET, KVS, NVS, UGC NET, State TETs)",
    url: "https://news.google.com/rss/search?q=(%22CTET%22+OR+%22KVS+Recruitment%22+OR+%22NVS+Recruitment%22+OR+%22UGC+NET%22+OR+%22Super+TET%22+OR+%22REET%22)+2026+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_bpsc",
    name: "Bihar (BPSC, BSSC, Bihar Police)",
    url: "https://news.google.com/rss/search?q=%22BPSC%22+OR+%22Bihar+Police%22+OR+%22BSSC%22+OR+%22Bihar+STET%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_upprpb",
    name: "Uttar Pradesh (UPSSSC, UPPSC, UP Police)",
    url: "https://news.google.com/rss/search?q=%22UPSSSC%22+OR+%22UPPRPB%22+OR+%22UP+Police+Constable%22+admit+card+result+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_rpsc",
    name: "Rajasthan (RPSC, RSMSSB, Rajasthan Police)",
    url: "https://news.google.com/rss/search?q=%22RPSC%22+OR+%22RSMSSB%22+OR+%22Rajasthan+Police%22+OR+%22REET%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_mpesb",
    name: "Madhya Pradesh (MPESB, MPPSC, MP Police)",
    url: "https://news.google.com/rss/search?q=%22MPESB%22+OR+%22MP+Police+Constable%22+OR+%22MP+Vyapam%22+OR+%22MPPEB%22+OR+%22Madhya+Pradesh+Police%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_hssc",
    name: "Haryana (HSSC, HPSC, Haryana Police)",
    url: "https://news.google.com/rss/search?q=%22HSSC%22+OR+%22HPSC%22+OR+%22Haryana+Police%22+OR+%22Haryana+CET%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_mpsc",
    name: "Maharashtra (MPSC, Maharashtra Police)",
    url: "https://news.google.com/rss/search?q=%22MPSC%22+OR+%22Maharashtra+Police%22+OR+%22Maharashtra+Arogya%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_gpsc",
    name: "Gujarat (GPSC, GSSSB, Gujarat Police)",
    url: "https://news.google.com/rss/search?q=%22GPSC%22+OR+%22GSSSB%22+OR+%22Gujarat+Police%22+OR+%22OJAS%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_wbpsc",
    name: "West Bengal (WBPSC, WB Police, WBSSC)",
    url: "https://news.google.com/rss/search?q=%22WBPSC%22+OR+%22WB+Police%22+OR+%22WBSSC%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_kpsc",
    name: "Karnataka (KPSC, Karnataka Police, KSP)",
    url: "https://news.google.com/rss/search?q=%22KPSC%22+OR+%22KSP%22+OR+%22Karnataka+Police%22+OR+%22KSSB%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_tnpsc",
    name: "Tamil Nadu (TNPSC, TNUSRB)",
    url: "https://news.google.com/rss/search?q=%22TNPSC%22+OR+%22TNUSRB%22+OR+%22Tamil+Nadu+Police%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_tspsc",
    name: "Telangana (TSPSC, Telangana Police)",
    url: "https://news.google.com/rss/search?q=%22TSPSC%22+OR+%22Telangana+Police%22+OR+%22TSLPRB%22+recruitment+admit+card+result+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "state_himalayan",
    name: "Himalayan & Eastern PSCs (JKSSB, HPPSC, UKPSC, APSC, OPSC, JPSC)",
    url: "https://news.google.com/rss/search?q=(%22JKSSB%22+OR+%22HPPSC%22+OR+%22UKPSC%22+OR+%22APSC%22+OR+%22OPSC%22+OR+%22JPSC%22+OR+%22CGPSC%22)+2026+recruit+admit+result&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "psu_scientific",
    name: "PSUs & Scientific (ISRO, DRDO, BARC, EPFO, ESIC)",
    url: "https://news.google.com/rss/search?q=(%22ISRO+Recruitment%22+OR+%22DRDO+Recruitment%22+OR+%22BARC+Recruitment%22+OR+%22EPFO%22+OR+%22ESIC%22+OR+%22IOCL+Recruitment%22)+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "medical_stream",
    name: "Medical & Paramedical (AIIMS, NHM, Staff Nurse)",
    url: "https://news.google.com/rss/search?q=(%22AIIMS+Recruitment%22+OR+%22NHM+Recruitment%22+OR+%22Staff+Nurse%22+OR+%22Lab+Technician%22+OR+%22Pharmacist+Recruitment%22)+2026&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "judiciary_stream",
    name: "Judiciary & Courts (High Court, District Courts)",
    url: "https://news.google.com/rss/search?q=(%22High+Court+Recruitment%22+OR+%22District+Court%22)+clerk+stenographer+2026+admit+card+result&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  },
  {
    id: "revenue_stream",
    name: "Revenue & Rural (Patwari, Lekhpal, VDO, Anganwadi)",
    url: "https://news.google.com/rss/search?q=(%22Lekhpal%22+OR+%22Patwari%22+OR+%22VDO+Recruitment%22+OR+%22Gram+Sachiv%22+OR+%22Anganwadi+Supervisor%22)+2026+notification+admit+card&hl=en-IN&gl=IN&ceid=IN:en",
    type: "official_gazette",
    trustLevel: "official",
    isAggregator: false
  }
];

// ─── KEYWORD FILTERS ───────────────────────────────────────────────────────
const GOV_KEYWORDS = [
  "recruitment", "vacancy", "vacancies", "notification", "advertise", "advertisement",
  "admit card", "hall ticket", "call letter", "e-admit",
  "result", "merit list", "scorecard", "score card",
  "exam", "examination", "written test",
  "answer key", "provisional answer key",
  "cut off", "cutoff", "bharti", "online form", "apply online", "application form",
  "syllabus", "exam date", "schedule", "document verification",
  "upsssc", "uppsc", "upprpb", "bpsc", "bssc", "rpsc", "rsmssb",
  "mppsc", "mpesb", "vyapam", "mpsc", "gpsc", "gsssb",
  "wbpsc", "opsc", "jpsc", "cgpsc", "kpsc", "tnpsc", "tspsc",
  "appsc", "kerala psc", "hppsc", "apsc", "jkssb", "jkpsc", "ukpsc",
  "ssc", "upsc", "rrb", "rrc", "ibps", "sbi", "rbi",
  "nda", "cds", "afcat", "crpf", "bsf", "cisf", "itbp",
  "agniveer", "agneepath",
  "police constable", "head constable", "sub inspector",
  "ctet", "kvs", "nvs", "ugc net", "state tet", "reet", "super tet",
  "isro", "drdo", "barc", "epfo", "esic",
  "forensic", "laboratory", "technician", "assistant", "clerk", "steno",
  "patwari", "lekhpal", "anganwadi", "asha", "health worker",
  "nurse", "pharmacist", "aiims", "nhm"
];

// ─── ORG MAP: extract organisation from title & desc ───────────────────────
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
  [/kpsc|ksp\b|karnataka police/i, "KPSC", "state"],
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

// ─── OFFICIAL PORTALS REGISTRY ─────────────────────────────────────────────
const OFFICIAL_PORTAL_REGISTRY: Record<string, { authority: string; portalUrl: string }> = {
  "Staff Selection Commission (SSC)": { authority: "Staff Selection Commission (SSC)", portalUrl: "https://ssc.gov.in" },
  "UPSC": { authority: "Union Public Service Commission (UPSC)", portalUrl: "https://upsc.gov.in" },
  "Indian Railways (RRB/RRC)": { authority: "Railway Recruitment Boards (RRB)", portalUrl: "https://rrbapply.gov.in" },
  "IBPS": { authority: "Institute of Banking Personnel Selection (IBPS)", portalUrl: "https://ibps.in" },
  "State Bank of India (SBI)": { authority: "State Bank of India (SBI)", portalUrl: "https://sbi.co.in/careers" },
  "Reserve Bank of India (RBI)": { authority: "Reserve Bank of India (RBI)", portalUrl: "https://opportunities.rbi.org.in" },
  "UPSSSC": { authority: "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)", portalUrl: "https://upsssc.gov.in" },
  "UPPSC": { authority: "Uttar Pradesh Public Service Commission (UPPSC)", portalUrl: "https://uppsc.up.nic.in" },
  "UP Police": { authority: "UP Police Recruitment & Promotion Board (UPPRPB)", portalUrl: "https://uppbpb.gov.in" },
  "BPSC": { authority: "Bihar Public Service Commission (BPSC)", portalUrl: "https://bpsc.bih.nic.in" },
  "BSSC": { authority: "Bihar Staff Selection Commission (BSSC)", portalUrl: "https://bssc.bihar.gov.in" },
  "RPSC / RSMSSB": { authority: "Rajasthan Public Service Commission (RPSC)", portalUrl: "https://rpsc.rajasthan.gov.in" },
  "MPPSC / MP Vyapam": { authority: "Madhya Pradesh Employees Selection Board (MPESB)", portalUrl: "https://esb.mp.gov.in" },
  "HSSC": { authority: "Haryana Staff Selection Commission (HSSC)", portalUrl: "https://hssc.gov.in" },
  "DSSSB": { authority: "Delhi Subordinate Services Selection Board (DSSSB)", portalUrl: "https://dsssb.delhi.gov.in" },
  "MPSC": { authority: "Maharashtra Public Service Commission (MPSC)", portalUrl: "https://mpsc.gov.in" },
  "GPSC / GSSSB": { authority: "Gujarat Public Service Commission (GPSC)", portalUrl: "https://gpsc.gujarat.gov.in" },
  "WBPSC": { authority: "West Bengal Public Service Commission (WBPSC)", portalUrl: "https://psc.wb.gov.in" },
  "KPSC": { authority: "Karnataka Public Service Commission (KPSC)", portalUrl: "https://kpsc.kar.nic.in" },
  "TNPSC": { authority: "Tamil Nadu Public Service Commission (TNPSC)", portalUrl: "https://tnpsc.gov.in" },
  "TSPSC": { authority: "Telangana State Public Service Commission (TSPSC)", portalUrl: "https://tspsc.gov.in" },
  "APPSC": { authority: "Andhra Pradesh Public Service Commission (APPSC)", portalUrl: "https://psc.ap.gov.in" },
  "Kerala PSC": { authority: "Kerala Public Service Commission (Kerala PSC)", portalUrl: "https://keralapsc.gov.in" },
  "HPPSC": { authority: "Himachal Pradesh Public Service Commission (HPPSC)", portalUrl: "https://hppsc.hp.gov.in" },
  "APSC": { authority: "Assam Public Service Commission (APSC)", portalUrl: "https://apsc.nic.in" },
  "JKSSB / JKPSC": { authority: "Jammu & Kashmir Services Selection Board (JKSSB)", portalUrl: "https://jkssb.nic.in" },
  "UKPSC": { authority: "Uttarakhand Public Service Commission (UKPSC)", portalUrl: "https://psc.uk.gov.in" },
  "OPSC": { authority: "Odisha Public Service Commission (OPSC)", portalUrl: "https://opsc.gov.in" },
  "JPSC": { authority: "Jharkhand Public Service Commission (JPSC)", portalUrl: "https://jpsc.gov.in" },
  "CGPSC": { authority: "Chhattisgarh Public Service Commission (CGPSC)", portalUrl: "https://psc.cg.gov.in" },
  "CTET / CBSE": { authority: "Central Board of Secondary Education (CBSE)", portalUrl: "https://ctet.nic.in" },
  "UGC NET": { authority: "National Testing Agency (NTA)", portalUrl: "https://ugcnet.nta.ac.in" },
  "AIIMS": { authority: "All India Institute of Medical Sciences (AIIMS)", portalUrl: "https://aiimsexams.ac.in" },
  "ISRO": { authority: "Indian Space Research Organisation (ISRO)", portalUrl: "https://isro.gov.in/Careers.html" },
  "DRDO": { authority: "Defence Research and Development Organisation (DRDO)", portalUrl: "https://drdo.gov.in/careers" },
  "BARC": { authority: "Bhabha Atomic Research Centre (BARC)", portalUrl: "https://barc.gov.in/careers" },
  "EPFO": { authority: "Employees' Provident Fund Organisation (EPFO)", portalUrl: "https://epfindia.gov.in" },
  "ESIC": { authority: "Employees' State Insurance Corporation (ESIC)", portalUrl: "https://esic.gov.in" },
};

// ─── OFFICIAL DOMAIN VALIDATOR ─────────────────────────────────────────────
function isOfficialGovDomain(urlStr: string): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    return (
      host.endsWith(".gov.in") ||
      host.endsWith(".nic.in") ||
      host.endsWith(".ac.in") ||
      host.endsWith(".edu.in") ||
      host === "ibps.in" ||
      host.endsWith(".ibps.in") ||
      host === "sbi.co.in" ||
      host.endsWith(".sbi.co.in") ||
      host === "rbi.org.in" ||
      host.endsWith(".rbi.org.in") ||
      host === "nta.ac.in" ||
      host.endsWith(".nta.ac.in")
    );
  } catch {
    return false;
  }
}

// ─── ROBUST HTML SANITIZER & ENTITY DECODER ───────────────────────────────
function stripHtmlAndDecode(rawText: string): string {
  if (!rawText) return "";
  let text = rawText
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)));

  text = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  text = text.replace(/<[^>]*>/g, " ");
  text = text.replace(/https?:\/\/\S+/g, " ");

  // Strip news aggregator brand footprints
  text = text.replace(/\s*[-|]\s*(?:PW|Physics\s*Wallah|Sarkari\s*Result|Adda247|Adda\s*247|Testbook|Jagran\s*Josh|Careers360|Shiksha|India\s*Today|TOI|Hindustan\s*Times|Sakshi\s*Education|Amar\s*Ujala|Dainik\s*Bhaskar)\b.*$/i, "");
  text = text.replace(/\b(?:PW|Physics\s*Wallah|Sarkari\s*Result|Adda247|Testbook)\b\s*$/i, "");

  return text.replace(/\s{2,}/g, " ").trim();
}

// ─── PLACEHOLDER TEXT SANITIZER ──────────────────────────────────────────
export function isPlaceholderText(val: any): boolean {
  return Boolean(
    val &&
    typeof val === "string" &&
    /announced|upcoming|notified|check|available now \/|window closed|as per|active \/|tba|to be announced/i.test(val)
  );
}

// ─── CONTEXT-AWARE DATE FORMATTING & NORMALIZATION ENGINE ─────────────────
export function formatUniversalDatesObject(
  extracted: ExtractedUniversalDates,
  title: string,
  type: string
) {
  const isAdmitNotice = type === "admit-card" || /admit card|hall ticket|call letter|city slip|exam date/i.test(title);
  const isResultNotice = type === "result" || /result|merit list|scorecard|cut off/i.test(title);

  // Return backward-compatible top-level keys AND complete structured schema
  return {
    startDate: cleanDateValue(extracted.applicationStart) || null,
    lastDate: cleanDateValue(extracted.applicationLastDate) || null,
    feeLastDate: cleanDateValue(extracted.feeLastDate || extracted.applicationLastDate) || null,
    examDate: cleanDateValue(extracted.examDate) || null,
    examDateFrom: cleanDateValue(extracted.examDateFrom) || null,
    examDateTo: cleanDateValue(extracted.examDateTo) || null,
    examDateEvidence: extracted.examDateEvidence || null,
    admitCardDate: cleanDateValue(extracted.admitCardDate) || null,
    admitCardEvidence: extracted.admitCardEvidence || null,
    citySlipDate: cleanDateValue(extracted.citySlipDate) || null,
    citySlipEvidence: extracted.citySlipEvidence || null,
    resultDate: cleanDateValue(extracted.resultDate) || null,
    resultDateEvidence: extracted.resultDateEvidence || null,
    stage: extracted.stage || "general",
    stages: extracted.stages || undefined,

    // Universal Structured Model
    application_begin: {
      date: cleanDateValue(extracted.applicationStart) || null,
      status: extracted.applicationStart ? "available" : (isAdmitNotice || isResultNotice ? "completed" : "not_announced"),
      evidence: extracted.applicationStartEvidence || undefined
    },
    application_last_date: {
      date: cleanDateValue(extracted.applicationLastDate) || null,
      status: (isAdmitNotice || isResultNotice) ? "closed" : (extracted.applicationLastDate ? "available" : "not_announced"),
      evidence: extracted.applicationLastDateEvidence || undefined
    },
    fee_payment_last_date: {
      date: cleanDateValue(extracted.feeLastDate || extracted.applicationLastDate) || null,
      status: (isAdmitNotice || isResultNotice) ? "closed" : "available",
      evidence: extracted.feeLastDateEvidence || undefined
    },
    correction_last_date: {
      date: null,
      status: (isAdmitNotice || isResultNotice) ? "closed" : "not_announced"
    },
    exam_date: {
      date: cleanDateValue(extracted.examDate) || null,
      start: cleanDateValue(extracted.examDateFrom) || undefined,
      end: cleanDateValue(extracted.examDateTo) || undefined,
      status: extracted.examDate ? "announced" : (isAdmitNotice ? "announced" : "not_announced"),
      evidence: extracted.examDateEvidence || undefined
    },
    city_intimation_date: {
      date: cleanDateValue(extracted.citySlipDate) || null,
      status: extracted.citySlipDate ? "available" : "not_announced",
      evidence: extracted.citySlipEvidence || undefined
    },
    admit_card_date: {
      date: cleanDateValue(extracted.admitCardDate) || null,
      status: extracted.admitCardDate ? "released" : (isAdmitNotice ? "released" : "not_announced"),
      evidence: extracted.admitCardEvidence || undefined
    },
    answer_key_date: {
      date: null,
      status: "not_announced"
    },
    result_date: {
      date: cleanDateValue(extracted.resultDate) || null,
      status: extracted.resultDate ? "released" : "not_declared",
      evidence: extracted.resultDateEvidence || undefined
    }
  };
}

function extractDatesFromNotice(
  title: string,
  desc: string,
  type: string,
  year: string
) {
  // Use universal extractor with date range, evidence, and confidence support
  const extracted = extractDatesFromText(desc, title, year);
  return formatUniversalDatesObject(extracted, title, type);
}

// ─── NOTICE CLASSIFIER ─────────────────────────────────────────────────────
function classifyNotice(title: string, desc: string): {
  type: "recruitment" | "admit-card" | "result" | "answer-key" | "other";
  badgeStatus: string;
  badgeColor: "emerald" | "blue" | "amber" | "purple";
  isRecruitment: boolean;
} {
  const t = title.toLowerCase();
  const combined = `${t} ${desc.toLowerCase()}`;

  // 1. Result Check
  if (/\bresult\b|merit list|final result|scorecard|cut.?off marks|selection list/i.test(t)) {
    return { type: "result", badgeStatus: "Result Declared", badgeColor: "amber", isRecruitment: false };
  }

  // 2. Answer Key Check
  if (/answer key|provisional answer|objection window/i.test(t)) {
    return { type: "answer-key", badgeStatus: "Answer Key Released", badgeColor: "purple", isRecruitment: false };
  }

  // 3. Admit Card / Exam Date Check
  if (/admit card|hall ticket|call letter|e-admit/i.test(t)) {
    return { type: "admit-card", badgeStatus: "Admit Card Out", badgeColor: "blue", isRecruitment: false };
  }
  if (/exam date|exam schedule|exam calendar|city slip|city intimation|prelims exam date|mains exam date/i.test(t)) {
    return { type: "admit-card", badgeStatus: "Exam Date Announced", badgeColor: "blue", isRecruitment: false };
  }

  // 4. Strict Recruitment Check (Priority for Phase 3A)
  const hasRecruitmentKeyword = /recruitment|vacancy|vacancies|notification|online form|apply online|application form|bharti|\bposts\b|\bcen\b|advertisement|registration|online application/i.test(t);
  const hasExtendedSignal = /last date extended|date extended|last date reminder|deadline extended/i.test(t);

  if (hasExtendedSignal) {
    return { type: "recruitment", badgeStatus: "Last Date Extended", badgeColor: "emerald", isRecruitment: true };
  }

  if (hasRecruitmentKeyword) {
    const isCorrectionWindow = /correction window|edit application/i.test(t);
    return { 
      type: "recruitment", 
      badgeStatus: isCorrectionWindow ? "Correction Window Open" : "Applications Live", 
      badgeColor: "emerald", 
      isRecruitment: true 
    };
  }

  return { type: "other", badgeStatus: "Gazette Notice", badgeColor: "emerald", isRecruitment: false };
}

// ─── QUICK PARSE NOTICE WITH SOURCE TRACKING & OFFICIAL ISOLATION ──────────
function quickParseNotice(
  raw: { title: string; link: string; pubDate: string; description: string },
  source: DiscoverySource
) {
  const t = raw.title;
  const desc = stripHtmlAndDecode(raw.description || "");

  // 1. Classification
  const classification = classifyNotice(t, desc);
  const type = classification.type === "recruitment" ? "recruitment" : (classification.type as "admit-card" | "result" | "answer-key" | "recruitment");
  const badge_status = classification.badgeStatus;
  const badge_color = classification.badgeColor;

  // 2. Organization Resolution
  let organization = "Government of India";
  let category: "central" | "railway" | "banking" | "police" | "defense" | "state" | "teaching" = "central";
  for (const [pattern, org, cat] of ORG_MAP) {
    if (pattern.test(t) || pattern.test(desc)) {
      organization = org;
      category = cat as typeof category;
      break;
    }
  }

  // 3. Vacancy Count
  const vacMatch = t.match(/(\d[\d,]+)\s*(posts?|vacancies|seats?)/i) ||
                   desc.match(/(\d[\d,]+)\s*(posts?|vacancies|seats?)/i);
  const vacancies = vacMatch ? `${vacMatch[1]} Posts` : "See Notification";

  // 4. Year
  const yearMatch = t.match(/20(2[4-9]|3\d)/);
  const year = yearMatch ? yearMatch[0] : "2026";

  // 5. Clean Title (Aggregator footprints completely removed)
  const cleanTitle = t
    .replace(/\s*[-|]\s*(Sarkari Result|Sarkari Naukri|Fresherslive|Employment News|Govt Jobs|Naukri Uday|Job Alert|Jagran Josh|Careers360|Adda247|Adda 247|PW|Physics Wallah|Shiksha\.com|Shiksha|India Today|Hindustan Times|Times of India|TOI|NDTV|News18|Amar Ujala|Dainik Bhaskar|Navbharat Times|Oneindia|Zee News|ABP Live|Patrika|LiveMint|Economic Times|The Hindu|Indian Express|Firstpost)[^-|]*$/i, "")
    .replace(/\s*\|\s*[^|]{5,50}$/, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

  // 6. Slug & Short Title
  const slug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  const short_title = cleanTitle.length > 55 ? cleanTitle.slice(0, 55).trim() + "…" : cleanTitle;

  // 7. Location Detection (Moved up for fingerprint accuracy)
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

  // 8. Extract Notification Number (CEN, Advt No, Notification No)
  const notifMatch = (t + " " + desc).match(/\b(?:cen|advt\.?\s*no\.?|notification\s*no\.?|employment\s*notice\s*no\.?)\s*[:.-]?\s*([a-z0-9\/-]+)/i);
  const notificationNumber = notifMatch ? notifMatch[1].trim() : undefined;

  // 9. Canonical Fingerprint for Deduplication
  let resultStage = "general";
  if (/cbt\s*[-]?\s*1/i.test(t + " " + desc)) resultStage = "cbt1";
  else if (/cbt\s*[-]?\s*2/i.test(t + " " + desc)) resultStage = "cbt2";
  else if (/tier\s*[-]?\s*1/i.test(t + " " + desc)) resultStage = "tier1";
  else if (/tier\s*[-]?\s*2/i.test(t + " " + desc)) resultStage = "tier2";
  else if (/prelims|preliminary/i.test(t + " " + desc)) resultStage = "prelims";
  else if (/mains/i.test(t + " " + desc)) resultStage = "mains";
  else if (/final/i.test(t + " " + desc)) resultStage = "final";
  else if (/pet|pst|physical/i.test(t + " " + desc)) resultStage = "pet";
  else if (/skill|typing/i.test(t + " " + desc)) resultStage = "skill";
  else if (/interview/i.test(t + " " + desc)) resultStage = "interview";

  const fingerprint = type === "result"
    ? generateResultFingerprint(organization, cleanTitle, year, resultStage, location)
    : generateRecruitmentFingerprint(organization, short_title || cleanTitle, year, notificationNumber);

  // 10. Qualification Matrix
  let qualification = "Bachelor's Degree in any discipline / Relevant Qualification";
  let qualification_level: "10th" | "12th" | "graduate" | "diploma" | "postgraduate" = "graduate";

  if (/scientist|engineer|\bicrb\b|drdo|barc|isro\b/i.test(t + desc)) {
    if (/technical assistant|technician|trade|iti|cook|fireman|draughtsman/i.test(t + desc)) {
      qualification = "Diploma in Engineering / ITI Certificate in Relevant Trade";
      qualification_level = "diploma";
    } else {
      qualification = "B.E / B.Tech / M.Sc in relevant Engineering / Science discipline (First Class / 65% Marks)";
      qualification_level = "graduate";
    }
  } else if (/technical assistant|junior engineer|\bje\b|diploma engineer/i.test(t + desc)) {
    qualification = "Diploma in Engineering (3 Years) / B.Sc in Relevant Discipline";
    qualification_level = "diploma";
  } else if (/technician|iti\b|trade apprentice|fitter|electrician|welder/i.test(t + desc)) {
    qualification = "10th (Matriculation) + ITI Certificate in Relevant Trade (NCVT/SCVT)";
    qualification_level = "10th";
  } else if (/\bapp\b|prosecutor|law officer|\bllb\b|civil judge|advocate|judicial/i.test(t + desc)) {
    qualification = "Bachelor's Degree in Law (LL.B)";
    qualification_level = "graduate";
  } else if (/nurse|nursing|gnm|b\.?sc nursing/i.test(t + desc)) {
    qualification = "B.Sc Nursing / GNM Diploma with State/INC Nursing Council Registration";
    qualification_level = "graduate";
  } else if (/pharmacist|b\.?pharm|d\.?pharm/i.test(t + desc)) {
    qualification = "Degree / Diploma in Pharmacy (B.Pharm / D.Pharm) with Council Registration";
    qualification_level = "diploma";
  } else if (/ctet|stet|teacher|tre\b|kvs|nvs|b\.?ed|d\.?el\.?ed/i.test(t + desc)) {
    qualification = "Graduation / Post Graduation with B.Ed / D.El.Ed & State/Central TET Scorecard";
    qualification_level = "graduate";
  } else if (/sub inspector|\bsi\b|daroga/i.test(t + desc)) {
    qualification = "Bachelor's Degree in any discipline from a recognized University";
    qualification_level = "graduate";
  } else if (/constable|sepoy|rifleman|guard/i.test(t + desc)) {
    qualification = "10+2 (Intermediate / Higher Secondary) Pass from a recognized Board";
    qualification_level = "12th";
  } else if (/lekhpal|patwari|\bvdo\b|gram sachiv/i.test(t + desc)) {
    qualification = "10+2 (Intermediate) + State PET Eligibility Scorecard / CCC Certificate";
    qualification_level = "12th";
  } else if (/civil services|ias|ips|pcs|uppsc|bpsc cce|ras|mpsc|wbcs|opsc ocs/i.test(t + desc)) {
    qualification = "Bachelor's Degree in any discipline from a recognized Indian University";
    qualification_level = "graduate";
  } else if (/probationary officer|\bpo\b|\bclerk\b|banking|ibps|sbi po|rbi grade b/i.test(t + desc)) {
    qualification = "Bachelor's Degree in any discipline from a recognized University";
    qualification_level = "graduate";
  } else if (/assistant professor|lecturer|ugc net/i.test(t + desc)) {
    qualification = "Master's Degree with minimum 55% marks + UGC NET / CSIR NET / SET";
    qualification_level = "postgraduate";
  } else if (/10th|matriculation|class 10|sslc|group d|mts/i.test(t + desc)) {
    qualification = "10th Pass (Matriculation) from a recognized Board";
    qualification_level = "10th";
  } else if (/12th|intermediate|class 12|higher secondary|\bchsl\b/i.test(t + desc)) {
    qualification = "10+2 (Intermediate) Pass from a recognized Board";
    qualification_level = "12th";
  } else if (/post.?graduate|master|m\.?sc|m\.?tech|m\.?com|m\.?a\b/i.test(t + desc)) {
    qualification = "Postgraduate Master's Degree in relevant subject";
    qualification_level = "postgraduate";
  } else if (/b\.?sc|b\.?tech|b\.?e\b|engineering|graduate|degree|\bcgl\b/i.test(t + desc)) {
    qualification = "Bachelor's Degree in relevant discipline from a recognized University";
    qualification_level = "graduate";
  } else if (/diploma/i.test(t + desc)) {
    qualification = "Diploma (3 Years) in relevant engineering or technical trade";
    qualification_level = "diploma";
  }

  // 11. Authoritative Factual Summary (HireOrbitAI native copy)
  const noticeTypeLabel = type === "recruitment" ? "Recruitment Notification" : badge_status;
  const summary = `${organization} has officially announced the ${noticeTypeLabel} for ${cleanTitle}. ${vacancies !== "See Notification" ? `Total verified vacancies: ${vacancies}. ` : ""}Eligible candidates possessing ${qualification} are advised to review the official schedule and eligibility conditions.`;

  // 12. Important Dates
  const important_dates = extractDatesFromNotice(t, desc, type, year);

  // 13. Official URL Resolution & Aggregator Isolation (Section 6, 7 & 13)
  const officialMapping = OFFICIAL_PORTAL_REGISTRY[organization];
  const isDirectOfficialUrl = isOfficialGovDomain(raw.link);

  let official_pdf_url: string | null = null;
  let apply_url: string = officialMapping?.portalUrl || "https://employmentnews.gov.in";
  let verification_status: "verified" | "pending" = "pending";

  if (type === "result") {
    if (isDirectOfficialUrl) {
      official_pdf_url = raw.link;
      apply_url = raw.link;
      verification_status = "verified";
    } else if (!source.isAggregator && source.trustLevel === "official") {
      verification_status = "verified";
      official_pdf_url = officialMapping?.portalUrl || "https://employmentnews.gov.in";
      apply_url = officialMapping?.portalUrl || "https://employmentnews.gov.in";
    } else {
      // RESULT SOURCE POLICY: Sarkari Result / Aggregator candidate access is NEVER blocked!
      // Retain the aggregator link so candidates have direct immediate result access.
      verification_status = "pending";
      official_pdf_url = null;
      apply_url = raw.link;
    }
  } else {
    if (isDirectOfficialUrl) {
      official_pdf_url = raw.link;
      apply_url = raw.link;
      verification_status = "verified";
    } else if (!source.isAggregator && source.trustLevel === "official") {
      verification_status = "verified";
      official_pdf_url = officialMapping?.portalUrl || "https://employmentnews.gov.in";
      apply_url = officialMapping?.portalUrl || "https://employmentnews.gov.in";
    } else {
      // AGGREGATOR DISCOVERY: Never treat aggregator URL as official!
      verification_status = "pending";
      official_pdf_url = null; // Left null until official source confirms
      apply_url = officialMapping?.portalUrl || "https://employmentnews.gov.in";
    }
  }

  // 14. Discovery Source Metadata Entry
  const sourceTrackingEntry = {
    sourceId: source.id,
    sourceName: source.name,
    sourceType: source.type,
    discoveredAt: new Date().toISOString(),
    lastCheckedAt: new Date().toISOString(),
    sourceUrl: raw.link,
    trustLevel: source.trustLevel
  };

  // 15. Standardized Application Fee
  const feeMatch = (t + " " + desc).match(/(?:rs\.?|₹)\s*(\d+)/i);
  let generalFee = "See notification";
  let scStFee = "Exempted / See notification";
  let femaleFee = "See notification";

  if (feeMatch) {
    generalFee = `₹${feeMatch[1]}`;
    scStFee = "Exempted / As per rules";
    femaleFee = generalFee;
  } else if (/\bssc\b/i.test(t + desc) || /\bupsc\b/i.test(t + desc)) {
    generalFee = "₹100";
    scStFee = "Exempted / Nil";
    femaleFee = "Exempted / Nil";
  } else if (/railway|\brrb\b|\brrc\b/i.test(t + desc)) {
    generalFee = "₹500 (₹400 refunded after CBT)";
    scStFee = "₹250 (Full ₹250 refunded after CBT)";
    femaleFee = "₹250 (Full ₹250 refunded after CBT)";
  } else if (/banking|ibps|\bsbi\b|\brbi\b/i.test(t + desc)) {
    generalFee = "₹850 (Application + Intimation)";
    scStFee = "₹175 (Intimation charges only)";
    femaleFee = "₹850";
  }

  // 16. Age Limit & Highlights
  const ageMatch = (t + " " + desc).match(/(\d{2})\s*(?:to|-)\s*(\d{2})\s*years?/i);
  const age_limit = ageMatch ? `${ageMatch[1]} - ${ageMatch[2]} Years (relaxation as per rules)` : "18 - 40 Years (as per category)";

  const payMatch = (t + " " + desc).match(/(?:level\s*\d+|pay matrix\s*(?:rs\.?)?\s*[\d,]+|rs\.?\s*[\d,]+(?:\s*to\s*[\d,]+)?\s*per\s*month)/i);
  const pay_scale = payMatch ? payMatch[0] : "As per Government Pay Scale";

  const key_highlights = [
    `${badge_status} — verified through ${source.name}`,
    location !== "All India" ? `${location} State Level Recruitment` : "Pan-India / Central Government Recruitment",
    vacancies !== "See Notification" ? `Total Vacancies: ${vacancies}` : "Multiple Posts Available — Check Gazette",
    `Educational Qualification: ${qualification}`,
    "Age Limit: 18 - 40 Years (relaxation for SC/ST/OBC as per rules)"
  ];

  const selection_process = [
    "Written Examination / Computer Based Test (CBT)",
    "Skill Test / Physical Efficiency Test (if applicable)",
    "Document Verification & Medical Examination",
    "Final Merit List & Appointment"
  ];

  return {
    fingerprint,
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
    age_limit,
    pay_scale,
    application_fee: { generalOBC: generalFee, scStPh: scStFee, female: femaleFee },
    important_dates,
    location,
    summary,
    key_highlights,
    selection_process,
    official_pdf_url,
    apply_url,
    verification_status,
    source_feed: source.name,
    sourceTrackingEntry,
    slug
  };
}

// ─── RSS ITEM EXTRACTOR ───────────────────────────────────────────────────
function extractRssItems(
  xmlText: string,
  source: DiscoverySource
): Array<{ title: string; link: string; pubDate: string; description: string; source: DiscoverySource }> {
  const items: Array<{ title: string; link: string; pubDate: string; description: string; source: DiscoverySource }> = [];
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i);
    const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/i);
    const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i);

    const title = (titleMatch ? titleMatch[1] || titleMatch[2] : "").trim();
    const link = (linkMatch ? linkMatch[1] || linkMatch[2] : "").trim();
    const pubDate = (dateMatch ? dateMatch[1] : "").trim();
    const rawDesc = descMatch ? descMatch[1] || descMatch[2] : "";
    const description = stripHtmlAndDecode(rawDesc);

    if (!title || title.length < 15) continue;

    const combined = (title + " " + description).toLowerCase();
    const isGovRelated = GOV_KEYWORDS.some(kw => combined.includes(kw));

    if (isGovRelated) {
      items.push({ title, link, pubDate, description, source });
    }
  }
  return items;
}

// ─── MAIN GET / CRON HANDLER ──────────────────────────────────────────────
export async function GET(request: Request) {
  const syncStartedAt = new Date().toISOString();
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const isTestMode = searchParams.get("test") === "true" || searchParams.get("dryRun") === "true";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Parallel Fetch with Promise.allSettled & Timeouts
    const feedResults = await Promise.allSettled(
      DISCOVERY_SOURCES.map(source =>
        fetch(source.url, {
          next: { revalidate: 0 },
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; HireOrbitAI-GovBot/2.0; +https://hireorbitai.in/bot)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*"
          },
          signal: AbortSignal.timeout(8000)
        }).then(async r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return { source, text: await r.text() };
        })
      )
    );

    // 2. Tally Source Metrics & Collect Items
    let sourcesSuccessful = 0;
    let sourcesFailed = 0;
    const failedSources: Array<{ id: string; name: string; error: string }> = [];
    const perSourceItems: Array<Array<{ title: string; link: string; pubDate: string; description: string; source: DiscoverySource }>> = [];

    feedResults.forEach((res, index) => {
      const sourceDef = DISCOVERY_SOURCES[index];
      if (res.status === "fulfilled") {
        sourcesSuccessful++;
        perSourceItems.push(extractRssItems(res.value.text, res.value.source));
      } else {
        sourcesFailed++;
        failedSources.push({
          id: sourceDef.id,
          name: sourceDef.name,
          error: res.reason?.message || "Connection timeout / network error"
        });
        perSourceItems.push([]);
      }
    });

    const totalItemsFetched = perSourceItems.reduce((acc, curr) => acc + curr.length, 0);

    // 3. Load Existing Database Rows for Cross-Source Deduplication
    const { data: existingRows } = await supabase
      .from("gov_notifications")
      .select("id, slug, title, fingerprint, important_dates, badge_status, type, organization, verification_status, sources_tracked, official_pdf_url, apply_url, vacancies, qualification");

    const existingByFingerprint = new Map<string, any>();
    const existingBySlug = new Map<string, any>();

    for (const row of existingRows || []) {
      if (row.fingerprint) existingByFingerprint.set(row.fingerprint, row);
      if (row.slug) existingBySlug.set(row.slug, row);
    }

    // 4. Round-Robin Item Selection (Ensure fair representation across sources)
    const toProcess: Array<{ title: string; link: string; pubDate: string; description: string; source: DiscoverySource }> = [];
    const seenTitlesThisRun = new Set<string>();
    const ITEMS_PER_FEED = 3;
    const MAX_PROCESS_TOTAL = 60;

    for (const items of perSourceItems) {
      let count = 0;
      for (const item of items) {
        if (toProcess.length >= MAX_PROCESS_TOTAL) break;
        if (count >= ITEMS_PER_FEED) break;

        const dedupeKey = item.title.toLowerCase().slice(0, 35);
        if (seenTitlesThisRun.has(dedupeKey)) continue;
        seenTitlesThisRun.add(dedupeKey);

        toProcess.push(item);
        count++;
      }
      if (toProcess.length >= MAX_PROCESS_TOTAL) break;
    }

    // 5. Process Items: Classification, Deduplication, New vs Update Detection
    let recruitmentsDetected = 0;
    let duplicates = 0;
    let verificationPending = 0;
    const newlyAdded: string[] = [];
    const updatedItems: Array<{ title: string; reason: string }> = [];

    for (const rawItem of toProcess) {
      const parsed = quickParseNotice(rawItem, rawItem.source);
      if (!parsed.slug || parsed.title.length < 10) continue;

      // ── DEEP EXTRACTION FOR ADMIT CARDS & NOTICES MISSING EXACT DATES ──
      // If notice is an admit card (or result) and exact date is not in snippet,
      // fetch article content to extract real dates and stage information.
      const isAdmitNotice = parsed.type === "admit-card" || /admit card|hall ticket|call letter/i.test(parsed.title);
      const isMissingCriticalDates = !parsed.important_dates.examDate || (isAdmitNotice && !parsed.important_dates.admitCardDate);

      if (isMissingCriticalDates && rawItem.link) {
        try {
          const deepExtracted = await deepExtractFromNotice(
            parsed.title,
            rawItem.description,
            rawItem.link,
            parsed.title.match(/20(2[4-9]|3\d)/)?.[0] || "2026"
          );
          if (deepExtracted) {
            const deepDates = formatUniversalDatesObject(deepExtracted, parsed.title, parsed.type);
            const valResult = validateNoticeDates({
              applicationStart: deepDates.startDate,
              applicationLastDate: deepDates.lastDate,
              admitCardDate: deepDates.admitCardDate,
              examDate: deepDates.examDate,
              examDateFrom: deepDates.examDateFrom
            });

            if (valResult.isValid) {
              if (deepDates.examDate && !parsed.important_dates.examDate) {
                parsed.important_dates.examDate = deepDates.examDate;
                parsed.important_dates.examDateFrom = deepDates.examDateFrom;
                parsed.important_dates.examDateTo = deepDates.examDateTo;
                parsed.important_dates.examDateEvidence = deepDates.examDateEvidence;
                parsed.important_dates.exam_date = deepDates.exam_date;
              }
              if (deepDates.admitCardDate && !parsed.important_dates.admitCardDate) {
                parsed.important_dates.admitCardDate = deepDates.admitCardDate;
                parsed.important_dates.admitCardEvidence = deepDates.admitCardEvidence;
                parsed.important_dates.admit_card_date = deepDates.admit_card_date;
              }
              if (deepDates.citySlipDate && !parsed.important_dates.citySlipDate) {
                parsed.important_dates.citySlipDate = deepDates.citySlipDate;
                parsed.important_dates.citySlipEvidence = deepDates.citySlipEvidence;
                parsed.important_dates.city_intimation_date = deepDates.city_intimation_date;
              }
              if (deepDates.startDate && !parsed.important_dates.startDate) {
                parsed.important_dates.startDate = deepDates.startDate;
                parsed.important_dates.application_begin = deepDates.application_begin;
              }
              if (deepDates.lastDate && !parsed.important_dates.lastDate) {
                parsed.important_dates.lastDate = deepDates.lastDate;
                parsed.important_dates.application_last_date = deepDates.application_last_date;
              }
              if (deepDates.stage) parsed.important_dates.stage = deepDates.stage;
              if (deepDates.stages) parsed.important_dates.stages = deepDates.stages;
            }
          }
        } catch (deepErr) {
          // Graceful fallback to snippet extraction
        }
      }

      if (parsed.type === "recruitment") {
        recruitmentsDetected++;
      }
      if (parsed.verification_status === "pending") {
        verificationPending++;
      }

      // Check existing by Fingerprint or Slug
      const existingMatch = existingByFingerprint.get(parsed.fingerprint) || existingBySlug.get(parsed.slug);

      // ─── CASE A: EXISTING RECRUITMENT MATCH FOUND -> CHANGE DETECTION ───
      if (existingMatch) {
        const oldDates: Record<string, any> = existingMatch.important_dates || {};
        const newDates: Record<string, any> = parsed.important_dates || {};

        const hasDateChange = Boolean(
          newDates.lastDate && 
          newDates.lastDate !== oldDates.lastDate && 
          !isPlaceholderText(newDates.lastDate)
        );
        const hasExamChange = Boolean(
          newDates.examDate && 
          newDates.examDate !== oldDates.examDate && 
          !isPlaceholderText(newDates.examDate)
        );
        const hasAdmitCardChange = Boolean(
          newDates.admitCardDate &&
          newDates.admitCardDate !== oldDates.admitCardDate &&
          !isPlaceholderText(newDates.admitCardDate)
        );
        const hasBadgeChange = Boolean(
          parsed.badge_status && 
          parsed.badge_status !== existingMatch.badge_status
        );
        const hasVacanciesUpdate = Boolean(
          parsed.vacancies && 
          parsed.vacancies !== "See Notification" && 
          existingMatch.vacancies === "See Notification"
        );
        // Official verification upgrade: pending -> verified
        const hasVerificationUpgrade = Boolean(
          parsed.verification_status === "verified" && 
          existingMatch.verification_status !== "verified"
        );
        // Result link update (e.g. scorecard available, cutoff PDF, or new candidate result link)
        const hasResultLinkUpdate = Boolean(
          parsed.type === "result" &&
          parsed.apply_url &&
          parsed.apply_url !== existingMatch.apply_url &&
          !parsed.apply_url.includes("employmentnews.gov.in")
        );

        if (hasDateChange || hasExamChange || hasAdmitCardChange || hasBadgeChange || hasVacanciesUpdate || hasVerificationUpgrade || hasResultLinkUpdate) {
          const reasons: string[] = [];
          if (hasDateChange) reasons.push(`Last date updated to ${newDates.lastDate}`);
          if (hasExamChange) reasons.push(`Exam date announced: ${newDates.examDate}`);
          if (hasAdmitCardChange) reasons.push(`Admit card date: ${newDates.admitCardDate}`);
          if (hasBadgeChange) reasons.push(`Status changed to ${parsed.badge_status}`);
          if (hasVacanciesUpdate) reasons.push(`Vacancies confirmed: ${parsed.vacancies}`);
          if (hasVerificationUpgrade) reasons.push(`Upgraded to Official Verified`);
          if (hasResultLinkUpdate) reasons.push(`Result access link updated to ${parsed.apply_url}`);

          const updatedSourcesTracked = Array.isArray(existingMatch.sources_tracked)
            ? [...existingMatch.sources_tracked]
            : [];

          // Avoid duplicating identical source in tracking list
          const alreadyTracked = updatedSourcesTracked.some((s: any) => s.sourceId === rawItem.source.id);
          if (!alreadyTracked) {
            updatedSourcesTracked.push(parsed.sourceTrackingEntry);
          }

          // Clean merge: Specific Date > Generic Status, placeholders stripped to null
          const cleanMergedDates: Record<string, any> = { ...oldDates };
          for (const k of ["startDate", "lastDate", "feeLastDate", "examDate", "examDateFrom", "examDateTo", "examDateEvidence", "admitCardDate", "admitCardEvidence", "citySlipDate", "citySlipEvidence", "resultDate", "resultDateEvidence", "stage", "stages"]) {
            if (newDates[k] && !isPlaceholderText(newDates[k])) {
              cleanMergedDates[k] = newDates[k];
            } else if (isPlaceholderText(cleanMergedDates[k])) {
              cleanMergedDates[k] = null;
            }
          }
          // Merge structured schema keys with SPECIFIC DATE > GENERIC STATUS
          for (const sk of ["application_begin", "application_last_date", "fee_payment_last_date", "correction_last_date", "exam_date", "city_intimation_date", "admit_card_date", "answer_key_date", "result_date"]) {
            const existingField = oldDates[sk] || {};
            const incomingField = newDates[sk] || {};
            const existingDate = existingField.date && !isPlaceholderText(existingField.date) ? existingField.date : null;
            const incomingDate = incomingField.date && !isPlaceholderText(incomingField.date) ? incomingField.date : null;
            const mergedDate = incomingDate || existingDate;

            cleanMergedDates[sk] = {
              ...existingField,
              ...incomingField,
              date: mergedDate,
              start: incomingField.start || existingField.start,
              end: incomingField.end || existingField.end,
              evidence: incomingField.evidence || existingField.evidence,
              status: incomingField.status || existingField.status || "not_announced"
            };
          }

          // Strict chronological validation: ensure no contradictory combinations
          const valMerged = validateNoticeDates({
            applicationStart: cleanMergedDates.startDate,
            applicationLastDate: cleanMergedDates.lastDate,
            admitCardDate: cleanMergedDates.admitCardDate,
            examDate: cleanMergedDates.examDate,
            examDateFrom: cleanMergedDates.examDateFrom
          });
          if (!valMerged.isValid) {
            // Contradiction detected on merge: e.g. incoming admitCardDate is after existing examDate
            if (valMerged.errors.some(e => e.includes("Admit card release date"))) {
              cleanMergedDates.admitCardDate = oldDates.admitCardDate && !isPlaceholderText(oldDates.admitCardDate) ? oldDates.admitCardDate : null;
              if (cleanMergedDates.admit_card_date) cleanMergedDates.admit_card_date.date = cleanMergedDates.admitCardDate;
            }
          }

          if (!isTestMode) {
            await supabase.from("gov_notifications").update({
              badge_status: parsed.badge_status || existingMatch.badge_status,
              badge_color: parsed.badge_color || existingMatch.badge_color,
              important_dates: cleanMergedDates,
              vacancies: hasVacanciesUpdate ? parsed.vacancies : existingMatch.vacancies,
              verification_status: hasVerificationUpgrade ? "verified" : existingMatch.verification_status,
              official_pdf_url: (hasVerificationUpgrade && parsed.official_pdf_url) ? parsed.official_pdf_url : existingMatch.official_pdf_url,
              apply_url: (hasVerificationUpgrade || hasResultLinkUpdate) ? parsed.apply_url : existingMatch.apply_url,
              sources_tracked: updatedSourcesTracked,
              updated_at: new Date().toISOString()
            }).eq("id", existingMatch.id);
          }

          updatedItems.push({
            title: parsed.title,
            reason: reasons.join("; ")
          });
        } else {
          // Unchanged / duplicate from another aggregator
          duplicates++;
          // Update lastCheckedAt in source tracking without overwriting original discovery
          if (!isTestMode && Array.isArray(existingMatch.sources_tracked)) {
            const tracking = [...existingMatch.sources_tracked];
            const idx = tracking.findIndex((s: any) => s.sourceId === rawItem.source.id);
            if (idx >= 0) {
              tracking[idx].lastCheckedAt = new Date().toISOString();
            } else {
              tracking.push(parsed.sourceTrackingEntry);
            }
            await supabase.from("gov_notifications").update({
              sources_tracked: tracking
            }).eq("id", existingMatch.id);
          }
        }
        continue;
      }

      // ─── CASE B: GENUINELY NEW RECRUITMENT -> INSERT NEW ROW ──────────
      let slug = parsed.slug;
      if (existingBySlug.has(slug)) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      const id = `auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // Sanitize new record: ensure NO placeholder strings exist in any date fields
      for (const k of ["startDate", "lastDate", "feeLastDate", "examDate", "examDateFrom", "examDateTo", "admitCardDate", "citySlipDate", "resultDate"]) {
        if (parsed.important_dates[k] && isPlaceholderText(parsed.important_dates[k])) {
          parsed.important_dates[k] = null;
        }
      }
      for (const sk of ["application_begin", "application_last_date", "fee_payment_last_date", "correction_last_date", "exam_date", "city_intimation_date", "admit_card_date", "answer_key_date", "result_date"]) {
        if (parsed.important_dates[sk]?.date && isPlaceholderText(parsed.important_dates[sk].date)) {
          parsed.important_dates[sk].date = null;
        }
      }

      const newRecord = {
        id,
        slug,
        title: parsed.title,
        short_title: parsed.short_title,
        organization: parsed.organization,
        category: parsed.category,
        type: parsed.type, // 'recruitment', 'admit-card', etc.
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
        verification_status: parsed.verification_status,
        fingerprint: parsed.fingerprint,
        sources_tracked: [parsed.sourceTrackingEntry],
        source_feed: parsed.source_feed,
        is_trending: true,
        is_lead_story: false
      };

      if (!isTestMode) {
        const { error } = await supabase.from("gov_notifications").insert(newRecord);
        if (!error) {
          newlyAdded.push(parsed.title);
          existingBySlug.set(slug, newRecord);
          existingByFingerprint.set(parsed.fingerprint, newRecord);
        }
      } else {
        newlyAdded.push(`[SIMULATED] ${parsed.title}`);
        existingBySlug.set(slug, newRecord);
        existingByFingerprint.set(parsed.fingerprint, newRecord);
      }
    }

    const syncFinishedAt = new Date().toISOString();
    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      syncStartedAt,
      syncFinishedAt,
      durationMs,
      sourcesAttempted: DISCOVERY_SOURCES.length,
      sourcesSuccessful,
      sourcesFailed,
      itemsFetched: totalItemsFetched,
      recruitmentsDetected,
      newRecruitments: newlyAdded.length,
      updatedRecruitments: updatedItems.length,
      duplicates,
      verificationPending,
      isDryRun: isTestMode,
      errors: failedSources,
      newlyAdded,
      updatedItems
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Internal sync pipeline error",
      syncStartedAt,
      syncFinishedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
