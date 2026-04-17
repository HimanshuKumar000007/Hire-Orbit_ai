/**
 * API Proxy: /api/latest-result
 * Forwards GET request to the Express backend /latest-result endpoint.
 * Eliminates CORS — browser calls same-origin Next.js, server calls backend.
 */
export async function GET(req) {
  try {
    const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5001";
    console.log("[latest-result proxy] BACKEND_URL:", BACKEND);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);

    let backendRes;
    try {
      backendRes = await fetch(`${BACKEND}/latest-result`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!backendRes.ok) {
      // 404 = no resume uploaded yet — not an error, just empty state
      const errData = await backendRes.json().catch(() => ({}));
      return Response.json({ error: errData.error || "No analysis result found" }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return Response.json(data, { status: 200 });
  } catch (err) {
    // Log the deep cause so we can see the real error (e.g. ECONNREFUSED)
    console.error("❌ latest-result proxy error:", err.message, "| cause:", err.cause?.message, err.cause?.code);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
