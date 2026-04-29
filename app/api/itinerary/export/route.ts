import { NextRequest, NextResponse } from "next/server";
import { buildTripPdf } from "@/lib/itinerary/pdf";
import type { Trip } from "@/lib/itinerary/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { trip: Trip };
    if (!body?.trip) {
      return NextResponse.json({ error: "Missing trip" }, { status: 400 });
    }
    const pdf = await buildTripPdf(body.trip);

    // Best-effort logging: when MongoDB is configured, persist the export.
    try {
      if (process.env.MONGODB_URI) {
        const { exportLogCollection } = await import("@/lib/itinerary/mongo");
        const col = await exportLogCollection();
        await col.insertOne({
          tripId: body.trip.id,
          userEmail: body.trip.ownerEmail,
          kind: "pdf",
          createdAt: new Date().toISOString()
        });
      }
    } catch {
      // Don't fail the export if logging fails.
    }

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${body.trip.destination.replace(/[^a-z0-9-]/gi, "_")}-itinerary.pdf"`
      }
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
