"use client";

import { useState } from "react";
import type { TransportLeg, TransportMode, Trip } from "@/lib/itinerary/types";
import { transportIcon, transportLabel, uid } from "@/lib/itinerary/utils";
import { BottomSheet } from "../BottomSheet";

const MODES: TransportMode[] = ["flight", "rental", "personal", "train", "bus", "rideshare"];

export function TransportationSection({
  trip,
  onChange
}: {
  trip: Trip;
  onChange: (next: Trip) => void;
}) {
  const [editing, setEditing] = useState<TransportLeg | null>(null);

  const startNew = () => {
    setEditing({ id: uid("leg-"), mode: "flight" });
  };

  const save = (leg: TransportLeg) => {
    const exists = trip.transport.some((l) => l.id === leg.id);
    const next = exists
      ? trip.transport.map((l) => (l.id === leg.id ? leg : l))
      : [...trip.transport, leg];
    onChange({ ...trip, transport: next });
    setEditing(null);
  };

  const remove = (id: string) => {
    onChange({ ...trip, transport: trip.transport.filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/70">
        How are you getting there? Add each leg of the journey — fly to the city, then rent a car, etc.
      </p>

      {trip.transport.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-white/60">
          No transportation legs yet.
        </div>
      )}

      <ul className="space-y-2">
        {trip.transport.map((leg, i) => (
          <li
            key={leg.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <span className="text-xl" aria-hidden>{transportIcon(leg.mode)}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="badge-gold">Leg {i + 1}</span>
                <span>{transportLabel(leg.mode)}</span>
              </div>
              <div className="mt-1 truncate text-xs text-white/60">
                {summarize(leg)}
              </div>
            </div>
            <div className="flex flex-none gap-1">
              <button
                onClick={() => setEditing(leg)}
                className="rounded-md px-2 py-1 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => remove(leg.id)}
                className="rounded-md px-2 py-1 text-xs font-medium text-red-accent hover:bg-red-accent/10"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={startNew} className="btn-secondary w-full">
        + Add transportation leg
      </button>

      <BottomSheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit leg — ${transportLabel(editing.mode)}` : ""}
      >
        {editing && (
          <LegForm
            leg={editing}
            onCancel={() => setEditing(null)}
            onSave={save}
            onModeChange={(m) => setEditing({ ...editing, mode: m })}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function summarize(l: TransportLeg) {
  const bits: string[] = [];
  if (l.mode === "flight") {
    if (l.airline || l.flightNumber)
      bits.push([l.airline, l.flightNumber].filter(Boolean).join(" "));
    if (l.terminal) bits.push(`Term. ${l.terminal}`);
  }
  if (l.mode === "rental") {
    if (l.rentalCompany) bits.push(l.rentalCompany);
    if (l.carClass) bits.push(l.carClass);
    if (l.pickupLocation) bits.push(`Pickup: ${l.pickupLocation}`);
  }
  if (l.mode === "personal") {
    if (l.departureAddress) bits.push(`From ${l.departureAddress}`);
    if (l.estimatedDriveTime) bits.push(`~${l.estimatedDriveTime}`);
  }
  if (l.mode === "train" || l.mode === "bus") {
    if (l.carrier) bits.push(l.carrier);
    if (l.routeOrLine) bits.push(l.routeOrLine);
  }
  if (l.mode === "rideshare" && l.rideshareService) bits.push(l.rideshareService);
  if (l.fromCity || l.toCity) bits.push(`${l.fromCity ?? "?"} → ${l.toCity ?? "?"}`);
  if (l.departDate) bits.push(l.departDate + (l.departTime ? ` ${l.departTime}` : ""));
  return bits.join(" • ") || "Tap edit to add details";
}

function LegForm({
  leg,
  onCancel,
  onSave,
  onModeChange
}: {
  leg: TransportLeg;
  onCancel: () => void;
  onSave: (l: TransportLeg) => void;
  onModeChange: (m: TransportMode) => void;
}) {
  const [draft, setDraft] = useState<TransportLeg>(leg);

  // Sync mode if parent forced one through onModeChange
  if (draft.mode !== leg.mode) {
    setDraft({ ...draft, mode: leg.mode });
  }

  const set = <K extends keyof TransportLeg>(k: K, v: TransportLeg[K]) =>
    setDraft({ ...draft, [k]: v });

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => {
            const active = draft.mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={[
                  "rounded-xl border px-2 py-3 text-xs font-semibold transition",
                  active
                    ? "border-gold/60 bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                ].join(" ")}
              >
                <span className="block text-base">{transportIcon(m)}</span>
                {transportLabel(m)}
              </button>
            );
          })}
        </div>
      </div>

      <ModeFields leg={draft} set={set} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="From city">
          <input
            className="input-base"
            value={draft.fromCity ?? ""}
            onChange={(e) => set("fromCity", e.target.value)}
          />
        </Field>
        <Field label="To city">
          <input
            className="input-base"
            value={draft.toCity ?? ""}
            onChange={(e) => set("toCity", e.target.value)}
          />
        </Field>
        <Field label="Depart date">
          <input
            type="date"
            className="input-base"
            value={draft.departDate ?? ""}
            onChange={(e) => set("departDate", e.target.value)}
          />
        </Field>
        <Field label="Depart time">
          <input
            type="time"
            className="input-base"
            value={draft.departTime ?? ""}
            onChange={(e) => set("departTime", e.target.value)}
          />
        </Field>
        <Field label="Arrive date">
          <input
            type="date"
            className="input-base"
            value={draft.arriveDate ?? ""}
            onChange={(e) => set("arriveDate", e.target.value)}
          />
        </Field>
        <Field label="Arrive time">
          <input
            type="time"
            className="input-base"
            value={draft.arriveTime ?? ""}
            onChange={(e) => set("arriveTime", e.target.value)}
          />
        </Field>
        <Field label="Confirmation #" full>
          <input
            className="input-base"
            value={draft.confirmation ?? ""}
            onChange={(e) => set("confirmation", e.target.value)}
          />
        </Field>
        <Field label="Notes" full>
          <textarea
            rows={2}
            className="input-base"
            value={draft.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button onClick={() => onSave(draft)} className="btn-primary">
          Save leg
        </button>
      </div>
    </div>
  );
}

function ModeFields({
  leg,
  set
}: {
  leg: TransportLeg;
  set: <K extends keyof TransportLeg>(k: K, v: TransportLeg[K]) => void;
}) {
  if (leg.mode === "flight") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label="Airline">
          <input className="input-base" value={leg.airline ?? ""} onChange={(e) => set("airline", e.target.value)} />
        </Field>
        <Field label="Flight #">
          <input className="input-base" value={leg.flightNumber ?? ""} onChange={(e) => set("flightNumber", e.target.value)} />
        </Field>
        <Field label="Terminal" full>
          <input className="input-base" value={leg.terminal ?? ""} onChange={(e) => set("terminal", e.target.value)} />
        </Field>
      </div>
    );
  }
  if (leg.mode === "rental") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label="Rental company">
          <input className="input-base" value={leg.rentalCompany ?? ""} onChange={(e) => set("rentalCompany", e.target.value)} />
        </Field>
        <Field label="Car class">
          <input className="input-base" value={leg.carClass ?? ""} onChange={(e) => set("carClass", e.target.value)} />
        </Field>
        <Field label="Pickup location" full>
          <input className="input-base" value={leg.pickupLocation ?? ""} onChange={(e) => set("pickupLocation", e.target.value)} />
        </Field>
        <Field label="Dropoff location" full>
          <input className="input-base" value={leg.dropoffLocation ?? ""} onChange={(e) => set("dropoffLocation", e.target.value)} />
        </Field>
      </div>
    );
  }
  if (leg.mode === "personal") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label="Departure address" full>
          <input className="input-base" value={leg.departureAddress ?? ""} onChange={(e) => set("departureAddress", e.target.value)} />
        </Field>
        <Field label="Estimated drive time" full>
          <input className="input-base" placeholder="e.g. 4h 30m" value={leg.estimatedDriveTime ?? ""} onChange={(e) => set("estimatedDriveTime", e.target.value)} />
        </Field>
      </div>
    );
  }
  if (leg.mode === "train" || leg.mode === "bus") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label="Carrier">
          <input className="input-base" value={leg.carrier ?? ""} onChange={(e) => set("carrier", e.target.value)} />
        </Field>
        <Field label="Route / line">
          <input className="input-base" value={leg.routeOrLine ?? ""} onChange={(e) => set("routeOrLine", e.target.value)} />
        </Field>
      </div>
    );
  }
  if (leg.mode === "rideshare") {
    return (
      <div className="grid grid-cols-1 gap-3">
        <Field label="Service (Uber, Lyft, etc.)">
          <input className="input-base" value={leg.rideshareService ?? ""} onChange={(e) => set("rideshareService", e.target.value)} />
        </Field>
      </div>
    );
  }
  return null;
}

function Field({
  label,
  full,
  children
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={["block", full ? "col-span-2" : ""].join(" ")}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">{label}</span>
      {children}
    </label>
  );
}
