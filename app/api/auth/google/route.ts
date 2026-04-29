import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Google OAuth handler. Two flows:
//   GET /api/auth/google           → redirect user to Google's consent screen
//   GET /api/auth/google?code=...  → exchange code for tokens and return user
//
// Requires: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
// (which should be the URL of this route).

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirect = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirect) {
    return NextResponse.json(
      {
        error:
          "Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI."
      },
      { status: 501 }
    );
  }

  if (!code) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirect,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent"
    });
    return NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    );
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirect,
      grant_type: "authorization_code"
    })
  });
  if (!tokenRes.ok) {
    return NextResponse.json({ error: await tokenRes.text() }, { status: 400 });
  }
  const tokens = (await tokenRes.json()) as { access_token: string; id_token: string };

  const profileRes = await fetch(
    `https://openidconnect.googleapis.com/v1/userinfo`,
    { headers: { Authorization: `Bearer ${tokens.access_token}` } }
  );
  const profile = (await profileRes.json()) as {
    email: string;
    name: string;
    picture?: string;
  };

  // Persist user record when MongoDB is configured.
  if (process.env.MONGODB_URI) {
    try {
      const { usersCollection } = await import("@/lib/itinerary/mongo");
      const col = await usersCollection();
      await col.updateOne(
        { email: profile.email },
        {
          $set: {
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            isAdmin: profile.email === process.env.ADMIN_EMAIL
          },
          $setOnInsert: { createdAt: new Date().toISOString() }
        },
        { upsert: true }
      );
    } catch {
      // ignore — user record is non-essential for the redirect to succeed
    }
  }

  // Redirect back to the dashboard with the user encoded in a cookie
  // (the React client will pick it up via document.cookie). For real prod
  // use httpOnly + signed sessions; this keeps the demo coherent.
  const dashboard = new URL("/itinerary", req.nextUrl.origin);
  const res = NextResponse.redirect(dashboard);
  res.cookies.set(
    "wc_user",
    JSON.stringify({
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      isAdmin: profile.email === process.env.ADMIN_EMAIL
    }),
    { path: "/", maxAge: 60 * 60 * 24 * 30 }
  );
  return res;
}
