import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL ?? "http://localhost:3001";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json(
      { error: "query param is required" },
      { status: 400 }
    );
  }

  const backendUrl = `${BACKEND_URL}/compare?query=${encodeURIComponent(q.trim())}`;

  const res = await fetch(backendUrl, {
    headers: { "Content-Type": "application/json" },
    // Don't cache — search results should always be fresh
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return NextResponse.json(
      { error: `Backend error: ${res.status}`, detail: body },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
