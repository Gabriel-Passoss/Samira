import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeSummoner } from '../factories/make-summoner';
import { HttpClient } from '../../src/utils/httpClient';
import { right, left } from '../../src/types/either';
import { SummonerService } from '../../src/services/summoner';

// Mock HttpClient
vi.mock('../../src/utils/httpClient');
vi.mock('../../src/utils/rateLimiter');

describe('SummonerService', () => {
  let summonerService: SummonerService;
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
    summonerService = new SummonerService(mockHttpClient);
  });

  describe('constructor', () => {
    it('should create MatchService instance', () => {
        expect(summonerService).toBeInstanceOf(SummonerService);
    });
  });

  describe('getSummonerByPuuid', () => {
    it('should fetch summoner by puuid successfully', async () => {
      const puuid = '1234';
      const mockSummoner = makeSummoner({ puuid });
      mockHttpClient.get.mockResolvedValue(right({ data: mockSummoner, status: 200, statusText: 'OK', headers: {} }));

      const result = await summonerService.getSummonerByPuuid(puuid);
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockSummoner);
      }
    });

    it('should return an error if the summoner is not found', async () => {
      const puuid = '1234';
      const error = { message: 'Summoner not found', status: 404 };
      mockHttpClient.get.mockResolvedValue(left(error));
  
      const result = await summonerService.getSummonerByPuuid(puuid);
      expect(result.isLeft()).toBe(true);
      expect(result.value).toEqual(error);
    });
  });
});
