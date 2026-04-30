"use client";

import { useMemo, useState } from "react";
import { events as catalogEvents } from "@/lib/data/events";
import { matches as catalogMatches } from "@/lib/data/matches";
import type { ItineraryEvent, EventCategory } from "@/lib/itinerary/types";
import {
  categoryColor,
  categoryLabel,
  parseTime12h,
  parseUSDate,
  uid
} from "@/lib/itinerary/utils";

type Tab = "match" | "event" | "custom";

const CATEGORIES: EventCategory[] = ["meal", "activity", "transport", "free", "ceremony"];

function eventCategoryFromCatalog(c: string): EventCategory {
  if (c === "Food") return "meal";
  if (c === "Nightlife" || c === "Music" || c === "Watch Party" || c === "Soccer Meetup")
    return "activity";
  if (c === "Family" || c === "Culture") return "free";
  return "activity";
}

export function EventPicker({
  defaultDate,
  onAdd,
  onClose
}: {
  defaultDate?: string;
  onAdd: (ev: ItineraryEvent) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("match");
  const [query, setQuery] = useState("");

  const matchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogMatches.filter(
      (m) =>
        !q ||
        m.teamA.toLowerCase().includes(q) ||
        m.teamB.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q) ||
        m.stage.toLowerCase().includes(q)
    );
  }, [query]);

  const eventResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogEvents.filter(
      (e) =>
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.neighborhood.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const addMatch = (id: string) => {
    const m = catalogMatches.find((x) => x.id === id);
    if (!m) return;
    onAdd({
      id: uid("ev-"),
      date: parseUSDate(m.date) ?? defaultDate ?? new Date().toISOString().slice(0, 10),
      startTime: parseTime12h(m.time),
      title: `${m.teamA} vs ${m.teamB}`,
      location: m.venue,
      category: "ceremony",
      color: categoryColor("ceremony"),
      attendees: [],
      notes: `${m.stage}${m.isAtlanta ? " — Atlanta" : ""}`,
      source: { type: "match", refId: m.id, refSlug: m.slug }
    });
  };

  const addCatalogEvent = (id: string) => {
    const ev = catalogEvents.find((x) => x.id === id);
    if (!ev) return;
    const cat = eventCategoryFromCatalog(ev.category);
    onAdd({
      id: uid("ev-"),
      date: parseUSDate(ev.date) ?? defaultDate ?? new Date().toISOString().slice(0, 10),
      startTime: parseTime12h(ev.time),
      title: ev.title,
      location: ev.location,
      category: cat,
      color: categoryColor(cat),
      attendees: [],
      notes: `${ev.category} • ${ev.neighborhood}${ev.isFree ? " • Free" : ""}`,
      source: { type: "event", refId: ev.id, refSlug: ev.slug }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs">
        <TabButton active={tab === "match"} onClick={() => setTab("match")}>
          ⚽ Matches
        </TabButton>
        <TabButton active={tab === "event"} onClick={() => setTab("event")}>
          🎉 Local events
        </TabButton>
        <TabButton active={tab === "custom"} onClick={() => setTab("custom")}>
          ✦ Custom
        </TabButton>
      </div>

      {tab !== "custom" && (
        <input
          autoFocus
          className="input-base"
          placeholder={tab === "match" ? "Search teams, venues, stage..." : "Search events, tags, neighborhoods..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {tab === "match" && (
        <ul className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {matchResults.length === 0 && (
            <li className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-white/60">
              No matches found.
            </li>
          )}
          {matchResults.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => addMatch(m.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-gold/40 hover:bg-white/10"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red-accent/15 text-lg" aria-hidden>
                  ⚽
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {m.teamA} vs {m.teamB}
                  </span>
                  <span className="block truncate text-[11px] text-white/60">
                    {m.stage} · {m.date} · {m.time}
                  </span>
                  <span className="block truncate text-[11px] text-white/50">📍 {m.venue}</span>
                </span>
                {m.isAtlanta && <span className="badge-gold flex-none">ATL</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {tab === "event" && (
        <ul className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {eventResults.length === 0 && (
            <li className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-sm text-white/60">
              No events found.
            </li>
          )}
          {eventResults.map((ev) => {
            const cat = eventCategoryFromCatalog(ev.category);
            return (
              <li key={ev.id}>
                <button
                  onClick={() => addCatalogEvent(ev.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-gold/40 hover:bg-white/10"
                >
                  <span
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-lg"
                    style={{
                      backgroundColor: categoryColor(cat) + "20",
                      color: categoryColor(cat)
                    }}
                    aria-hidden
                  >
                    {ev.isFree ? "★" : "✦"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{ev.title}</span>
                    <span className="block truncate text-[11px] text-white/60">
                      {ev.category} · {ev.date} · {ev.time}
                    </span>
                    <span className="block truncate text-[11px] text-white/50">📍 {ev.location}</span>
                  </span>
                  {ev.isFree && <span className="badge flex-none">Free</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "custom" && (
        <CustomForm defaultDate={defaultDate} onSubmit={onAdd} onCancel={onClose} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-1 rounded-full px-3 py-1.5 font-semibold transition",
        active ? "bg-gold text-navy-950" : "text-white/70 hover:bg-white/10"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function CustomForm({
  defaultDate,
  onSubmit,
  onCancel
}: {
  defaultDate?: string;
  onSubmit: (ev: ItineraryEvent) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("activity");

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({
      id: uid("ev-"),
      date,
      startTime: startTime || undefined,
      title: title.trim(),
      location: location.trim() || undefined,
      category,
      color: categoryColor(category),
      attendees: [],
      source: { type: "custom" }
    });
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Title</span>
        <input className="input-base" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brunch at Café Rouge" />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Date</span>
          <input type="date" className="input-base" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Start time</span>
          <input type="time" className="input-base" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Location</span>
        <input className="input-base" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="123 Peachtree St" />
      </label>
      <div>
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-white/60">Category</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c;
            const color = categoryColor(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active ? "" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                ].join(" ")}
                style={active ? { borderColor: color + "99", backgroundColor: color + "20", color } : undefined}
              >
                {categoryLabel(c)}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="btn-ghost">Cancel</button>
        <button onClick={submit} disabled={!title.trim()} className="btn-primary">Add to workflow</button>
      </div>
    </div>
  );
}
