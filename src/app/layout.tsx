import type { Metadata } from "next";

import Footer from "@/Components/Footer";
import TopNavber from "@/Components/TopNavber";
import AboveFooterVideo from "@/Components/AboveFooterVideo";
import "./globals.css";
import SectionNavigation from "@/Components/SectionNavigation";
import AppProviders from "@/context/AppProviders";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.arogga.com"),
  title: {
    default: "Arogga Store | Healthcare, Beauty & Everyday Essentials",
    template: "%s | Arogga Store",
  },
  description: "A premium Bangladesh healthcare and ecommerce platform for medicine, beauty, wellness, lab tests, doctors and daily essentials.",
  openGraph: {
    title: "Arogga Store",
    description: "Healthcare, beauty, wellness and general ecommerce for Bangladesh.",
    url: "/",
    siteName: "Arogga Store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arogga Store",
    description: "Healthcare, beauty, wellness and daily essentials in one place.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="site-wrapper" suppressHydrationWarning>
        <AppProviders>
        <TopNavber />
        <SectionNavigation />
        <main className="site-main">{children}</main>
        <AboveFooterVideo /> 
        <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
