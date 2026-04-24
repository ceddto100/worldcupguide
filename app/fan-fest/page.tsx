import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Atlanta Fan Fest Guide — World Cup 2026",
  description:
    "Everything to know about Atlanta Fan Fest at Centennial Olympic Park — viewing, food, music, family zones, and what fans can expect.",
  keywords: ["Fan Fest", "Centennial Olympic Park", "Atlanta soccer", "watch party"]
};

export default function FanFestPage() {
  return (
    <>
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Fan Fest"
            title="Atlanta Fan Fest at Centennial Olympic Park"
            description="Downtown Atlanta's central gathering place during the tournament — big-screen viewing, food, music, and family zones, steps from the stadium."
          />

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card">
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="mt-2 text-white/75">
                Centennial Olympic Park, Downtown Atlanta. Walking distance to Mercedes-Benz Stadium, the Georgia World
                Congress Center, and the GWCC/CNN Center and Peachtree Center MARTA stations.
              </p>

              <h3 className="mt-6 text-lg font-semibold">What fans can expect</h3>
              <ul className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Big-screen matchday viewing</li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Live music stages</li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Food from international kitchens</li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Family-friendly activity zones</li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Interactive soccer games</li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Supporter and fan meetups</li>
              </ul>

              <h3 className="mt-6 text-lg font-semibold">Registration</h3>
              <p className="mt-2 text-white/75">
                Registration and entry details will be updated as official Fan Fest partners publish them. This guide is
                independent and will link out when confirmed.
              </p>
            </div>

            <aside className="card-featured card">
              <h3 className="text-lg font-semibold">Plan your day</h3>
              <p className="mt-2 text-sm text-white/80">
                Most visitors pair a few hours at Fan Fest with dinner and a watch party in a nearby neighborhood.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                <li>
                  <strong className="text-gold">1.</strong> Take MARTA to GWCC/CNN Center or Peachtree Center.
                </li>
                <li>
                  <strong className="text-gold">2.</strong> Spend the afternoon at Fan Fest — food, music, big screens.
                </li>
                <li>
                  <strong className="text-gold">3.</strong> Head to a restaurant or bar nearby for the evening match.
                </li>
                <li>
                  <strong className="text-gold">4.</strong> After full time, explore Castleberry Hill or the BeltLine.
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/events" className="btn-primary">See nearby events</Link>
                <Link href="/businesses" className="btn-secondary">Find restaurants & bars</Link>
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
