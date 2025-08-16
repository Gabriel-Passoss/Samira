import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { Samira } from '../../src/samira';
import { REGIONS } from '../../src/constants';

describe('Summoner Service E2E', () => {
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
      platform: "BR1",
    });
    
    console.log('🚀 Samira initialized with config:', samira.getConfig());

    samira.usePlatformRouting();
  });

  // Rate limiting helper function
  const waitForRateLimit = async () => {
    const status = samira.getHttpClient().getRateLimitStatus();
    
    if (!status.canMakeRequest) {
      const delay = status.delayUntilNext;
      await new Promise(resolve => setTimeout(resolve, delay + 100));
    }
    
    if (status.requestsInWindow >= 80) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  beforeEach(async () => {
    // Wait for rate limits before each test
    await waitForRateLimit();
  });

  describe('getSummonerByPuuid', () => {
    it('should fetch summoner by PUUID successfully', async () => {
      const puuid = 'ZrXebR0htvpXhiz8D75UGNtYhcCNRqXIAO4kGieSfwJbihV1PKTjTd2sP1CsgqClaL-vw812L7h7iQ';

      const result = await samira.summoner.getSummonerByPuuid(puuid);

      console.log(result.value);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const summoner = result.value as any;
        expect(summoner).toBeDefined();
        expect(summoner.puuid).toBeDefined();
        expect(summoner.puuid).toBe(puuid);
      }
    });

    it('should handle invalid PUUID gracefully', async () => {
      const invalidPUUID = 'ZrXebR0htvpXhiz8D75UGNtYhcCNRqXIAO4kGieSfwJbihV1PKTjTd2sP1CsgqClaL-vw812L7h7as';

      const result = await samira.summoner.getSummonerByPuuid(invalidPUUID);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        console.log(result.value);
        expect(result.value.status).toBe(400);
        expect(result.value.message).toContain(`Bad Request - Exception decrypting ${invalidPUUID}`);
      }
    });
  });

  describe('API response validation', () => {
    it('should return properly formatted summoner data', async () => {
        const puuid = 'ZrXebR0htvpXhiz8D75UGNtYhcCNRqXIAO4kGieSfwJbihV1PKTjTd2sP1CsgqClaL-vw812L7h7iQ';

      const result = await samira.summoner.getSummonerByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const summoner = result.value;
        
        // Validate data structure
        expect(summoner).toHaveProperty('puuid');
        expect(summoner).toHaveProperty('profileIconId');
        expect(summoner).toHaveProperty('revisionDate');
        expect(summoner).toHaveProperty('summonerLevel');
        
        // Validate data types
        expect(typeof summoner.puuid).toBe('string');
        expect(typeof summoner.profileIconId).toBe('number');
        expect(typeof summoner.revisionDate).toBe('number');
        expect(typeof summoner.summonerLevel).toBe('number');
        
        // Validate data content
        expect(summoner.puuid.length).toBeGreaterThan(0);
        expect(summoner.profileIconId).toBeGreaterThan(0);
        expect(summoner.revisionDate).toBeGreaterThan(0);
        expect(summoner.summonerLevel).toBeGreaterThan(0);
        
        expect(summoner.puuid).toMatch(/^[a-zA-Z0-9_-]{70,80}$/);
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
