/**
 * API Proxy: /api/career-suggestions
 * Forwards POST request (with Authorization) to the Express backend.
 * Eliminates CORS — browser calls same-origin Next.js, server calls backend.
 */
export async function POST(req) {
  try {
    const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5001";

    const authHeader = req.headers.get("authorization");
    const body = await req.text(); // forward raw body

    const backendRes = await fetch(`${BACKEND}/api/career-suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: body || "{}",
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return Response.json({ error: data.error || "Backend error" }, { status: backendRes.status });
    }

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error("❌ career-suggestions proxy error:", err.message);
    // Return empty suggestions gracefully — non-critical feature
    return Response.json({ suggestions: [] }, { status: 200 });
  }
}
