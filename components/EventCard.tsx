import Link from "next/link";
import type { EventItem } from "@/lib/types";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className={`card flex h-full flex-col ${event.isFeatured ? "card-featured" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-gold">{event.category}</span>
        {event.isFeatured && <span className="badge-red">Featured</span>}
        {event.isFamilyFriendly && <span className="badge">Family-friendly</span>}
        {event.isFree && <span className="badge">Free</span>}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{event.title}</h3>
      <p className="mt-1 text-sm text-white/70">{event.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/60">
        <div>
          <dt className="uppercase tracking-wider text-white/40">Date</dt>
          <dd className="mt-0.5 text-white/85">{event.date}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-white/40">Time</dt>
          <dd className="mt-0.5 text-white/85">{event.time}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-white/40">Where</dt>
          <dd className="mt-0.5 text-white/85">{event.location}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-white/40">Price</dt>
          <dd className="mt-0.5 text-white/85">{event.priceLabel}</dd>
        </div>
      </dl>
      <div className="mt-auto pt-5">
        <Link href={event.ctaUrl ?? "/events"} className="btn-secondary w-full">
          View Event
        </Link>
      </div>
    </article>
  );
}
