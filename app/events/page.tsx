"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { EventCard } from "@/components/EventCard";
import { FilterBar } from "@/components/FilterBar";
import { events } from "@/lib/data/events";

const ALL = "all";

export default function EventsPage() {
  const [category, setCategory] = useState(ALL);
  const [neighborhood, setNeighborhood] = useState(ALL);
  const [pricing, setPricing] = useState(ALL);
  const [family, setFamily] = useState(ALL);

  const categories = Array.from(new Set(events.map((e) => e.category)));
  const neighborhoods = Array.from(new Set(events.map((e) => e.neighborhood)));

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (category !== ALL && e.category !== category) return false;
      if (neighborhood !== ALL && e.neighborhood !== neighborhood) return false;
      if (pricing === "free" && !e.isFree) return false;
      if (pricing === "paid" && e.isFree) return false;
      if (family === "yes" && !e.isFamilyFriendly) return false;
      return true;
    });
  }, [category, neighborhood, pricing, family]);

  return (
    <section className="section-spacing">
      <div className="container-page">
        <SectionHeader
          eyebrow="Events"
          title="Browse World Cup events in Atlanta"
          description="Watch parties, food events, family zones, meetups, and nightlife during the tournament."
        />

        <FilterBar
          groups={[
            {
              id: "category",
              label: "Category",
              value: category,
              onChange: setCategory,
              options: [
                { label: "All categories", value: ALL },
                ...categories.map((c) => ({ label: c, value: c }))
              ]
            },
            {
              id: "neighborhood",
              label: "Neighborhood",
              value: neighborhood,
              onChange: setNeighborhood,
              options: [
                { label: "All neighborhoods", value: ALL },
                ...neighborhoods.map((n) => ({ label: n, value: n }))
              ]
            },
            {
              id: "pricing",
              label: "Pricing",
              value: pricing,
              onChange: setPricing,
              options: [
                { label: "Any", value: ALL },
                { label: "Free", value: "free" },
                { label: "Paid", value: "paid" }
              ]
            },
            {
              id: "family",
              label: "Family-friendly",
              value: family,
              onChange: setFamily,
              options: [
                { label: "Any", value: ALL },
                { label: "Family-friendly", value: "yes" }
              ]
            }
          ]}
        />

        <p className="mt-4 text-sm text-white/60">
          Showing {filtered.length} of {events.length} events
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card mt-6 text-center text-sm text-white/70">
            No events match your filters yet. Try loosening a filter or{" "}
            <a href="/submit" className="text-gold underline">submit an event</a>.
          </div>
        )}
      </div>
    </section>
  );
}
