import crypto from "crypto";

// ─── OFFICIAL GOVERNMENT DOMAIN VALIDATION ─────────────────────────────────
export function isOfficialGovDomain(urlStr: string): boolean {
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

// ─── OFFICIAL PORTALS REGISTRY ─────────────────────────────────────────────
export const OFFICIAL_AUTHORITY_PORTALS: Record<string, { authority: string; portalUrl: string; officialDomain: string }> = {
  "SSC": { authority: "Staff Selection Commission (SSC)", portalUrl: "https://ssc.gov.in", officialDomain: "ssc.gov.in" },
  "UPSC": { authority: "Union Public Service Commission (UPSC)", portalUrl: "https://upsc.gov.in", officialDomain: "upsc.gov.in" },
  "RRB": { authority: "Railway Recruitment Boards (RRB)", portalUrl: "https://rrbapply.gov.in", officialDomain: "rrbapply.gov.in" },
  "Indian Railways": { authority: "Indian Railways (RRB/RRC)", portalUrl: "https://indianrailways.gov.in", officialDomain: "indianrailways.gov.in" },
  "IBPS": { authority: "Institute of Banking Personnel Selection (IBPS)", portalUrl: "https://ibps.in", officialDomain: "ibps.in" },
  "SBI": { authority: "State Bank of India (SBI)", portalUrl: "https://sbi.co.in/careers", officialDomain: "sbi.co.in" },
  "RBI": { authority: "Reserve Bank of India (RBI)", portalUrl: "https://opportunities.rbi.org.in", officialDomain: "rbi.org.in" },
  "UPSSSC": { authority: "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)", portalUrl: "https://upsssc.gov.in", officialDomain: "upsssc.gov.in" },
  "UPPSC": { authority: "Uttar Pradesh Public Service Commission (UPPSC)", portalUrl: "https://uppsc.up.nic.in", officialDomain: "uppsc.up.nic.in" },
  "UP Police": { authority: "UP Police Recruitment & Promotion Board (UPPRPB)", portalUrl: "https://uppbpb.gov.in", officialDomain: "uppbpb.gov.in" },
  "BPSC": { authority: "Bihar Public Service Commission (BPSC)", portalUrl: "https://bpsc.bih.nic.in", officialDomain: "bpsc.bih.nic.in" },
  "BSSC": { authority: "Bihar Staff Selection Commission (BSSC)", portalUrl: "https://bssc.bihar.gov.in", officialDomain: "bssc.bihar.gov.in" },
  "RPSC": { authority: "Rajasthan Public Service Commission (RPSC)", portalUrl: "https://rpsc.rajasthan.gov.in", officialDomain: "rpsc.rajasthan.gov.in" },
  "RSMSSB": { authority: "Rajasthan Staff Selection Board (RSMSSB)", portalUrl: "https://rsmssb.rajasthan.gov.in", officialDomain: "rsmssb.rajasthan.gov.in" },
  "MPESB": { authority: "Madhya Pradesh Employees Selection Board (MPESB)", portalUrl: "https://esb.mp.gov.in", officialDomain: "esb.mp.gov.in" },
  "HSSC": { authority: "Haryana Staff Selection Commission (HSSC)", portalUrl: "https://hssc.gov.in", officialDomain: "hssc.gov.in" },
  "DSSSB": { authority: "Delhi Subordinate Services Selection Board (DSSSB)", portalUrl: "https://dsssb.delhi.gov.in", officialDomain: "dsssb.delhi.gov.in" },
  "MPSC": { authority: "Maharashtra Public Service Commission (MPSC)", portalUrl: "https://mpsc.gov.in", officialDomain: "mpsc.gov.in" },
  "GPSC": { authority: "Gujarat Public Service Commission (GPSC)", portalUrl: "https://gpsc.gujarat.gov.in", officialDomain: "gpsc.gujarat.gov.in" },
  "WBPSC": { authority: "West Bengal Public Service Commission (WBPSC)", portalUrl: "https://psc.wb.gov.in", officialDomain: "psc.wb.gov.in" },
  "KPSC": { authority: "Karnataka Public Service Commission (KPSC)", portalUrl: "https://kpsc.kar.nic.in", officialDomain: "kpsc.kar.nic.in" },
  "TNPSC": { authority: "Tamil Nadu Public Service Commission (TNPSC)", portalUrl: "https://tnpsc.gov.in", officialDomain: "tnpsc.gov.in" },
  "TSPSC": { authority: "Telangana State Public Service Commission (TSPSC)", portalUrl: "https://tspsc.gov.in", officialDomain: "tspsc.gov.in" },
  "JKSSB": { authority: "J&K Services Selection Board (JKSSB)", portalUrl: "https://jkssb.nic.in", officialDomain: "jkssb.nic.in" },
  "OPSC": { authority: "Odisha Public Service Commission (OPSC)", portalUrl: "https://opsc.gov.in", officialDomain: "opsc.gov.in" },
  "CTET": { authority: "Central Board of Secondary Education (CBSE)", portalUrl: "https://ctet.nic.in", officialDomain: "ctet.nic.in" },
  "UGC NET": { authority: "National Testing Agency (NTA)", portalUrl: "https://ugcnet.nta.ac.in", officialDomain: "ugcnet.nta.ac.in" },
  "NTA": { authority: "National Testing Agency (NTA)", portalUrl: "https://nta.ac.in", officialDomain: "nta.ac.in" },
  "AIIMS": { authority: "All India Institute of Medical Sciences (AIIMS)", portalUrl: "https://aiimsexams.ac.in", officialDomain: "aiimsexams.ac.in" },
  "ISRO": { authority: "Indian Space Research Organisation (ISRO)", portalUrl: "https://isro.gov.in", officialDomain: "isro.gov.in" },
  "DRDO": { authority: "Defence Research and Development Organisation (DRDO)", portalUrl: "https://drdo.gov.in", officialDomain: "drdo.gov.in" },
  "BARC": { authority: "Bhabha Atomic Research Centre (BARC)", portalUrl: "https://barc.gov.in", officialDomain: "barc.gov.in" }
};

// ─── RESOLVE OFFICIAL AUTHORITY DOMAIN ─────────────────────────────────────
export function resolveOfficialAuthority(organization: string, title?: string): { authority: string; portalUrl: string; officialDomain: string } | null {
  const combined = `${organization} ${title || ""}`.toLowerCase();
  for (const [key, mapping] of Object.entries(OFFICIAL_AUTHORITY_PORTALS)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(combined)) {
      return mapping;
    }
  }
  return null;
}

