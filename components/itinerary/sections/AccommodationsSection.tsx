"use client";

import { useState } from "react";
import type { Accommodation, AccommodationType, Trip } from "@/lib/itinerary/types";
import { accommodationIcon, accommodationLabel, uid } from "@/lib/itinerary/utils";
import { BottomSheet } from "../BottomSheet";

const TYPES: AccommodationType[] = ["hotel", "bnb", "airbnb", "hostel", "camping", "friends"];

const AMENITIES = ["pool", "breakfast", "parking", "pet-friendly", "wifi", "gym", "kitchen", "washer"];

export function AccommodationsSection({
  trip,
  onChange
}: {
  trip: Trip;
  onChange: (next: Trip) => void;
}) {
  const [editing, setEditing] = useState<Accommodation | null>(null);

  const startNew = () => {
    setEditing({ id: uid("stay-"), type: "hotel", name: "", amenities: [] });
  };

  const save = (s: Accommodation) => {
    const exists = trip.stays.some((x) => x.id === s.id);
    const next = exists ? trip.stays.map((x) => (x.id === s.id ? s : x)) : [...trip.stays, s];
    onChange({ ...trip, stays: next });
    setEditing(null);
  };

  const remove = (id: string) => {
    onChange({ ...trip, stays: trip.stays.filter((s) => s.id !== id) });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/70">
        Where are you staying? Add multiple stays for multi-city trips.
      </p>

      {trip.stays.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-white/60">
          No stays yet.
        </div>
      )}

      <ul className="space-y-2">
        {trip.stays.map((s) => (
          <li
            key={s.id}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <span className="text-xl" aria-hidden>{accommodationIcon(s.type)}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <span>{s.name || "Untitled stay"}</span>
                <span className="badge">{accommodationLabel(s.type)}</span>
              </div>
              <div className="mt-1 text-xs text-white/60">
                {s.address && <div className="truncate">{s.address}</div>}
                {(s.checkIn || s.checkOut) && (
                  <div>
                    {s.checkIn ?? "?"} {s.checkInTime && `@ ${s.checkInTime}`} → {s.checkOut ?? "?"} {s.checkOutTime && `@ ${s.checkOutTime}`}
                  </div>
                )}
              </div>
              {s.amenities.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {s.amenities.map((a) => (
                    <span key={a} className="badge">{a}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-none flex-col gap-1">
              <button
                onClick={() => setEditing(s)}
                className="rounded-md px-2 py-1 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => remove(s.id)}
                className="rounded-md px-2 py-1 text-xs font-medium text-red-accent hover:bg-red-accent/10"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={startNew} className="btn-secondary w-full">
        + Add a stay
      </button>

      <BottomSheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id && trip.stays.some((s) => s.id === editing.id) ? "Edit stay" : "New stay"}
      >
        {editing && (
          <StayForm
            stay={editing}
            onCancel={() => setEditing(null)}
            onSave={save}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function StayForm({
  stay,
  onCancel,
  onSave
}: {
  stay: Accommodation;
  onCancel: () => void;
  onSave: (s: Accommodation) => void;
}) {
  const [draft, setDraft] = useState<Accommodation>(stay);
  const set = <K extends keyof Accommodation>(k: K, v: Accommodation[K]) =>
    setDraft({ ...draft, [k]: v });

  const toggleAmenity = (a: string) =>
    set(
      "amenities",
      draft.amenities.includes(a)
        ? draft.amenities.filter((x) => x !== a)
        : [...draft.amenities, a]
    );

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => {
            const active = draft.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={[
                  "rounded-xl border px-2 py-3 text-xs font-semibold transition",
                  active
                    ? "border-gold/60 bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                ].join(" ")}
              >
                <span className="block text-base">{accommodationIcon(t)}</span>
                {accommodationLabel(t)}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Property name">
        <input
          className="input-base"
          value={draft.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="The Grand Hotel"
        />
      </Field>

      <Field label="Address">
        <input
          className="input-base"
          value={draft.address ?? ""}
          onChange={(e) => set("address", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Check-in date">
          <input
            type="date"
            className="input-base"
            value={draft.checkIn ?? ""}
            onChange={(e) => set("checkIn", e.target.value)}
          />
        </Field>
        <Field label="Check-in time">
          <input
            type="time"
            className="input-base"
            value={draft.checkInTime ?? ""}
            onChange={(e) => set("checkInTime", e.target.value)}
          />
        </Field>
        <Field label="Check-out date">
          <input
            type="date"
            className="input-base"
            value={draft.checkOut ?? ""}
            onChange={(e) => set("checkOut", e.target.value)}
          />
        </Field>
        <Field label="Check-out time">
          <input
            type="time"
            className="input-base"
            value={draft.checkOutTime ?? ""}
            onChange={(e) => set("checkOutTime", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Confirmation #">
        <input
          className="input-base"
          value={draft.confirmation ?? ""}
          onChange={(e) => set("confirmation", e.target.value)}
        />
      </Field>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => {
            const on = draft.amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  on
                    ? "border-gold/60 bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                ].join(" ")}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Notes">
        <textarea
          rows={2}
          className="input-base"
          value={draft.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button
          onClick={() => onSave(draft)}
          className="btn-primary"
          disabled={!draft.name.trim()}
        >
          Save stay
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
