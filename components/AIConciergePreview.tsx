"use client";

import { useState } from "react";

const sampleQuestions = [
  "Where can I watch the match tonight?",
  "What restaurants are near Centennial Olympic Park?",
  "How do I get to Mercedes-Benz Stadium using MARTA?",
  "What family-friendly events are happening today?",
  "Where can fans hang out after the game?"
];

export function AIConciergePreview() {
  const [value, setValue] = useState("");

  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/70 p-6 sm:p-10">
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-red-accent/15 blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-8 md:grid-cols-2">
            <div>
              <span className="badge-gold">Coming Soon</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Meet <span className="text-gold">Ask ATL Matchday</span>
              </h2>
              <p className="mt-3 text-white/75">
                Your pocket concierge for the tournament. Ask anything about matches, food, transit, or late-night
                plans and get answers grounded in local listings on this guide.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>&bull; Grounded in our Atlanta business and event directory</li>
                <li>&bull; Multilingual support planned for visiting fans</li>
                <li>&bull; Businesses can embed their own branded concierge</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-5">
              <p className="text-xs uppercase tracking-wider text-white/50">Try a sample question</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sampleQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setValue(q)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:border-gold/40 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form
                className="mt-5 flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Placeholder: wire to /api/concierge + Claude API later.
                }}
              >
                <input
                  className="input-base"
                  placeholder="Ask about matches, food, MARTA, events..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled
                />
                <button type="submit" className="btn-primary" disabled>
                  Preview only &mdash; live soon
                </button>
              </form>
              <p className="mt-2 text-xs text-white/40">
                This preview is UI only. It will connect to Claude once the API key is configured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
