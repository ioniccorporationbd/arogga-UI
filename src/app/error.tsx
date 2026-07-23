"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Arogga page error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <section className="route-state route-state--error" role="alert">
      <span>Page error</span>
      <h1>This section needs a quick retry.</h1>
      <p>No cart, wishlist, or order data was changed. Please retry or return home.</p>
      <div className="route-state__actions">
        <button type="button" onClick={reset}>Try again</button>
        <Link href="/">Back to home</Link>
      </div>
    </section>
  );
}
