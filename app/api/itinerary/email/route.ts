import { NextRequest, NextResponse } from "next/server";
import { buildTripPdf } from "@/lib/itinerary/pdf";
import type { Trip } from "@/lib/itinerary/types";

export const runtime = "nodejs";

// Sends the trip PDF via Gmail API. Requires the following env vars:
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_REFRESH_TOKEN  (offline-access refresh token for the sender)
//   GOOGLE_SENDER_EMAIL   (the from: address)
//
// When credentials are missing, the route falls through to a SUBMIT_WEBHOOK_URL
// pass-through (Make.com / n8n / Zapier) so users can still wire up sending
// without standing up Google OAuth themselves.

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { trip: Trip; to: string };
    if (!body?.trip || !body?.to) {
      return NextResponse.json({ error: "Missing trip or to" }, { status: 400 });
    }

    const pdf = await buildTripPdf(body.trip);

    const hasGmail =
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_SENDER_EMAIL;

    if (hasGmail) {
      await sendViaGmail({
        to: body.to,
        from: process.env.GOOGLE_SENDER_EMAIL!,
        subject: `Your itinerary: ${body.trip.destination}`,
        text: emailBody(body.trip),
        attachment: { filename: "itinerary.pdf", content: pdf }
      });
      return NextResponse.json({ ok: true, channel: "gmail" });
    }

    if (process.env.SUBMIT_WEBHOOK_URL) {
      await fetch(process.env.SUBMIT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "itinerary_email",
          to: body.to,
          subject: `Your itinerary: ${body.trip.destination}`,
          trip: body.trip,
          pdf_base64: pdf.toString("base64")
        })
      });
      return NextResponse.json({ ok: true, channel: "webhook" });
    }

    return NextResponse.json(
      {
        error:
          "Email isn't configured. Set GOOGLE_* env vars or SUBMIT_WEBHOOK_URL to enable sending."
      },
      { status: 501 }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function emailBody(trip: Trip) {
  return [
    `Here's your itinerary for ${trip.destination}.`,
    "",
    trip.startDate && trip.endDate ? `Dates: ${trip.startDate} → ${trip.endDate}` : "Dates: TBD",
    `Travelers: ${trip.travelers.join(", ") || "—"}`,
    "",
    "Your full plan is attached as a PDF.",
    "",
    "— World Cup ATL Guide"
  ].join("\n");
}

async function sendViaGmail(opts: {
  to: string;
  from: string;
  subject: string;
  text: string;
  attachment: { filename: string; content: Buffer };
}) {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token"
    })
  });
  if (!tokenRes.ok) {
    throw new Error(`Token refresh failed: ${await tokenRes.text()}`);
  }
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const boundary = `mime_${Math.random().toString(36).slice(2)}`;
  const mime = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    opts.text,
    "",
    `--${boundary}`,
    "Content-Type: application/pdf",
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${opts.attachment.filename}"`,
    "",
    opts.attachment.content.toString("base64"),
    `--${boundary}--`
  ].join("\r\n");

  const raw = Buffer.from(mime, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw })
  });
  if (!sendRes.ok) {
    throw new Error(`Gmail send failed: ${await sendRes.text()}`);
  }
}
