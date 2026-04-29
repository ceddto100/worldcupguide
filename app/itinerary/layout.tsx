import type { Metadata } from "next";
import { AuthProvider } from "@/components/itinerary/AuthContext";

export const metadata: Metadata = {
  title: "Trip Planner — Build your itinerary step by step",
  description:
    "Plan transportation, stays, daily events, budget, and packing — all in one mobile-first workflow."
};

export default function ItineraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="container-page py-8">{children}</div>
    </AuthProvider>
  );
}
