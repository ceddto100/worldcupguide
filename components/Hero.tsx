import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 60% at 70% 10%, rgba(245,197,24,0.18) 0%, rgba(5,7,14,0) 60%), radial-gradient(50% 50% at 10% 90%, rgba(230,57,70,0.18) 0%, rgba(5,7,14,0) 60%)"
        }}
      />
      <div className="container-page relative py-16 sm:py-24">
        <div className="max-w-3xl">
          <span className="badge-gold">Atlanta · Summer 2026</span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Atlanta&apos;s Local Guide for{" "}
            <span className="text-gold">World Cup 2026</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-lg">
            Find matchday events, watch parties, food spots, nightlife, transportation tips, and local businesses during the biggest soccer event Atlanta has ever hosted.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/events" className="btn-primary">
              Explore the Guide
            </Link>
            <Link href="/submit" className="btn-secondary">
              Submit Your Business or Event
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="badge">Mercedes-Benz Stadium</span>
            <span className="badge">Fan Fest</span>
            <span className="badge">Watch Parties</span>
            <span className="badge">MARTA</span>
            <span className="badge">Neighborhood Guides</span>
          </div>
        </div>
      </div>
    </section>
  );
}
