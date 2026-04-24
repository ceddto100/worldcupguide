import Link from "next/link";
import type { Business } from "@/lib/types";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <article className={`card flex h-full flex-col ${business.isFeatured ? "card-featured" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-gold">{business.type}</span>
        <span className="badge">{business.neighborhood}</span>
        {business.isFeatured && <span className="badge-red">Featured</span>}
        {business.isBlackOwned && <span className="badge">Black-owned</span>}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{business.name}</h3>
      <p className="mt-1 text-sm text-white/70">{business.description}</p>
      {business.specialOffer && (
        <p className="mt-3 rounded-lg border border-gold/30 bg-gold/10 p-3 text-xs text-gold">
          Offer: {business.specialOffer}
        </p>
      )}
      <div className="mt-auto pt-5">
        <Link href={business.ctaUrl ?? "/businesses"} className="btn-secondary w-full">
          View Business
        </Link>
      </div>
    </article>
  );
}
