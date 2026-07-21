import type { Metadata } from "next";

import Footer from "@/Components/Footer";
import TopNavber from "@/Components/TopNavber";
import AboveFooterVideo from "@/Components/AboveFooterVideo";
import "./globals.css";
import SectionNavigation from "@/Components/SectionNavigation";
import AppProviders from "@/context/AppProviders";

export const metadata: Metadata = {
  title: "Arogga Store",
  description: "The primary healthcare platform for Bangladesh.",
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
