"use client";

import { useMemo, useState } from "react";
import type { PackingItem, Trip } from "@/lib/itinerary/types";
import { uid } from "@/lib/itinerary/utils";

const CATS: { id: PackingItem["category"]; label: string; icon: string }[] = [
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "toiletries", label: "Toiletries", icon: "🧴" },
  { id: "documents", label: "Documents", icon: "📄" },
  { id: "gear", label: "Gear", icon: "🎒" }
];

export function PackingListSection({
  trip,
  onChange
}: {
  trip: Trip;
  onChange: (next: Trip) => void;
}) {
  const [draftLabel, setDraftLabel] = useState("");
  const [draftCat, setDraftCat] = useState<PackingItem["category"]>("clothing");

  const grouped = useMemo(() => {
    const map: Record<string, PackingItem[]> = {};
    for (const c of CATS) map[c.id] = [];
    for (const item of trip.packing) (map[item.category] ??= []).push(item);
    return map;
  }, [trip.packing]);

  const checkedCount = trip.packing.filter((p) => p.checked).length;

  const toggle = (id: string) =>
    onChange({
      ...trip,
      packing: trip.packing.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    });

  const remove = (id: string) =>
    onChange({ ...trip, packing: trip.packing.filter((p) => p.id !== id) });

  const add = () => {
    if (!draftLabel.trim()) return;
    onChange({
      ...trip,
      packing: [
        ...trip.packing,
        { id: uid("pk-"), category: draftCat, label: draftLabel.trim(), checked: false }
      ]
    });
    setDraftLabel("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">
          Tap to check off. {checkedCount}/{trip.packing.length} packed.
        </p>
        {trip.collaborators.length > 0 && (
          <span className="badge">Shared with {trip.collaborators.length}</span>
        )}
      </div>

      {CATS.map((c) => {
        const items = grouped[c.id] ?? [];
        if (items.length === 0) return null;
        return (
          <div key={c.id}>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/60">
              <span className="mr-1">{c.icon}</span>
              {c.label}
            </h4>
            <ul className="space-y-1.5">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                >
                  <button
                    onClick={() => toggle(it.id)}
                    className={[
                      "flex h-5 w-5 flex-none items-center justify-center rounded-md border text-xs transition",
                      it.checked
                        ? "border-gold bg-gold text-navy-950"
                        : "border-white/30 bg-white/5 text-transparent hover:border-white/60"
                    ].join(" ")}
                    aria-label={it.checked ? "Mark unchecked" : "Mark checked"}
                  >
                    ✓
                  </button>
                  <span
                    className={[
                      "flex-1 text-sm",
                      it.checked ? "text-white/40 line-through" : "text-white"
                    ].join(" ")}
                  >
                    {it.label}
                  </span>
                  <button
                    onClick={() => remove(it.id)}
                    className="text-xs text-red-accent/70 hover:text-red-accent"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Add item</h4>
        <div className="grid grid-cols-3 gap-2">
          <input
            className="input-base col-span-2"
            placeholder="e.g. Sunscreen"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
            }}
          />
          <select
            className="input-base"
            value={draftCat}
            onChange={(e) => setDraftCat(e.target.value as PackingItem["category"])}
          >
            {CATS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <button onClick={add} className="btn-secondary mt-2 w-full">
          Add to list
        </button>
      </div>
    </div>
  );
}
