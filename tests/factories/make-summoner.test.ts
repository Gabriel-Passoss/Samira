import { describe, it, expect } from 'vitest';
import { makeSummoner, makeSummonerArray } from './make-summoner';
import { SummonerSchema } from '../../src/types';

describe('Summoner Factory', () => {
  describe('makeSummoner', () => {
    it('should generate a valid summoner', () => {
      const summoner = makeSummoner();
      
      expect(summoner).toBeDefined();
      expect(summoner.profileIconId).toBeDefined();
      expect(summoner.revisionDate).toBeDefined();
      expect(summoner.puuid).toBeDefined();
      expect(summoner.summonerLevel).toBeDefined();
      
      // Validate against Zod schema
      const result = SummonerSchema.safeParse(summoner);
      expect(result.success).toBe(true);
    });

    it('should generate summoner with custom options', () => {
      const customOptions = {
        profileIconId: 15,
        revisionDate: 1640995200000,
        puuid: 'custom-puuid-789',
        summonerLevel: 100
      };
      
      const summoner = makeSummoner(customOptions);
      
      expect(summoner.profileIconId).toBe(customOptions.profileIconId);
      expect(summoner.revisionDate).toBe(customOptions.revisionDate);
      expect(summoner.puuid).toBe(customOptions.puuid);
      expect(summoner.summonerLevel).toBe(customOptions.summonerLevel);
    });

    it('should generate different summoners on multiple calls', () => {
      const summoner1 = makeSummoner();
      const summoner2 = makeSummoner();
      
      expect(summoner1.puuid).not.toBe(summoner2.puuid);
    });
  });

  describe('makeSummonerArray', () => {
    it('should generate array of summoners', () => {
      const count = 5;
      const summoners = makeSummonerArray(count);
      
      expect(summoners).toHaveLength(count);
      summoners.forEach(summoner => {
        expect(summoner).toBeDefined();
        expect(summoner.puuid).toBeDefined();
        expect(summoner.summonerLevel).toBeDefined();
      });
    });

    it('should generate summoners with custom options', () => {
      const count = 3;
      const customOptions = { summonerLevel: 50 };
      const summoners = makeSummonerArray(count, customOptions);
      
      expect(summoners).toHaveLength(count);
      summoners.forEach(summoner => {
        expect(summoner.summonerLevel).toBe(customOptions.summonerLevel);
      });
    });
  });

  describe('data validation', () => {
    it('should generate profile icon IDs within valid range', () => {
      const summoner = makeSummoner();
      
      expect(summoner.profileIconId).toBeGreaterThanOrEqual(1);
      expect(summoner.profileIconId).toBeLessThanOrEqual(30);
    });

    it('should generate summoner levels within valid range', () => {
      const summoner = makeSummoner();
      
      expect(summoner.summonerLevel).toBeGreaterThanOrEqual(1);
      expect(summoner.summonerLevel).toBeLessThanOrEqual(500);
    });

    it('should generate recent revision dates', () => {
      const summoner = makeSummoner();
      const now = Date.now();
      const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
      
      expect(summoner.revisionDate).toBeLessThanOrEqual(now);
      expect(summoner.revisionDate).toBeGreaterThan(oneYearAgo);
    });
  });
});
