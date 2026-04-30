import type { Trip } from "./types";

export type TripTemplateId = "blank";

export type TripTemplate = {
  id: TripTemplateId;
  label: string;
  emoji: string;
  description: string;
  build: () => Partial<Trip>;
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
      budget: { cap: 0, currency: "USD", items: [] }
    })
  }
];

export function getTemplate(id: TripTemplateId) {
  return TRIP_TEMPLATES.find((t) => t.id === id) ?? TRIP_TEMPLATES[0];
}
