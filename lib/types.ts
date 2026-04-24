export type MatchStage =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarterfinal"
  | "Semifinal"
  | "Third-Place Match"
  | "Final";

export interface Match {
  id: string;
  slug: string;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  venue: string;
  stage: MatchStage;
  isAtlanta: boolean;
  imageUrl?: string;
  ctaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | "Watch Party"
  | "Food"
  | "Nightlife"
  | "Family"
  | "Culture"
  | "Music"
  | "Soccer Meetup";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  neighborhood: string;
  priceLabel: string;
  isFree: boolean;
  isFamilyFriendly: boolean;
  isFeatured: boolean;
  tags: string[];
  imageUrl?: string;
  ctaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type BusinessType =
  | "Restaurant"
  | "Bar"
  | "Lounge"
  | "Food Truck"
  | "Hotel"
  | "Airbnb Host"
  | "Shop"
  | "Experience"
  | "Service";

export interface Business {
  id: string;
  slug: string;
  name: string;
  type: BusinessType;
  neighborhood: string;
  address?: string;
  description: string;
  specialOffer?: string;
  isFeatured: boolean;
  isBlackOwned?: boolean;
  cuisine?: string;
  tags: string[];
  imageUrl?: string;
  ctaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Neighborhood {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  bestFor: string[];
  transitNotes: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  priceLabel: string;
  priceNote?: string;
  features: string[];
  isFeatured: boolean;
  ctaLabel: string;
  ctaUrl: string;
}

export interface SubmissionFormData {
  name: string;
  email: string;
  phone?: string;
  entityName: string;
  submissionType: "business" | "event";
  category: string;
  neighborhood: string;
  eventDate?: string;
  eventTime?: string;
  website?: string;
  description: string;
  specialOffer?: string;
  familyFriendly: boolean;
  interestedInFeatured: boolean;
  message?: string;
}
