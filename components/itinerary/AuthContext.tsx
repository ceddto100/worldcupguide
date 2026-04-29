"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser, setCurrentUser, type LocalUser } from "@/lib/itinerary/storage";

type Ctx = {
  user: LocalUser | null;
  ready: boolean;
  signInDemo: (name?: string, email?: string) => void;
  signInGoogleStub: () => void;
  signOut: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setReady(true);
  }, []);

  const signInDemo = useCallback((name = "Traveler", email = "traveler@example.com") => {
    const u: LocalUser = { name, email, isAdmin: email === "admin@worldcupatlguide.com" };
    setCurrentUser(u);
    setUser(u);
  }, []);

  // Google OAuth stub — creates a Google-shaped user record without
  // actually round-tripping. Real OAuth wiring is sketched in
  // app/api/auth/google/route.ts and uses GOOGLE_CLIENT_ID/SECRET if present.
  const signInGoogleStub = useCallback(() => {
    const u: LocalUser = {
      name: "Google Traveler",
      email: "google.traveler@gmail.com",
      picture: "https://lh3.googleusercontent.com/a/default-user",
      isAdmin: false
    };
    setCurrentUser(u);
    setUser(u);
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, ready, signInDemo, signInGoogleStub, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
