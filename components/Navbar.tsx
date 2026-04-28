"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/matches", label: "Matches" },
  { href: "/fan-fest", label: "Fan Fest" },
  { href: "/events", label: "Events" },
  { href: "/businesses", label: "Businesses" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/transportation", label: "Transportation" },
  { href: "/business-services", label: "For Businesses" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-7 w-7 rounded-md bg-gold" aria-hidden />
          <span className="text-sm font-bold tracking-tight sm:text-base">
            World Cup <span className="text-gold">ATL</span> Guide
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative rounded-full px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-gold/15 text-gold after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-gold after:content-['']"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/submit" className="btn-primary ml-2">
            Submit
          </Link>
        </nav>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black/80 backdrop-blur-lg lg:hidden">
          <div className="container-page flex flex-col py-3">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition",
                    active
                      ? "bg-gold/15 text-gold"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  ].join(" ")}
                >
                  {active && (
                    <span className="inline-block h-1.5 w-1.5 flex-none rounded-full bg-gold" aria-hidden />
                  )}
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/submit"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              Submit Your Business or Event
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
