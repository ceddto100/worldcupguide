"use client";

import { useState } from "react";

export function WorkflowCard({
  step,
  title,
  subtitle,
  done,
  defaultOpen = false,
  badge,
  children,
  cta
}: {
  step: number;
  title: string;
  subtitle?: string;
  done?: boolean;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
  cta?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section
      className={[
        "rounded-2xl border bg-black/50 backdrop-blur-md transition",
        done
          ? "border-gold/40 shadow-[0_0_0_1px_rgba(245,197,24,0.15)]"
          : "border-white/15"
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left"
        aria-expanded={open}
      >
        <span
          className={[
            "flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold",
            done
              ? "bg-gold text-navy-950"
              : "border border-white/20 bg-white/5 text-white"
          ].join(" ")}
          aria-hidden
        >
          {done ? "✓" : step}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-white/60">{subtitle}</p>
          )}
        </div>
        <svg
          className={["h-5 w-5 flex-none text-white/60 transition-transform", open ? "rotate-180" : ""].join(" ")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={[
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-4 py-4 sm:px-5">{children}</div>
          {cta && (
            <div className="border-t border-white/10 bg-black/30 px-4 py-3 sm:px-5">{cta}</div>
          )}
        </div>
      </div>
    </section>
  );
}
