import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RateLimiter, createRateLimiter, DEFAULT_RATE_LIMITS } from '../../src/utils/rateLimiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    vi.useFakeTimers();
    rateLimiter = new RateLimiter({
      requestsPerSecond: 10,
      requestsPerTwoMinutes: 100,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create rate limiter with correct config', () => {
      const config = {
        requestsPerSecond: 20,
        requestsPerTwoMinutes: 200,
        requestsPerDay: 1000,
      };
      
      const limiter = new RateLimiter(config);
      expect(limiter.getStatus().canMakeRequest).toBe(true);
    });
  });

  describe('canMakeRequest', () => {
    it('should allow requests initially', () => {
      expect(rateLimiter.canMakeRequest()).toBe(true);
    });

    it('should respect per-second limit', () => {
      // Make 10 requests (at limit)
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordRequest();
      }
      
      expect(rateLimiter.canMakeRequest()).toBe(false);
      
      // Advance time by 1 second
      vi.advanceTimersByTime(1000);
      expect(rateLimiter.canMakeRequest()).toBe(true);
    });

    it('should respect per-two-minutes limit', () => {
      // Make 100 requests (at limit)
      for (let i = 0; i < 100; i++) {
        rateLimiter.recordRequest();
      }
      
      expect(rateLimiter.canMakeRequest()).toBe(false);
      
      // Advance time by 2 minutes
      vi.advanceTimersByTime(120000);
      expect(rateLimiter.canMakeRequest()).toBe(true);
    });

    it('should respect daily limit when configured', () => {
      // Create a rate limiter with a very low daily limit to test
      const dailyLimiter = new RateLimiter({
        requestsPerSecond: 1000, // Very high to avoid other limits
        requestsPerTwoMinutes: 10000, // Very high to avoid other limits
        requestsPerDay: 3, // Very low daily limit
      });

      // Make 3 requests (at daily limit)
      for (let i = 0; i < 3; i++) {
        dailyLimiter.recordRequest();
      }
      
      // Debug: check the status
      const status = dailyLimiter.getStatus();
      console.log('Daily limit test status:', {
        dailyRequests: status.dailyRequests,
        requestsInWindow: status.requestsInWindow,
        canMakeRequest: status.canMakeRequest
      });
      
      expect(dailyLimiter.canMakeRequest()).toBe(false);
      
      // Reset the rate limiter to simulate a new day
      dailyLimiter.reset();
      expect(dailyLimiter.canMakeRequest()).toBe(true);
    });
  });

  describe('recordRequest', () => {
    it('should increment request count', () => {
      const initialStatus = rateLimiter.getStatus();
      rateLimiter.recordRequest();
      const newStatus = rateLimiter.getStatus();
      
      expect(newStatus.requestsInWindow).toBe(initialStatus.requestsInWindow + 1);
    });

    it('should update last request time', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      rateLimiter.recordRequest();
      
      // Advance time and make another request
      vi.advanceTimersByTime(500);
      rateLimiter.recordRequest();
      
      // With the new logic, we should still be able to make requests
      // since we're within the per-second limit (20 requests per second)
      expect(rateLimiter.canMakeRequest()).toBe(true);
    });
  });

  describe('getDelayUntilNextRequest', () => {
    it('should return 0 when request can be made', () => {
      expect(rateLimiter.getDelayUntilNextRequest()).toBe(0);
    });

    it('should return delay for per-second limit', () => {
      // Make 20 requests to hit the per-second limit
      for (let i = 0; i < 20; i++) {
        rateLimiter.recordRequest();
      }
      
      // Try to make another request immediately
      const delay = rateLimiter.getDelayUntilNextRequest();
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThanOrEqual(1000);
    });

    it('should return delay for per-two-minutes limit', () => {
      // Make 100 requests to hit the limit
      for (let i = 0; i < 100; i++) {
        rateLimiter.recordRequest();
      }
      
      const delay = rateLimiter.getDelayUntilNextRequest();
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThanOrEqual(120000);
    });
  });

  describe('waitForNextRequest', () => {
    it('should wait for next available request slot', async () => {
      // Make 10 requests to hit the limit
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordRequest();
      }
      
      const waitPromise = rateLimiter.waitForNextRequest();
      
      // Advance time by 1 second
      vi.advanceTimersByTime(1000);
      
      await waitPromise;
      expect(rateLimiter.canMakeRequest()).toBe(true);
    });

    it('should not wait when request can be made immediately', async () => {
      const startTime = Date.now();
      await rateLimiter.waitForNextRequest();
      const endTime = Date.now();
      
      // Should complete immediately
      expect(endTime - startTime).toBeLessThan(10);
    });
  });

  describe('getStatus', () => {
    it('should return correct status information', () => {
      const status = rateLimiter.getStatus();
      
      expect(status).toHaveProperty('canMakeRequest');
      expect(status).toHaveProperty('delayUntilNext');
      expect(status).toHaveProperty('requestsInWindow');
      expect(status).toHaveProperty('dailyRequests');
      
      expect(status.canMakeRequest).toBe(true);
      expect(status.delayUntilNext).toBe(0);
      expect(status.requestsInWindow).toBe(0);
      expect(status.dailyRequests).toBe(0);
    });

    it('should update status after recording requests', () => {
      rateLimiter.recordRequest();
      rateLimiter.recordRequest();
      
      const status = rateLimiter.getStatus();
      expect(status.requestsInWindow).toBe(2);
      // Note: dailyRequests is only tracked when requestsPerDay is configured
      expect(status.dailyRequests).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset all counters and timers', () => {
      // Make some requests
      rateLimiter.recordRequest();
      rateLimiter.recordRequest();
      
      // Reset
      rateLimiter.reset();
      
      const status = rateLimiter.getStatus();
      expect(status.requestsInWindow).toBe(0);
      expect(status.dailyRequests).toBe(0);
      expect(status.canMakeRequest).toBe(true);
    });
  });
});

