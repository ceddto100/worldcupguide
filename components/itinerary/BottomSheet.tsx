"use client";

import { useEffect } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none"
      ].join(" ")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0"
        ].join(" ")}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          "absolute inset-x-0 bottom-0 mx-auto max-w-2xl rounded-t-3xl border border-white/15 bg-navy-900/95 shadow-2xl backdrop-blur-xl",
          "transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full"
        ].join(" ")}
        style={{ maxHeight: "92vh" }}
      >
        <div className="flex items-center justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-white/20" aria-hidden />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-5" style={{ maxHeight: "70vh" }}>
          {children}
        </div>
        {footer && (
          <div className="border-t border-white/10 bg-black/30 px-5 py-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
