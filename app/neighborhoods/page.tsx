import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";
import { CTASection } from "@/components/CTASection";
import { neighborhoods } from "@/lib/data/neighborhoods";

export const metadata: Metadata = {
  title: "Atlanta Neighborhood Guides — World Cup 2026",
  description:
    "Where to stay, eat, and explore during World Cup 2026 — Downtown, Midtown, Old Fourth Ward, Buckhead, Decatur, Castleberry Hill, BeltLine and more.",
  keywords: ["Atlanta neighborhoods", "where to stay Atlanta", "BeltLine", "Buckhead", "Decatur"]
};

export default function NeighborhoodsPage() {
  return (
    <>
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Neighborhoods"
            title="Atlanta neighborhood guides"
            description="Each neighborhood offers a different Atlanta. Pick your pace, your food, and your crowd."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((n) => (
              <div id={n.slug} key={n.id}>
                <NeighborhoodCard neighborhood={n} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Local to a neighborhood? Put it on the guide."
        description="If you know the best block, the best plate, or the best pub — help visitors find it."
        primaryHref="/submit"
        primaryLabel="Submit a tip or business"
      />
    </>
  );
}
