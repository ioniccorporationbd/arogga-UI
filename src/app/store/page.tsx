import HeroBannerSlider from "@/app/store/HeroBannerSlider";
import AllYourNeeds from "./AllYourNeeds";
import StoreProductSections from "./StoreProductSections";

export default function StorePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <HeroBannerSlider />
      <AllYourNeeds />
      <StoreProductSections />
    </div>
  );
}
