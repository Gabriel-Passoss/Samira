import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Samira, createSamira, createPlatformSamira, createRegionalSamira } from '../src/samira';
import { PLATFORMS, REGIONS } from '../src/constants';

describe('Samira', () => {
  let samira: Samira;
  const mockApiKey = process.env.RIOT_API_KEY || 'test-api-key-12345';

  beforeEach(() => {
    samira = new Samira({
      apiKey: mockApiKey,
      platform: PLATFORMS.NA1,
      region: REGIONS.AMERICAS,
    });
  });

  describe('constructor', () => {
    it('should create a Samira instance with valid config', () => {
      expect(samira).toBeInstanceOf(Samira);
      expect(samira.getConfig().apiKey).toBe(mockApiKey);
      expect(samira.getConfig().platform).toBe(PLATFORMS.NA1);
      expect(samira.getConfig().region).toBe(REGIONS.AMERICAS);
    });

    it('should throw error for empty API key', () => {
      expect(() => new Samira({ apiKey: '' })).toThrow('API key is required');
      expect(() => new Samira({ apiKey: '   ' })).toThrow('API key is required');
    });

    it('should set default platform and region when not provided', () => {
      const defaultSamira = new Samira({ apiKey: mockApiKey });
      expect(defaultSamira.getConfig().platform).toBe(PLATFORMS.NA1);
      expect(defaultSamira.getConfig().region).toBe(REGIONS.AMERICAS);
    });
  });

  describe('configuration methods', () => {
    it('should update API key', () => {
      const newApiKey = 'new-api-key-67890';
      samira.updateApiKey(newApiKey);
      expect(samira.getConfig().apiKey).toBe(newApiKey);
    });

    it('should update platform', () => {
      const newPlatform = PLATFORMS.EUW1;
      samira.updatePlatform(newPlatform);
      expect(samira.getConfig().platform).toBe(newPlatform);
    });

    it('should update region', () => {
      const newRegion = REGIONS.EUROPE;
      samira.updateRegion(newRegion);
      expect(samira.getConfig().region).toBe(newRegion);
    });

    it('should return config copy', () => {
      const config = samira.getConfig();
      expect(config).toEqual({
        apiKey: mockApiKey,
        platform: PLATFORMS.NA1,
        region: REGIONS.AMERICAS,
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
        expect(platforms).toHaveProperty('NA1', PLATFORMS.NA1);
        expect(platforms).toHaveProperty('EUW1', PLATFORMS.EUW1);
        expect(platforms).toHaveProperty('KR', PLATFORMS.KR);
        expect(Object.keys(platforms).length).toBeGreaterThan(10);
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
        expect(regions).toHaveProperty('AMERICAS', REGIONS.AMERICAS);
        expect(regions).toHaveProperty('EUROPE', REGIONS.EUROPE);
        expect(regions).toHaveProperty('ASIA', REGIONS.ASIA);
        expect(regions).toHaveProperty('SEA', REGIONS.SEA);
      });
    });

    describe('isValidPlatform', () => {
      it('should return true for valid platforms', () => {
        expect(Samira.isValidPlatform(PLATFORMS.NA1)).toBe(true);
        expect(Samira.isValidPlatform(PLATFORMS.EUW1)).toBe(true);
        expect(Samira.isValidPlatform(PLATFORMS.KR)).toBe(true);
      });

      it('should return false for invalid platforms', () => {
        expect(Samira.isValidPlatform('invalid-platform')).toBe(false);
        expect(Samira.isValidPlatform('')).toBe(false);
      });
    });

    describe('isValidRegion', () => {
      it('should return true for valid regions', () => {
        expect(Samira.isValidRegion(REGIONS.AMERICAS)).toBe(true);
        expect(Samira.isValidRegion(REGIONS.EUROPE)).toBe(true);
        expect(Samira.isValidRegion(REGIONS.ASIA)).toBe(true);
        expect(Samira.isValidRegion(REGIONS.SEA)).toBe(true);
      });

      it('should return false for invalid regions', () => {
        expect(Samira.isValidRegion('invalid-region')).toBe(false);
        expect(Samira.isValidRegion('')).toBe(false);
      });
    });

    describe('getPlatformFromRegion', () => {
      it('should return correct platform for each region', () => {
        expect(Samira.getPlatformFromRegion(REGIONS.AMERICAS)).toBe(PLATFORMS.NA1);
        expect(Samira.getPlatformFromRegion(REGIONS.EUROPE)).toBe(PLATFORMS.EUW1);
        expect(Samira.getPlatformFromRegion(REGIONS.ASIA)).toBe(PLATFORMS.KR);
        expect(Samira.getPlatformFromRegion(REGIONS.SEA)).toBe(PLATFORMS.SG2);
      });

      it('should return default platform for unknown region', () => {
        expect(Samira.getPlatformFromRegion('unknown-region')).toBe(PLATFORMS.NA1);
      });
    });

    describe('getRegionFromPlatform', () => {
      it('should return correct region for each platform', () => {
        expect(Samira.getRegionFromPlatform(PLATFORMS.NA1)).toBe(REGIONS.AMERICAS);
        expect(Samira.getRegionFromPlatform(PLATFORMS.EUW1)).toBe(REGIONS.EUROPE);
        expect(Samira.getRegionFromPlatform(PLATFORMS.KR)).toBe(REGIONS.ASIA);
        expect(Samira.getRegionFromPlatform(PLATFORMS.SG2)).toBe(REGIONS.SEA);
      });

      it('should return default region for unknown platform', () => {
        expect(Samira.getRegionFromPlatform('unknown-platform')).toBe(REGIONS.AMERICAS);
      });
    });
  });
});

describe('Factory Functions', () => {
  const mockApiKey = process.env.RIOT_API_KEY || 'test-api-key-12345';

  describe('createSamira', () => {
    it('should create Samira instance with default config', () => {
      const samira = createSamira(mockApiKey);
      expect(samira).toBeInstanceOf(Samira);
      expect(samira.getConfig().apiKey).toBe(mockApiKey);
      expect(samira.getConfig().platform).toBe(PLATFORMS.NA1);
      expect(samira.getConfig().region).toBe(REGIONS.AMERICAS);
    });

    it('should create Samira instance with custom platform and region', () => {
      const samira = createSamira(mockApiKey, PLATFORMS.EUW1, REGIONS.EUROPE);
      expect(samira.getConfig().platform).toBe(PLATFORMS.EUW1);
      expect(samira.getConfig().region).toBe(REGIONS.EUROPE);
    });
  });

  describe('createPlatformSamira', () => {
    it('should create Samira instance for specific platform', () => {
      const samira = createPlatformSamira(mockApiKey, PLATFORMS.KR);
      expect(samira.getConfig().platform).toBe(PLATFORMS.KR);
      expect(samira.getConfig().region).toBe(REGIONS.ASIA); // Should auto-detect region
    });
  });

  describe('createRegionalSamira', () => {
    it('should create Samira instance for specific region', () => {
      const samira = createRegionalSamira(mockApiKey, REGIONS.EUROPE);
      expect(samira.getConfig().region).toBe(REGIONS.EUROPE);
      expect(samira.getConfig().platform).toBe(PLATFORMS.EUW1); // Should auto-detect platform
    });
  });
});
