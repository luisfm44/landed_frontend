import { NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL ?? "http://localhost:3001";

export async function GET() {
  const res = await fetch(
    `${BACKEND_URL}/opportunities/top-deals?limit=50&minScore=0`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return NextResponse.json(
      { error: `Backend error: ${res.status}`, detail: body },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
