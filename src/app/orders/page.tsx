import { Suspense } from "react";
import MyOrdersPage from "./MyOrdersPage";

export default function Page() {
  return (
    <Suspense fallback={<main className="orders-page"><section>Loading orders...</section></main>}>
      <MyOrdersPage />
    </Suspense>
  );
}
