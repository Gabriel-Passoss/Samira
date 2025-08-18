import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountService } from '../../src/services/account';
import { HttpClient } from '../../src/utils/httpClient';
import { ENDPOINTS } from '../../src/constants';
import { makeMatch } from '../factories/make-match';
import { right, left } from '../../src/types/either';
import { makeAccount } from '../factories/make-account';

// Mock HttpClient
vi.mock('../../src/utils/httpClient');
vi.mock('../../src/utils/rateLimiter');

describe('AccountService', () => {
  let accountService: AccountService;
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
    accountService = new AccountService(mockHttpClient);
  });

  describe('constructor', () => {
    it('should create MatchService instance', () => {
      expect(accountService).toBeInstanceOf(AccountService);
    });
  });

  describe('getAccountByPuuid', () => {
    it('should fetch account by puuid successfully', async () => {
      const puuid = '1234';
      const mockAccount = makeAccount({ puuid });
      mockHttpClient.get.mockResolvedValue(
        right({ data: mockAccount, status: 200, statusText: 'OK', headers: {} }),
      );

      const result = await accountService.getAccountByPuuid(puuid);
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockAccount);
      }
    });

    it('should return an error if the account is not found', async () => {
      const puuid = '1234';
      const error = { message: 'Account not found', status: 404 };
      mockHttpClient.get.mockResolvedValue(left(error));

      const result = await accountService.getAccountByPuuid(puuid);
      expect(result.isLeft()).toBe(true);
      expect(result.value).toEqual(error);
    });
  });

  describe('getAccountByRiotId', () => {
    it('should fetch account by riot id successfully', async () => {
      const gameName = 'test';
      const tagLine = '1234';
      const mockAccount = makeAccount({ gameName, tagLine });
      mockHttpClient.get.mockResolvedValue(
        right({ data: mockAccount, status: 200, statusText: 'OK', headers: {} }),
      );

      const result = await accountService.getAccountByRiotId(gameName, tagLine);
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockAccount);
      }
    });

    it('should return an error if the account is not found', async () => {
      const gameName = 'test';
      const tagLine = '1234';
      const error = { message: 'Account not found', status: 404 };
      mockHttpClient.get.mockResolvedValue(left(error));

      const result = await accountService.getAccountByRiotId(gameName, tagLine);
      expect(result.isLeft()).toBe(true);
      expect(result.value).toEqual(error);
    });
  });
});
