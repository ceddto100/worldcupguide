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
    body: "MARTA is Atlanta's rail and bus system and the easiest way to reach downtown, Mercedes-Benz Stadium, and the FIFA Fan Festival™ on matchdays. Tap to pay with any credit card, phone, or smartwatch via the new Better Breeze system — no Breeze card required.",
    bullets: [
      "Best stadium station: Vine City (Blue/Green Line) — covered pedestrian bridge walks directly to the stadium",
      "Also convenient: SEC District Station (formerly GWCC/CNN Center) — one stop before Vine City, at the stadium entrance",
      "Downtown and Fan Fest: SEC District, Five Points, Peachtree Center, and Garnett stations",
      "Airport → Five Points: ~20 minutes; transfer there for Vine City or SEC District",
      "Match days: trains run at 5-minute headways (confirmed by MARTA)",
      "30+ buses staged as rapid-response fleet at 5 strategic stations on match days",
      "MARTA Transit Ambassadors deployed 12 hours/day — white jerseys on match days, black on non-match days",
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
    body: "Stadium-area parking books up fast and is very expensive on matchdays. Use MARTA if you can. If you must drive, reserve in advance — official FIFA parking lots start at $99.99.",
    bullets: [
      "Pre-book lots through apps like SpotHero or ParkMobile, or via the official FIFA ticketing platform",
      "Official FIFA parking: $99.99 for the opening match (June 15) up to $249.99 for the Semifinal (July 15)",
      "Neighborhood lots (Castleberry Hill, Midtown) can be cheaper with a short walk or one MARTA stop"
    ]
  },
  {
    title: "Airport arrival tips",
    body: "Hartsfield-Jackson (ATL) is the busiest airport in the country. The fastest way from the airport to downtown is MARTA.",
    bullets: [
      "Follow signs for 'Ground Transportation' → MARTA",
      "Airport to Five Points or Peachtree Center: ~20 minutes",
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
    title: "FIFA Fan Festival™ access",
    body: "The FIFA Fan Festival™ Atlanta at Centennial Olympic Park is free with advance registration (atlantafwc26.com). It's walkable from multiple MARTA stations and open on 16 selected days between June 12 and July 15.",
    bullets: [
      "Closest MARTA stations: SEC District and Peachtree Center (both short walks)",
      "Big crowds before and during evening matches — arrive early, capacity limits apply",
      "All four festival zones open throughout the day; Main Stage concerts typically in the evening"
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
