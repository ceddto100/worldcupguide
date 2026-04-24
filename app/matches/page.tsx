import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchCard } from "@/components/MatchCard";
import { CTASection } from "@/components/CTASection";
import { matches } from "@/lib/data/matches";

export const metadata: Metadata = {
  title: "Atlanta Match Schedule — World Cup 2026",
  description:
    "Every World Cup 2026 match being played in Atlanta at Mercedes-Benz Stadium. Dates, stages, and matchday guides.",
  keywords: ["Atlanta World Cup matches", "Mercedes-Benz Stadium", "2026 schedule", "matchday guide"]
};

export default function MatchesPage() {
  return (
    <>
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Atlanta Schedule"
            title="World Cup 2026 matches in Atlanta"
            description="Atlanta is a confirmed host city at Mercedes-Benz Stadium. Teams and exact kickoff times are placeholders until the draw and official schedule are finalized."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
          <p className="mt-8 text-xs text-white/50">
            Schedule shown is editorial and subject to update. Always confirm on the official host city and tournament channels.
          </p>
        </div>
      </section>

      <CTASection
        title="Planning around a matchday?"
        description="Grab our guides for transportation, neighborhoods, and the best nearby watch parties."
        primaryHref="/transportation"
        primaryLabel="Transportation tips"
        secondaryHref="/events"
        secondaryLabel="Matchday events"
      />
    </>
  );
}
