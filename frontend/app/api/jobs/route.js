/**
 * API Proxy: /api/jobs
 * Forwards GET to the Express backend /api/jobs endpoint.
 * Supports ?skills=... and ?role=... params — passes both to backend SerpAPI route.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skills = searchParams.get("skills") || "";
    const role   = searchParams.get("role")   || "";

    const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5001";

    // Build query string — pass both skills and role to backend
    const params = new URLSearchParams();
    if (skills) params.set("skills", skills);
    if (role)   params.set("role",   role);

    if (!skills && !role) {
      return Response.json({ error: "No skills or role provided" }, { status: 400 });
    }

    console.log(`🌐 /api/jobs proxy → backend with role="${role}" skills="${skills.slice(0, 60)}..."`);

    const backendRes = await fetch(`${BACKEND}/api/jobs?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!backendRes.ok) {
      console.error("Backend jobs error:", backendRes.status);
      return Response.json({ error: "Backend returned error" }, { status: backendRes.status });
    }

    const data = await backendRes.json();

    // Backend now returns { data: [...], source: "google_jobs" | "local" }
    // If already wrapped, pass through; if legacy flat array, wrap it
    if (Array.isArray(data)) {
      return Response.json({ data, source: "local" });
    }
    return Response.json(data);

  } catch (error) {
    console.error("Jobs API Proxy Error:", error.message);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
