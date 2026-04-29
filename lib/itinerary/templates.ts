import type { Trip } from "./types";

export type TripTemplateId =
  | "blank"
  | "honeymoon"
  | "solo-backpacking"
  | "family"
  | "business"
  | "road-trip";

export type TripTemplate = {
  id: TripTemplateId;
  label: string;
  emoji: string;
  description: string;
  build: () => Partial<Trip>;
};

const baseBudget = (cap: number) => ({
  cap,
  currency: "USD",
  items: []
});

const seedPacking = (extra: { category: "clothing" | "toiletries" | "documents" | "gear"; label: string }[]) => {
  const core = [
    { category: "documents" as const, label: "Passport / ID" },
    { category: "documents" as const, label: "Boarding passes / tickets" },
    { category: "documents" as const, label: "Travel insurance card" },
    { category: "toiletries" as const, label: "Toothbrush + toothpaste" },
    { category: "toiletries" as const, label: "Shampoo / conditioner" },
    { category: "toiletries" as const, label: "Deodorant" },
    { category: "clothing" as const, label: "Underwear (one per day)" },
    { category: "clothing" as const, label: "Socks" },
    { category: "gear" as const, label: "Phone charger" },
    { category: "gear" as const, label: "Universal adapter" }
  ];
  return [...core, ...extra].map((p, i) => ({
    id: `pk-${i}-${Math.random().toString(36).slice(2, 7)}`,
    ...p,
    checked: false
  }));
};

export const TRIP_TEMPLATES: TripTemplate[] = [
  {
    id: "blank",
    label: "Blank Trip",
    emoji: "✦",
    description: "Start from a clean slate.",
    build: () => ({
      template: "blank",
      transport: [],
      stays: [],
      events: [],
      budget: baseBudget(2000),
      packing: seedPacking([])
    })
  },
  {
    id: "honeymoon",
    label: "Honeymoon",
    emoji: "💞",
    description: "Romantic getaway, paced and indulgent.",
    build: () => ({
      template: "honeymoon",
      transport: [],
      stays: [],
      events: [],
      budget: baseBudget(6000),
      packing: seedPacking([
        { category: "clothing", label: "Formal outfit (dinner reservations)" },
        { category: "clothing", label: "Swimwear" },
        { category: "gear", label: "Camera" },
        { category: "documents", label: "Marriage certificate (if claiming honeymoon perks)" }
      ])
    })
  },
  {
    id: "solo-backpacking",
    label: "Solo Backpacking",
    emoji: "🎒",
    description: "Lightweight, flexible, hostel-friendly.",
    build: () => ({
      template: "solo-backpacking",
      transport: [],
      stays: [],
      events: [],
      budget: baseBudget(1500),
      packing: seedPacking([
        { category: "gear", label: "Backpack rain cover" },
        { category: "gear", label: "Quick-dry towel" },
        { category: "gear", label: "Padlock for hostel locker" },
        { category: "clothing", label: "Hiking shoes" }
      ])
    })
  },
  {
    id: "family",
    label: "Family Vacation",
    emoji: "👨‍👩‍👧",
    description: "Kid-friendly pace, snacks, and naps.",
    build: () => ({
      template: "family",
      transport: [],
      stays: [],
      events: [],
      budget: baseBudget(5000),
      packing: seedPacking([
        { category: "gear", label: "Stroller / carrier" },
        { category: "gear", label: "Snacks & drinks" },
        { category: "documents", label: "Kids' birth certificates" },
        { category: "toiletries", label: "Sunscreen (kid-safe)" }
      ])
    })
  },
  {
    id: "business",
    label: "Business Trip",
    emoji: "💼",
    description: "In and out, meetings, and one good dinner.",
    build: () => ({
      template: "business",
      transport: [],
      stays: [],
      events: [],
      budget: baseBudget(2500),
      packing: seedPacking([
        { category: "clothing", label: "Suit / blazer" },
        { category: "clothing", label: "Dress shoes" },
        { category: "gear", label: "Laptop + charger" },
        { category: "documents", label: "Business cards" }
      ])
    })
  },
  {
    id: "road-trip",
    label: "Road Trip",
    emoji: "🚗",
    description: "Multi-stop, by car, with playlists.",
    build: () => ({
      template: "road-trip",
      transport: [],
      stays: [],
      events: [],
      budget: baseBudget(1800),
      packing: seedPacking([
        { category: "gear", label: "Phone car mount" },
        { category: "gear", label: "Cooler + snacks" },
        { category: "documents", label: "Driver's license + registration" },
        { category: "gear", label: "Roadside emergency kit" }
      ])
    })
  }
];

export function getTemplate(id: TripTemplateId) {
  return TRIP_TEMPLATES.find((t) => t.id === id) ?? TRIP_TEMPLATES[0];
}
