"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Trip } from "@/lib/itinerary/types";
import { saveTrip, ensureShareSlug, inviteCollaborator, removeCollaborator } from "@/lib/itinerary/storage";
import { sectionCompletion } from "@/lib/itinerary/utils";
import { ProgressBar } from "./ProgressBar";
import { WorkflowCard } from "./WorkflowCard";
import { TransportationSection } from "./sections/TransportationSection";
import { AccommodationsSection } from "./sections/AccommodationsSection";
import { EventSchedulerSection } from "./sections/EventSchedulerSection";
import { BudgetSection } from "./sections/BudgetSection";
import { PackingListSection } from "./sections/PackingListSection";
import { BottomSheet } from "./BottomSheet";

export function WorkflowBuilder({ initial, readOnly = false }: { initial: Trip; readOnly?: boolean }) {
  const [trip, setTrip] = useState<Trip>(initial);
  const [shareOpen, setShareOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Auto-save
  useEffect(() => {
    if (readOnly) return;
    const t = setTimeout(() => {
      saveTrip(trip);
      setSavedAt(new Date().toLocaleTimeString());
    }, 400);
    return () => clearTimeout(t);
  }, [trip, readOnly]);

  const updateMeta = <K extends keyof Trip>(k: K, v: Trip[K]) =>
    setTrip((prev) => ({ ...prev, [k]: v }));

  const map = useMemo(() => sectionCompletion(trip), [trip]);

  const onChange = (next: Trip) => setTrip(next);

  const logExport = (kind: "pdf" | "email") => {
    try {
      const raw = window.localStorage.getItem("wc_export_log_v1");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({
        at: new Date().toISOString(),
        kind,
        user: trip.ownerEmail,
        tripDest: trip.destination
      });
      window.localStorage.setItem("wc_export_log_v1", JSON.stringify(arr.slice(-200)));
    } catch {
      // ignore
    }
  };

  const handleExportPdf = async () => {
    if (typeof window === "undefined") return;
    saveTrip(trip);
    const res = await fetch("/api/itinerary/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trip })
    });
    if (!res.ok) {
      alert("Could not generate PDF.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${trip.destination.replace(/\s+/g, "-")}-itinerary.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    logExport("pdf");
  };

  const handleEmail = async () => {
    const to = window.prompt("Email this itinerary to:");
    if (!to) return;
    const res = await fetch("/api/itinerary/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trip, to })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      logExport("email");
      alert("Sent! (Or queued — see API logs.)");
    } else {
      alert(data?.error ?? "Failed to send.");
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Trip header */}
      <div className="rounded-2xl border border-white/15 bg-black/50 p-4 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <input
              className="w-full bg-transparent text-xl font-bold text-white outline-none placeholder:text-white/40"
              value={trip.destination}
              onChange={(e) => updateMeta("destination", e.target.value)}
              placeholder="Where are you going?"
              disabled={readOnly}
            />
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-white/50">Start</span>
                <input
                  type="date"
                  className="input-base"
                  value={trip.startDate ?? ""}
                  onChange={(e) => updateMeta("startDate", e.target.value)}
                  disabled={readOnly}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-white/50">End</span>
                <input
                  type="date"
                  className="input-base"
                  value={trip.endDate ?? ""}
                  onChange={(e) => updateMeta("endDate", e.target.value)}
                  disabled={readOnly}
                />
              </label>
            </div>
            <label className="mt-2 block text-xs">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-white/50">Travelers</span>
              <input
                className="input-base"
                value={trip.travelers.join(", ")}
                onChange={(e) =>
                  updateMeta(
                    "travelers",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Alex, Sam, Jordan"
                disabled={readOnly}
              />
            </label>
          </div>
        </div>
      </div>

      <ProgressBar trip={trip} />

      <WorkflowCard
        step={1}
        title="Transportation"
        subtitle="How are you getting there?"
        done={map.transport}
        defaultOpen={!map.transport}
        badge={trip.transport.length > 0 ? <span className="badge">{trip.transport.length} legs</span> : null}
      >
        <TransportationSection trip={trip} onChange={onChange} />
      </WorkflowCard>

      <WorkflowCard
        step={2}
        title="Accommodations"
        subtitle="Where are you staying?"
        done={map.stays}
        defaultOpen={map.transport && !map.stays}
        badge={trip.stays.length > 0 ? <span className="badge">{trip.stays.length} stays</span> : null}
      >
        <AccommodationsSection trip={trip} onChange={onChange} />
      </WorkflowCard>

      <WorkflowCard
        step={3}
        title="Event Scheduler"
        subtitle="Build the day-by-day timeline"
        done={map.events}
        defaultOpen={map.stays && !map.events}
        badge={trip.events.length > 0 ? <span className="badge-gold">{trip.events.length} events</span> : null}
      >
        <EventSchedulerSection trip={trip} onChange={onChange} />
      </WorkflowCard>

      <WorkflowCard
        step={4}
        title="Budget Tracker"
        subtitle="Optional — track spend by category"
        done={map.budget}
        badge={trip.budget.cap > 0 ? <span className="badge">{trip.budget.currency} {trip.budget.cap}</span> : null}
      >
        <BudgetSection trip={trip} onChange={onChange} />
      </WorkflowCard>

      <WorkflowCard
        step={5}
        title="Packing List"
        subtitle="Don't forget anything"
        done={map.packing}
        badge={trip.packing.length > 0 ? <span className="badge">{trip.packing.filter((p) => p.checked).length}/{trip.packing.length}</span> : null}
      >
        <PackingListSection trip={trip} onChange={onChange} />
      </WorkflowCard>

      {!readOnly && (
        <div className="sticky bottom-0 -mx-4 mt-4 border-t border-white/10 bg-navy-950/85 px-4 py-3 backdrop-blur-lg sm:-mx-0 sm:rounded-2xl sm:border sm:border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-white/60">
              {savedAt ? `Saved ${savedAt}` : "Editing..."}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShareOpen(true)} className="btn-secondary">
                Share
              </button>
              <button onClick={handleEmail} className="btn-secondary">
                Email
              </button>
              <button onClick={handleExportPdf} className="btn-primary">
                Export PDF
              </button>
              <Link href={`/itinerary/${trip.id}/print`} className="btn-ghost">
                Print view
              </Link>
            </div>
          </div>
        </div>
      )}

      <ShareSheet
        trip={trip}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onUpdate={(t) => setTrip(t)}
      />
    </div>
  );
}

function ShareSheet({
  trip,
  open,
  onClose,
  onUpdate
}: {
  trip: Trip;
  open: boolean;
  onClose: () => void;
  onUpdate: (t: Trip) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"edit" | "view">("edit");

  const slug = trip.shareSlug;
  const shareUrl =
    slug && typeof window !== "undefined"
      ? `${window.location.origin}/itinerary/share/${slug}`
      : "";

  const ensure = () => {
    const s = ensureShareSlug(trip.id);
    if (s) onUpdate({ ...trip, shareSlug: s });
  };

  const invite = () => {
    if (!email.trim()) return;
    inviteCollaborator(trip.id, email.trim(), role);
    onUpdate({
      ...trip,
      collaborators: [...trip.collaborators.filter((c) => c.email !== email.trim()), { email: email.trim(), role }]
    });
    setEmail("");
  };

  const remove = (e: string) => {
    removeCollaborator(trip.id, e);
    onUpdate({ ...trip, collaborators: trip.collaborators.filter((c) => c.email !== e) });
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Share & collaborate">
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold">View-only link</h4>
          {slug ? (
            <div className="flex gap-2">
              <input className="input-base flex-1 text-xs" readOnly value={shareUrl} />
              <button
                onClick={() => navigator.clipboard?.writeText(shareUrl)}
                className="btn-secondary"
              >
                Copy
              </button>
            </div>
          ) : (
            <button onClick={ensure} className="btn-secondary w-full">
              Generate link
            </button>
          )}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Invite collaborators</h4>
          <div className="grid grid-cols-3 gap-2">
            <input
              className="input-base col-span-2"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <select
              className="input-base"
              value={role}
              onChange={(e) => setRole(e.target.value as "edit" | "view")}
            >
              <option value="edit">Edit</option>
              <option value="view">View</option>
            </select>
          </div>
          <button onClick={invite} className="btn-primary mt-2 w-full">
            Send invite
          </button>

          {trip.collaborators.length > 0 && (
            <ul className="mt-3 space-y-1">
              {trip.collaborators.map((c) => (
                <li
                  key={c.email}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="truncate">{c.email}</span>
                  <span className="flex items-center gap-2">
                    <span className="badge">{c.role}</span>
                    <button onClick={() => remove(c.email)} className="text-xs text-red-accent">
                      Remove
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
