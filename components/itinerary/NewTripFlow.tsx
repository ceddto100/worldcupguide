"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTrip } from "@/lib/itinerary/storage";
import { useAuth } from "./AuthContext";

export function NewTripFlow() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const created = useRef(false);

  useEffect(() => {
    if (!ready || !user || created.current) return;
    created.current = true;
    const trip = createTrip({
      ownerEmail: user.email,
      destination: "",
      templateId: "blank"
    });
    router.replace(`/itinerary/${trip.id}`);
  }, [ready, user, router]);

  if (!ready) return null;
  if (!user) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center">
        <p className="text-sm text-white/70">Sign in first to create a trip.</p>
        <Link href="/itinerary" className="btn-primary mt-3 inline-flex">
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-white/60">
      Building your workflow…
    </div>
  );
}
