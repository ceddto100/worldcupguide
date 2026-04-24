import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlanta Business Directory — World Cup 2026",
  description:
    "Find Atlanta restaurants, bars, lounges, food trucks, hotels, Airbnb hosts, and experiences during World Cup 2026.",
  keywords: ["Atlanta restaurants", "Atlanta bars", "Airbnb Atlanta", "black-owned Atlanta", "food trucks"]
};

export default function BusinessesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
