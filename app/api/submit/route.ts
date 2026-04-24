import { NextResponse } from "next/server";
import type { SubmissionFormData } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: SubmissionFormData;
  try {
    payload = (await req.json()) as SubmissionFormData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload?.name || !payload?.email || !payload?.entityName || !payload?.description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Placeholder: forward to a Make.com / n8n / Zapier webhook if configured.
  // To wire this up, set SUBMIT_WEBHOOK_URL in .env.local.
  const webhookUrl = process.env.SUBMIT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() })
      });
    } catch (err) {
      console.error("Webhook forward failed:", err);
      // Do not fail the user submission because of a webhook issue.
    }
  } else {
    // Dev fallback: log to the server console so you can see submissions locally.
    console.log("[submit] new submission:", payload);
  }

  return NextResponse.json({ ok: true });
}
