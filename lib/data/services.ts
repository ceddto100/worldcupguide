import type { ServicePackage } from "@/lib/types";

export const servicePackages: ServicePackage[] = [
  {
    id: "svc-001",
    slug: "basic-listing",
    name: "Basic Listing",
    tagline: "Get on the guide. Simple, fast, visible to visitors.",
    priceLabel: "$49",
    priceNote: "one-time (placeholder)",
    features: [
      "Listing on /businesses",
      "Business name, description, neighborhood",
      "One special offer line",
      "Category and tag filters"
    ],
    isFeatured: false,
    ctaLabel: "Start a Basic Listing",
    ctaUrl: "/submit"
  },
  {
    id: "svc-002",
    slug: "featured-listing",
    name: "Featured Listing",
    tagline: "Stand out on the guide with priority placement and visuals.",
    priceLabel: "$149",
    priceNote: "one-time (placeholder)",
    features: [
      "Everything in Basic",
      "Priority placement on /businesses",
      "Featured badge and image",
      "Homepage rotation spot"
    ],
    isFeatured: true,
    ctaLabel: "Get Featured",
    ctaUrl: "/submit"
  },
  {
    id: "svc-003",
    slug: "qr-landing-page",
    name: "QR Landing Page Package",
    tagline: "Printable QR code that opens your World Cup offer page.",
    priceLabel: "$399",
    priceNote: "one-time (placeholder)",
    features: [
      "Custom landing page under your brand",
      "QR code art for print at your door",
      "Email/SMS capture on the page",
      "Analytics on scans and form fills"
    ],
    isFeatured: false,
    ctaLabel: "Order a QR Page",
    ctaUrl: "/submit"
  },
  {
    id: "svc-004",
    slug: "ai-concierge-automation",
    name: "AI Concierge & Automation Setup",
    tagline: "AI FAQ chatbot, Make.com automations, lead capture — all wired up.",
    priceLabel: "$799+",
    priceNote: "custom scope (placeholder)",
    features: [
      "AI chatbot trained on your business FAQ",
      "Make.com automation for inquiries",
      "Google Business Profile review + tips",
      "Email/SMS capture + welcome sequence",
      "Optional reservation/booking form"
    ],
    isFeatured: true,
    ctaLabel: "Request a Scoping Call",
    ctaUrl: "/submit"
  }
];
