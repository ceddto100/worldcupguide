"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { WorkflowCanvas } from "@/components/itinerary/WorkflowCanvas";
import { getTrip } from "@/lib/itinerary/storage";
import type { Trip } from "@/lib/itinerary/types";

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

  useEffect(() => {
    setTrip(getTrip(id));
  }, [id]);

  if (trip === undefined) {
    return <div className="text-sm text-white/60">Loading…</div>;
  }
  if (trip === null) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center">
        <h1 className="text-lg font-semibold">Trip not found</h1>
        <p className="mt-1 text-sm text-white/60">
          It may have been deleted, or you're on a different device.
        </p>
        <Link href="/itinerary" className="btn-primary mt-4 inline-flex">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/itinerary" className="mb-3 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
        ← All trips
      </Link>
      <WorkflowCanvas initial={trip} />
    </div>
  );
}
