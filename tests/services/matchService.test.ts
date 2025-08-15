import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatchService } from '../../src/services/matchService';
import { HttpClient } from '../../src/utils/httpClient';
import { ENDPOINTS } from '../../src/constants';
import { makeMatch, makeMatchArray } from '../factories/make-match';

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
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
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

      mockHttpClient.get.mockResolvedValue({
        data: mockMatchData,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      const match = await matchService.getMatchById(matchId);
      
      expect(match).toBeDefined();
      expect(match.metadata).toBeDefined();
      expect(match.metadata.matchId).toBe(matchId);
      expect(match.info).toBeDefined();
      expect(match.info.participants).toBeDefined();
      expect(Array.isArray(match.info.participants)).toBe(true);
      expect(match.info.participants.length).toBe(10);
    });

    it('should handle errors when fetching match', async () => {
      const error = new Error('Match not found');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(matchService.getMatchById('invalid-id')).rejects.toThrow('Match not found');
    });
  });

  describe('getMatchHistoryByPUUID', () => {
    it('should fetch match history with default options', async () => {
      const mockMatchIds = ['match1', 'match2', 'match3'];
      
      mockHttpClient.get.mockResolvedValue({
        data: mockMatchIds,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      const result = await matchService.getMatchHistoryByPUUID('test-puuid');
      
      expect(result).toEqual(mockMatchIds);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        ENDPOINTS.MATCHES_BY_PUUID.replace('{puuid}', 'test-puuid')
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
      
      mockHttpClient.get.mockResolvedValue({
        data: mockMatchIds,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      const result = await matchService.getMatchHistoryByPUUID('test-puuid', options);
      
      expect(result).toEqual(mockMatchIds);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('start=0&count=2&startTime=1640995200000&endTime=1640997000000&queue=420&type=ranked')
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
        .mockResolvedValueOnce({ data: mockMatches[0], status: 200, statusText: 'OK', headers: {} })
        .mockResolvedValueOnce({ data: mockMatches[1], status: 200, statusText: 'OK', headers: {} })
        .mockResolvedValueOnce({ data: mockMatches[2], status: 200, statusText: 'OK', headers: {} });

      const result = await matchService.getMatchesByIds(matchIds);
      
      expect(result).toHaveLength(3);
      expect(result[0].metadata.matchId).toBe('match1');
      expect(result[1].metadata.matchId).toBe('match2');
      expect(result[2].metadata.matchId).toBe('match3');
      expect(mockHttpClient.get).toHaveBeenCalledTimes(3);
    });

    it('should handle errors when fetching multiple matches', async () => {
      const matchIds = ['match1', 'match2'];
      
      mockHttpClient.get
        .mockResolvedValueOnce({ data: makeMatch({ matchId: 'match1' }), status: 200, statusText: 'OK', headers: {} })
        .mockRejectedValueOnce(new Error('Failed to fetch match2'));

      const result = await matchService.getMatchesByIds(matchIds);
      
      // Should return successful matches and log errors for failed ones
      expect(result).toHaveLength(1);
      expect(result[0].metadata.matchId).toBe('match1');
    });
  });

  describe('getRecentMatches', () => {
    it('should fetch recent matches with default count', async () => {
      const mockMatchIds = ['match1', 'match2', 'match3', 'match4', 'match5'];
      const mockMatches = mockMatchIds.map(id => makeMatch({ matchId: id, gameMode: 'CLASSIC' }));

      mockHttpClient.get
        .mockResolvedValueOnce({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} });

      mockMatches.forEach(match => {
        mockHttpClient.get.mockResolvedValueOnce({
          data: match,
          status: 200,
          statusText: 'OK',
          headers: {},
        });
      });

      const result = await matchService.getRecentMatches('test-puuid');
      
      expect(result).toHaveLength(5);
      expect(result[0].metadata.matchId).toBe('match1');
    });

    it('should fetch recent matches with custom count', async () => {
      const mockMatchIds = ['match1', 'match2'];
      const mockMatches = mockMatchIds.map(id => makeMatch({ matchId: id, gameMode: 'CLASSIC' }));

      mockHttpClient.get
        .mockResolvedValueOnce({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} });

      mockMatches.forEach(match => {
        mockHttpClient.get.mockResolvedValueOnce({
          data: match,
          status: 200,
          statusText: 'OK',
          headers: {},
        });
      });

      const result = await matchService.getRecentMatches('test-puuid', 2);
      
      expect(result).toHaveLength(2);
    });
  });

  describe('getMatchesInTimeRange', () => {
    it('should fetch matches in time range', async () => {
      const startTime = 1640995200000; // Jan 1, 2022
      const endTime = 1640997000000;   // Jan 1, 2022 + 30 minutes
      
      const mockMatchIds = ['match1', 'match2'];
      const mockMatches = mockMatchIds.map(id => makeMatch({ matchId: id, gameMode: 'CLASSIC' }));

      mockHttpClient.get
        .mockResolvedValueOnce({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} });

      mockMatches.forEach(match => {
        mockHttpClient.get.mockResolvedValueOnce({
          data: match,
          status: 200,
          statusText: 'OK',
          headers: {},
        });
      });

      const result = await matchService.getMatchesInTimeRange('test-puuid', startTime, endTime);
      
      expect(result).toHaveLength(2);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining(`startTime=${startTime}&endTime=${endTime}`)
      );
    });
  });

  describe('getMatchesByQueue', () => {
    it('should fetch matches by queue type', async () => {
      const queueId = 420; // Ranked Solo/Duo
      
      const mockMatchIds = ['match1', 'match2'];
      const mockMatches = mockMatchIds.map(id => makeMatch({ matchId: id, gameMode: 'CLASSIC', queueId: 420 }));

      mockHttpClient.get
        .mockResolvedValueOnce({ data: mockMatchIds, status: 200, statusText: 'OK', headers: {} });

      mockMatches.forEach(match => {
        mockHttpClient.get.mockResolvedValueOnce({
          data: match,
          status: 200,
          statusText: 'OK',
          headers: {},
        });
      });

      const result = await matchService.getMatchesByQueue('test-puuid', queueId);
      
      expect(result).toHaveLength(2);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining(`queue=${queueId}`)
      );
    });
  });

  describe('utility methods', () => {
    it('should get match duration in minutes', async () => {
      const mockMatchData = makeMatch({ gameDuration: 1800 }); // 30 minutes in seconds

      mockHttpClient.get.mockResolvedValue({
        data: mockMatchData,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      const result = await matchService.getMatchDuration('test-match');
      expect(result).toBe(30);
    });

    it('should get match creation date', async () => {
      const mockMatchData = makeMatch({ 
        gameCreation: 1641081600000,
        gameDuration: 1800 
      });

      mockHttpClient.get.mockResolvedValue({
        data: mockMatchData,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      const result = await matchService.getMatchCreationDate('test-match');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2022);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(1);
    });
  });
});
