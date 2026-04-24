import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlanta World Cup Events — Watch Parties, Food, Nightlife",
  description:
    "Browse matchday watch parties, food events, family zones, and nightlife happening around Atlanta during World Cup 2026.",
  keywords: ["Atlanta events", "watch parties", "Fan Fest", "World Cup 2026", "matchday"]
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
