import { NextRequest, NextResponse } from "next/server";
import type { Trip } from "@/lib/itinerary/types";

export const runtime = "nodejs";

// Trip CRUD over MongoDB. Used when MONGODB_URI is configured. Browsers
// can call this to mirror the local store to the cloud; the client UI
// reads from local first and syncs through here when online.

export async function GET(req: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ trips: [], synced: false });
  }
  const email = req.nextUrl.searchParams.get("email");
  const { tripsCollection } = await import("@/lib/itinerary/mongo");
  const col = await tripsCollection();
  const filter = email
    ? { $or: [{ ownerEmail: email }, { "collaborators.email": email }] }
    : {};
  const trips = await col.find(filter).toArray();
  return NextResponse.json({ trips, synced: true });
}

export async function POST(req: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ ok: true, synced: false });
  }
  const trip = (await req.json()) as Trip;
  const { tripsCollection } = await import("@/lib/itinerary/mongo");
  const col = await tripsCollection();
  await col.updateOne({ id: trip.id }, { $set: trip }, { upsert: true });
  return NextResponse.json({ ok: true, synced: true });
}

export async function DELETE(req: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ ok: true, synced: false });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { tripsCollection } = await import("@/lib/itinerary/mongo");
  const col = await tripsCollection();
  await col.deleteOne({ id });
  return NextResponse.json({ ok: true, synced: true });
}
