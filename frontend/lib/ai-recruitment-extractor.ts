// ─── AI-ASSISTED OFFICIAL RECRUITMENT NOTIFICATION EXTRACTOR ───────────────

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "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";

export interface RawAiExtractionResult {
  categoryDistribution?: {
    ur?: string | number;
    obc?: string | number;
    sc?: string | number;
    st?: string | number;
    ews?: string | number;
    total?: string | number;
    [key: string]: any;
  };
  postWiseDetails?: Array<{
    postName: string;
    department?: string;
    vacancies?: string | number;
    payScale?: string;
    eligibility?: string;
    classification?: string;
  }>;
  examPattern?: {
    tierName?: string;
    mode?: string;
    totalQuestions?: string | number;
    totalMarks?: string | number;
    duration?: string;
    negativeMarking?: string;
    subjects?: Array<{
      name: string;
      questions?: string | number;
      marks?: string | number;
    }>;
  };
  applicationInstructions?: string[];
  documentsRequired?: string[];
  evidence?: Array<{
    field: string;
    value: any;
    quote?: string;
  }>;
  error?: string;
}

const AI_EXTRACTION_SYSTEM_PROMPT = `You are a Government Gazette Data Extraction Engine.
Your task is to extract FACTUAL STRUCTURED RECRUITMENT METADATA from official government notifications.

CRITICAL RULES:
1. Return ONLY a valid, parseable JSON object.
2. DO NOT write an article, summary, introduction, or conversational text.
3. DO NOT fabricate or invent numbers. If a table or category is missing in the document, return null or an empty array.
4. Extract ONLY fields explicitly supported by the text.
5. In categoryDistribution, extract exact numeric vacancy counts for categories like UR, OBC, EWS, SC, ST, and Total.
6. In postWiseDetails, extract postName, department, vacancies, payScale, eligibility, and classification.
7. In examPattern, extract tierName, mode (CBT / OMR / Written), totalQuestions, totalMarks, duration, negativeMarking, and subjects.
8. In applicationInstructions, extract verified chronological application steps.
9. In documentsRequired, extract specific certificates and document upload specifications.
10. In evidence, provide the exact quote or context for key values.

TARGET JSON SCHEMA:
{
  "categoryDistribution": {
    "ur": "number or string",
    "obc": "number or string",
    "sc": "number or string",
    "st": "number or string",
    "ews": "number or string",
    "total": "number or string"
  },
  "postWiseDetails": [
    {
      "postName": "string",
      "department": "string",
      "vacancies": "string or number",
      "payScale": "string",
      "eligibility": "string",
      "classification": "string"
    }
  ],
  "examPattern": {
    "tierName": "string",
    "mode": "string",
    "totalQuestions": "number",
    "totalMarks": "number",
    "duration": "string",
    "negativeMarking": "string",
    "subjects": [
      {
        "name": "string",
        "questions": "number",
        "marks": "number"
      }
    ]
  },
  "applicationInstructions": ["string"],
  "documentsRequired": ["string"],
  "evidence": [
    {
      "field": "string",
      "value": "string or number",
      "quote": "string"
    }
  ]
}`;

// ─── EXECUTE STRUCTURED AI EXTRACTION ─────────────────────────────────────
export async function extractRecruitmentDataWithAi(
  documentText: string,
  context: { authority: string; title: string; year?: string }
): Promise<RawAiExtractionResult> {
  if (!documentText || documentText.trim().length < 50) {
    return {
      error: "Document text too short or empty for AI extraction"
    };
  }

  const promptUserMessage = `Official Document Text for Recruitment: "${context.title}" (${context.authority}, ${context.year || 2026}):
--------------------------------------------------
${documentText.slice(0, 35000)}
--------------------------------------------------
Extract the structured recruitment JSON strictly adhering to the schema. Output JSON only:`;

  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-11b-vision-instruct",
        messages: [
          { role: "system", content: AI_EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: promptUserMessage }
        ],
        temperature: 0.1, // Near-zero for deterministic extraction
        max_tokens: 4096
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        error: `NVIDIA NIM API Error ${res.status}: ${errText.slice(0, 200)}`
      };
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Parse and clean JSON from model response
    let cleanedJson = rawContent.trim();
    if (cleanedJson.startsWith("```json")) {
      cleanedJson = cleanedJson.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    } else if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Extract JSON object if model included prefix text
    const jsonStart = cleanedJson.indexOf("{");
    const jsonEnd = cleanedJson.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanedJson = cleanedJson.slice(jsonStart, jsonEnd + 1);
    }

    const parsed: RawAiExtractionResult = JSON.parse(cleanedJson);
    return parsed;
  } catch (err: any) {
    return {
      error: `AI extraction parse failure: ${err.message}`
    };
  }
}
