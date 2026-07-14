import type { Metadata } from "next";
import Footer from "../components/Footer";
import TopNavber from "../components/TopNavber";
import "./globals.css";
import CategoryNav from "@/Components/CategoryNav";

export const metadata: Metadata = {
  title: "Arogga Store",
  description: "The Primary Healthcare Platform for Bangladesh",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
     <body className="site-wrapper">
        <TopNavber />
        <CategoryNav/>
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
