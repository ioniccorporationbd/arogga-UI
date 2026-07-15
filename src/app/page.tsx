import AllYouNeed from "@/Components/HomeComponents/AllYouNeed";
import BasicSiteBanner from "@/Components/HomeComponents/BasicSiteBanner";
import EspeciallyForYou from "@/Components/HomeComponents/EspeciallyForYou";
import StealTheDeal from "@/Components/HomeComponents/StealTheDeal";

export default function HomePage() {
  return (
    <>
      <BasicSiteBanner />
      <EspeciallyForYou />
      <AllYouNeed />
        <StealTheDeal/>
    </>
  );
}
