export type TransportMode =
  | "flight"
  | "rental"
  | "personal"
  | "train"
  | "bus"
  | "rideshare";

export type TransportLeg = {
  id: string;
  mode: TransportMode;
  // Flight
  flightNumber?: string;
  airline?: string;
  terminal?: string;
  // Rental
  rentalCompany?: string;
  carClass?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  // Personal vehicle
  departureAddress?: string;
  estimatedDriveTime?: string;
  // Train / bus
  carrier?: string;
  routeOrLine?: string;
  // Rideshare
  rideshareService?: string;
  // Common
  fromCity?: string;
  toCity?: string;
  departDate?: string;
  departTime?: string;
  arriveDate?: string;
  arriveTime?: string;
  confirmation?: string;
  notes?: string;
};

export type AccommodationType =
  | "hotel"
  | "bnb"
  | "airbnb"
  | "hostel"
  | "camping"
  | "friends";

export type Accommodation = {
  id: string;
  type: AccommodationType;
  name: string;
  address?: string;
  checkIn?: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm
  checkOut?: string;
  checkOutTime?: string;
  confirmation?: string;
  amenities: string[]; // pool, breakfast, parking, pet-friendly...
  notes?: string;
};

export type EventCategory =
  | "meal"
  | "activity"
  | "transport"
  | "free"
  | "ceremony";

export type ItineraryEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  startTime?: string; // HH:mm
  endTime?: string;
  location?: string;
  category: EventCategory;
  color?: string;
  notes?: string;
  attendees: string[];
  manualOrder?: number;
};

export type BudgetCategory =
  | "transport"
  | "lodging"
  | "food"
  | "activities"
  | "misc";

export type BudgetItem = {
  id: string;
  category: BudgetCategory;
  label: string;
  amount: number;
};

export type Budget = {
  cap: number;
  currency: string;
  items: BudgetItem[];
};

export type PackingItem = {
  id: string;
  category: "clothing" | "toiletries" | "documents" | "gear";
  label: string;
  checked: boolean;
};

export type Collaborator = {
  email: string;
  role: "edit" | "view";
};

export type Trip = {
  id: string;
  ownerEmail: string; // creator
  destination: string;
  coverPhoto?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
  travelers: string[]; // names
  transport: TransportLeg[];
  stays: Accommodation[];
  events: ItineraryEvent[];
  budget: Budget;
  packing: PackingItem[];
  template?: string;
  collaborators: Collaborator[];
  shareSlug?: string; // for view-only link
  createdAt: string;
  updatedAt: string;
};

export type WorkflowSection =
  | "transport"
  | "stays"
  | "events"
  | "budget"
  | "packing";

export type CompletionMap = Record<WorkflowSection, boolean>;
