import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://worldcupatlguide.com"),
  title: {
    default: "World Cup ATL Guide — Atlanta's Local Guide for World Cup 2026",
    template: "%s · World Cup ATL Guide"
  },
  description:
    "An independent local guide to World Cup 2026 in Atlanta — matches, Fan Fest, watch parties, restaurants, bars, nightlife, neighborhoods, and transportation tips.",
  keywords: [
    "World Cup 2026",
    "Atlanta",
    "Mercedes-Benz Stadium",
    "Fan Fest",
    "watch parties",
    "Atlanta soccer",
    "MARTA",
    "neighborhood guide",
    "local businesses"
  ],
  openGraph: {
    type: "website",
    siteName: "World Cup ATL Guide",
    title: "Atlanta's Local Guide for World Cup 2026",
    description:
      "Matchday events, watch parties, food, nightlife, and transportation tips for Atlanta's biggest soccer summer."
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup ATL Guide",
    description: "Atlanta's Local Guide for World Cup 2026."
  }
};

export const viewport: Viewport = {
  themeColor: "#05070E",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-navy-950 text-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
