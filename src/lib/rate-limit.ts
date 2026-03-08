/**
 * Simple in-memory rate limiter using sliding window.
 * For production at scale, replace with Redis-based solution.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and consume a rate limit token.
 * @param key - Unique identifier (e.g., IP address or user ID)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  cleanup(config.windowMs);

  const entry = store.get(key) ?? { timestamps: [] };
  const cutoff = now - config.windowMs;

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= config.limit) {
    const oldestInWindow = entry.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldestInWindow + config.windowMs,
    };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    allowed: true,
    remaining: config.limit - entry.timestamps.length,
    resetAt: now + config.windowMs,
  };
}

// Preset configurations
export const RATE_LIMITS = {
  /** API reads: 100 requests per minute */
  read: { limit: 100, windowMs: 60 * 1000 } as RateLimitConfig,
  /** API writes: 20 requests per minute */
  write: { limit: 20, windowMs: 60 * 1000 } as RateLimitConfig,
  /** Likes: 30 per minute */
  like: { limit: 30, windowMs: 60 * 1000 } as RateLimitConfig,
  /** Downloads: 30 per minute */
  download: { limit: 30, windowMs: 60 * 1000 } as RateLimitConfig,
  /** Auth attempts: 5 per minute */
  auth: { limit: 5, windowMs: 60 * 1000 } as RateLimitConfig,
};
