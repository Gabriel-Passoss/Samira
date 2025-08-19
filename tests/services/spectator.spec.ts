import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountService } from '../../src/services/account';
import { HttpClient } from '../../src/utils/httpClient';
import { right, left } from '../../src/types/either';
import { makeActiveGame } from '../factories/make-active-game';
import { SpectatorService } from '../../src/services/spectator';

// Mock HttpClient
vi.mock('../../src/utils/httpClient');
vi.mock('../../src/utils/rateLimiter');

describe('SpectatorService', () => {
  let spectatorService: SpectatorService;
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
    spectatorService = new SpectatorService(mockHttpClient);
  });

  describe('constructor', () => {
    it('should create SpectatorService instance', () => {
      expect(spectatorService).toBeInstanceOf(SpectatorService);
    });
  });

  describe('getActiveGameByPuuid', () => {
    it('should fetch active game by puuid successfully', async () => {
      const puuid = '1234';
      const mockActiveGame = makeActiveGame();
      mockHttpClient.get.mockResolvedValue(
        right({ data: mockActiveGame, status: 200, statusText: 'OK', headers: {} }),
      );

      const result = await spectatorService.getActiveGameByPuuid(puuid);
      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value).toEqual(mockActiveGame);
      }
    });

    it('should return an error if the active game is not found', async () => {
      const puuid = '1234';
      const error = { message: 'Active game not found', status: 404 };
      mockHttpClient.get.mockResolvedValue(left(error));

      const result = await spectatorService.getActiveGameByPuuid(puuid);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toEqual(error);
    });
  });
});
