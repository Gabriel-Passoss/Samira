import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { Samira } from '../../src/samira';
import { REGIONS, PLATFORMS } from '../../src/constants';

describe('Spectator Service E2E', () => {
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
      region: REGIONS.AMERICAS,
      platform: PLATFORMS.NA1,
    });

    console.log('🚀 Samira initialized with config:', samira.getConfig());

    samira.usePlatformRouting();
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

  describe('getActiveGameByPuuid', () => {
    it('should fetch active game by PUUID successfully', async () => {
      let puuid = '';

      const featuredGames = await samira.spectator.getFeaturedGames();

      expect(featuredGames.isRight()).toBe(true);

      if (featuredGames.isRight()) {
        const game = featuredGames.value.gameList[0];
        puuid = game.participants[0].puuid;
      }

      const result = await samira.spectator.getActiveGameByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const game = result.value;
        expect(game).toBeDefined();
        expect(game.gameId).toBeDefined();
      }
    });
  });

  describe('API response validation', () => {
    it('should return properly formatted account data', async () => {
      let puuid = '';

      const featuredGames = await samira.spectator.getFeaturedGames();

      expect(featuredGames.isRight()).toBe(true);

      if (featuredGames.isRight()) {
        const game = featuredGames.value.gameList[0];
        puuid = game.participants[0].puuid;
      }

      const result = await samira.spectator.getActiveGameByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const game = result.value;

        // Validate data structure
        expect(game).toHaveProperty('gameId');
        expect(game).toHaveProperty('gameType');
        expect(game).toHaveProperty('gameStartTime');
        expect(game).toHaveProperty('mapId');
        expect(game).toHaveProperty('gameLength');
        expect(game).toHaveProperty('platformId');
        expect(game).toHaveProperty('gameMode');
        expect(game).toHaveProperty('bannedChampions');
        expect(game).toHaveProperty('gameQueueConfigId');
        expect(game).toHaveProperty('observers');
        expect(game).toHaveProperty('participants');

        // Validate data types
        expect(typeof game.participants[0].bot).toBe('boolean');
        expect(typeof game.participants[0].puuid).toBe('string');
        expect(typeof game.participants[0].spell1Id).toBe('number');
        expect(typeof game.participants[0].spell2Id).toBe('number');
        expect(typeof game.participants[0].profileIconId).toBe('number');
        expect(typeof game.participants[0].championId).toBe('number');
        expect(typeof game.participants[0].teamId).toBe('number');
        expect(typeof game.participants[0].gameCustomizationObjects).toBe('object');
        expect(typeof game.participants[0].perks).toBe('object');

        // Validate data content
        expect(game.participants[0].puuid).toMatch(/^[a-zA-Z0-9_-]{70,80}$/);
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
