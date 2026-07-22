import EcommerceImageShowcase from "@/Components/HomeComponents/EcommerceImageShowcase";
import HeroBannerSlider from "./HeroBannerSlider";
import HomeLabTestSection from "./HomeLabTestSection";
import HealthPackageExplorer from "./HealthPackageExplorer";
import LabProductSections from "./LabProductSections";
import TrustedLabPartners from "./TrustedLabPartners";
import LabSeoContentSection from "./LabSeoContentSection";

export default function LabPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <HeroBannerSlider />
      <EcommerceImageShowcase compact />
      <HomeLabTestSection />
      <HealthPackageExplorer />
      <LabProductSections />
      <TrustedLabPartners />
      <LabSeoContentSection />
    </div>
  );
}
