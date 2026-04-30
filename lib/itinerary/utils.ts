import type { CompletionMap, Trip, WorkflowSection } from "./types";

export function uid(prefix = "") {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function tripDays(trip: Trip): string[] {
  if (!trip.startDate || !trip.endDate) return [];
  const out: string[] = [];
  const start = new Date(trip.startDate + "T00:00:00");
  const end = new Date(trip.endDate + "T00:00:00");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function sectionCompletion(trip: Trip): CompletionMap {
  const transport = trip.transport.length > 0;
  const stays = trip.stays.length > 0;
  const events = trip.events.length > 0;
  const budget =
    trip.budget.cap > 0 || trip.budget.items.length > 0;
  return { transport, stays, events, budget };
}

export function completionPercent(trip: Trip): number {
  const map = sectionCompletion(trip);
  const required: WorkflowSection[] = ["transport", "stays", "events"];
  const required_done = required.filter((k) => map[k]).length;
  // Budget is optional but contributes a small bonus
  const bonus = map.budget ? 1 : 0;
  const total = required.length + 1;
  return Math.round(((required_done + bonus) / total) * 100);
}

export function categoryColor(cat: string): string {
  switch (cat) {
    case "meal":
      return "#F5C518"; // gold
    case "activity":
      return "#22D3EE"; // cyan
    case "transport":
      return "#A78BFA"; // violet
    case "free":
      return "#34D399"; // emerald
    case "ceremony":
      return "#E63946"; // red accent
    default:
      return "#94A3B8";
  }
}

export function categoryLabel(cat: string): string {
  switch (cat) {
    case "meal":
      return "Meal";
    case "activity":
      return "Activity";
    case "transport":
      return "Transport";
    case "free":
      return "Free time";
    case "ceremony":
      return "Ceremony";
    default:
      return cat;
  }
}

export function transportLabel(mode: string): string {
  switch (mode) {
    case "flight":
      return "Flight";
    case "rental":
      return "Rental car";
    case "personal":
      return "Personal vehicle";
    case "train":
      return "Train";
    case "bus":
      return "Bus";
    case "rideshare":
      return "Rideshare";
    default:
      return mode;
  }
}

export function transportIcon(mode: string): string {
  switch (mode) {
    case "flight":
      return "✈";
    case "rental":
      return "🚙";
    case "personal":
      return "🚗";
    case "train":
      return "🚆";
    case "bus":
      return "🚌";
    case "rideshare":
      return "🛺";
    default:
      return "•";
  }
}

export function accommodationLabel(t: string): string {
  switch (t) {
    case "hotel":
      return "Hotel";
    case "bnb":
      return "Bed & Breakfast";
    case "airbnb":
      return "Airbnb";
    case "hostel":
      return "Hostel";
    case "camping":
      return "Camping";
    case "friends":
      return "Friend / Family";
    default:
      return t;
  }
}

export function accommodationIcon(t: string): string {
  switch (t) {
    case "hotel":
      return "🏨";
    case "bnb":
      return "🍳";
    case "airbnb":
      return "🏡";
    case "hostel":
      return "🛏";
    case "camping":
      return "🏕";
    case "friends":
      return "👋";
    default:
      return "•";
  }
}

export function chainedEvents(trip: Trip) {
  return trip.events.slice().sort((a, b) => {
    const ao = a.manualOrder;
    const bo = b.manualOrder;
    if (ao !== undefined && bo !== undefined) return ao - bo;
    if (ao !== undefined) return -1;
    if (bo !== undefined) return 1;
    const ad = (a.date ?? "") + " " + (a.startTime ?? "99:99");
    const bd = (b.date ?? "") + " " + (b.startTime ?? "99:99");
    return ad.localeCompare(bd);
  });
}

export function reflowChain(events: { id: string; manualOrder?: number }[]) {
  return events.map((ev, i) => ({ ...ev, manualOrder: (i + 1) * 10 }));
}

export function parseUSDate(date?: string): string | null {
  if (!date) return null;
  // Try direct ISO first
  const iso = /^\d{4}-\d{2}-\d{2}/.exec(date);
  if (iso) return iso[0];
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString().slice(0, 10);
}

export function parseTime12h(time?: string): string | undefined {
  if (!time) return undefined;
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(time.trim());
  if (!m) return undefined;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3]?.toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${min}`;
}

export function sortedEventsForDay(trip: Trip, day: string) {
  return trip.events
    .filter((e) => e.date === day)
    .slice()
    .sort((a, b) => {
      const ao = a.manualOrder;
      const bo = b.manualOrder;
      if (ao !== undefined && bo !== undefined) return ao - bo;
      if (ao !== undefined) return -1;
      if (bo !== undefined) return 1;
      const at = a.startTime ?? "99:99";
      const bt = b.startTime ?? "99:99";
      return at.localeCompare(bt);
    });
}

export function sumByCategory(trip: Trip) {
  const map: Record<string, number> = {};
  for (const item of trip.budget.items) {
    map[item.category] = (map[item.category] ?? 0) + item.amount;
  }
  return map;
}

export function totalSpent(trip: Trip) {
  return trip.budget.items.reduce((s, i) => s + i.amount, 0);
}
