/**
 * API Proxy: /api/ai-interview-questions
 * Forwards POST request (with Authorization, role, and jobDescription) to the Express backend.
 * Eliminates CORS — browser calls same-origin Next.js, server calls backend.
 */
export async function POST(req) {
  try {
    const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5001";

    const authHeader = req.headers.get("authorization");
    const body = await req.text(); // forward raw body

    const backendRes = await fetch(`${BACKEND}/api/ai/interview-questions`, {
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
    console.error("❌ ai-interview-questions proxy error:", err.message);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
