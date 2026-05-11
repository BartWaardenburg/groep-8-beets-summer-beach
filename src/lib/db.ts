import { Redis } from "@upstash/redis";
import type { Rsvp, RsvpMap } from "./kids";

const RSVP_KEY = "rsvps:v1";

type Store = {
  getAll: () => Promise<RsvpMap>;
  set: (kid: string, rsvp: Rsvp) => Promise<void>;
};

const memoryMap: RsvpMap = {};

const memoryStore: Store = {
  getAll: async () => ({ ...memoryMap }),
  set: async (kid, rsvp) => {
    memoryMap[kid] = rsvp;
  },
};

const redisStore = (redis: Redis): Store => ({
  getAll: async () => {
    const data = await redis.hgetall<Record<string, string>>(RSVP_KEY);
    if (!data) return {};
    const out: RsvpMap = {};
    for (const [kid, value] of Object.entries(data)) {
      try {
        const parsed = typeof value === "string" ? (JSON.parse(value) as Rsvp) : (value as Rsvp);
        out[kid] = parsed;
      } catch {
        // skip malformed entries
      }
    }
    return out;
  },
  set: async (kid, rsvp) => {
    await redis.hset(RSVP_KEY, { [kid]: JSON.stringify(rsvp) });
  },
});

const buildStore = (): Store => {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[db] Upstash KV env vars missing, using in-memory store (data resets on server restart)",
      );
    }
    return memoryStore;
  }
  return redisStore(new Redis({ url, token }));
};

export const store = buildStore();
