"use client";

import type { Trip } from "@/lib/itinerary/types";
import { completionPercent, sectionCompletion } from "@/lib/itinerary/utils";

const STEPS: { key: keyof ReturnType<typeof sectionCompletion>; label: string; icon: string }[] = [
  { key: "transport", label: "Transport", icon: "✈" },
  { key: "stays", label: "Stays", icon: "🏨" },
  { key: "events", label: "Schedule", icon: "📅" },
  { key: "budget", label: "Budget", icon: "💵" },
  { key: "packing", label: "Packing", icon: "🎒" }
];

export function ProgressBar({ trip }: { trip: Trip }) {
  const pct = completionPercent(trip);
  const map = sectionCompletion(trip);

  return (
    <div className="rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Trip completion</span>
        <span className="text-gold">{pct}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-5 gap-1">
        {STEPS.map((s) => {
          const done = map[s.key];
          return (
            <li key={s.key} className="flex flex-col items-center gap-1">
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm transition",
                  done
                    ? "border-gold/60 bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-white/60"
                ].join(" ")}
                aria-hidden
              >
                {done ? "✓" : s.icon}
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-wide text-white/60">
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
