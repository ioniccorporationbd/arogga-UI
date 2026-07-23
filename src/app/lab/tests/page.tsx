import LabTestsExperience from "@/features/lab/components/LabTestsExperience";

export default function LabTestsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  void searchParams;
  return <LabTestsExperience initialQuery={{ limit: 20, sort: "popular" }} />;
}
