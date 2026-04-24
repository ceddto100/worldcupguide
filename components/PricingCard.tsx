import Link from "next/link";
import type { ServicePackage } from "@/lib/types";

export function PricingCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <article className={`card flex h-full flex-col ${pkg.isFeatured ? "card-featured" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        {pkg.isFeatured && <span className="badge-red">Popular</span>}
      </div>
      <p className="mt-1 text-sm text-white/70">{pkg.tagline}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gold">{pkg.priceLabel}</span>
        {pkg.priceNote && <span className="text-xs text-white/50">{pkg.priceNote}</span>}
      </div>
      <ul className="mt-5 space-y-2 text-sm text-white/80">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-gold" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Link href={pkg.ctaUrl} className="btn-primary w-full">
          {pkg.ctaLabel}
        </Link>
      </div>
    </article>
  );
}
