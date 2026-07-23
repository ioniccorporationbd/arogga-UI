import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { diagnosticCenterSchema, labTestSchema, queryLabTests, buildLabFacets, type DiagnosticCenter, type LabQuery, type LabTest } from "./domain";

export interface LabRepository {
  listTests(query?: LabQuery): Promise<ReturnType<typeof queryLabTests>>;
  findTestBySlug(slug: string): Promise<LabTest | null>;
  listDiagnosticCenters(): Promise<DiagnosticCenter[]>;
  findDiagnosticCenterBySlug(slug: string): Promise<DiagnosticCenter | null>;
  facets(): Promise<ReturnType<typeof buildLabFacets>>;
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(path.join(process.cwd(), "public", "data", file), "utf8")) as T;
}

export const getLabTests = cache(async () => labTestSchema.array().parse(await readJson<unknown>("lab-tests.json")));
export const getDiagnosticCenters = cache(async () => diagnosticCenterSchema.array().parse(await readJson<unknown>("diagnostic-centers.json")));

export class LocalLabRepository implements LabRepository {
  async listTests(query: LabQuery = {}) { return queryLabTests(await getLabTests(), query); }
  async findTestBySlug(slug: string) { return (await getLabTests()).find((test) => test.slug === slug || test.id === slug) || null; }
  async listDiagnosticCenters() { return getDiagnosticCenters(); }
  async findDiagnosticCenterBySlug(slug: string) { return (await getDiagnosticCenters()).find((center) => center.slug === slug || center.id === slug) || null; }
  async facets() { return buildLabFacets(await getLabTests(), await getDiagnosticCenters()); }
}

export class RemoteLabRepository implements LabRepository {
  async listTests(): Promise<ReturnType<typeof queryLabTests>> { throw new Error("Remote LabRepository is not configured. Set API_BASE_URL and implement provider adapter."); }
  async findTestBySlug(): Promise<LabTest | null> { throw new Error("Remote LabRepository is not configured."); }
  async listDiagnosticCenters(): Promise<DiagnosticCenter[]> { throw new Error("Remote LabRepository is not configured."); }
  async findDiagnosticCenterBySlug(): Promise<DiagnosticCenter | null> { throw new Error("Remote LabRepository is not configured."); }
  async facets(): Promise<ReturnType<typeof buildLabFacets>> { throw new Error("Remote LabRepository is not configured."); }
}

export function getLabRepository(): LabRepository {
  return process.env.DATA_SOURCE === "api" ? new RemoteLabRepository() : new LocalLabRepository();
}
