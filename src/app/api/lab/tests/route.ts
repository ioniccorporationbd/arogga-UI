import { NextResponse } from "next/server";
import { getLabRepository } from "@/features/lab/repository";
import type { LabQuery } from "@/features/lab/domain";

function num(value: string | null) { if (!value) return undefined; const n = Number(value); return Number.isFinite(n) ? n : undefined; }
function bool(value: string | null) { if (value === "true") return true; if (value === "false") return false; return undefined; }

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query: LabQuery = {
    q: params.get("q") || undefined,
    priceMin: num(params.get("priceMin")),
    priceMax: num(params.get("priceMax")),
    centerId: params.get("centerId") || undefined,
    organ: params.get("organ") || undefined,
    healthConcern: params.get("healthConcern") || undefined,
    packageGroup: params.get("packageGroup") || undefined,
    sampleType: params.get("sampleType") || undefined,
    fastingRequired: bool(params.get("fastingRequired")),
    homeCollection: bool(params.get("homeCollection")),
    available: bool(params.get("available")),
    sort: (params.get("sort") as LabQuery["sort"]) || undefined,
    page: num(params.get("page")),
    limit: num(params.get("limit")),
  };
  const repo = getLabRepository();
  const [result, facets] = await Promise.all([repo.listTests(query), repo.facets()]);
  return NextResponse.json({ ok: true, ...result, facets }, { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } });
}
