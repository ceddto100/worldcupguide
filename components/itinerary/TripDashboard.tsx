"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Trip } from "@/lib/itinerary/types";
import {
  deleteTrip,
  duplicateTrip,
  listTrips
} from "@/lib/itinerary/storage";
import { completionPercent, formatDateShort } from "@/lib/itinerary/utils";
import { useAuth } from "./AuthContext";

export function TripDashboard() {
  const { user, ready, signInDemo, signInGoogleStub } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user) setTrips(listTrips(user.email));
  }, [user]);

  if (!ready) return null;

  if (!user) {
    return <SignInPanel onDemo={signInDemo} onGoogle={signInGoogleStub} />;
  }

  const refresh = () => setTrips(listTrips(user.email));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Your trips</h1>
          <p className="text-sm text-white/60">
            Welcome back, {user.name}.
          </p>
        </div>
        <div className="flex gap-2">
          {user.isAdmin && (
            <Link href="/itinerary/admin" className="btn-ghost">
              Admin
            </Link>
          )}
          <Link href="/itinerary/new" className="btn-primary">
            + New trip
          </Link>
        </div>
      </header>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/40 p-10 text-center">
          <p className="text-sm text-white/60">No trips yet.</p>
          <Link href="/itinerary/new" className="btn-primary mt-4 inline-flex">
            Plan your first trip
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={() => {
                if (confirm(`Delete "${trip.destination}"? This can't be undone.`)) {
                  deleteTrip(trip.id);
                  refresh();
                }
              }}
              onDuplicate={() => {
                const copy = duplicateTrip(trip.id);
                if (copy) router.push(`/itinerary/${copy.id}`);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TripCard({
  trip,
  onDelete,
  onDuplicate
}: {
  trip: Trip;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const pct = completionPercent(trip);
  const dateRange =
    trip.startDate && trip.endDate
      ? `${formatDateShort(trip.startDate)} – ${formatDateShort(trip.endDate)}`
      : "Dates TBD";

  return (
    <li className="group overflow-hidden rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md transition hover:border-white/30">
      <Link href={`/itinerary/${trip.id}`} className="block">
        <div
          className="relative h-32 w-full bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950"
          style={
            trip.coverPhoto
              ? { backgroundImage: `url(${trip.coverPhoto})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <div className="text-xs text-white/70">{dateRange}</div>
            <div className="truncate text-lg font-bold">{trip.destination || "Untitled trip"}</div>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-white/60">Completion</span>
            <span className="font-semibold text-gold">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-white/10 bg-black/30 px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-white/60">
          {trip.collaborators.length > 0 && <span className="badge">👥 {trip.collaborators.length}</span>}
          {trip.template && <span className="badge">{trip.template}</span>}
        </div>
        <div className="flex gap-1">
          <button onClick={onDuplicate} className="rounded-md px-2 py-1 hover:bg-white/10">
            Duplicate
          </button>
          <button onClick={onDelete} className="rounded-md px-2 py-1 text-red-accent hover:bg-red-accent/10">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

function SignInPanel({
  onDemo,
  onGoogle
}: {
  onDemo: (name?: string, email?: string) => void;
  onGoogle: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/15 bg-black/55 p-6 backdrop-blur-xl">
      <h1 className="text-xl font-bold">Sign in</h1>
      <p className="mt-1 text-sm text-white/70">
        Sign in to save itineraries to your account, share with collaborators, and email exports.
      </p>

      <button
        onClick={onGoogle}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-white/90"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#fbbc05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-white/50">
        <span className="h-px flex-1 bg-white/10" />
        or use a demo account
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-2">
        <input
          className="input-base"
          placeholder="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input-base"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={() => onDemo(name || undefined, email || undefined)}
          className="btn-secondary w-full"
        >
          Continue
        </button>
        <p className="text-[10px] text-white/40">
          Tip: sign in with email <code>admin@worldcupatlguide.com</code> to access the admin dashboard.
        </p>
      </div>
    </div>
  );
}
