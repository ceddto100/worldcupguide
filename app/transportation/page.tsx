import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Getting Around Atlanta — Transportation Guide for World Cup 2026",
  description:
    "MARTA, rideshare, parking, airport arrivals, stadium access, and Fan Fest access tips for visitors during World Cup 2026 in Atlanta.",
  keywords: ["MARTA", "Atlanta airport", "Mercedes-Benz Stadium parking", "Fan Fest access", "rideshare Atlanta"]
};

const sections: { title: string; body: string; bullets?: string[] }[] = [
  {
    title: "MARTA",
    body: "MARTA is Atlanta's rail and bus system and the easiest way to reach downtown, Mercedes-Benz Stadium, and Fan Fest on matchdays. Buy a Breeze card at any station or use the MARTA mobile app.",
    bullets: [
      "GWCC/CNN Center, Peachtree Center, and Five Points stations serve downtown and Fan Fest",
      "Airport line (ATL Airport to downtown) runs every ~15 minutes",
      "Expect heavy ridership before and after matches — plan 30+ minutes of buffer"
    ]
  },
  {
    title: "Rideshare (Uber / Lyft)",
    body: "Rideshare is convenient but surges around kickoff and final whistle. Use designated pickup zones near the stadium and Fan Fest to avoid long waits.",
    bullets: [
      "Request a ride a few blocks away from the stadium exit for faster pickup",
      "Confirm license plate before entering any vehicle",
      "Late-night rideshare from Midtown/Buckhead is usually quick"
    ]
  },
  {
    title: "Walking around downtown",
    body: "Downtown Atlanta is walkable between Mercedes-Benz Stadium, Centennial Olympic Park, Castleberry Hill, and major hotels. Wear comfortable shoes and stay hydrated — summer heat is real.",
    bullets: [
      "Stadium to Centennial Olympic Park: ~10 minutes on foot",
      "Stadium to Castleberry Hill: ~10 minutes on foot",
      "Stay on well-lit streets after dark"
    ]
  },
  {
    title: "Parking",
    body: "Stadium-area parking books up fast and is expensive on matchdays. Use MARTA if you can. If you must drive, reserve in advance.",
    bullets: [
      "Pre-book lots through apps like SpotHero or ParkMobile",
      "Expect $40–$80+ for stadium-adjacent lots on match days",
      "Neighborhood lots (Castleberry Hill, Midtown) can be cheaper plus a short walk/MARTA ride"
    ]
  },
  {
    title: "Airport arrival tips",
    body: "Hartsfield-Jackson (ATL) is the busiest airport in the country. The fastest way from the airport to downtown is MARTA.",
    bullets: [
      "Follow signs for 'Ground Transportation' → MARTA",
      "Airport to Peachtree Center station: ~20 minutes",
      "Rideshare pickups are on the upper level during peak hours"
    ]
  },
  {
    title: "Stadium arrival tips",
    body: "Arrive 60–90 minutes before kickoff to clear security and enjoy the atmosphere. Bags are subject to restrictions — check the stadium's clear bag policy.",
    bullets: [
      "Clear bag policy applies",
      "Enter through the gate nearest your section",
      "Hydrate and plan for summer heat, especially afternoon kickoffs"
    ]
  },
  {
    title: "Fan Fest access",
    body: "Fan Fest at Centennial Olympic Park is open to the public and walkable from multiple MARTA stations. Entry details will update once officially published.",
    bullets: [
      "Walkable from Peachtree Center and GWCC/CNN Center stations",
      "Big crowds for evening matches — plan extra time",
      "Family zones typically open earlier in the day"
    ]
  },
  {
    title: "Safety and planning tips",
    body: "Atlanta is welcoming and friendly, but like any major city during a mega-event, use common sense.",
    bullets: [
      "Keep your phone charged — bring a small power bank",
      "Stay with your group in crowded areas",
      "Have a plan for meeting up if you get separated",
      "Carry some cash for food trucks and small vendors"
    ]
  }
];

export default function TransportationPage() {
  return (
    <>
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Getting Around"
            title="Transportation guide for Atlanta"
            description="Simple, practical tips to get to the stadium, Fan Fest, and around Atlanta without burning your day in traffic."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {sections.map((s) => (
              <article key={s.title} className="card">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/80">{s.body}</p>
                {s.bullets && (
                  <ul className="mt-3 space-y-1.5 text-sm text-white/75">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-gold" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Hosting guests? Share this guide with them."
        description="Airbnb hosts and hotels: drop a QR code at check-in and send visitors straight to the local guide."
        primaryHref="/business-services"
        primaryLabel="See QR & concierge packages"
      />
    </>
  );
}
