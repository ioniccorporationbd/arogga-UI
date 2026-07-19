import EverydayKGlow from "./EverydayKGlow";
import GroceryEssentials from "./GroceryEssentials";
import KitchenAndHomeEssentials from "./KitchenAndHomeEssentials";
import PawsAndClaws from "./PawsAndClaws";
import ProtectYourHealth from "./ProtectYourHealth";
import ShopYourGlow from "./ShopYourGlow";
import TinyTots from "./TinyTots";

export default function CategoryDealSections() {
  return (
    <>
      <KitchenAndHomeEssentials />
      <PawsAndClaws />
      <ShopYourGlow />
      <ProtectYourHealth />
      <GroceryEssentials />
      <EverydayKGlow />
      <TinyTots />
    </>
  );
}
