/**
 * MongoDB client for BetterAuth (server-side only).
 * Same database as the Express server (DB_NAME), so both read the same "user" collection.
 *
 * The client is cached on globalThis so Next.js hot-reload (dev) and warm serverless
 * functions (Vercel) reuse ONE connection pool instead of opening a new one each time.
 * The driver connects automatically on the first query.
 */
import "server-only";
import dns from "node:dns";
import { MongoClient } from "mongodb";

// Local-dev fix (same as the server): some routers/ISPs refuse the SRV DNS lookup
// that "mongodb+srv://" needs. Vercel's DNS works fine, so only do this locally.
if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  console.log("🔧 Using Google/Cloudflare DNS for MongoDB");
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is missing. Add it to .env.local (local) or Vercel env vars.");

const globalForMongo = globalThis as unknown as { _fixmateAuthMongo?: MongoClient };

export const client =
  globalForMongo._fixmateAuthMongo ??
  (globalForMongo._fixmateAuthMongo = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 8000 }));

export const db = client.db(process.env.DB_NAME || "fixmate");