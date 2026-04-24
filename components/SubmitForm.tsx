"use client";

import { useState } from "react";
import type { SubmissionFormData } from "@/lib/types";

const initial: SubmissionFormData = {
  name: "",
  email: "",
  phone: "",
  entityName: "",
  submissionType: "business",
  category: "",
  neighborhood: "",
  eventDate: "",
  eventTime: "",
  website: "",
  description: "",
  specialOffer: "",
  familyFriendly: false,
  interestedInFeatured: false,
  message: ""
};

type Status = "idle" | "submitting" | "success" | "error";

export function SubmitForm() {
  const [form, setForm] = useState<SubmissionFormData>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof SubmissionFormData>(key: K, value: SubmissionFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      setForm(initial);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isEvent = form.submissionType === "event";

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            required
            className="input-base"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>
        <Field label="Email" required>
          <input
            required
            type="email"
            className="input-base"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            className="input-base"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </Field>
        <Field label="Business or event name" required>
          <input
            required
            className="input-base"
            value={form.entityName}
            onChange={(e) => update("entityName", e.target.value)}
          />
        </Field>
        <Field label="Submission type" required>
          <select
            className="input-base"
            value={form.submissionType}
            onChange={(e) => update("submissionType", e.target.value as "business" | "event")}
          >
            <option value="business" className="bg-navy-900">Business listing</option>
            <option value="event" className="bg-navy-900">Event listing</option>
          </select>
        </Field>
        <Field label="Category" required>
          <input
            required
            placeholder={isEvent ? "Watch Party, Food, Music..." : "Restaurant, Bar, Hotel..."}
            className="input-base"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
        </Field>
        <Field label="Neighborhood">
          <input
            className="input-base"
            placeholder="Downtown, Midtown, Old Fourth Ward..."
            value={form.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value)}
          />
        </Field>
        <Field label="Website or social link">
          <input
            className="input-base"
            placeholder="https://"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </Field>

        {isEvent && (
          <>
            <Field label="Event date">
              <input
                type="date"
                className="input-base"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
              />
            </Field>
            <Field label="Event time">
              <input
                type="time"
                className="input-base"
                value={form.eventTime}
                onChange={(e) => update("eventTime", e.target.value)}
              />
            </Field>
          </>
        )}
      </div>

      <Field label="Description" required>
        <textarea
          required
          className="input-base min-h-[120px]"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </Field>

      <Field label="Special offer for fans (optional)">
        <input
          className="input-base"
          placeholder="10% off with a matchday ticket stub"
          value={form.specialOffer}
          onChange={(e) => update("specialOffer", e.target.value)}
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        <Checkbox
          label="Family-friendly"
          checked={form.familyFriendly}
          onChange={(v) => update("familyFriendly", v)}
        />
        <Checkbox
          label="Interested in featured placement"
          checked={form.interestedInFeatured}
          onChange={(v) => update("interestedInFeatured", v)}
        />
      </div>

      <Field label="Anything else?">
        <textarea
          className="input-base min-h-[80px]"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/50">
          By submitting you agree to be contacted by CodeByCed about your listing.
        </p>
        <button type="submit" className="btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </div>

      {status === "success" && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
          Thanks — your submission is in. We&apos;ll be in touch within 48 hours.
        </div>
      )}
      {status === "error" && (
        <div className="rounded-xl border border-red-accent/40 bg-red-accent/10 p-4 text-sm text-red-accent">
          {error ?? "Something went wrong. Please try again."}
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-white/50">
        {label}
        {required && <span className="ml-1 text-red-accent">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-white/80">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-white/20 bg-navy-900 text-gold focus:ring-gold"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
