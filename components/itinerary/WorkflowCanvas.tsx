"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ItineraryEvent, Trip } from "@/lib/itinerary/types";
import {
  ensureShareSlug,
  inviteCollaborator,
  removeCollaborator,
  saveTrip
} from "@/lib/itinerary/storage";
import {
  categoryColor,
  categoryLabel,
  chainedEvents,
  completionPercent,
  formatDateLabel,
  formatDateShort,
  reflowChain,
  uid
} from "@/lib/itinerary/utils";
import { BottomSheet } from "./BottomSheet";
import { EventPicker } from "./EventPicker";
import { WorkflowCard } from "./WorkflowCard";
import { TransportationSection } from "./sections/TransportationSection";
import { AccommodationsSection } from "./sections/AccommodationsSection";
import { BudgetSection } from "./sections/BudgetSection";
import { PackingListSection } from "./sections/PackingListSection";

type PickerState = { open: boolean; insertAt: number };
type EditState = { open: boolean; event: ItineraryEvent | null };

export function WorkflowCanvas({ initial, readOnly = false }: { initial: Trip; readOnly?: boolean }) {
  const [trip, setTrip] = useState<Trip>(initial);
  const [picker, setPicker] = useState<PickerState>({ open: false, insertAt: 0 });
  const [editing, setEditing] = useState<EditState>({ open: false, event: null });
  const [shareOpen, setShareOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (readOnly) return;
    const t = setTimeout(() => {
      saveTrip(trip);
      setSavedAt(new Date().toLocaleTimeString());
    }, 400);
    return () => clearTimeout(t);
  }, [trip, readOnly]);

  const chain = useMemo(() => chainedEvents(trip), [trip]);
  const updateMeta = <K extends keyof Trip>(k: K, v: Trip[K]) =>
    setTrip((prev) => ({ ...prev, [k]: v }));

  const insertEvent = (newEv: ItineraryEvent, position: number) => {
    const before = chain.slice(0, position);
    const after = chain.slice(position);
    const reflowed = reflowChain([...before, newEv, ...after]);
    const otherEvents = trip.events.filter(
      (e) => !chain.some((c) => c.id === e.id)
    );
    setTrip({
      ...trip,
      events: [
        ...otherEvents,
        ...reflowed.map((r) => {
          const original = [...chain, newEv].find((c) => c.id === r.id)!;
          return { ...original, manualOrder: r.manualOrder };
        })
      ]
    });
  };

  const updateEvent = (next: ItineraryEvent) => {
    setTrip({
      ...trip,
      events: trip.events.map((e) => (e.id === next.id ? next : e))
    });
  };

  const removeEvent = (id: string) => {
    setTrip({ ...trip, events: trip.events.filter((e) => e.id !== id) });
  };

  const moveEvent = (id: string, direction: -1 | 1) => {
    const idx = chain.findIndex((e) => e.id === id);
    if (idx === -1) return;
    const target = idx + direction;
    if (target < 0 || target >= chain.length) return;
    const reordered = [...chain];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    const reflowed = reflowChain(reordered);
    const others = trip.events.filter((e) => !chain.some((c) => c.id === e.id));
    setTrip({
      ...trip,
      events: [
        ...others,
        ...reflowed.map((r) => {
          const original = chain.find((c) => c.id === r.id)!;
          return { ...original, manualOrder: r.manualOrder };
        })
      ]
    });
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
  };

  const pct = completionPercent(trip);
  const onChange = (next: Trip) => setTrip(next);

  return (
    <div className="space-y-4 pb-28">
      {/* Compact trip header */}
      <div className="rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
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
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs">
              <span className="font-semibold text-gold">{pct}%</span>
              <span className="ml-1 text-white/60">complete</span>
            </div>
            <div className="text-[10px] text-white/50">
              {savedAt ? `Saved ${savedAt}` : readOnly ? "Read-only" : "Editing…"}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow canvas */}
      <div className="relative rounded-2xl border border-white/15 bg-[radial-gradient(ellipse_at_top,_rgba(245,197,24,0.06),_transparent_60%),_rgba(0,0,0,0.5)] p-4 backdrop-blur-md sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Trip workflow</h2>
          <span className="text-xs text-white/50">{chain.length} {chain.length === 1 ? "step" : "steps"}</span>
        </div>

        <div className="flex flex-col items-center">
          {/* Start node */}
          <TriggerNode
            label="Trip Start"
            sub={trip.startDate ? formatDateLabel(trip.startDate) : "Pick a start date above"}
          />

          <Connector />
          <AddNodeButton
            disabled={readOnly}
            onClick={() => setPicker({ open: true, insertAt: 0 })}
          />

          {chain.length === 0 ? (
            <>
              <Connector />
              <button
                disabled={readOnly}
                onClick={() => setPicker({ open: true, insertAt: 0 })}
                className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-5 text-center text-sm text-white/70 transition hover:border-gold/40 hover:bg-gold/5 disabled:cursor-not-allowed"
              >
                <span className="block text-lg">⊕</span>
                <span className="block font-semibold">Pick your first event</span>
                <span className="block text-[11px] text-white/50">
                  Choose a match, a local watch party, or add your own
                </span>
              </button>
            </>
          ) : (
            chain.map((ev, i) => (
              <div key={ev.id} className="flex w-full flex-col items-center">
                <Connector />
                <EventNode
                  index={i + 1}
                  event={ev}
                  canMoveUp={i > 0}
                  canMoveDown={i < chain.length - 1}
                  readOnly={readOnly}
                  onClick={() => setEditing({ open: true, event: ev })}
                  onRemove={() => removeEvent(ev.id)}
                  onMoveUp={() => moveEvent(ev.id, -1)}
                  onMoveDown={() => moveEvent(ev.id, 1)}
                />
                <Connector />
                <AddNodeButton
                  disabled={readOnly}
                  onClick={() => setPicker({ open: true, insertAt: i + 1 })}
                />
              </div>
            ))
          )}

          <Connector />
          <TerminatorNode
            label="Trip End"
            sub={trip.endDate ? formatDateLabel(trip.endDate) : "Pick an end date above"}
          />
        </div>
      </div>

      {/* Optional details */}
      <div className="rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md">
        <button
          onClick={() => setDetailsOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span className="text-sm font-semibold">Trip details</span>
          <span className="flex items-center gap-2 text-xs text-white/60">
            Transport · Stays · Budget · Packing
            <svg
              className={["h-4 w-4 transition-transform", detailsOpen ? "rotate-180" : ""].join(" ")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        {detailsOpen && (
          <div className="space-y-3 border-t border-white/10 px-3 py-3 sm:px-4">
            <WorkflowCard
              step={1}
              title="Transportation"
              subtitle="Flights, rentals, rideshares"
              done={trip.transport.length > 0}
              badge={trip.transport.length > 0 ? <span className="badge">{trip.transport.length} legs</span> : null}
            >
              <TransportationSection trip={trip} onChange={onChange} />
            </WorkflowCard>
            <WorkflowCard
              step={2}
              title="Accommodations"
              subtitle="Where you're staying"
              done={trip.stays.length > 0}
              badge={trip.stays.length > 0 ? <span className="badge">{trip.stays.length} stays</span> : null}
            >
              <AccommodationsSection trip={trip} onChange={onChange} />
            </WorkflowCard>
            <WorkflowCard
              step={3}
              title="Budget Tracker"
              subtitle="Optional"
              done={trip.budget.cap > 0}
              badge={trip.budget.cap > 0 ? <span className="badge">{trip.budget.currency} {trip.budget.cap}</span> : null}
            >
              <BudgetSection trip={trip} onChange={onChange} />
            </WorkflowCard>
            <WorkflowCard
              step={4}
              title="Packing List"
              subtitle="Don't forget anything"
              done={trip.packing.some((p) => p.checked)}
              badge={trip.packing.length > 0 ? <span className="badge">{trip.packing.filter((p) => p.checked).length}/{trip.packing.length}</span> : null}
            >
              <PackingListSection trip={trip} onChange={onChange} />
            </WorkflowCard>
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      {!readOnly && (
        <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-navy-950/85 px-4 py-3 backdrop-blur-lg sm:-mx-0 sm:rounded-2xl sm:border sm:border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-white/60">
              {chain.length > 0 ? `${chain.length} ${chain.length === 1 ? "node" : "nodes"} in workflow` : "Empty workflow"}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShareOpen(true)} className="btn-secondary">Share</button>
              <button onClick={handleExportPdf} className="btn-primary">Export PDF</button>
              <Link href={`/itinerary/${trip.id}/print`} className="btn-ghost">Print</Link>
            </div>
          </div>
        </div>
      )}

      {/* Picker sheet */}
      <BottomSheet
        open={picker.open}
        onClose={() => setPicker({ open: false, insertAt: 0 })}
        title={picker.insertAt === 0 ? "Pick the first event" : `Add event #${picker.insertAt + 1}`}
      >
        <EventPicker
          defaultDate={trip.startDate}
          onAdd={(ev) => {
            insertEvent(ev, picker.insertAt);
            setPicker({ open: false, insertAt: 0 });
          }}
          onClose={() => setPicker({ open: false, insertAt: 0 })}
        />
      </BottomSheet>

      {/* Edit sheet */}
      <BottomSheet
        open={editing.open}
        onClose={() => setEditing({ open: false, event: null })}
        title="Edit node"
      >
        {editing.event && (
          <NodeEditor
            event={editing.event}
            onSave={(next) => {
              updateEvent(next);
              setEditing({ open: false, event: null });
            }}
            onDelete={() => {
              if (editing.event) removeEvent(editing.event.id);
              setEditing({ open: false, event: null });
            }}
            onCancel={() => setEditing({ open: false, event: null })}
          />
        )}
      </BottomSheet>

      <ShareSheet
        trip={trip}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onUpdate={(t) => setTrip(t)}
      />
    </div>
  );
}

function Connector() {
  return (
    <div className="relative my-1 h-6 w-px">
      <div className="absolute inset-0 border-l-2 border-dashed border-white/25" />
    </div>
  );
}

function TriggerNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 shadow-[0_0_0_1px_rgba(52,211,153,0.15)]">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald-400/20 text-lg" aria-hidden>
        ▶
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Trigger</div>
        <div className="truncate text-sm font-semibold">{label}</div>
        <div className="truncate text-xs text-white/60">{sub}</div>
      </div>
    </div>
  );
}

function TerminatorNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/10 text-lg" aria-hidden>
        ■
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Finish</div>
        <div className="truncate text-sm font-semibold">{label}</div>
        <div className="truncate text-xs text-white/60">{sub}</div>
      </div>
    </div>
  );
}

function AddNodeButton({
  onClick,
  disabled
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed",
        disabled
          ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
          : "border-gold/50 bg-navy-950 text-gold transition hover:border-gold hover:bg-gold hover:text-navy-950"
      ].join(" ")}
      aria-label="Add event"
      title="Add event"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function EventNode({
  index,
  event,
  canMoveUp,
  canMoveDown,
  readOnly,
  onClick,
  onRemove,
  onMoveUp,
  onMoveDown
}: {
  index: number;
  event: ItineraryEvent;
  canMoveUp: boolean;
  canMoveDown: boolean;
  readOnly: boolean;
  onClick: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const color = event.color ?? categoryColor(event.category);
  const sourceLabel =
    event.source?.type === "match"
      ? "Match"
      : event.source?.type === "event"
      ? "Local"
      : "Custom";
  const sourceIcon =
    event.source?.type === "match" ? "⚽" : event.source?.type === "event" ? "🎉" : "✦";

  return (
    <div className="group relative w-full max-w-md">
      <div
        className="flex items-stretch overflow-hidden rounded-2xl border bg-black/60 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)] transition hover:border-white/30"
        style={{ borderColor: color + "55" }}
      >
        <div className="w-1.5 flex-none" style={{ backgroundColor: color }} aria-hidden />
        <button onClick={onClick} className="flex flex-1 items-center gap-3 px-3 py-3 text-left">
          <span
            className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-xl"
            style={{ backgroundColor: color + "20", color }}
            aria-hidden
          >
            {sourceIcon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-white/50">
              <span>Step {index}</span>
              <span>·</span>
              <span style={{ color }}>{categoryLabel(event.category)}</span>
              <span className="badge ml-auto">{sourceLabel}</span>
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-white">
              {event.title || "Untitled event"}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-white/60">
              <span>{formatDateShort(event.date)}</span>
              {event.startTime && (
                <span>
                  {event.startTime}
                  {event.endTime ? ` – ${event.endTime}` : ""}
                </span>
              )}
              {event.location && <span className="truncate">📍 {event.location}</span>}
            </span>
          </span>
        </button>
        {!readOnly && (
          <div className="flex flex-col border-l border-white/10">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="flex h-1/3 w-9 items-center justify-center text-white/50 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move up"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="flex h-1/3 w-9 items-center justify-center border-y border-white/10 text-white/50 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move down"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={onRemove}
              className="flex h-1/3 w-9 items-center justify-center text-red-accent transition hover:bg-red-accent/10"
              aria-label="Remove"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NodeEditor({
  event,
  onSave,
  onCancel,
  onDelete
}: {
  event: ItineraryEvent;
  onSave: (e: ItineraryEvent) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<ItineraryEvent>(event);
  const set = <K extends keyof ItineraryEvent>(k: K, v: ItineraryEvent[K]) =>
    setDraft({ ...draft, [k]: v });

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Title</span>
        <input className="input-base" value={draft.title} onChange={(e) => set("title", e.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Date</span>
          <input type="date" className="input-base" value={draft.date} onChange={(e) => set("date", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Start</span>
          <input type="time" className="input-base" value={draft.startTime ?? ""} onChange={(e) => set("startTime", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">End</span>
          <input type="time" className="input-base" value={draft.endTime ?? ""} onChange={(e) => set("endTime", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Color</span>
          <input
            type="color"
            className="h-10 w-full rounded-xl border border-white/15 bg-black/40"
            value={draft.color ?? categoryColor(draft.category)}
            onChange={(e) => set("color", e.target.value)}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Location</span>
        <input className="input-base" value={draft.location ?? ""} onChange={(e) => set("location", e.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Notes</span>
        <textarea rows={3} className="input-base" value={draft.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Attendees (comma separated)</span>
        <input
          className="input-base"
          value={draft.attendees.join(", ")}
          onChange={(e) =>
            set("attendees", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
          }
        />
      </label>
      <div className="flex items-center justify-between gap-2 pt-2">
        <button onClick={onDelete} className="rounded-full px-3 py-2 text-xs font-semibold text-red-accent hover:bg-red-accent/10">
          Delete node
        </button>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button onClick={() => onSave(draft)} className="btn-primary" disabled={!draft.title.trim()}>Save</button>
        </div>
      </div>
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
      collaborators: [
        ...trip.collaborators.filter((c) => c.email !== email.trim()),
        { email: email.trim(), role }
      ]
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
              <button onClick={() => navigator.clipboard?.writeText(shareUrl)} className="btn-secondary">Copy</button>
            </div>
          ) : (
            <button onClick={ensure} className="btn-secondary w-full">Generate link</button>
          )}
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">Invite collaborators</h4>
          <div className="grid grid-cols-3 gap-2">
            <input className="input-base col-span-2" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="input-base" value={role} onChange={(e) => setRole(e.target.value as "edit" | "view")}>
              <option value="edit">Edit</option>
              <option value="view">View</option>
            </select>
          </div>
          <button onClick={invite} className="btn-primary mt-2 w-full">Send invite</button>
          {trip.collaborators.length > 0 && (
            <ul className="mt-3 space-y-1">
              {trip.collaborators.map((c) => (
                <li key={c.email} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <span className="truncate">{c.email}</span>
                  <span className="flex items-center gap-2">
                    <span className="badge">{c.role}</span>
                    <button onClick={() => remove(c.email)} className="text-xs text-red-accent">Remove</button>
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
