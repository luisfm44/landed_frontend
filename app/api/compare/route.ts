import { NextRequest, NextResponse } from "next/server";
import { MOCK_OPPORTUNITIES } from "@/lib/mock-opportunities";

const BACKEND_URL = process.env.API_URL ?? "http://localhost:3001";
const USE_MOCK_COMPARE = process.env.NEXT_PUBLIC_USE_MOCK_COMPARE === "true";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json(
      { error: "query param is required" },
      { status: 400 }
    );
  }

  if (USE_MOCK_COMPARE) {
    const term = q.trim().toLowerCase();
    const results = MOCK_OPPORTUNITIES.filter(
      (o) =>
        o.title.toLowerCase().includes(term) ||
        (o.marketplace ?? "").toLowerCase().includes(term),
    ).map((o) => ({
      marketplace: o.marketplace ?? "unknown",
      title: o.title,
      priceUsd: o.priceUsd,
      productUrl: o.externalUrl,
      decision: o.decision,
    }));

    return NextResponse.json({
      query: q.trim(),
      total: results.length,
      results,
      bestOption: results[0] ?? null,
    });
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
