// ─── RESILIENT NATIVE PDF & TEXT EXTRACTOR ─────────────────────────────────

export interface ExtractedDocumentContent {
  success: boolean;
  text: string;
  isScanned: boolean;
  method: "native_text" | "html_text" | "vision_fallback_required";
  error?: string;
  pageCountGuess?: number;
}

// ─── EXTRACT PLAIN TEXT FROM PDF BUFFERS ──────────────────────────────────
export function extractTextFromPdfBuffer(buffer: Buffer): ExtractedDocumentContent {
  try {
    const rawString = buffer.toString("latin1");

    // Check if valid PDF signature
    if (!rawString.startsWith("%PDF-")) {
      // Check if it's HTML/text instead
      if (rawString.includes("<html") || rawString.includes("<!DOCTYPE")) {
        const text = stripHtmlTags(buffer.toString("utf8"));
        return {
          success: true,
          text: text.slice(0, 50000),
          isScanned: false,
          method: "html_text",
          pageCountGuess: 1
        };
      }
    }

    // Guess page count
    const pageMatches = rawString.match(/\/Type\s*\/Page\b/g);
    const pageCountGuess = pageMatches ? pageMatches.length : 1;

    // Fast regex stream extractor for PDF Text blocks (BT ... ET)
    const textPieces: string[] = [];
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/gi;
    let streamMatch;

    while ((streamMatch = streamRegex.exec(rawString)) !== null) {
      const streamContent = streamMatch[1];
      
      // Look for text bracket operators: (text) Tj or [(t)(e)(x)(t)] TJ
      const tjRegex = /\(([^)]+)\)\s*Tj/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(streamContent)) !== null) {
        textPieces.push(tjMatch[1]);
      }

      const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
      let arrayMatch;
      while ((arrayMatch = tjArrayRegex.exec(streamContent)) !== null) {
        const inner = arrayMatch[1];
        const innerTexts = inner.match(/\(([^)]+)\)/g);
        if (innerTexts) {
          const joined = innerTexts.map(s => s.slice(1, -1)).join("");
          textPieces.push(joined);
        }
      }
    }

    let combinedText = textPieces
      .join(" ")
      .replace(/\\([()\\])/g, "$1") // unescape PDF brackets
      .replace(/\\r|\\n/g, "\n")
      .replace(/\s{2,}/g, " ")
      .trim();

    // If native PDF stream text is too short, the document is likely scanned
    if (combinedText.length < 150) {
      return {
        success: true,
        text: combinedText,
        isScanned: true,
        method: "vision_fallback_required",
        pageCountGuess
      };
    }

    return {
      success: true,
      text: combinedText.slice(0, 60000), // Cap at 60k chars to fit LLM window safely
      isScanned: false,
      method: "native_text",
      pageCountGuess
    };
  } catch (err: any) {
    return {
      success: false,
      text: "",
      isScanned: false,
      method: "native_text",
      error: `PDF extraction error: ${err.message}`
    };
  }
}

// ─── STRIP HTML HELPER ────────────────────────────────────────────────────
function stripHtmlTags(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}
