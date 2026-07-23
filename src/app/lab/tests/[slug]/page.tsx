import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, FlaskConical, ShieldCheck, Star } from "lucide-react";
import { getLabRepository } from "@/features/lab/repository";
import { LabNavigation, LabTestCard } from "@/features/lab/components/LabTestsExperience";

export default async function LabTestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repo = getLabRepository();
  const test = await repo.findTestBySlug(slug);
  if (!test) notFound();
  const centers = await repo.listDiagnosticCenters();
  const recommended = await repo.listTests({ organ: test.organ, limit: 3 });
  return <div className="lab-detail"><LabNavigation mode="lab" /><nav className="lab-breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/lab">Lab Test</Link><span>›</span><Link href="/lab/tests">Tests</Link><span>›</span><b>{test.shortName}</b></nav><section className="lab-detail-hero"><div className="lab-detail-image"><Image src={test.image || "/images/product-fallback.png"} alt={test.name} width={760} height={760} priority /></div><aside className="lab-detail-card"><header><span><Clock3 size={16} /> Report in {test.reportDeliveryHours} hours</span><span><Star size={16} fill="#f97316" color="#f97316" /> Booked {test.bookedCount} times</span></header><h1>{test.name}</h1><p>{test.description}</p><div className="lab-partner-icons">{centers.filter((center) => test.diagnosticCenterIds.includes(center.id)).slice(0, 10).map((center) => <Link href={`/lab/diagnostics/${center.slug}`} key={center.id} title={center.name}>{center.name.slice(0, 3).toUpperCase()}</Link>)}</div><div className="lab-detail-price"><strong>৳{test.salePrice}</strong><del>৳{test.regularPrice}</del><Link href="/lab/cart">Book Test</Link></div><dl><div><dt><FlaskConical /> Sample Type</dt><dd>{test.sampleType}</dd></div><div><dt>Fasting Required</dt><dd>{test.fastingRequired ? "Yes" : "No"}</dd></div><div><dt><ShieldCheck /> Home Collection</dt><dd>{test.homeCollection ? "Available" : "Center visit"}</dd></div></dl></aside></section><section className="lab-recommended"><h2>Recommended for You</h2><div>{recommended.items.filter((item) => item.id !== test.id).slice(0, 3).map((item) => <LabTestCard key={item.id} test={item} center={centers[0]} />)}</div></section><LabInfo title="Overview">{test.description}</LabInfo><LabInfo title="Risk assessment">{test.healthConcern}, {test.organ}, preventive screening and doctor-advised monitoring.</LabInfo><LabInfo title="Ranges"><pre>{test.ranges}</pre></LabInfo><LabInfo title="Test result interpretation">Reports should be interpreted by a qualified healthcare professional based on symptoms, history and other tests.</LabInfo><LabInfo title="Sample types">{test.sampleType} sample.</LabInfo><section className="lab-faq"><h2>Frequently Asked Question</h2>{test.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section></div>;
}

function LabInfo({ title, children }: { title: string; children: React.ReactNode }) { return <section className="lab-info"><h2>{title}</h2><div>{children}</div></section>; }
