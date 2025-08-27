import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Samira, regionToPlatform } from '../src/samira';
import { PLATFORMS, REGIONS, type Region } from '../src/constants';

describe('Samira', () => {
  let samira: Samira;
  const mockApiKey = process.env.RIOT_API_KEY || 'test-api-key-12345';

  beforeEach(() => {
    samira = new Samira({
      apiKey: mockApiKey,
      region: REGIONS.NA1,
    });
  });

  describe('constructor', () => {
    it('should create a Samira instance with valid config', () => {
      expect(samira).toBeInstanceOf(Samira);
      expect(samira.getConfig().apiKey).toBe(mockApiKey);
      expect(samira.getConfig().region).toBe(REGIONS.NA1);
    });

    it('should throw error for empty API key', () => {
      expect(() => new Samira({ apiKey: '', region: REGIONS.NA1 })).toThrow('API key is required');
      expect(() => new Samira({ apiKey: '   ', region: REGIONS.NA1 })).toThrow(
        'API key is required',
      );
    });

    it('should throw error for invalid region', () => {
      expect(() => new Samira({ apiKey: mockApiKey, region: 'invalid-region' as Region })).toThrow(
        "Region invalid-region doesn't exist!",
      );
    });
  });

  describe('configuration methods', () => {
    it('should update API key', () => {
      const newApiKey = 'new-api-key-67890';
      samira.updateApiKey(newApiKey);
      expect(samira.getConfig().apiKey).toBe(newApiKey);
    });

    it('should update region', () => {
      const newRegion = REGIONS.EUW1;
      samira.updateRegion(newRegion);
      expect(samira.getConfig().region).toBe(newRegion);
    });

    it('should return config copy', () => {
      const config = samira.getConfig();
      expect(config).toEqual({
        apiKey: mockApiKey,
        region: REGIONS.NA1,
      });

      // Modifying returned config should not affect original
      config.apiKey = 'modified';
      expect(samira.getConfig().apiKey).toBe(mockApiKey);
    });
  });

  describe('static utility methods', () => {
    describe('getAvailablePlatforms', () => {
      it('should return all available platforms', () => {
        const platforms = Samira.getAvailablePlatforms();
        expect(platforms).toHaveProperty('AMERICAS', PLATFORMS.AMERICAS);
        expect(platforms).toHaveProperty('ASIA', PLATFORMS.ASIA);
        expect(platforms).toHaveProperty('EUROPE', PLATFORMS.EUROPE);
        expect(platforms).toHaveProperty('SEA', PLATFORMS.SEA);
        expect(Object.keys(platforms).length).toBe(4);
      });

      it('should return a copy of platforms object', () => {
        const platforms = Samira.getAvailablePlatforms();
        const originalCount = Object.keys(platforms).length;

        // Modifying returned object should not affect original
        delete (platforms as any).NA1;
        expect(Object.keys(Samira.getAvailablePlatforms()).length).toBe(originalCount);
      });
    });

    describe('getAvailableRegions', () => {
      it('should return all available regions', () => {
        const regions = Samira.getAvailableRegions();
        expect(regions).toHaveProperty('NA1', REGIONS.NA1);
        expect(regions).toHaveProperty('EUW1', REGIONS.EUW1);
        expect(regions).toHaveProperty('KR', REGIONS.KR);
      });
    });

    describe('isValidPlatform', () => {
      it('should return true for valid platforms', () => {
        expect(Samira.isValidPlatform(PLATFORMS.AMERICAS)).toBe(true);
        expect(Samira.isValidPlatform(PLATFORMS.EUROPE)).toBe(true);
        expect(Samira.isValidPlatform(PLATFORMS.ASIA)).toBe(true);
      });

      it('should return false for invalid platforms', () => {
        expect(Samira.isValidPlatform('invalid-platform')).toBe(false);
        expect(Samira.isValidPlatform('')).toBe(false);
      });
    });

    describe('isValidRegion', () => {
      it('should return true for valid regions', () => {
        expect(Samira.isValidRegion(REGIONS.NA1)).toBe(true);
        expect(Samira.isValidRegion(REGIONS.EUW1)).toBe(true);
        expect(Samira.isValidRegion(REGIONS.KR)).toBe(true);
      });

      it('should return false for invalid regions', () => {
        expect(Samira.isValidRegion('invalid-region')).toBe(false);
        expect(Samira.isValidRegion('')).toBe(false);
      });
    });

    describe('getPlatformFromRegion', () => {
      it('should return correct platform for each region', () => {
        expect(regionToPlatform(REGIONS.BR1)).toBe(PLATFORMS.AMERICAS);
        expect(regionToPlatform(REGIONS.EUW1)).toBe(PLATFORMS.EUROPE);
        expect(regionToPlatform(REGIONS.KR)).toBe(PLATFORMS.ASIA);
      });
    });
  });
});
