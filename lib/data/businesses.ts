import type { Business } from "@/lib/types";

export const businesses: Business[] = [
  {
    id: "biz-001",
    slug: "south-city-kitchen-midtown",
    name: "Midtown Southern Kitchen (Sample)",
    type: "Restaurant",
    neighborhood: "Midtown",
    description:
      "Modern Southern plates just steps from MARTA. Matchday brunch and late-night kitchen during the tournament.",
    specialOffer: "10% off for fans showing a matchday ticket stub",
    isFeatured: true,
    cuisine: "Southern",
    tags: ["brunch", "late-night", "walkable"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "biz-002",
    slug: "castleberry-jerk-spot",
    name: "Castleberry Jerk Spot (Sample)",
    type: "Restaurant",
    neighborhood: "Castleberry Hill",
    description:
      "Black-owned Caribbean kitchen serving jerk plates, oxtail, and patties. Outdoor patio with match audio.",
    specialOffer: "Free soda with any plate over $15 on matchdays",
    isFeatured: true,
    isBlackOwned: true,
    cuisine: "Caribbean",
    tags: ["black-owned", "caribbean", "patio"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "biz-003",
    slug: "old-fourth-ward-taproom",
    name: "Old Fourth Ward Taproom (Sample)",
    type: "Bar",
    neighborhood: "Old Fourth Ward",
    description:
      "Local beer, 12 TVs, and a projector set up in the back patio. Every match, every language, every fan.",
    specialOffer: "$5 pints during match windows",
    isFeatured: false,
    tags: ["beer", "patio", "match-audio"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "biz-004",
    slug: "west-midtown-lounge",
    name: "West Midtown Rooftop Lounge (Sample)",
    type: "Lounge",
    neighborhood: "West Midtown",
    description:
      "Skyline views, DJs, and late-night watch parties for the biggest matches of the tournament.",
    isFeatured: false,
    tags: ["rooftop", "dj", "21+"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "biz-005",
    slug: "atl-taco-truck",
    name: "ATL Global Taco Truck (Sample)",
    type: "Food Truck",
    neighborhood: "Downtown",
    description:
      "Rotating international tacos — birria, bulgogi, jerk chicken, chorizo. Follow our schedule during tournament weeks.",
    specialOffer: "Buy 3 tacos, get a free drink on matchdays",
    isFeatured: false,
    cuisine: "Global",
    tags: ["food-truck", "international"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "biz-006",
    slug: "buckhead-boutique-hotel",
    name: "Buckhead Boutique Hotel (Sample)",
    type: "Hotel",
    neighborhood: "Buckhead",
    description:
      "Boutique rooms and a quiet rooftop bar. Shuttle service to downtown during tournament days (on request).",
    isFeatured: false,
    tags: ["boutique", "rooftop", "shuttle"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "biz-007",
    slug: "downtown-airbnb-host",
    name: "Downtown Loft Stay (Sample Host)",
    type: "Airbnb Host",
    neighborhood: "Downtown",
    description:
      "Walk to Mercedes-Benz Stadium and Centennial Olympic Park. Matchday welcome kit with MARTA cards and a local guide.",
    isFeatured: true,
    tags: ["walk-to-stadium", "welcome-kit"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "biz-008",
    slug: "east-atlanta-pub",
    name: "East Atlanta Village Pub (Sample)",
    type: "Bar",
    neighborhood: "East Atlanta Village",
    description:
      "Soccer-first pub with match audio, supporter groups, and a scarf wall from fans around the world.",
    isFeatured: false,
    tags: ["soccer-pub", "supporters"],
    ctaUrl: "/businesses",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  }
];
