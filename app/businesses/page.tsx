"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { BusinessCard } from "@/components/BusinessCard";
import { FilterBar } from "@/components/FilterBar";
import { businesses } from "@/lib/data/businesses";

const ALL = "all";

export default function BusinessesPage() {
  const [type, setType] = useState(ALL);
  const [neighborhood, setNeighborhood] = useState(ALL);
  const [featured, setFeatured] = useState(ALL);

  const types = Array.from(new Set(businesses.map((b) => b.type)));
  const neighborhoods = Array.from(new Set(businesses.map((b) => b.neighborhood)));

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (type !== ALL && b.type !== type) return false;
      if (neighborhood !== ALL && b.neighborhood !== neighborhood) return false;
      if (featured === "yes" && !b.isFeatured) return false;
      return true;
    });
  }, [type, neighborhood, featured]);

  const featuredBusinesses = filtered.filter((b) => b.isFeatured);
  const regularBusinesses = filtered.filter((b) => !b.isFeatured);

  return (
    <section className="section-spacing">
      <div className="container-page">
        <SectionHeader
          eyebrow="Directory"
          title="Atlanta business directory"
          description="Independent restaurants, bars, lounges, hotels, hosts, and experiences worth knowing during the tournament."
        />

        <FilterBar
          groups={[
            {
              id: "type",
              label: "Type",
              value: type,
              onChange: setType,
              options: [{ label: "All types", value: ALL }, ...types.map((t) => ({ label: t, value: t }))]
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
              id: "featured",
              label: "Featured",
              value: featured,
              onChange: setFeatured,
              options: [
                { label: "All", value: ALL },
                { label: "Featured only", value: "yes" }
              ]
            }
          ]}
        />

        {featuredBusinesses.length > 0 && (
          <>
            <h3 className="mt-10 text-sm uppercase tracking-wider text-white/50">Featured</h3>
            <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBusinesses.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          </>
        )}

        {regularBusinesses.length > 0 && (
          <>
            <h3 className="mt-10 text-sm uppercase tracking-wider text-white/50">All listings</h3>
            <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {regularBusinesses.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="card mt-8 text-center text-sm text-white/70">
            No businesses match your filters.{" "}
            <a href="/submit" className="text-gold underline">Submit yours</a>.
          </div>
        )}
      </div>
    </section>
  );
}
