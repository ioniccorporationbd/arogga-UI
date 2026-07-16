import type { Metadata } from "next";
import CategoryNav from "@/Components/CategoryNav";
import Footer from "@/Components/Footer";
import TopNavber from "@/Components/TopNavber";
import AboveFooterVideo from "@/Components/AboveFooterVideo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arogga Store",
  description: "The primary healthcare platform for Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="site-wrapper">
        <TopNavber />
        <CategoryNav />
        <main className="site-main">{children}</main>
        <AboveFooterVideo/> 
        <Footer />
      </body>
    </html>
  );
}
