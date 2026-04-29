"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { TRIP_TEMPLATES, type TripTemplateId } from "@/lib/itinerary/templates";
import { createTrip } from "@/lib/itinerary/storage";
import { useAuth } from "./AuthContext";

export function NewTripFlow() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [destination, setDestination] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [travelers, setTravelers] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [tplId, setTplId] = useState<TripTemplateId>("blank");

  if (!ready) return null;
  if (!user) {
    return (
      <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center">
        <p className="text-sm text-white/70">Sign in first to create a trip.</p>
        <Link href="/itinerary" className="btn-primary mt-3 inline-flex">
          Go to dashboard
        </Link>
      </div>
    );
  }

  const create = () => {
    const trip = createTrip({
      ownerEmail: user.email,
      destination: destination.trim() || "My Trip",
      startDate: start || undefined,
      endDate: end || undefined,
      templateId: tplId,
      travelers: travelers.split(",").map((s) => s.trim()).filter(Boolean),
      coverPhoto: coverPhoto.trim() || undefined
    });
    router.push(`/itinerary/${trip.id}`);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Plan a new trip</h1>
        <p className="text-sm text-white/60">
          Step {step} of 2 — {step === 1 ? "the basics" : "pick a template"}
        </p>
      </header>

      {step === 1 ? (
        <div className="space-y-3 rounded-2xl border border-white/15 bg-black/50 p-5 backdrop-blur-md">
          <Field label="Destination">
            <input
              className="input-base"
              autoFocus
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Atlanta, GA"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input
                type="date"
                className="input-base"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                className="input-base"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Travelers (comma separated)">
            <input
              className="input-base"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              placeholder="Alex, Sam"
            />
          </Field>
          <Field label="Cover photo URL (optional)">
            <input
              className="input-base"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="https://..."
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Link href="/itinerary" className="btn-ghost">
              Cancel
            </Link>
            <button
              className="btn-primary"
              disabled={!destination.trim()}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-white/15 bg-black/50 p-5 backdrop-blur-md">
          <p className="text-sm text-white/70">
            Templates pre-fill a packing list, budget cap, and trip vibe. You can change everything later.
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TRIP_TEMPLATES.map((t) => {
              const active = tplId === t.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setTplId(t.id)}
                    className={[
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition",
                      active
                        ? "border-gold/60 bg-gold/10"
                        : "border-white/15 bg-white/5 hover:bg-white/10"
                    ].join(" ")}
                  >
                    <span className="text-2xl" aria-hidden>{t.emoji}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{t.label}</span>
                      <span className="block text-xs text-white/60">{t.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between gap-2 pt-2">
            <button onClick={() => setStep(1)} className="btn-ghost">
              ← Back
            </button>
            <button onClick={create} className="btn-primary">
              Create trip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