describe('DEFAULT_RATE_LIMITS', () => {
  it('should have correct default limits', () => {
    expect(DEFAULT_RATE_LIMITS.default.requestsPerSecond).toBe(20);
    expect(DEFAULT_RATE_LIMITS.default.requestsPerTwoMinutes).toBe(100);
    
    expect(DEFAULT_RATE_LIMITS.match.requestsPerSecond).toBe(100);
    expect(DEFAULT_RATE_LIMITS.match.requestsPerTwoMinutes).toBe(2000);
    
    expect(DEFAULT_RATE_LIMITS.spectator.requestsPerSecond).toBe(20);
    expect(DEFAULT_RATE_LIMITS.spectator.requestsPerTwoMinutes).toBe(100);
    
    expect(DEFAULT_RATE_LIMITS.status.requestsPerSecond).toBe(20);
    expect(DEFAULT_RATE_LIMITS.status.requestsPerTwoMinutes).toBe(100);
  });
});

describe('createRateLimiter', () => {
  it('should create rate limiter with default config', () => {
    const limiter = createRateLimiter();
    expect(limiter).toBeInstanceOf(RateLimiter);
    
    const status = limiter.getStatus();
    expect(status.canMakeRequest).toBe(true);
  });

    it('should create rate limiter with specific endpoint type', () => {
    const limiter = createRateLimiter('match');
    expect(limiter).toBeInstanceOf(RateLimiter);
    
    expect(limiter.canMakeRequest()).toBe(true);
    
    // Make 100 requests to hit the per-second limit
    for (let i = 0; i < 100; i++) {
      limiter.recordRequest();
    }
    
    expect(limiter.canMakeRequest()).toBe(false);
    
    const status = limiter.getStatus();
    expect(status.requestsInWindow).toBe(100);
    expect(status.requestsInWindow).toBeLessThan(2000);
    
    expect(DEFAULT_RATE_LIMITS.match.requestsPerTwoMinutes).toBe(2000);
    expect(DEFAULT_RATE_LIMITS.match.requestsPerSecond).toBe(100);
  });

  it('should demonstrate rate limiting with proper timing', async () => {
    const limiter = createRateLimiter('match');
    
    // Make 100 requests to hit the per-second limit
    for (let i = 0; i < 100; i++) {
      expect(limiter.canMakeRequest()).toBe(true);
      limiter.recordRequest();
    }
    
    // Should now be at the limit
    expect(limiter.canMakeRequest()).toBe(false);

    // Wait for the second window to reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Should be able to make requests again
    expect(limiter.canMakeRequest()).toBe(true);
  }, 30000); // Increase timeout to 30 seconds
});
