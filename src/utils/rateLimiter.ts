/**
 * Rate limiter utility for Riot Games API
 * Handles rate limiting for different API endpoints
 */

export interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerTwoMinutes: number;
  requestsPerDay?: number;
}

export interface RateLimitState {
  lastRequestTime: number;
  requestCount: number;
  windowStartTime: number;
  dailyRequestCount: number;
  dailyWindowStart: number;
  // Add per-second tracking
  secondWindowStart: number;
  requestsInLastSecond: number;
}

export class RateLimiter {
  private state: RateLimitState;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.state = {
      lastRequestTime: 0,
      requestCount: 0,
      windowStartTime: Date.now(),
      dailyRequestCount: 0,
      dailyWindowStart: Date.now(),
      secondWindowStart: Date.now(),
      requestsInLastSecond: 0,
    };
  }

  /**
   * Check if a request can be made
   */
  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Check daily limit
    if (this.config.requestsPerDay) {
      if (this.state.dailyRequestCount >= this.config.requestsPerDay) {
        return false;
      }
    }

    // Check per-second limit
    if (now - this.state.secondWindowStart < 1000) {
      // Within the same second window
      if (this.state.requestsInLastSecond >= this.config.requestsPerSecond) {
        return false;
      }
    } else {
      // New second window, reset counter
      this.state.secondWindowStart = now;
      this.state.requestsInLastSecond = 0;
    }

    // Check per-two-minutes limit
    if (now - this.state.windowStartTime < 120000) {
      if (this.state.requestCount >= this.config.requestsPerTwoMinutes) {
        return false;
      }
    } else {
      // Reset window - only reset if we're actually starting a new window
      this.state.requestCount = 0;
      this.state.windowStartTime = now;
    }

    return true;
  }

  /**
   * Update window state without resetting (called internally)
   */
  private updateWindowState(): void {
    const now = Date.now();
    
    // Only reset if we're actually outside the current window
    if (now - this.state.windowStartTime >= 120000) {
      this.state.requestCount = 0;
      this.state.windowStartTime = now;
    }
    
    // Update per-second window
    if (now - this.state.secondWindowStart >= 1000) {
      this.state.secondWindowStart = now;
      this.state.requestsInLastSecond = 0;
    }
    
    // Update daily window
    if (this.config.requestsPerDay) {
      const dayStart = new Date(now).setHours(0, 0, 0, 0);
      if (this.state.dailyWindowStart !== dayStart) {
        this.state.dailyRequestCount = 0;
        this.state.dailyWindowStart = dayStart;
      }
    }
  }

  /**
   * Record a request being made
   */
  recordRequest(): void {
    const now = Date.now();
    
    // Update window state first
    this.updateWindowState();
    
    this.state.lastRequestTime = now;
    this.state.requestCount++;
    this.state.requestsInLastSecond++;
    
    if (this.config.requestsPerDay) {
      this.state.dailyRequestCount++;
    }
  }

  /**
   * Get the delay needed before the next request can be made
   */
  getDelayUntilNextRequest(): number {
    const now = Date.now();
    
    // Check per-second limit
    let delayForSecondLimit = 0;
    if (now - this.state.secondWindowStart < 1000) {
      if (this.state.requestsInLastSecond >= this.config.requestsPerSecond) {
        // Wait until next second window
        delayForSecondLimit = 1000 - (now - this.state.secondWindowStart);
      }
    }
    
    // Check per-two-minutes limit
    const timeInWindow = now - this.state.windowStartTime;
    const remainingRequests = this.config.requestsPerTwoMinutes - this.state.requestCount;
    
    let delayForTwoMinuteLimit = 0;
    if (remainingRequests <= 0) {
      delayForTwoMinuteLimit = 120000 - timeInWindow;
    }
    
    return Math.max(delayForSecondLimit, delayForTwoMinuteLimit);
  }

  /**
   * Wait until a request can be made
   */
  async waitForNextRequest(): Promise<void> {
    const delay = this.getDelayUntilNextRequest();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus(): {
    canMakeRequest: boolean;
    delayUntilNext: number;
    requestsInWindow: number;
    dailyRequests: number;
  } {
    // Update window state before returning status
    this.updateWindowState();
    
    return {
      canMakeRequest: this.canMakeRequest(),
      delayUntilNext: this.getDelayUntilNextRequest(),
      requestsInWindow: this.state.requestCount,
      dailyRequests: this.state.dailyRequestCount,
    };
  }

  /**
   * Reset the rate limiter state
   */
  reset(): void {
    this.state = {
      lastRequestTime: 0,
      requestCount: 0,
      windowStartTime: Date.now(),
      dailyRequestCount: 0,
      dailyWindowStart: Date.now(),
      secondWindowStart: Date.now(),
      requestsInLastSecond: 0,
    };
  }
}

/**
 * Default rate limit configurations for different API endpoints
 */
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Standard endpoints (20 requests per second, 100 requests per 2 minutes)
  default: {
    requestsPerSecond: 20,
    requestsPerTwoMinutes: 100,
  },
  
  // Match endpoints (100 requests per second, 2000 requests per 2 minutes)
  match: {
    requestsPerSecond: 100,
    requestsPerTwoMinutes: 2000,
  },
  
  // Spectator endpoints (20 requests per second, 100 requests per 2 minutes)
  spectator: {
    requestsPerSecond: 20,
    requestsPerTwoMinutes: 100,
  },
  
  // Status endpoints (20 requests per second, 100 requests per 2 minutes)
  status: {
    requestsPerSecond: 20,
    requestsPerTwoMinutes: 100,
  },
};

/**
 * Create a rate limiter for a specific endpoint type
 */
export function createRateLimiter(endpointType: keyof typeof DEFAULT_RATE_LIMITS = 'default'): RateLimiter {
  return new RateLimiter(DEFAULT_RATE_LIMITS[endpointType]!);
}
