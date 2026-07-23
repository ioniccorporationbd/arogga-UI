import Link from "next/link";
import LabTestsExperience, { LabNavigation } from "@/features/lab/components/LabTestsExperience";
import { getLabRepository } from "@/features/lab/repository";

export default async function LabPage() {
  const repo = getLabRepository();
  const [tests, centers] = await Promise.all([repo.listTests({ limit: 8, sort: "popular" }), repo.listDiagnosticCenters()]);
  return <div className="lab-home"><LabNavigation mode="lab" /><section className="lab-hero"><div><span>Independent Lab Ecosystem</span><h1>Book trusted lab tests from home</h1><p>Premium local-first diagnostics with verified centers, transparent pricing, home sample collection and API-ready architecture.</p><div><Link href="/lab/tests">Browse Tests</Link><Link href="/lab/cart">Lab Cart</Link></div></div><div className="lab-hero-stat"><strong>{tests.meta.total}+</strong><span>Local lab tests</span><strong>{centers.length}</strong><span>Diagnostic partners</span></div></section><LabTestsExperience initialQuery={{ limit: 8, sort: "popular" }} /></div>;
}
