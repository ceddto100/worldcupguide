import { MongoClient, type Db } from "mongodb";
import type { Trip } from "./types";

// MongoDB adapter. Wired only when MONGODB_URI is present; otherwise
// the client falls back to local storage (see lib/itinerary/storage.ts).

let client: MongoClient | null = null;
let dbPromise: Promise<Db> | null = null;

export function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export async function getDb(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!dbPromise) {
    client = new MongoClient(process.env.MONGODB_URI);
    dbPromise = client
      .connect()
      .then(() => client!.db(process.env.MONGODB_DB ?? "worldcup_itinerary"));
  }
  return dbPromise;
}

export async function tripsCollection() {
  const db = await getDb();
  return db.collection<Trip>("trips");
}

export async function usersCollection() {
  const db = await getDb();
  return db.collection<{
    email: string;
    name: string;
    picture?: string;
    isAdmin?: boolean;
    createdAt: string;
  }>("users");
}

export async function exportLogCollection() {
  const db = await getDb();
  return db.collection<{
    tripId: string;
    userEmail: string;
    kind: "pdf" | "email";
    createdAt: string;
  }>("export_logs");
}