// ─── DOCUMENT HASH GENERATOR (SHA-256) ─────────────────────────────────────
export function computeDocumentHash(content: string | Buffer): string {
  const hash = crypto.createHash("sha256");
  if (typeof content === "string") {
    hash.update(content, "utf8");
  } else {
    hash.update(content);
  }
  return hash.digest("hex");
}

export interface DocumentResolutionResult {
  isOfficial: boolean;
  officialUrl: string | null;
  documentHash: string | null;
  contentType: string;
  buffer?: Buffer;
  textSnippet?: string;
  error?: string;
}

// ─── RESOLVE & FETCH OFFICIAL NOTIFICATION DOCUMENT ────────────────────────
export async function resolveAndFetchOfficialDocument(
  urlOrDomain: string,
  organization: string,
  title: string
): Promise<DocumentResolutionResult> {
  // 1. Is this already an official URL?
  let targetUrl = urlOrDomain;
  let isOfficial = isOfficialGovDomain(targetUrl);

  if (!isOfficial) {
    // If provided URL is an aggregator, resolve canonical official portal
    const resolved = resolveOfficialAuthority(organization, title);
    if (resolved) {
      targetUrl = resolved.portalUrl;
      isOfficial = true;
    } else {
      return {
        isOfficial: false,
        officialUrl: null,
        documentHash: null,
        contentType: "unknown",
        error: `Could not resolve verified government portal for authority: ${organization}`
      };
    }
  }

  // 2. Safely attempt document fetch with 8-second timeout
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HireOrbitAI-GovBot/2.0; +https://hireorbitai.in/bot)",
        "Accept": "application/pdf, text/html, application/xhtml+xml, */*"
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      return {
        isOfficial,
        officialUrl: targetUrl,
        documentHash: null,
        contentType: "unknown",
        error: `HTTP ${res.status}: Failed to retrieve official document at ${targetUrl}`
      };
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compute document hash for change detection & deduplication
    const documentHash = computeDocumentHash(buffer);

    // Quick text preview if HTML or text
    let textSnippet = "";
    if (contentType.includes("html") || contentType.includes("text")) {
      textSnippet = buffer.toString("utf8").slice(0, 1500);
    } else if (contentType.includes("pdf") || buffer.subarray(0, 5).toString() === "%PDF-") {
      textSnippet = "[BINARY PDF DOCUMENT]";
    }

    return {
      isOfficial,
      officialUrl: targetUrl,
      documentHash,
      contentType,
      buffer,
      textSnippet
    };
  } catch (err: any) {
    return {
      isOfficial,
      officialUrl: targetUrl,
      documentHash: null,
      contentType: "unknown",
      error: `Network/TLS error fetching ${targetUrl}: ${err.message}`
    };
  }
}
