import { NextResponse } from "next/server";
import { getLabRepository } from "@/features/lab/repository";

export async function GET() {
  const centers = await getLabRepository().listDiagnosticCenters();
  return NextResponse.json({ ok: true, items: centers }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" } });
}
