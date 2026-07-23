export default function Loading() {
  return (
    <section className="route-state route-state--loading" aria-live="polite" aria-busy="true">
      <div className="route-state__spinner" />
      <span>Loading Arogga</span>
      <h1>Preparing your healthcare store...</h1>
      <p>Products, offers, cart and account modules are loading securely.</p>
    </section>
  );
}
