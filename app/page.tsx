import Link from "next/link";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { MatchCard } from "@/components/MatchCard";
import { EventCard } from "@/components/EventCard";
import { BusinessCard } from "@/components/BusinessCard";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";
import { CTASection } from "@/components/CTASection";
import { AIConciergePreview } from "@/components/AIConciergePreview";
import { matches } from "@/lib/data/matches";
import { events } from "@/lib/data/events";
import { businesses } from "@/lib/data/businesses";
import { neighborhoods } from "@/lib/data/neighborhoods";

export default function HomePage() {
  const upcomingMatches = matches.slice(0, 3);
  const featuredWatchParties = events.filter((e) => e.category === "Watch Party" || e.isFeatured).slice(0, 3);
  const featuredBusinesses = businesses.filter((b) => b.isFeatured).slice(0, 3);
  const featuredNeighborhoods = neighborhoods.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Upcoming Atlanta matches */}
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Matchdays"
            title="Upcoming Atlanta matches"
            description="Atlanta hosts multiple 2026 matches at Mercedes-Benz Stadium. Exact teams and times update as the draw finalizes."
            ctaHref="/matches"
            ctaLabel="See full schedule"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Fan Fest callout */}
      <section className="section-spacing">
        <div className="container-page">
          <div className="grid gap-6 overflow-hidden rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md sm:p-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="badge-red">Fan Fest</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Centennial Olympic Park <span className="text-gold">= the heart of Fan Fest</span>
              </h2>
              <p className="mt-3 text-white/75">
                Expect big-screen viewing, live music, food from international kitchens, family zones, and interactive
                soccer activations right in the middle of downtown.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/fan-fest" className="btn-primary">Explore Fan Fest</Link>
                <Link href="/events" className="btn-secondary">Matchday events near the park</Link>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm text-white/80">
              <li className="card">Big-screen viewing</li>
              <li className="card">International food</li>
              <li className="card">Live music</li>
              <li className="card">Family zones</li>
              <li className="card">Watch parties</li>
              <li className="card">Interactive games</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured watch parties */}
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Watch Parties"
            title="Featured watch parties"
            description="Curated matchday viewings across downtown, Midtown, the BeltLine, and East Atlanta."
            ctaHref="/events"
            ctaLabel="Browse all events"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWatchParties.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured local businesses */}
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Local Businesses"
            title="Featured local businesses"
            description="Restaurants, bars, and hosts going all-in on matchday."
            ctaHref="/businesses"
            ctaLabel="See the directory"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood guides */}
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Neighborhoods"
            title="Where to stay and explore"
            description="Each Atlanta neighborhood brings something different. Pick your vibe."
            ctaHref="/neighborhoods"
            ctaLabel="All neighborhoods"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredNeighborhoods.map((n) => (
              <NeighborhoodCard key={n.id} neighborhood={n} />
            ))}
          </div>
        </div>
      </section>

      {/* Transportation tips */}
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Getting Around"
            title="Transportation tips"
            description="Use MARTA for stadium days, rideshare for late nights, and walk the BeltLine when you can."
            ctaHref="/transportation"
            ctaLabel="Full transit guide"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card"><h3 className="font-semibold">MARTA</h3><p className="mt-1 text-sm text-white/70">Direct trains to downtown and Buckhead. The easiest option on matchdays.</p></div>
            <div className="card"><h3 className="font-semibold">Rideshare</h3><p className="mt-1 text-sm text-white/70">Plan surge around kickoff and final whistle. Use designated pickup zones.</p></div>
            <div className="card"><h3 className="font-semibold">Walking</h3><p className="mt-1 text-sm text-white/70">Downtown is walkable between stadium, Fan Fest, and Castleberry Hill.</p></div>
            <div className="card"><h3 className="font-semibold">Airport</h3><p className="mt-1 text-sm text-white/70">ATL Airport has a direct MARTA line to downtown in ~20 minutes.</p></div>
          </div>
        </div>
      </section>

      {/* Business callout */}
      <CTASection
        eyebrow="For Businesses"
        title="Own a restaurant, bar, lounge, or Airbnb? Capitalize on the biggest soccer summer Atlanta has seen."
        description="Featured listings, QR landing pages, AI chatbots, and lead capture — fast to set up, built for solo operators and independent businesses."
        primaryHref="/business-services"
        primaryLabel="See services"
        secondaryHref="/submit"
        secondaryLabel="Submit your business"
      />

      {/* AI Concierge teaser */}
      <AIConciergePreview />

      {/* Newsletter */}
      <section className="section-spacing">
        <div className="container-page">
          <div className="card flex flex-col gap-4 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Matchday tips in your inbox</h3>
              <p className="mt-1 text-sm text-white/70">
                One clean email a week during the tournament. Watch parties, food, transit updates.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2" action="#" method="post">
              <input
                type="email"
                placeholder="you@email.com"
                className="input-base"
                aria-label="Email address"
              />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
