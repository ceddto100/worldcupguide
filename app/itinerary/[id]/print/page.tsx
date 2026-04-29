"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getTrip } from "@/lib/itinerary/storage";
import type { Trip } from "@/lib/itinerary/types";
import {
  accommodationLabel,
  categoryLabel,
  formatDateLabel,
  sortedEventsForDay,
  totalSpent,
  transportLabel,
  tripDays
} from "@/lib/itinerary/utils";

export default function PrintViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

  useEffect(() => {
    setTrip(getTrip(id));
  }, [id]);

  const days = useMemo(() => (trip ? tripDays(trip) : []), [trip]);

  if (trip === undefined) return <div className="text-sm text-white/60">Loading…</div>;
  if (trip === null) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center">
        <h1 className="text-lg font-semibold">Trip not found</h1>
        <Link href="/itinerary" className="btn-primary mt-4 inline-flex">Back</Link>
      </div>
    );
  }

  return (
    <div className="print-page">
      <style>{`
        @media print {
          html, body { background: white !important; color: black !important; }
          .bg-image, .bg-overlay { display: none !important; }
          header, footer, nav, .no-print { display: none !important; }
          .print-page { background: white !important; color: black !important; }
          .print-card { border: 1px solid #ddd !important; background: white !important; color: black !important; box-shadow: none !important; }
          .print-h { color: black !important; text-shadow: none !important; }
          a { color: black !important; text-decoration: none !important; }
        }
      `}</style>

      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/itinerary/${trip.id}`} className="text-xs text-white/60 hover:text-white">
          ← Back to trip
        </Link>
        <button onClick={() => window.print()} className="btn-primary">
          Print
        </button>
      </div>

      <div className="print-card mx-auto max-w-3xl rounded-2xl border border-white/15 bg-black/40 p-6 print:bg-white">
        <h1 className="print-h text-3xl font-bold">{trip.destination}</h1>
        <p className="print-h text-sm text-white/70">
          {trip.startDate && trip.endDate
            ? `${formatDateLabel(trip.startDate)} → ${formatDateLabel(trip.endDate)}`
            : "Dates TBD"}{" "}
          {trip.travelers.length > 0 && `· Travelers: ${trip.travelers.join(", ")}`}
        </p>

        <Section title="Transportation">
          {trip.transport.length === 0 ? (
            <Empty />
          ) : (
            <ul className="space-y-2 text-sm">
              {trip.transport.map((l, i) => (
                <li key={l.id} className="border-l-2 border-gold pl-3">
                  <strong>Leg {i + 1}: {transportLabel(l.mode)}</strong>
                  <div className="text-white/70 print:text-black/70">
                    {[l.airline, l.flightNumber, l.rentalCompany, l.carrier, l.fromCity && `from ${l.fromCity}`, l.toCity && `to ${l.toCity}`, l.departDate, l.confirmation && `Conf #${l.confirmation}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Accommodations">
          {trip.stays.length === 0 ? (
            <Empty />
          ) : (
            <ul className="space-y-2 text-sm">
              {trip.stays.map((s) => (
                <li key={s.id} className="border-l-2 border-gold pl-3">
                  <strong>{s.name} <span className="font-normal opacity-70">({accommodationLabel(s.type)})</span></strong>
                  <div className="text-white/70 print:text-black/70">
                    {s.address}
                    {s.checkIn && ` · ${s.checkIn}${s.checkInTime ? " " + s.checkInTime : ""}`}
                    {s.checkOut && ` → ${s.checkOut}${s.checkOutTime ? " " + s.checkOutTime : ""}`}
                  </div>
                  {s.amenities.length > 0 && (
                    <div className="text-xs italic opacity-70">{s.amenities.join(", ")}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Day-by-day">
          {days.length === 0 ? (
            <Empty />
          ) : (
            days.map((d) => {
              const events = sortedEventsForDay(trip, d);
              if (events.length === 0) return null;
              return (
                <div key={d} className="mt-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide">{formatDateLabel(d)}</h3>
                  <ul className="mt-1 space-y-1.5 text-sm">
                    {events.map((e) => (
                      <li key={e.id} className="border-l-2 pl-3" style={{ borderColor: e.color }}>
                        <strong>
                          {e.startTime ? `${e.startTime}${e.endTime ? "–" + e.endTime : ""} · ` : ""}
                          {e.title}
                        </strong>
                        <span className="ml-2 text-xs opacity-70">[{categoryLabel(e.category)}]</span>
                        {e.location && <div className="text-xs opacity-70">📍 {e.location}</div>}
                        {e.notes && <div className="text-xs opacity-70">{e.notes}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </Section>

        <Section title="Budget">
          {trip.budget.items.length === 0 ? (
            <Empty />
          ) : (
            <>
              <div className="mb-1 text-sm">
                Spent: <strong>{trip.budget.currency} {totalSpent(trip).toFixed(2)}</strong>{" "}
                {trip.budget.cap > 0 && `/ ${trip.budget.cap.toFixed(2)}`}
              </div>
              <ul className="space-y-1 text-sm">
                {trip.budget.items.map((b) => (
                  <li key={b.id} className="flex justify-between">
                    <span>
                      <span className="opacity-70">[{b.category}]</span> {b.label}
                    </span>
                    <span>{trip.budget.currency} {b.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="print-h border-b border-white/20 pb-1 text-lg font-bold print:border-black/20">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Empty() {
  return <p className="text-sm italic opacity-60">— nothing yet —</p>;
}
