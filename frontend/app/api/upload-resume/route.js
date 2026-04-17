/**
 * API Proxy: /api/upload-resume
 * Forwards the multipart FormData from the browser to the Express backend.
 * This eliminates all CORS issues since the browser only talks to Next.js (port 3000).
 *
 * Fixes applied:
 *  1. duplex: 'half'  — required in Node 18+ when the fetch body is a ReadableStream/FormData
 *  2. AbortController — prevents hanging forever during slow AI analysis (120 s timeout)
 *  3. Better error surfacing — logs & returns the real backend error message
 */

export const maxDuration = 120; // Vercel / Next.js route handler max seconds

export async function POST(req) {
  const BACKEND =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://127.0.0.1:5001";

  // ── Auth check ──────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return Response.json({ error: "Unauthorized: missing token" }, { status: 401 });
  }

  // ── AbortController: kill the request after 120 s ──────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120_000);

  try {
    // ── Parse incoming multipart body ─────────────────────────────────────────
    let formData;
    try {
      formData = await req.formData();
    } catch (parseErr) {
      console.error("❌ Failed to parse multipart body:", parseErr.message);
      return Response.json(
        { error: "Could not read uploaded file. Is it a valid PDF?" },
        { status: 400 }
      );
    }

    // ── Forward to Express backend ─────────────────────────────────────────────
    // NOTE: `duplex: 'half'` is mandatory in Node 18+ when the body is a stream/FormData.
    // Without it Node throws "TypeError: fetch failed" before even hitting the network.
    const backendRes = await fetch(`${BACKEND}/upload-resume`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        // Do NOT set Content-Type manually — fetch sets it with the correct multipart boundary
      },
      body: formData,
      // @ts-ignore — duplex is a valid undici/Node 18 fetch option
      duplex: "half",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // ── Handle backend error responses ──────────────────────────────────────────
    let data;
    try {
      data = await backendRes.json();
    } catch {
      // Backend returned non-JSON (e.g. HTML error page)
      const text = await backendRes.text().catch(() => "");
      console.error("❌ Backend returned non-JSON:", text.slice(0, 300));
      return Response.json(
        { error: `Backend error (status ${backendRes.status})` },
        { status: backendRes.status || 500 }
      );
    }

    if (!backendRes.ok) {
      console.error("❌ Backend responded with error:", data);
      return Response.json(
        { error: data.error || "Upload failed on backend" },
        { status: backendRes.status }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      console.error("❌ Upload proxy timed out after 120 s");
      return Response.json(
        { error: "Request timed out — the AI analysis is taking too long. Please try again." },
        { status: 504 }
      );
    }

    // "fetch failed" usually means the backend is not reachable at all
    console.error("❌ Upload proxy error:", err.message);
    return Response.json(
      {
        error:
          err.message === "fetch failed"
            ? "Cannot reach the backend server. Make sure it is running on port 5001."
            : err.message || "Internal proxy error",
      },
      { status: 500 }
    );
  }
}
