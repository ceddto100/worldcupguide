import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { PricingCard } from "@/components/PricingCard";
import { CTASection } from "@/components/CTASection";
import { servicePackages } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services for Atlanta Businesses — World Cup ATL Guide",
  description:
    "Affordable World Cup marketing for Atlanta restaurants, bars, hotels, hosts, and experiences — listings, QR landing pages, AI chatbots, and Make.com automations.",
  keywords: ["Atlanta marketing", "QR landing page", "AI chatbot", "small business", "World Cup marketing"]
};

const offerings = [
  "World Cup landing page",
  "QR code menu or offer page",
  "Featured listing on the guide",
  "Event promo page",
  "AI FAQ chatbot",
  "Google Business Profile optimization",
  "Social media content package",
  "Email / SMS capture setup",
  "Reservation or booking form",
  "Automated lead capture workflow",
  "Make.com automation setup",
  "Basic website updates"
];

export default function BusinessServicesPage() {
  return (
    <>
      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="For Business Owners"
            title="Capitalize on the biggest soccer summer Atlanta has seen"
            description="You don't need a huge marketing budget to win during the tournament. Here's what I build for local businesses — simple, fast, and designed to convert visitors into customers."
          />

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-navy-800/60 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o) => (
              <div key={o} className="flex items-start gap-3 text-sm text-white/85">
                <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-gold" aria-hidden />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-page">
          <SectionHeader
            eyebrow="Packages"
            title="Starter pricing (placeholders)"
            description="Clear, fixed-price starter packages. Custom scopes available — these prices are intentionally simple and easy to update."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicePackages.map((p) => (
              <PricingCard key={p.id} pkg={p} />
            ))}
          </div>
          <p className="mt-6 text-xs text-white/50">
            Prices shown are placeholders and may change based on scope. Contact us through the submission form for a
            custom quote.
          </p>
        </div>
      </section>

      <CTASection
        eyebrow="Ready to launch?"
        title="Tell me about your business and I'll reply within 48 hours."
        primaryHref="/submit"
        primaryLabel="Start a listing"
        secondaryHref="/businesses"
        secondaryLabel="See the directory"
      />
    </>
  );
}
