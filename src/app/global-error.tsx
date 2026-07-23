"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Arogga route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="route-state route-state--error" role="alert">
          <span>Something went wrong</span>
          <h1>We could not load this Arogga page.</h1>
          <p>Please retry. If the issue continues, contact support with request ID: {error.digest || "local-dev"}.</p>
          <div className="route-state__actions">
            <button type="button" onClick={reset}>Try again</button>
            <Link href="/">Back to home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
