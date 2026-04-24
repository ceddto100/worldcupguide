import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-md bg-gold" aria-hidden />
            <span className="text-sm font-bold">
              World Cup <span className="text-gold">ATL</span> Guide
            </span>
          </div>
          <p className="mt-3 text-sm text-white/60">
            Atlanta&apos;s independent local guide for soccer&apos;s biggest summer.
          </p>
          <p className="mt-3 text-xs text-white/40">Powered by CodeByCed</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Guide</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li><Link href="/matches" className="hover:text-white">Match Schedule</Link></li>
            <li><Link href="/fan-fest" className="hover:text-white">Fan Fest</Link></li>
            <li><Link href="/events" className="hover:text-white">Events</Link></li>
            <li><Link href="/neighborhoods" className="hover:text-white">Neighborhoods</Link></li>
            <li><Link href="/transportation" className="hover:text-white">Transportation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Business</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li><Link href="/businesses" className="hover:text-white">Business Directory</Link></li>
            <li><Link href="/business-services" className="hover:text-white">Services for Owners</Link></li>
            <li><Link href="/submit" className="hover:text-white">Submit Business or Event</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Stay in the loop</h4>
          <p className="mt-3 text-sm text-white/60">
            Matchday tips, watch parties, and local deals — straight to your inbox.
          </p>
          <form className="mt-4 flex gap-2" action="#" method="post">
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              className="input-base"
              aria-label="Email address"
            />
            <button type="submit" className="btn-primary">Join</button>
          </form>
          <p className="mt-2 text-xs text-white/40">Placeholder — not yet connected.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>
            This is an independent local guide and is not affiliated with FIFA, the FIFA World Cup, or official host organizations.
          </p>
          <p>&copy; {new Date().getFullYear()} CodeByCed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
