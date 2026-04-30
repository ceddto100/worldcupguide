import type { Metadata } from "next";
import { AuthProvider } from "@/components/itinerary/AuthContext";

export const metadata: Metadata = {
  title: "Trip Planner — Build your itinerary step by step",
  description:
    "Build your trip as a visual workflow — pick matches, events, and stops, one node at a time."
};

export default function ItineraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="container-page py-8">{children}</div>
    </AuthProvider>
  );
}
