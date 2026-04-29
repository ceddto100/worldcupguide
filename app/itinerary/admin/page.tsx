"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Trip } from "@/lib/itinerary/types";
import { listAllTrips } from "@/lib/itinerary/storage";
import { useAuth } from "@/components/itinerary/AuthContext";
import { completionPercent } from "@/lib/itinerary/utils";

export default function AdminPage() {
  const { user, ready } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (user?.isAdmin) setTrips(listAllTrips());
  }, [user]);

  if (!ready) return null;
  if (!user) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/50 p-6">
        <p className="text-sm text-white/70">Sign in first.</p>
        <Link href="/itinerary" className="btn-primary mt-3 inline-flex">Sign in</Link>
      </div>
    );
  }
  if (!user.isAdmin) {
    return (
      <div className="rounded-2xl border border-red-accent/40 bg-black/50 p-6">
        <h1 className="text-lg font-semibold">Admin only</h1>
        <p className="mt-1 text-sm text-white/70">
          Sign in with email <code>admin@worldcupatlguide.com</code> to access this page.
        </p>
      </div>
    );
  }

  const byUser = useMemo(() => {
    const m = new Map<string, { trips: number; events: number; collaborators: number }>();
    for (const t of trips) {
      const cur = m.get(t.ownerEmail) ?? { trips: 0, events: 0, collaborators: 0 };
      cur.trips += 1;
      cur.events += t.events.length;
      cur.collaborators += t.collaborators.length;
      m.set(t.ownerEmail, cur);
    }
    return Array.from(m.entries());
  }, [trips]);

  const totalEvents = trips.reduce((s, t) => s + t.events.length, 0);
  const exportLogs = readExportLogs();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Admin</h1>
        <Link href="/itinerary" className="btn-ghost">← User dashboard</Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Users" value={byUser.length} />
        <Stat label="Trips" value={trips.length} />
        <Stat label="Events" value={totalEvents} />
        <Stat label="Exports" value={exportLogs.length} />
      </div>

      <section className="rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/70">Users</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase text-white/50">
              <th className="py-2">Email</th>
              <th className="py-2">Trips</th>
              <th className="py-2">Events</th>
              <th className="py-2">Collabs</th>
            </tr>
          </thead>
          <tbody>
            {byUser.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-white/50">No users yet.</td></tr>
            )}
            {byUser.map(([email, s]) => (
              <tr key={email} className="border-b border-white/5">
                <td className="py-2">{email}</td>
                <td className="py-2">{s.trips}</td>
                <td className="py-2">{s.events}</td>
                <td className="py-2">{s.collaborators}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/70">All trips</h2>
        <ul className="mt-3 space-y-1.5">
          {trips.map((t) => (
            <li key={t.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <Link href={`/itinerary/${t.id}`} className="flex-1 truncate hover:underline">
                {t.destination}
              </Link>
              <span className="text-xs text-white/50">{t.ownerEmail}</span>
              <span className="badge">{completionPercent(t)}%</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/70">Recent export activity</h2>
        {exportLogs.length === 0 ? (
          <p className="mt-2 text-xs text-white/50">No exports yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-xs text-white/70">
            {exportLogs.slice(-20).reverse().map((l, i) => (
              <li key={i}>
                <span className="opacity-60">{new Date(l.at).toLocaleString()}</span> · {l.kind} · {l.user} · {l.tripDest}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/50 p-4 text-center backdrop-blur-md">
      <div className="text-2xl font-bold text-gold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/60">{label}</div>
    </div>
  );
}

type LogRow = { at: string; kind: string; user: string; tripDest: string };
function readExportLogs(): LogRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("wc_export_log_v1");
    return raw ? (JSON.parse(raw) as LogRow[]) : [];
  } catch {
    return [];
  }
}
