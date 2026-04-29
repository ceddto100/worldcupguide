"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EventCategory, ItineraryEvent, Trip } from "@/lib/itinerary/types";
import {
  categoryColor,
  categoryLabel,
  formatDateLabel,
  formatDateShort,
  sortedEventsForDay,
  tripDays,
  uid
} from "@/lib/itinerary/utils";
import { BottomSheet } from "../BottomSheet";

const CATEGORIES: EventCategory[] = ["meal", "activity", "transport", "free", "ceremony"];

export function EventSchedulerSection({
  trip,
  onChange
}: {
  trip: Trip;
  onChange: (next: Trip) => void;
}) {
  const days = useMemo(() => tripDays(trip), [trip]);
  const fallback = trip.events[0]?.date ?? new Date().toISOString().slice(0, 10);
  const [activeDay, setActiveDay] = useState<string>(days[0] ?? fallback);
  const [editing, setEditing] = useState<ItineraryEvent | null>(null);

  useEffect(() => {
    if (days.length && !days.includes(activeDay)) setActiveDay(days[0]);
  }, [days, activeDay]);

  const dayEvents = useMemo(
    () => sortedEventsForDay(trip, activeDay),
    [trip, activeDay]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = dayEvents.map((d) => d.id);
    const from = ids.indexOf(active.id as string);
    const to = ids.indexOf(over.id as string);
    if (from === -1 || to === -1) return;
    const reordered = arrayMove(dayEvents, from, to);
    const reorderedWithIndex = reordered.map((ev, i) => ({ ...ev, manualOrder: i }));
    const others = trip.events.filter((e) => e.date !== activeDay);
    onChange({ ...trip, events: [...others, ...reorderedWithIndex] });
  };

  const startNew = () => {
    setEditing({
      id: uid("ev-"),
      date: activeDay,
      title: "",
      category: "activity",
      attendees: [],
      color: categoryColor("activity")
    });
  };

  const saveEvent = (ev: ItineraryEvent) => {
    const exists = trip.events.some((e) => e.id === ev.id);
    const next = exists
      ? trip.events.map((e) => (e.id === ev.id ? ev : e))
      : [...trip.events, ev];
    onChange({ ...trip, events: next });
    setEditing(null);
  };

  const removeEvent = (id: string) => {
    onChange({ ...trip, events: trip.events.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/70">
        Build your day. Long-press a card on mobile to drag it. Events sort by time but you can override.
      </p>

      {!trip.startDate || !trip.endDate ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-xs text-white/60">
          Set trip dates above to populate the day strip. You can still add events; they'll attach to today's date.
        </div>
      ) : (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {days.map((d, i) => {
            const active = d === activeDay;
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={[
                  "flex flex-none flex-col items-center rounded-2xl border px-3 py-2 transition",
                  active
                    ? "border-gold/70 bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                ].join(" ")}
              >
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                  Day {i + 1}
                </span>
                <span className="text-sm font-semibold">{formatDateShort(d)}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold">{formatDateLabel(activeDay)}</h4>
          <span className="text-xs text-white/50">{dayEvents.length} events</span>
        </div>

        {dayEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-white/60">
            No events yet. Tap + to add the first one.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={dayEvents.map((d) => d.id)} strategy={verticalListSortingStrategy}>
              <ul className="relative space-y-2">
                {dayEvents.map((ev) => (
                  <SortableEventCard
                    key={ev.id}
                    event={ev}
                    onEdit={() => setEditing(ev)}
                    onRemove={() => removeEvent(ev.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <button
        type="button"
        onClick={startNew}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl font-bold text-navy-950 shadow-xl shadow-gold/40 transition hover:bg-gold-soft sm:bottom-8 sm:right-8"
        aria-label="Add event"
      >
        +
      </button>

      <BottomSheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing && trip.events.some((e) => e.id === editing.id) ? "Edit event" : "New event"}
      >
        {editing && (
          <EventForm
            event={editing}
            days={days.length ? days : [activeDay]}
            onCancel={() => setEditing(null)}
            onSave={saveEvent}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function SortableEventCard({
  event,
  onEdit,
  onRemove
}: {
  event: ItineraryEvent;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: event.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 280ms cubic-bezier(0.2, 1.2, 0.4, 1)",
    zIndex: isDragging ? 30 : "auto"
  } as React.CSSProperties;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={[
        "group flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm",
        isDragging ? "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] ring-1 ring-gold/40" : ""
      ].join(" ")}
    >
      <div
        className="w-1.5 flex-none"
        style={{ backgroundColor: event.color ?? categoryColor(event.category) }}
        aria-hidden
      />
      <button
        {...attributes}
        {...listeners}
        className="flex flex-none cursor-grab items-center justify-center px-2 text-white/40 hover:text-white/80 active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>
      <button
        onClick={onEdit}
        className="flex-1 px-3 py-3 text-left"
      >
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span
            className="badge"
            style={{
              borderColor: (event.color ?? categoryColor(event.category)) + "60",
              color: event.color ?? categoryColor(event.category)
            }}
          >
            {categoryLabel(event.category)}
          </span>
          {event.startTime && (
            <span className="font-semibold text-white">
              {event.startTime}
              {event.endTime ? ` – ${event.endTime}` : ""}
            </span>
          )}
        </div>
        <div className="mt-1 truncate text-sm font-semibold">
          {event.title || "Untitled event"}
        </div>
        {event.location && (
          <div className="mt-0.5 truncate text-xs text-white/60">📍 {event.location}</div>
        )}
        {event.attendees.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {event.attendees.map((a) => (
              <span key={a} className="badge text-[10px]">@ {a}</span>
            ))}
          </div>
        )}
      </button>
      <button
        onClick={onRemove}
        className="flex-none px-3 text-xs font-medium text-red-accent opacity-0 transition group-hover:opacity-100"
        aria-label="Delete event"
      >
        ✕
      </button>
    </li>
  );
}

function EventForm({
  event,
  days,
  onCancel,
  onSave
}: {
  event: ItineraryEvent;
  days: string[];
  onCancel: () => void;
  onSave: (e: ItineraryEvent) => void;
}) {
  const [draft, setDraft] = useState<ItineraryEvent>(event);
  const set = <K extends keyof ItineraryEvent>(k: K, v: ItineraryEvent[K]) =>
    setDraft({ ...draft, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Title">
        <input
          className="input-base"
          value={draft.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Brunch at Café Rouge"
          autoFocus
        />
      </Field>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = draft.category === c;
            const color = categoryColor(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  set("category", c);
                  set("color", color);
                }}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active ? "" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                ].join(" ")}
                style={
                  active
                    ? { borderColor: color + "99", backgroundColor: color + "20", color }
                    : undefined
                }
              >
                {categoryLabel(c)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Day" full>
          <select
            className="input-base"
            value={draft.date}
            onChange={(e) => set("date", e.target.value)}
          >
            {(days.includes(draft.date) ? days : [...days, draft.date]).map((d) => (
              <option key={d} value={d}>
                {formatDateLabel(d)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Start time">
          <input
            type="time"
            className="input-base"
            value={draft.startTime ?? ""}
            onChange={(e) => set("startTime", e.target.value)}
          />
        </Field>
        <Field label="End time">
          <input
            type="time"
            className="input-base"
            value={draft.endTime ?? ""}
            onChange={(e) => set("endTime", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Location">
        <input
          className="input-base"
          value={draft.location ?? ""}
          onChange={(e) => set("location", e.target.value)}
          placeholder="123 Peachtree St, Atlanta"
        />
      </Field>

      <Field label="Color">
        <input
          type="color"
          className="h-10 w-full rounded-xl border border-white/15 bg-black/40"
          value={draft.color ?? categoryColor(draft.category)}
          onChange={(e) => set("color", e.target.value)}
        />
      </Field>

      <Field label="Notes">
        <textarea
          rows={2}
          className="input-base"
          value={draft.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
        />
      </Field>

      <Field label="Attendees (comma separated)">
        <input
          className="input-base"
          value={draft.attendees.join(", ")}
          onChange={(e) =>
            set(
              "attendees",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder="Alex, Sam"
        />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button
          onClick={() => onSave({ ...draft, manualOrder: undefined })}
          className="btn-primary"
          disabled={!draft.title.trim()}
        >
          Save event
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  full,
  children
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={["block", full ? "col-span-2" : ""].join(" ")}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
