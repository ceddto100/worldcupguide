"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { WorkflowCanvas } from "@/components/itinerary/WorkflowCanvas";
import { getTripByShareSlug } from "@/lib/itinerary/storage";
import type { Trip } from "@/lib/itinerary/types";

export default function SharedTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

  useEffect(() => {
    setTrip(getTripByShareSlug(slug));
  }, [slug]);

  if (trip === undefined) return <div className="text-sm text-white/60">Loading…</div>;
  if (trip === null) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center">
        <h1 className="text-lg font-semibold">Link not found</h1>
        <p className="mt-1 text-sm text-white/60">This share link is invalid or has expired.</p>
        <Link href="/itinerary" className="btn-primary mt-4 inline-flex">
          Browse itineraries
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 rounded-xl border border-gold/30 bg-gold/5 p-3 text-xs text-gold">
        🔒 View-only — you're seeing a shared itinerary.
      </div>
      <WorkflowCanvas initial={trip} readOnly />
    </div>
  );
}
