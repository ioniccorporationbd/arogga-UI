import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Star } from "lucide-react";
import { getLabRepository } from "@/features/lab/repository";
import { LabNavigation, LabTestCard } from "@/features/lab/components/LabTestsExperience";

export default async function DiagnosticCenterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repo = getLabRepository();
  const center = await repo.findDiagnosticCenterBySlug(slug);
  if (!center) notFound();
  const tests = await repo.listTests({ centerId: center.id, limit: 12 });
  return <div className="lab-shell"><LabNavigation mode="lab" /><section className="diagnostic-hero"><div className="diagnostic-logo"><Image src={center.logo || "/images/product-fallback.png"} alt={center.name} width={120} height={120} /></div><div><span>Verified Diagnostic Partner</span><h1>{center.name}</h1><p><MapPin size={16} /> {center.address}</p><p><Star size={16} fill="#f97316" color="#f97316" /> {center.rating} rating · Report from {center.reportDeliveryHours} hours</p></div></section><section className="lab-results"><h2>Available tests from {center.name}</h2>{tests.items.map((test) => <LabTestCard key={test.id} test={test} center={center} />)}</section></div>;
}
