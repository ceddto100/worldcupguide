import type { Neighborhood } from "@/lib/types";

export const neighborhoods: Neighborhood[] = [
  {
    id: "nb-001",
    slug: "downtown",
    name: "Downtown",
    shortDescription:
      "The matchday epicenter. Home to Mercedes-Benz Stadium, Centennial Olympic Park, and the Fan Fest footprint.",
    bestFor: ["walk to the stadium", "Fan Fest", "big watch parties"],
    transitNotes:
      "GWCC/CNN Center, Peachtree Center, and Five Points MARTA stations are all within walking distance.",
    tags: ["stadium", "fan-fest", "marta"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-002",
    slug: "midtown",
    name: "Midtown",
    shortDescription:
      "Dense dining scene, Piedmont Park, and high-rise lounges. Easy MARTA access to downtown.",
    bestFor: ["dining", "lounges", "park hangs"],
    transitNotes: "Midtown and Arts Center MARTA stations connect directly to downtown.",
    tags: ["dining", "nightlife", "park"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-003",
    slug: "old-fourth-ward",
    name: "Old Fourth Ward",
    shortDescription:
      "Historic neighborhood anchored by Ponce City Market and the Eastside BeltLine. Diverse food and walkable fun.",
    bestFor: ["Ponce City Market", "BeltLine", "foodie crawls"],
    transitNotes: "Best accessed by rideshare, bike, or scooter along the BeltLine.",
    tags: ["beltline", "food", "walkable"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-004",
    slug: "west-midtown",
    name: "West Midtown",
    shortDescription:
      "Warehouse-chic district with design showrooms, rooftop lounges, and some of the city's best new restaurants.",
    bestFor: ["rooftops", "new restaurants", "late night"],
    transitNotes: "Rideshare recommended. Limited direct MARTA coverage.",
    tags: ["rooftop", "dining", "design"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-005",
    slug: "buckhead",
    name: "Buckhead",
    shortDescription:
      "Upscale shopping, boutique hotels, and a quieter base for visitors who want to escape the downtown crowds.",
    bestFor: ["hotels", "shopping", "upscale dining"],
    transitNotes: "Buckhead MARTA station connects to downtown in about 15 minutes.",
    tags: ["hotels", "shopping"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-006",
    slug: "decatur",
    name: "Decatur",
    shortDescription:
      "A walkable square with indie restaurants, bars, and a community feel. Great base for families.",
    bestFor: ["families", "walkable square", "indie bars"],
    transitNotes: "Decatur MARTA station drops you right on the square.",
    tags: ["family", "marta", "walkable"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-007",
    slug: "castleberry-hill",
    name: "Castleberry Hill",
    shortDescription:
      "Historic arts district just south of downtown — lofts, galleries, and a strong culinary scene walking distance from the stadium.",
    bestFor: ["art walks", "walk to stadium", "culture"],
    transitNotes: "Walkable from downtown and GWCC/CNN Center MARTA.",
    tags: ["art", "walkable", "stadium"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-008",
    slug: "east-atlanta-village",
    name: "East Atlanta Village",
    shortDescription:
      "Laid-back, music-forward neighborhood with soccer pubs and supporter culture baked in.",
    bestFor: ["soccer pubs", "live music", "casual bites"],
    transitNotes: "Best by rideshare. No direct MARTA station.",
    tags: ["pubs", "music", "supporters"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "nb-009",
    slug: "beltline",
    name: "BeltLine",
    shortDescription:
      "A 22-mile multi-use trail wrapping the city with restaurants, breweries, and public art. The best way to see Atlanta on foot.",
    bestFor: ["walking/biking", "breweries", "public art"],
    transitNotes:
      "Rent a bike or scooter. Eastside BeltLine is the most popular stretch for visitors.",
    tags: ["trail", "outdoor", "bikes"],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  }
];
