import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { Samira } from '../../src/samira';
import { PLATFORMS, REGIONS, Region } from '../../src/constants';

describe('League Service E2E', () => {
  let samira: Samira;

  beforeAll(() => {
    // Check if API key is available
    if (!process.env.RIOT_API_KEY) {
      console.warn('⚠️  RIOT_API_KEY not found, using test key for debugging');
    }

    samira = new Samira({
      apiKey: process.env.RIOT_API_KEY!,
      region: REGIONS.BR1,
    });
  });

  // Rate limiting helper function
  const waitForRateLimit = async () => {
    const status = samira.getRegionalClient().getRateLimitStatus();

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

  describe('getEntriesByPuuid', () => {
    it('should fetch league entries by PUUID successfully', async () => {
      const puuid =
        'ZrXebR0htvpXhiz8D75UGNtYhcCNRqXIAO4kGieSfwJbihV1PKTjTd2sP1CsgqClaL-vw812L7h7iQ';

      const result = await samira.league.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const entries = result.value;
        expect(entries).toBeDefined();
        expect(entries.length).toBeGreaterThan(0);
      }
    });

    it('should handle invalid PUUID gracefully', async () => {
      const invalidPUUID =
        'ZrXebR0htvpXhiz8D75UGNtYhcCNRqXIAO4kGieSfwJbihV1PKTjTd2sP1CsgqClaL-vw812L7h7ix';

      const result = await samira.league.getEntriesByPuuid(invalidPUUID);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(400);
        expect(result.value.message).toContain('');
      }
    });
  });

  describe('API response validation', () => {
    it('should return properly formatted league entries data', async () => {
      const puuid =
        'ZrXebR0htvpXhiz8D75UGNtYhcCNRqXIAO4kGieSfwJbihV1PKTjTd2sP1CsgqClaL-vw812L7h7iQ';

      const result = await samira.league.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const entries = result.value;

        // Validate data structure
        expect(entries[0]).toHaveProperty('puuid');
        expect(entries[0]).toHaveProperty('queueType');
        expect(entries[0]).toHaveProperty('tier');
        expect(entries[0]).toHaveProperty('rank');
        expect(entries[0]).toHaveProperty('leaguePoints');
        expect(entries[0]).toHaveProperty('wins');
        expect(entries[0]).toHaveProperty('losses');
        expect(entries[0]).toHaveProperty('hotStreak');
        expect(entries[0]).toHaveProperty('veteran');
        expect(entries[0]).toHaveProperty('freshBlood');
        expect(entries[0]).toHaveProperty('inactive');

        // Validate data types
        expect(typeof entries[0].puuid).toBe('string');
        expect(typeof entries[0].queueType).toBe('string');
        expect(typeof entries[0].tier).toBe('string');
        expect(typeof entries[0].rank).toBe('string');
        expect(typeof entries[0].leaguePoints).toBe('number');
        expect(typeof entries[0].wins).toBe('number');
        expect(typeof entries[0].losses).toBe('number');
        expect(typeof entries[0].hotStreak).toBe('boolean');
        expect(typeof entries[0].veteran).toBe('boolean');
        expect(typeof entries[0].freshBlood).toBe('boolean');
        expect(typeof entries[0].inactive).toBe('boolean');

        // Validate data content
        expect(entries[0].puuid.length).toBeGreaterThan(0);
        expect(entries[0].queueType.length).toBeGreaterThan(0);
        expect(entries[0].tier.length).toBeGreaterThan(0);
        expect(entries[0].rank.length).toBeGreaterThan(0);
        expect(entries[0].leaguePoints).toBeGreaterThanOrEqual(0);
        expect(entries[0].wins).toBeGreaterThanOrEqual(0);
        expect(entries[0].losses).toBeGreaterThanOrEqual(0);
        expect(entries[0].hotStreak).toBe(false);
        expect(entries[0].veteran).toBe(false);
        expect(entries[0].freshBlood).toBe(false);
        expect(entries[0].inactive).toBe(false);
        if (entries[0].miniSeries) {
          expect(entries[0].miniSeries.losses).toBeGreaterThanOrEqual(0);
          expect(entries[0].miniSeries.progress).toBeDefined();
          expect(entries[0].miniSeries.target).toBeGreaterThan(0);
          expect(entries[0].miniSeries.wins).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });
});
