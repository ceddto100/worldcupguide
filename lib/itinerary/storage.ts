import type { Trip } from "./types";
import { getTemplate, type TripTemplateId } from "./templates";
import { uid } from "./utils";

// Local-first storage. The intended production backend is MongoDB —
// see lib/itinerary/mongo.ts for the adapter. The client always reads/writes
// through this layer so swapping backends is a one-line change.

const KEY = "wc_itineraries_v1";
const USER_KEY = "wc_user_v1";

export type LocalUser = {
  email: string;
  name: string;
  picture?: string;
  isAdmin?: boolean;
};

function readAll(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Trip & { packing?: unknown }>;
    return parsed.map(({ packing: _drop, ...t }) => t as Trip);
  } catch {
    return [];
  }
}

function writeAll(trips: Trip[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(trips));
}

export function getCurrentUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalUser;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: LocalUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(USER_KEY);
}

export function listTrips(ownerEmail?: string): Trip[] {
  const trips = readAll();
  if (!ownerEmail) return trips;
  return trips.filter(
    (t) =>
      t.ownerEmail === ownerEmail ||
      t.collaborators.some((c) => c.email === ownerEmail)
  );
}

export function listAllTrips(): Trip[] {
  return readAll();
}

export function getTrip(id: string): Trip | null {
  return readAll().find((t) => t.id === id) ?? null;
}

export function getTripByShareSlug(slug: string): Trip | null {
  return readAll().find((t) => t.shareSlug === slug) ?? null;
}

export function saveTrip(trip: Trip) {
  const trips = readAll();
  const idx = trips.findIndex((t) => t.id === trip.id);
  trip.updatedAt = new Date().toISOString();
  if (idx >= 0) trips[idx] = trip;
  else trips.push(trip);
  writeAll(trips);
}

export function deleteTrip(id: string) {
  const trips = readAll().filter((t) => t.id !== id);
  writeAll(trips);
}

export function createTrip(opts: {
  ownerEmail: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  templateId?: TripTemplateId;
  travelers?: string[];
  coverPhoto?: string;
}): Trip {
  const tpl = getTemplate(opts.templateId ?? "blank");
  const seed = tpl.build();
  const now = new Date().toISOString();
  const trip: Trip = {
    id: uid("trip-"),
    ownerEmail: opts.ownerEmail,
    destination: opts.destination,
    coverPhoto: opts.coverPhoto,
    startDate: opts.startDate,
    endDate: opts.endDate,
    travelers: opts.travelers ?? [],
    transport: seed.transport ?? [],
    stays: seed.stays ?? [],
    events: seed.events ?? [],
    budget: seed.budget ?? { cap: 0, currency: "USD", items: [] },
    template: seed.template,
    collaborators: [],
    createdAt: now,
    updatedAt: now
  };
  saveTrip(trip);
  return trip;
}

export function duplicateTrip(id: string): Trip | null {
  const orig = getTrip(id);
  if (!orig) return null;
  const now = new Date().toISOString();
  const copy: Trip = {
    ...orig,
    id: uid("trip-"),
    destination: `${orig.destination} (copy)`,
    shareSlug: undefined,
    collaborators: [],
    createdAt: now,
    updatedAt: now
  };
  saveTrip(copy);
  return copy;
}

export function ensureShareSlug(id: string): string | null {
  const trip = getTrip(id);
  if (!trip) return null;
  if (!trip.shareSlug) {
    trip.shareSlug = uid("s-");
    saveTrip(trip);
  }
  return trip.shareSlug;
}

export function inviteCollaborator(
  tripId: string,
  email: string,
  role: "edit" | "view" = "edit"
) {
  const trip = getTrip(tripId);
  if (!trip) return;
  if (trip.collaborators.some((c) => c.email === email)) return;
  trip.collaborators.push({ email, role });
  saveTrip(trip);
}

export function removeCollaborator(tripId: string, email: string) {
  const trip = getTrip(tripId);
  if (!trip) return;
  trip.collaborators = trip.collaborators.filter((c) => c.email !== email);
  saveTrip(trip);
}
