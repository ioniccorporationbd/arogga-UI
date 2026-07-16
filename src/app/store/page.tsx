import HeroBannerSlider from "@/app/store/HeroBannerSlider";
import AllYourNeeds from "./AllYourNeeds";
import StoreProductSections from "./StoreProductSections";
import SunAndSplashSection from "./SunAndSplashSection";
import BabyCareHubSection from "./BabyCareHubSection";
import CraveCartSection from "./CraveCartSection";
import LifestyleProductSections from "./LifestyleProductSections";
import VetCareAndBrandsSection from "./VetCareAndBrandsSection";

export default function StorePage() {
  return (
    <>
      <HeroBannerSlider />
      <AllYourNeeds/>
      <StoreProductSections/>
      <SunAndSplashSection/>
      <BabyCareHubSection/>
      <CraveCartSection/>
      <LifestyleProductSections/>
      <VetCareAndBrandsSection/>
    </>
  );
}