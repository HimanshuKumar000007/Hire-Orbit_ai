import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resolveAndFetchOfficialDocument } from "@/lib/official-pdf-resolver";
import { extractTextFromPdfBuffer } from "@/lib/pdf-text-extractor";
import { extractRecruitmentDataWithAi } from "@/lib/ai-recruitment-extractor";
import { validateAndAuditAiExtraction } from "@/lib/logic-validation-engine";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buqkdtnffjoiwwtfxiek.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const targetSlug = searchParams.get("slug");
    const isDryRun = searchParams.get("test") === "true" || searchParams.get("dryRun") === "true";
    const limit = Math.min(Number(searchParams.get("limit")) || 3, 10);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch Target Records
    let query = supabase
      .from("gov_notifications")
      .select("id, slug, title, short_title, organization, category, type, vacancies, verification_status, official_pdf_url, apply_url, category_distribution, post_wise_details, exam_pattern, application_instructions, documents_required")
      .order("created_at", { ascending: false });

    if (targetSlug) {
      query = query.eq("slug", targetSlug);
    } else {
      query = query
        .or("verification_status.eq.pending,category_distribution.is.null,exam_pattern.is.null")
        .limit(limit);
    }

    const { data: records, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!records || records.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No recruitment records requiring AI enrichment at this time.",
        processedCount: 0,
        durationMs: Date.now() - startTime
      });
    }

    const enrichedResults: any[] = [];

    // 2. Process Records Sequentially
    for (const record of records) {
      const itemStartTime = Date.now();
      const enrichmentReport: any = {
        id: record.id,
        slug: record.slug,
        title: record.title,
        previousVerificationStatus: record.verification_status || "pending"
      };

      // Step A: Resolve and fetch official document
      const docTarget = record.official_pdf_url || record.apply_url || "";
      const docResult = await resolveAndFetchOfficialDocument(
        docTarget,
        record.organization || "",
        record.title || ""
      );

      enrichmentReport.officialResolution = {
        isOfficial: docResult.isOfficial,
        officialUrl: docResult.officialUrl,
        contentType: docResult.contentType,
        documentHash: docResult.documentHash,
        error: docResult.error
      };

      let extractedText = docResult.textSnippet || "";

      // Step B: Text Extraction from Buffer if present
      if (docResult.buffer) {
        const textExtractResult = extractTextFromPdfBuffer(docResult.buffer);
        if (textExtractResult.success && textExtractResult.text) {
          extractedText = textExtractResult.text;
        }
      }

      // If document text is not available from live fetch, construct rich contextual text from metadata
      if (!extractedText || extractedText.length < 50) {
        extractedText = `Official Notification: ${record.title}. Organization: ${record.organization}. Total Vacancies: ${record.vacancies || 'See Notification'}. Official Portal: ${docResult.officialUrl || record.apply_url}.`;
      }

      // Step C: AI Extraction with NVIDIA NIM
      const rawAiData = await extractRecruitmentDataWithAi(extractedText, {
        authority: record.organization || "Government Commission",
        title: record.title || "Government Recruitment Notification"
      });

      // Step D: Deterministic Logic Validation (The Gatekeeper)
      const validated = validateAndAuditAiExtraction(rawAiData, {
        vacancies: record.vacancies,
        verification_status: record.verification_status,
        category_distribution: record.category_distribution,
        post_wise_details: record.post_wise_details,
        exam_pattern: record.exam_pattern
      });

      enrichmentReport.fieldVerification = validated.fieldVerification;
      enrichmentReport.rejectionReasons = validated.fieldVerification.rejectionReasons;

      // Step E: Database Update (if not in test mode)
      if (!isDryRun) {
        const updatePayload: Record<string, any> = {
          verification_status: validated.fieldVerification.overallStatus,
          updated_at: new Date().toISOString()
        };

        if (validated.categoryDistribution) {
          updatePayload.category_distribution = validated.categoryDistribution;
        }
        if (validated.postWiseDetails && validated.postWiseDetails.length > 0) {
          updatePayload.post_wise_details = validated.postWiseDetails;
        }
        if (validated.examPattern) {
          updatePayload.exam_pattern = validated.examPattern;
        }
        if (validated.applicationInstructions && validated.applicationInstructions.length > 0) {
          updatePayload.application_instructions = validated.applicationInstructions;
        }
        if (validated.documentsRequired && validated.documentsRequired.length > 0) {
          updatePayload.documents_required = validated.documentsRequired;
        }
        if (docResult.isOfficial && docResult.officialUrl) {
          updatePayload.official_pdf_url = docResult.officialUrl;
        }

        const { error: updateErr } = await supabase
          .from("gov_notifications")
          .update(updatePayload)
          .eq("id", record.id);

        enrichmentReport.dbWriteSuccess = !updateErr;
        if (updateErr) {
          enrichmentReport.dbWriteError = updateErr.message;
        }
      } else {
        enrichmentReport.simulatedWrite = true;
      }

      enrichmentReport.durationMs = Date.now() - itemStartTime;
      enrichedResults.push(enrichmentReport);
    }

    return NextResponse.json({
      success: true,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      isDryRun,
      processedCount: enrichedResults.length,
      results: enrichedResults
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Internal enrichment pipeline failure"
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
