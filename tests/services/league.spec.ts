import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LeagueService } from '../../src/services/league';
import { HttpClient } from '../../src/utils/httpClient';
import { ENDPOINTS } from '../../src/constants';
import { right, left } from '../../src/types/either';
import { LeagueEntry } from '../../src/types';
import {
  makeLeagueEntry,
  makeLeagueEntries,
  makeLeagueEntryWithMiniSeries,
  makeLeagueEntriesWithDifferentQueues,
  makeLeagueEntriesWithDifferentTiers,
} from '../factories/make-league-entry';

// Mock HttpClient
vi.mock('../../src/utils/httpClient');
vi.mock('../../src/utils/rateLimiter');

describe('LeagueService', () => {
  let leagueService: LeagueService;
  let mockHttpClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a mock HttpClient instance
    mockHttpClient = {
      get: vi.fn(),
    };

    // Mock the HttpClient constructor to return our mock
    (HttpClient as any).mockImplementation(() => mockHttpClient);

    // Create the service with the mocked client
    leagueService = new LeagueService(mockHttpClient);
  });

  describe('constructor', () => {
    it('should create LeagueService instance', () => {
      expect(leagueService).toBeInstanceOf(LeagueService);
    });
  });

  describe('getEntriesByPuuid', () => {
    it('should fetch league entries by PUUID successfully', async () => {
      const puuid = 'test-puuid-123';
      const mockLeagueEntries = [
        makeLeagueEntry({
          leagueId: 'league-1',
          puuid: 'test-puuid-123',
          queueType: 'RANKED_SOLO_5x5',
          tier: 'GOLD',
          rank: 'II',
          leaguePoints: 75,
          wins: 15,
          losses: 10,
          hotStreak: false,
          veteran: false,
          freshBlood: true,
          inactive: false,
        }),
        makeLeagueEntryWithMiniSeries({
          leagueId: 'league-2',
          puuid: 'test-puuid-123',
          queueType: 'RANKED_FLEX_SR',
          tier: 'SILVER',
          rank: 'I',
          leaguePoints: 50,
          wins: 8,
          losses: 12,
          hotStreak: false,
          veteran: true,
          freshBlood: false,
          inactive: false,
          miniSeriesProgress: 'WWN',
        }),
      ];

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockLeagueEntries,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockLeagueEntries);
        expect(result.value).toHaveLength(2);

        // Check first entry
        const firstEntry = result.value[0];
        expect(firstEntry.leagueId).toBe('league-1');
        expect(firstEntry.puuid).toBe('test-puuid-123');
        expect(firstEntry.queueType).toBe('RANKED_SOLO_5x5');
        expect(firstEntry.tier).toBe('GOLD');
        expect(firstEntry.rank).toBe('II');
        expect(firstEntry.leaguePoints).toBe(75);
        expect(firstEntry.wins).toBe(15);
        expect(firstEntry.losses).toBe(10);
        expect(firstEntry.hotStreak).toBe(false);
        expect(firstEntry.veteran).toBe(false);
        expect(firstEntry.freshBlood).toBe(true);
        expect(firstEntry.inactive).toBe(false);
        expect(firstEntry.miniSeries).toBeUndefined();

        // Check second entry with mini series
        const secondEntry = result.value[1];
        expect(secondEntry.leagueId).toBe('league-2');
        expect(secondEntry.queueType).toBe('RANKED_FLEX_SR');
        expect(secondEntry.tier).toBe('SILVER');
        expect(secondEntry.rank).toBe('I');
        expect(secondEntry.miniSeries).toBeDefined();
        if (secondEntry.miniSeries) {
          expect(secondEntry.miniSeries.losses).toBe(0); // WWN = 2 wins, 0 losses, 1 not played
          expect(secondEntry.miniSeries.progress).toBe('WWN');
          expect(secondEntry.miniSeries.target).toBe(3);
          expect(secondEntry.miniSeries.wins).toBe(2);
        }
      }

      // Verify the correct endpoint was called
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        ENDPOINTS.LEAGUE_ENTRIES_BY_PUUID.replace('{encryptedPUUID}', puuid),
      );
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle empty league entries array', async () => {
      const puuid = 'test-puuid-456';
      const mockLeagueEntries: LeagueEntry[] = [];

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockLeagueEntries,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual([]);
        expect(result.value).toHaveLength(0);
      }
    });

    it('should handle single league entry', async () => {
      const puuid = 'test-puuid-789';
      const mockLeagueEntry = makeLeagueEntry({
        leagueId: 'league-single',
        queueType: 'RANKED_SOLO_5x5',
        tier: 'PLATINUM',
        rank: 'IV',
        leaguePoints: 25,
        wins: 20,
        losses: 15,
        hotStreak: true,
        veteran: false,
        freshBlood: false,
        inactive: false,
      });

      mockHttpClient.get.mockResolvedValue(
        right({
          data: [mockLeagueEntry],
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]).toEqual(mockLeagueEntry);
        expect(result.value[0].hotStreak).toBe(true);
      }
    });

    it('should handle HTTP client errors', async () => {
      const puuid = 'test-puuid-error';
      const mockError = {
        status: 404,
        statusText: 'Not Found',
        message: 'Summoner not found',
      };

      mockHttpClient.get.mockResolvedValue(left(mockError));

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(404);
        expect(result.value.statusText).toBe('Not Found');
        expect(result.value.message).toBe('Summoner not found');
      }

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        ENDPOINTS.LEAGUE_ENTRIES_BY_PUUID.replace('{encryptedPUUID}', puuid),
      );
    });

    it('should handle network errors', async () => {
      const puuid = 'test-puuid-network-error';
      const mockError = {
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Network error occurred',
      };

      mockHttpClient.get.mockResolvedValue(left(mockError));

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(500);
        expect(result.value.message).toBe('Network error occurred');
      }
    });

    it('should handle rate limit errors', async () => {
      const puuid = 'test-puuid-rate-limit';
      const mockError = {
        status: 429,
        statusText: 'Too Many Requests',
        message: 'Rate limit exceeded',
      };

      mockHttpClient.get.mockResolvedValue(left(mockError));

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(429);
        expect(result.value.message).toBe('Rate limit exceeded');
      }
    });

    it('should handle validation errors gracefully', async () => {
      const puuid = 'test-puuid-validation-error';
      const invalidData = [
        {
          leagueId: 'league-1',
          summonerId: 'summoner-1',
          summonerName: 'TestSummoner',
          queueType: 'RANKED_SOLO_5x5',
          tier: 'GOLD',
          rank: 'II',
          leaguePoints: 'invalid-points', // Should be number
          wins: 15,
          losses: 10,
          hotStreak: false,
          veteran: false,
          freshBlood: true,
          inactive: false,
        },
      ];

      mockHttpClient.get.mockResolvedValue(
        right({
          data: invalidData,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await leagueService.getEntriesByPuuid(puuid);

      // The service should handle validation errors and return them
      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(400);
        expect(result.value.statusText).toBe('Validation Error');
        expect(result.value.message).toBe('League entries data validation failed');
        expect(result.value.details).toBeDefined();
      }
    });

    it('should handle different queue types', async () => {
      const puuid = 'test-puuid-queues';
      const mockLeagueEntries = makeLeagueEntriesWithDifferentQueues();

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockLeagueEntries,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(3);

        const soloEntry = result.value.find((entry) => entry.queueType === 'RANKED_SOLO_5x5');
        const flexEntry = result.value.find((entry) => entry.queueType === 'RANKED_FLEX_SR');
        const tftEntry = result.value.find((entry) => entry.queueType === 'RANKED_TFT');

        expect(soloEntry).toBeDefined();
        expect(flexEntry).toBeDefined();
        expect(tftEntry).toBeDefined();

        expect(soloEntry?.tier).toBe('GOLD');
        expect(flexEntry?.tier).toBe('SILVER');
        expect(tftEntry?.tier).toBe('PLATINUM');
      }
    });

    it('should handle different tiers and ranks', async () => {
      const puuid = 'test-puuid-tiers';
      const mockLeagueEntries = makeLeagueEntriesWithDifferentTiers();

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockLeagueEntries,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(4);

        const ironEntry = result.value.find((entry) => entry.tier === 'IRON');
        const challengerEntry = result.value.find((entry) => entry.tier === 'CHALLENGER');

        expect(ironEntry).toBeDefined();
        expect(challengerEntry).toBeDefined();

        expect(ironEntry?.rank).toBe('IV');
        expect(challengerEntry?.rank).toBe(''); // Challenger has no rank
        expect(ironEntry?.leaguePoints).toBe(0);
        expect(challengerEntry?.leaguePoints).toBe(1250);
      }
    });

    it('should handle multiple entries with factory', async () => {
      const puuid = 'test-puuid-multiple';
      const mockLeagueEntries = makeLeagueEntries(5, {
        tier: 'GOLD',
        queueType: 'RANKED_SOLO_5x5',
      });

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockLeagueEntries,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await leagueService.getEntriesByPuuid(puuid);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(5);
        result.value.forEach((entry) => {
          expect(entry.tier).toBe('GOLD');
          expect(entry.queueType).toBe('RANKED_SOLO_5x5');
        });
      }
    });
  });
});
