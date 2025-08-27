import { describe, it, expect } from 'vitest';
import {
  REGIONS,
  PLATFORMS,
  REGIONAL_ROUTING,
  ENDPOINTS,
  QUEUE_TYPES,
  GAME_MODES,
  MAP_IDS,
  CHAMPION_TAGS,
  TIER_LEVELS,
  RANK_DIVISIONS,
} from '../src/constants';

describe('Constants', () => {
  describe('REGIONS', () => {
    it('should have all required regions', () => {
      expect(REGIONS).toHaveProperty('BR1', 'br1');
      expect(REGIONS).toHaveProperty('EUN1', 'eun1');
      expect(REGIONS).toHaveProperty('EUW1', 'euw1');
      expect(REGIONS).toHaveProperty('JP1', 'jp1');
      expect(REGIONS).toHaveProperty('KR', 'kr');
      expect(REGIONS).toHaveProperty('LA1', 'la1');
      expect(REGIONS).toHaveProperty('LA2', 'la2');
      expect(REGIONS).toHaveProperty('NA1', 'na1');
      expect(REGIONS).toHaveProperty('OC1', 'oc1');
      expect(REGIONS).toHaveProperty('PH2', 'ph2');
    });

    it('should have correct number of regions', () => {
      expect(Object.keys(REGIONS)).toHaveLength(16);
    });
  });

  describe('PLATFORMS', () => {
    it('should have major platforms', () => {
      expect(PLATFORMS).toHaveProperty('AMERICAS', 'americas');
      expect(PLATFORMS).toHaveProperty('EUROPE', 'europe');
      expect(PLATFORMS).toHaveProperty('ASIA', 'asia');
      expect(PLATFORMS).toHaveProperty('SEA', 'sea');
    });

    it('should have correct platform URL format', () => {
      Object.values(PLATFORMS).forEach((platform) => {
        expect(platform).toMatch(/^[a-z0-9]+$/);
      });
    });

    it('should have sufficient number of platforms', () => {
      expect(Object.keys(PLATFORMS).length).toBe(4);
    });
  });

  describe('REGIONAL_ROUTING', () => {
    it('should have routing for each region', () => {
      expect(REGIONAL_ROUTING).toHaveProperty('AMERICAS', 'americas');
      expect(REGIONAL_ROUTING).toHaveProperty('EUROPE', 'europe');
      expect(REGIONAL_ROUTING).toHaveProperty('ASIA', 'asia');
      expect(REGIONAL_ROUTING).toHaveProperty('SEA', 'sea');
    });

    it('should have correct routing URL format', () => {
      Object.values(REGIONAL_ROUTING).forEach((routing) => {
        expect(routing).toMatch(/^[a-z]+$/);
      });
    });
  });

  describe('ENDPOINTS', () => {
    it('should have champion endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('CHAMPIONS');
      expect(ENDPOINTS).toHaveProperty('CHAMPION_BY_ID');
      expect(ENDPOINTS.CHAMPIONS).toBe('/lol/platform/v3/champions');
      expect(ENDPOINTS.CHAMPION_BY_ID).toBe('/lol/platform/v3/champions/{id}');
    });

    it('should have summoner endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('SUMMONER_BY_ACCOUNT');
      expect(ENDPOINTS).toHaveProperty('SUMMONER_BY_NAME');
      expect(ENDPOINTS).toHaveProperty('SUMMONER_BY_PUUID');
      expect(ENDPOINTS).toHaveProperty('SUMMONER_BY_ID');
    });

    it('should have match endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('MATCH_BY_ID');
      expect(ENDPOINTS).toHaveProperty('MATCHES_BY_PUUID');
    });

    it('should have league endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('LEAGUE_ENTRIES_BY_PUUID');
    });

    it('should have account endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('ACCOUNT_BY_PUUID');
      expect(ENDPOINTS).toHaveProperty('ACCOUNT_BY_RIOT_ID');
    });

    it('should have champion mastery endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('CHAMPION_MASTERIES_BY_SUMMONER');
      expect(ENDPOINTS).toHaveProperty('CHAMPION_MASTERY_BY_SUMMONER_AND_CHAMPION');
      expect(ENDPOINTS).toHaveProperty('CHAMPION_MASTERY_SCORE_BY_SUMMONER');
    });

    it('should have spectator endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('CURRENT_GAME_BY_SUMMONER');
    });

    it('should have status endpoints', () => {
      expect(ENDPOINTS).toHaveProperty('PLATFORM_STATUS');
    });
  });

  describe('QUEUE_TYPES', () => {
    it('should have major queue types', () => {
      expect(QUEUE_TYPES).toHaveProperty('RANKED_SOLO_5x5', 420);
      expect(QUEUE_TYPES).toHaveProperty('RANKED_FLEX_SR', 440);
      expect(QUEUE_TYPES).toHaveProperty('NORMAL_BLIND_PICK', 430);
      expect(QUEUE_TYPES).toHaveProperty('ARAM', 450);
      expect(QUEUE_TYPES).toHaveProperty('URF', 900);
    });

    it('should have numeric values', () => {
      Object.values(QUEUE_TYPES).forEach((value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('GAME_MODES', () => {
    it('should have classic game modes', () => {
      expect(GAME_MODES).toHaveProperty('CLASSIC', 'CLASSIC');
      expect(GAME_MODES).toHaveProperty('ARAM', 'ARAM');
      expect(GAME_MODES).toHaveProperty('URF', 'URF');
      expect(GAME_MODES).toHaveProperty('TUTORIAL', 'TUTORIAL');
    });

    it('should have string values', () => {
      Object.values(GAME_MODES).forEach((value) => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('MAP_IDS', () => {
    it('should have major map IDs', () => {
      expect(MAP_IDS).toHaveProperty('SUMMONERS_RIFT', 11);
      expect(MAP_IDS).toHaveProperty('HOWLING_ABYSS', 12);
      expect(MAP_IDS).toHaveProperty('NEXUS_BLITZ', 21);
    });

    it('should have numeric values', () => {
      Object.values(MAP_IDS).forEach((value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('CHAMPION_TAGS', () => {
    it('should have all champion roles', () => {
      expect(CHAMPION_TAGS).toHaveProperty('FIGHTER', 'Fighter');
      expect(CHAMPION_TAGS).toHaveProperty('TANK', 'Tank');
      expect(CHAMPION_TAGS).toHaveProperty('MAGE', 'Mage');
      expect(CHAMPION_TAGS).toHaveProperty('ASSASSIN', 'Assassin');
      expect(CHAMPION_TAGS).toHaveProperty('MARKSMAN', 'Marksman');
      expect(CHAMPION_TAGS).toHaveProperty('SUPPORT', 'Support');
    });

    it('should have 6 champion tags', () => {
      expect(Object.keys(CHAMPION_TAGS)).toHaveLength(6);
    });
  });

  describe('TIERS', () => {
    it('should have all ranked tiers', () => {
      expect(TIER_LEVELS).toHaveProperty('IRON', 'IRON');
      expect(TIER_LEVELS).toHaveProperty('BRONZE', 'BRONZE');
      expect(TIER_LEVELS).toHaveProperty('SILVER', 'SILVER');
      expect(TIER_LEVELS).toHaveProperty('GOLD', 'GOLD');
      expect(TIER_LEVELS).toHaveProperty('PLATINUM', 'PLATINUM');
      expect(TIER_LEVELS).toHaveProperty('EMERALD', 'EMERALD');
      expect(TIER_LEVELS).toHaveProperty('DIAMOND', 'DIAMOND');
      expect(TIER_LEVELS).toHaveProperty('MASTER', 'MASTER');
      expect(TIER_LEVELS).toHaveProperty('GRANDMASTER', 'GRANDMASTER');
      expect(TIER_LEVELS).toHaveProperty('CHALLENGER', 'CHALLENGER');
    });

    it('should have 10 tiers', () => {
      expect(Object.keys(TIER_LEVELS)).toHaveLength(10);
    });
  });

  describe('RANKS', () => {
    it('should have all rank divisions', () => {
      expect(RANK_DIVISIONS).toHaveProperty('I', 'I');
      expect(RANK_DIVISIONS).toHaveProperty('II', 'II');
      expect(RANK_DIVISIONS).toHaveProperty('III', 'III');
      expect(RANK_DIVISIONS).toHaveProperty('IV', 'IV');
    });

    it('should have 4 ranks', () => {
      expect(Object.keys(RANK_DIVISIONS)).toHaveLength(4);
    });
  });
});
