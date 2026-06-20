import { describe, it, expect, beforeEach } from "vitest";
import { isRateLimited } from "./rateLimit.js";

describe("Rate Limiting", () => {
  beforeEach(() => {
    // Clear environment variables to force in-memory rate limiting for tests
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("allows requests under the rate limit", async () => {
    const clientId = `client-test-1-${Date.now()}`;
    for (let i = 0; i < 10; i++) {
      const limited = await isRateLimited(clientId);
      expect(limited).toBe(false);
    }
  });

  it("blocks requests that exceed the rate limit", async () => {
    const clientId = `client-test-2-${Date.now()}`;
    // Limit is 30 requests per minute
    for (let i = 0; i < 30; i++) {
      const limited = await isRateLimited(clientId);
      expect(limited).toBe(false);
    }
    const limited = await isRateLimited(clientId);
    expect(limited).toBe(true);
  });
});
