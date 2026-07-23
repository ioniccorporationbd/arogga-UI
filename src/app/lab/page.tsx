import LabHomeExperience from "@/features/lab/components/LabHomeExperience";
import { getLabRepository } from "@/features/lab/repository";

export default async function LabPage() {
  const repo = getLabRepository();
  const [tests, centers] = await Promise.all([
    repo.listTests({ limit: 220, sort: "popular" }),
    repo.listDiagnosticCenters(),
  ]);

  return <LabHomeExperience initialTests={tests.items} initialCenters={centers} />;
}
