import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatchService } from '../../src/services/match';
import { HttpClient } from '../../src/utils/httpClient';
import { ENDPOINTS } from '../../src/constants';
import { makeMatch } from '../factories/make-match';
import { right, left } from '../../src/types/either';

// Mock HttpClient
vi.mock('../../src/utils/httpClient');
vi.mock('../../src/utils/rateLimiter');

describe('MatchService', () => {
  let matchService: MatchService;
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
    matchService = new MatchService(mockHttpClient);
  });

  describe('constructor', () => {
    it('should create MatchService instance', () => {
      expect(matchService).toBeInstanceOf(MatchService);
    });
  });

  describe('getMatchById', () => {
    it('should fetch match by ID successfully', async () => {
      const matchId = 'BR1_3130694840';
      const mockMatchData = makeMatch({ matchId });

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockMatchData,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const match = await matchService.getMatchById(matchId);

      expect(match.isRight()).toBe(true);
      if (match.isRight()) {
        expect(match.value).toBeDefined();
        expect(match.value.metadata).toBeDefined();
        expect(match.value.metadata.matchId).toBe(matchId);
        expect(match.value.info).toBeDefined();
        expect(match.value.info.participants).toBeDefined();
        expect(Array.isArray(match.value.info.participants)).toBe(true);
        expect(match.value.info.participants.length).toBe(10);
      }
    });

    it('should handle errors when fetching match', async () => {
      const error = { message: 'Match not found', status: 404 };
      mockHttpClient.get.mockResolvedValue(left(error));

      const result = await matchService.getMatchById('invalid-id');
      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.message).toBe('Match not found');
        expect(result.value.status).toBe(404);
      }
    });
  });

  describe('getMatchHistoryByPUUID', () => {
    it('should fetch match history with default options', async () => {
      const mockMatchIds = ['match1', 'match2', 'match3'];

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockMatchIds,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await matchService.getMatchHistoryByPUUID('test-puuid');

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockMatchIds);
      }
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        ENDPOINTS.MATCHES_BY_PUUID.replace('{puuid}', 'test-puuid'),
      );
    });

    it('should fetch match history with custom options', async () => {
      const mockMatchIds = ['match1', 'match2'];
      const options = {
        start: 0,
        count: 2,
        startTime: 1640995200000,
        endTime: 1640997000000,
        queue: 420,
        type: 'ranked',
      };

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockMatchIds,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await matchService.getMatchHistoryByPUUID('test-puuid', options);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockMatchIds);
      }
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining(
          'start=0&count=2&startTime=1640995200000&endTime=1640997000000&queue=420&type=ranked',
        ),
      );
    });
  });

  describe('getMatchesByIds', () => {
    it('should fetch multiple matches by IDs', async () => {
      const matchIds = ['match1', 'match2', 'match3'];
      const mockMatches = [
        makeMatch({ matchId: 'match1', gameMode: 'CLASSIC' }),
        makeMatch({ matchId: 'match2', gameMode: 'ARAM' }),
        makeMatch({ matchId: 'match3', gameMode: 'CLASSIC' }),
      ];

      mockHttpClient.get
        .mockResolvedValueOnce(
          right({ data: mockMatches[0], status: 200, statusText: 'OK', headers: {} }),
        )
        .mockResolvedValueOnce(
          right({ data: mockMatches[1], status: 200, statusText: 'OK', headers: {} }),
        )
        .mockResolvedValueOnce(
          right({ data: mockMatches[2], status: 200, statusText: 'OK', headers: {} }),
        );

      const result = await matchService.getMatchesByIds(matchIds);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(3);
        expect(result.value[0].metadata.matchId).toBe('match1');
        expect(result.value[1].metadata.matchId).toBe('match2');
        expect(result.value[2].metadata.matchId).toBe('match3');
      }
      expect(mockHttpClient.get).toHaveBeenCalledTimes(3);
    });

    it('should handle errors when fetching multiple matches', async () => {
      const matchIds = ['match1', 'match2'];

      mockHttpClient.get
        .mockResolvedValueOnce(
          right({
            data: makeMatch({ matchId: 'match1' }),
            status: 200,
            statusText: 'OK',
            headers: {},
          }),
        )
        .mockResolvedValueOnce(left({ message: 'Failed to fetch match2', status: 500 }));

      const result = await matchService.getMatchesByIds(matchIds);

      // Should return successful matches and handle errors for failed ones
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].metadata.matchId).toBe('match1');
      }
    });
  });

  describe('getRecentMatches', () => {
    it('should fetch recent matches with default count', async () => {
      const mockMatchIds = ['match1', 'match2', 'match3', 'match4', 'match5'];
      const mockMatches = mockMatchIds.map((id) => makeMatch({ matchId: id, gameMode: 'CLASSIC' }));

      mockHttpClient.get.mockResolvedValueOnce(
        right({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} }),
      );

      mockMatches.forEach((match) => {
        mockHttpClient.get.mockResolvedValueOnce(
          right({
            data: match,
            status: 200,
            statusText: 'OK',
            headers: {},
          }),
        );
      });

      const result = await matchService.getRecentMatches('test-puuid');

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(5);
        expect(result.value[0].metadata.matchId).toBe('match1');
      }
    });

    it('should fetch recent matches with custom count', async () => {
      const mockMatchIds = ['match1', 'match2'];
      const mockMatches = mockMatchIds.map((id) => makeMatch({ matchId: id, gameMode: 'CLASSIC' }));

      mockHttpClient.get.mockResolvedValueOnce(
        right({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} }),
      );

      mockMatches.forEach((match) => {
        mockHttpClient.get.mockResolvedValueOnce(
          right({
            data: match,
            status: 200,
            statusText: 'OK',
            headers: {},
          }),
        );
      });

      const result = await matchService.getRecentMatches('test-puuid', 2);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(2);
      }
    });
  });

  describe('getMatchesInTimeRange', () => {
    it('should fetch matches in time range', async () => {
      const startTime = 1640995200000; // Jan 1, 2022
      const endTime = 1640997000000; // Jan 1, 2022 + 30 minutes

      const mockMatchIds = ['match1', 'match2'];
      const mockMatches = mockMatchIds.map((id) => makeMatch({ matchId: id, gameMode: 'CLASSIC' }));

      mockHttpClient.get.mockResolvedValueOnce(
        right({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} }),
      );

      mockMatches.forEach((match) => {
        mockHttpClient.get.mockResolvedValueOnce(
          right({
            data: match,
            status: 200,
            statusText: 'OK',
            headers: {},
          }),
        );
      });

      const result = await matchService.getMatchesInTimeRange('test-puuid', startTime, endTime);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(2);
      }
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining(`startTime=${startTime}&endTime=${endTime}`),
      );
    });
  });

  describe('getMatchesByQueue', () => {
    it('should fetch matches by queue type', async () => {
      const queueId = 420; // Ranked Solo/Duo

      const mockMatchIds = ['match1', 'match2'];
      const mockMatches = mockMatchIds.map((id) =>
        makeMatch({ matchId: id, gameMode: 'CLASSIC', queueId: 420 }),
      );

      mockHttpClient.get.mockResolvedValueOnce(
        right({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} }),
      );

      mockMatches.forEach((match) => {
        mockHttpClient.get.mockResolvedValueOnce(
          right({
            data: match,
            status: 200,
            statusText: 'OK',
            headers: {},
          }),
        );
      });

      const result = await matchService.getMatchesByQueue('test-puuid', queueId);

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toHaveLength(2);
      }
      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining(`queue=${queueId}`));
    });
  });

  describe('utility methods', () => {
    it('should get match duration in minutes', async () => {
      const mockMatchData = makeMatch({ gameDuration: 1800 }); // 30 minutes in seconds

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockMatchData,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await matchService.getMatchDuration('test-match');
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toBe(30);
      }
    });

    it('should get match creation date', async () => {
      const mockMatchData = makeMatch({
        gameCreation: 1641081600000,
        gameDuration: 1800,
      });

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockMatchData,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await matchService.getMatchCreationDate('test-match');
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toBeInstanceOf(Date);
        expect(result.value.getFullYear()).toBe(2022);
        expect(result.value.getMonth()).toBe(0); // January
        expect(result.value.getDate()).toBe(1);
      }
    });
  });
});
