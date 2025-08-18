import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { Samira } from '../../src/samira';
import { REGIONS } from '../../src/constants';

describe('Match Service E2E', () => {
  let samira: Samira;

  beforeAll(() => {
    // Check if API key is available
    if (!process.env.RIOT_API_KEY) {
      console.warn('⚠️  RIOT_API_KEY not found, using test key for debugging');
    }

    console.log('🔑 Using API key:', process.env.RIOT_API_KEY);

    // Initialize Samira with regional routing for account endpoints
    samira = new Samira({
      apiKey: process.env.RIOT_API_KEY!,
      platform: 'BR1',
      region: REGIONS.AMERICAS,
    });

    console.log('🚀 Samira initialized with config:', samira.getConfig());

    samira.useRegionalRouting();
  });

  // Rate limiting helper function
  const waitForRateLimit = async () => {
    const status = samira.getHttpClient().getRateLimitStatus();

    if (!status.canMakeRequest) {
      const delay = status.delayUntilNext;
      await new Promise((resolve) => setTimeout(resolve, delay + 100));
    }

    if (status.requestsInWindow >= 80) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  beforeEach(async () => {
    // Wait for rate limits before each test
    await waitForRateLimit();
  });

  describe('getMatchById', () => {
    it('should fetch match by match ID successfully', async () => {
      const matchId = 'BR1_3130694840';

      const result = await samira.match.getMatchById(matchId);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const match = result.value as any;
        expect(match).toBeDefined();
        expect(match.metadata).toBeDefined();
        expect(match.metadata.matchId).toBe(matchId);
        expect(match.info).toBeDefined();
        expect(match.info.participants).toBeDefined();
        expect(Array.isArray(match.info.participants)).toBe(true);
        expect(match.info.participants.length).toBe(10);
      }
    });

    it('should handle invalid match ID gracefully', async () => {
      const matchId = 'InvalidMatchId';

      const result = await samira.match.getMatchById(matchId);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(404);
        expect(result.value.message).toContain('match file not found');
      }
    });
  });

  describe('API response validation', () => {
    it('should return properly formatted account data', async () => {
      const gameName = 'Dave Mustaine';
      const tagLine = 'trash';

      const result = await samira.account.getAccountByRiotId(gameName, tagLine);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const account = result.value;

        // Validate data structure
        expect(account).toHaveProperty('puuid');
        expect(account).toHaveProperty('gameName');
        expect(account).toHaveProperty('tagLine');

        // Validate data types
        expect(typeof account.puuid).toBe('string');
        expect(typeof account.gameName).toBe('string');
        expect(typeof account.tagLine).toBe('string');

        // Validate data content
        expect(account.puuid.length).toBeGreaterThan(0);
        expect(account.gameName.length).toBeGreaterThan(0);
        expect(account.tagLine.length).toBeGreaterThan(0);

        expect(account.puuid).toMatch(/^[a-zA-Z0-9_-]{70,80}$/);
      }
    });
  });

  describe('Error handling', () => {
    it('should handle network errors gracefully', async () => {
      // Create a Samira instance with invalid base URL to simulate network error
      const invalidSamira = new Samira({
        apiKey: process.env.RIOT_API_KEY!,
        platform: 'invalid-platform',
      });

      const result = await invalidSamira.account.getAccountByRiotId('Dave Mustaine', 'trash');

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.message).toContain('No response received from server');
      }
    });

    it('should handle unauthorized access', async () => {
      // Create a Samira instance with invalid API key
      const invalidSamira = new Samira({
        apiKey: 'invalid-api-key',
        region: 'americas',
      });

      // Use regional routing for account endpoints
      invalidSamira.useRegionalRouting();

      const result = await invalidSamira.account.getAccountByRiotId('Faker', 'KR1');

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(401);
        expect(result.value.statusText).toContain('Unauthorized');
      }
    });
  });
});
