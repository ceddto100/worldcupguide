import Link from "next/link";
import type { Neighborhood } from "@/lib/types";

export function NeighborhoodCard({ neighborhood }: { neighborhood: Neighborhood }) {
  return (
    <article className="card flex h-full flex-col">
      <h3 className="text-lg font-semibold">{neighborhood.name}</h3>
      <p className="mt-1 text-sm text-white/70">{neighborhood.shortDescription}</p>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wider text-white/40">Best for</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {neighborhood.bestFor.map((item) => (
            <span key={item} className="badge">{item}</span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wider text-white/40">Getting there</p>
        <p className="mt-1 text-sm text-white/80">{neighborhood.transitNotes}</p>
      </div>

      <div className="mt-auto pt-5">
        <Link href={`/neighborhoods#${neighborhood.slug}`} className="btn-secondary w-full">
          Explore Neighborhood
        </Link>
      </div>
    </article>
  );
}
