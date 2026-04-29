"use client";

import { useState } from "react";
import type { BudgetCategory, BudgetItem, Trip } from "@/lib/itinerary/types";
import { sumByCategory, totalSpent, uid } from "@/lib/itinerary/utils";

const CATS: { id: BudgetCategory; label: string; color: string }[] = [
  { id: "transport", label: "Transport", color: "#A78BFA" },
  { id: "lodging", label: "Lodging", color: "#22D3EE" },
  { id: "food", label: "Food", color: "#F5C518" },
  { id: "activities", label: "Activities", color: "#34D399" },
  { id: "misc", label: "Misc", color: "#94A3B8" }
];

export function BudgetSection({
  trip,
  onChange
}: {
  trip: Trip;
  onChange: (next: Trip) => void;
}) {
  const [draftLabel, setDraftLabel] = useState("");
  const [draftAmount, setDraftAmount] = useState<string>("");
  const [draftCat, setDraftCat] = useState<BudgetCategory>("food");

  const total = totalSpent(trip);
  const cap = trip.budget.cap;
  const totalsByCat = sumByCategory(trip);
  const overBudget = cap > 0 && total > cap;

  const setCap = (v: number) =>
    onChange({ ...trip, budget: { ...trip.budget, cap: Math.max(0, v) } });

  const setCurrency = (v: string) =>
    onChange({ ...trip, budget: { ...trip.budget, currency: v } });

  const addItem = () => {
    const amt = parseFloat(draftAmount);
    if (!draftLabel.trim() || Number.isNaN(amt)) return;
    const item: BudgetItem = {
      id: uid("b-"),
      category: draftCat,
      label: draftLabel.trim(),
      amount: amt
    };
    onChange({
      ...trip,
      budget: { ...trip.budget, items: [...trip.budget.items, item] }
    });
    setDraftLabel("");
    setDraftAmount("");
  };

  const removeItem = (id: string) =>
    onChange({
      ...trip,
      budget: { ...trip.budget, items: trip.budget.items.filter((i) => i.id !== id) }
    });

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/70">
        Optional. Track spend by category against a cap.
      </p>

      <div className="grid grid-cols-3 gap-3">
        <label className="col-span-2 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">Budget cap</span>
          <input
            type="number"
            min={0}
            className="input-base"
            value={cap || ""}
            onChange={(e) => setCap(parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">Currency</span>
          <input
            className="input-base"
            value={trip.budget.currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            placeholder="USD"
          />
        </label>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wide text-white/60">Total spent</span>
          <span className={["text-lg font-bold", overBudget ? "text-red-accent" : "text-gold"].join(" ")}>
            {trip.budget.currency} {total.toFixed(2)}
            {cap > 0 && <span className="ml-1 text-xs font-normal text-white/50">/ {cap.toFixed(2)}</span>}
          </span>
        </div>
        {cap > 0 && (
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={["h-full rounded-full transition-[width]", overBudget ? "bg-red-accent" : "bg-gold"].join(" ")}
              style={{ width: `${Math.min(100, (total / cap) * 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {CATS.map((c) => {
          const v = totalsByCat[c.id] ?? 0;
          const pct = cap > 0 ? Math.min(100, (v / cap) * 100) : 0;
          return (
            <div key={c.id} className="rounded-lg border border-white/10 bg-black/30 p-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold" style={{ color: c.color }}>{c.label}</span>
                <span className="text-white/70">{trip.budget.currency} {v.toFixed(2)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">Line items</h4>
        {trip.budget.items.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-3 text-center text-xs text-white/60">
            No items yet.
          </div>
        )}
        <ul className="space-y-1.5">
          {trip.budget.items.map((it) => {
            const c = CATS.find((x) => x.id === it.category);
            return (
              <li
                key={it.id}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                <span
                  className="h-2.5 w-2.5 flex-none rounded-full"
                  style={{ backgroundColor: c?.color ?? "#94A3B8" }}
                  aria-hidden
                />
                <span className="flex-1 truncate">{it.label}</span>
                <span className="text-white/70">{trip.budget.currency} {it.amount.toFixed(2)}</span>
                <button
                  onClick={() => removeItem(it.id)}
                  className="text-xs text-red-accent hover:underline"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Add item</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input-base col-span-2"
            placeholder="What was it?"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
          />
          <select
            className="input-base"
            value={draftCat}
            onChange={(e) => setDraftCat(e.target.value as BudgetCategory)}
          >
            {CATS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            className="input-base"
            placeholder="Amount"
            value={draftAmount}
            onChange={(e) => setDraftAmount(e.target.value)}
          />
        </div>
        <button onClick={addItem} className="btn-secondary mt-2 w-full">
          Add expense
        </button>
      </div>
    </div>
  );
}
