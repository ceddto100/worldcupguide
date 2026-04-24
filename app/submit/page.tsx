import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { SubmitForm } from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit Your Business or Event — World Cup ATL Guide",
  description:
    "Get your Atlanta business, pop-up, watch party, or matchday event listed on Atlanta's independent World Cup 2026 guide.",
  keywords: ["submit business", "list event", "Atlanta World Cup", "free listing", "featured listing"]
};

export default function SubmitPage() {
  return (
    <section className="section-spacing">
      <div className="container-page max-w-3xl">
        <SectionHeader
          eyebrow="Get Listed"
          title="Submit your business or event"
          description="Tell us about your business, watch party, or matchday event. We'll review and add it to the guide — usually within 48 hours."
        />
        <SubmitForm />
      </div>
    </section>
  );
}
