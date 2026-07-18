import AboveFooterVideo from "@/Components/AboveFooterVideo";
import AllYouNeed from "@/Components/HomeComponents/AllYouNeed";
import BasicSiteBanner from "@/Components/HomeComponents/BasicSiteBanner";
import BlueDealSections from "@/Components/HomeComponents/BlueDealSections";
import CategoryDealSections from "@/Components/HomeComponents/CategoryDealSections";
import EspeciallyForYou from "@/Components/HomeComponents/EspeciallyForYou";
import FragrancePerfume from "@/Components/HomeComponents/FragrancePerfume";
import MultiDealSections from "@/Components/HomeComponents/MultiDealSections";
import NewAndBestSelling from "@/Components/HomeComponents/NewAndBestSelling";
import SeoContentSection from "@/Components/HomeComponents/SeoContentSection";
import StealTheDeal from "@/Components/HomeComponents/StealTheDeal";
import SunAndSplash from "@/Components/HomeComponents/SunAndSplash";
import SupplementAndOTC from "@/Components/HomeComponents/SupplementAndOTC";
import SupplementFestival from "@/Components/HomeComponents/SupplementFestival";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <BasicSiteBanner />

      <EspeciallyForYou />

      <AllYouNeed />

      <StealTheDeal />

      <MultiDealSections />

      <BlueDealSections />

      <SupplementFestival />

      <SupplementAndOTC />

      <SunAndSplash />

      <CategoryDealSections />

      <FragrancePerfume />

      <NewAndBestSelling />

      <AboveFooterVideo />

      <SeoContentSection />
    </main>
  );
}