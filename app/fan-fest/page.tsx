import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "FIFA Fan Festival™ Atlanta — World Cup 2026",
  description:
    "Everything to know about the FIFA Fan Festival™ Atlanta at Centennial Olympic Park — viewing, concerts, food, family zones, and free admission details.",
  keywords: ["FIFA Fan Festival", "Centennial Olympic Park", "Atlanta soccer", "World Cup watch party", "free admission"]
};

export default function FanFestPage() {
  return (
    <>
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="FIFA Fan Festival™"
            title="FIFA Fan Festival™ Atlanta"
            description="The official FIFA Fan Festival™ takes over all 22 acres of Centennial Olympic Park from June 12 – July 15, 2026. Admission is free with advance registration — no match ticket required."
          />

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card">
              <h3 className="text-lg font-semibold">Location &amp; Dates</h3>
              <p className="mt-2 text-white/75">
                Centennial Olympic Park (full 22-acre footprint), Downtown Atlanta. The festival runs June 12 – July 15,
                2026, open on 16 selected days — not every day. Walking distance to Mercedes-Benz Stadium, the Georgia
                World Congress Center, and the SEC District and Peachtree Center MARTA stations.
              </p>
              <p className="mt-3 text-sm text-white/60">
                <strong className="text-white/80">June open dates:</strong> 12, 13, 14, 15, 17, 18, 19, 20, 21, 24, 26,
                27 &nbsp;·&nbsp; <strong className="text-white/80">July:</strong> match days through July 15
              </p>
              <p className="mt-2 text-sm text-white/60">
                Operated by FIFA, the Atlanta World Cup Host Committee, and the Georgia World Congress Center Authority
                (GWCCA) — the same park that hosted the 1996 Atlanta Summer Olympics, 30 years prior.
              </p>

              <h3 className="mt-6 text-lg font-semibold">Four zones inside the festival</h3>
              <ul className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <strong className="block text-white">Main Stage</strong>
                  40-ft screen, live concerts, and matchday broadcasts
                </li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <strong className="block text-white">The Playground</strong>
                  Kids &amp; youth activations, interactive soccer games
                </li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <strong className="block text-white">The Pitch</strong>
                  Community stage, podcasts, AR/VR soccer experiences
                </li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <strong className="block text-white">Georgia Street</strong>
                  Local artists, food vendors, and Atlanta culture
                </li>
              </ul>

              <h3 className="mt-6 text-lg font-semibold">Admission &amp; Registration</h3>
              <p className="mt-2 text-white/75">
                General Admission is <strong className="text-white">free</strong> but requires advance registration at{" "}
                <strong className="text-white">atlantafwc26.com</strong>. A digital QR pass is sent via email — valid ID
                required at entry. Entry is first-come, first-served and subject to capacity.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-gold" aria-hidden />
                  <span><strong className="text-white">Free GA</strong> — standard admission, register at atlantafwc26.com</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-gold" aria-hidden />
                  <span><strong className="text-white">GA+</strong> — upgraded experience with premium amenities</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-gold" aria-hidden />
                  <span><strong className="text-white">VIP</strong> — air-conditioned hospitality areas</span>
                </li>
              </ul>
            </div>

            <aside className="card-featured card">
              <h3 className="text-lg font-semibold">Plan your day</h3>
              <p className="mt-2 text-sm text-white/80">
                Most visitors pair a few hours at the Fan Festival with dinner and a watch party in a nearby neighborhood.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                <li>
                  <strong className="text-gold">1.</strong> Register free in advance at atlantafwc26.com — get your QR pass emailed.
                </li>
                <li>
                  <strong className="text-gold">2.</strong> Take MARTA to SEC District or Peachtree Center — both are a short walk.
                </li>
                <li>
                  <strong className="text-gold">3.</strong> Arrive early — capacity limits apply and lines grow before kickoffs.
                </li>
                <li>
                  <strong className="text-gold">4.</strong> After the match, explore Castleberry Hill or the BeltLine.
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/events" className="btn-primary">See nearby events</Link>
                <Link href="/businesses" className="btn-secondary">Find restaurants &amp; bars</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Bring people in"
        title="Running food, drinks, or music near Fan Fest?"
        description="Get listed on the guide and show up when visitors search for what's nearby."
        primaryHref="/submit"
        primaryLabel="Submit your business"
        secondaryHref="/business-services"
        secondaryLabel="See services"
      />
    </>
  );
}
