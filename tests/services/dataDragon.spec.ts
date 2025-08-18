import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataDragonService } from '../../src/services/dataDragon';
import { HttpClient } from '../../src/utils/httpClient';
import { right } from '../../src/types/either';

// Mock HttpClient
vi.mock('../../src/utils/httpClient');
vi.mock('../../src/utils/rateLimiter');

describe('DataDragonService', () => {
  let dataDragonService: DataDragonService;
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
    dataDragonService = new DataDragonService(mockHttpClient);
  });

  describe('constructor', () => {
    it('should create DataDragonService instance with default config', () => {
      expect(dataDragonService).toBeInstanceOf(DataDragonService);
      expect(dataDragonService.getConfig()).toEqual({
        version: 'latest',
        language: 'en_US',
        baseUrl: 'https://ddragon.leagueoflegends.com',
        includeFullUrl: false,
      });
    });

    it('should create DataDragonService instance with custom config', () => {
      const customService = new DataDragonService(mockHttpClient, {
        version: '13.1.1',
        language: 'pt_BR',
        includeFullUrl: true,
      });
      
      expect(customService.getConfig()).toEqual({
        version: '13.1.1',
        language: 'pt_BR',
        baseUrl: 'https://ddragon.leagueoflegends.com',
        includeFullUrl: true,
      });
    });
  });

  describe('getLatestVersion', () => {
    it('should fetch latest version successfully', async () => {
      const mockVersions = ['13.1.1', '13.1.2', '13.2.1'];
      mockHttpClient.get.mockResolvedValue(right({ 
        data: mockVersions, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getLatestVersion();
      
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockVersions);
      }
    });
  });

  describe('getChampions', () => {
    it('should fetch champions successfully', async () => {
      const mockChampions = {
        'Aatrox': {
          id: 'Aatrox',
          key: '266',
          name: 'Aatrox',
          title: 'the Darkin Blade',
          image: { full: 'Aatrox.png', sprite: 'champion0.png', group: 'champion' },
          // These fields are optional in the API response
          skins: [],
          spells: [],
          passive: { name: '', description: '', image: { full: '', sprite: '', group: '' } },
        },
      };
      
      mockHttpClient.get.mockResolvedValue(right({ 
        data: { data: mockChampions }, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getChampions();
      
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockChampions);
      }
    });
  });

  describe('getChampion', () => {
    it('should fetch specific champion successfully', async () => {
      const mockChampion = {
        id: 'Aatrox',
        key: '266',
        name: 'Aatrox',
        title: 'the Darkin Blade',
        image: { full: 'Aatrox.png', sprite: 'champion0.png', group: 'champion' },
        skins: [],
        spells: [],
        passive: { name: '', description: '', image: { full: '', sprite: '', group: '' } },
      };
      
      mockHttpClient.get.mockResolvedValue(right({ 
        data: { data: { 'Aatrox': mockChampion } }, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getChampion('Aatrox');
      
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockChampion);
      }
    });
  });

  describe('getItems', () => {
    it('should fetch items successfully', async () => {
      const mockItems = {
        '1001': {
          name: 'Boots of Speed',
          description: 'Slightly increases Movement Speed',
          image: { full: '1001.png', sprite: 'item0.png', group: 'item' },
          gold: { base: 300, total: 300, sell: 210 },
          tags: ['Boots'],
        },
      };
      
      mockHttpClient.get.mockResolvedValue(right({ 
        data: { data: mockItems }, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getItems();
      
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockItems);
      }
    });
  });

  describe('getItem', () => {
    it('should fetch specific item successfully', async () => {
      const mockItem = {
        name: 'Boots of Speed',
        description: 'Slightly increases Movement Speed',
        image: { full: '1001.png', sprite: 'item0.png', group: 'item' },
        gold: { base: 300, total: 300, sell: 210 },
        tags: ['Boots'],
      };
      
      mockHttpClient.get.mockResolvedValue(right({ 
        data: { data: { '1001': mockItem } }, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getItem('1001');
      
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockItem);
      }
    });

    it('should return error for non-existent item', async () => {
      mockHttpClient.get.mockResolvedValue(right({ 
        data: { data: {} }, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getItem('99999');
      
      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(404);
        expect(result.value.message).toContain('Item with ID 99999 not found');
      }
    });
  });

  describe('getRunes', () => {
    it('should fetch runes successfully', async () => {
      const mockRunes = [
        {
          id: 8000,
          key: 'Precision',
          name: 'Precision',
          icon: 'perk-images/Styles/7201_Precision.png',
          slots: [
            {
              runes: [
                {
                  id: 8005,
                  key: 'PressTheAttack',
                  name: 'Press the Attack',
                  icon: 'perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png',
                  shortDesc: 'Basic attacks against a champion apply a stack for 4 seconds. At 3 stacks, the target takes 40-180 bonus adaptive damage.',
                  longDesc: 'Basic attacks against a champion apply a stack for 4 seconds. At 3 stacks, the target takes 40-180 bonus adaptive damage.',
                },
              ],
            },
          ],
        },
      ];
      
      mockHttpClient.get.mockResolvedValue(right({ 
        data: mockRunes, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getRunes();
      
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockRunes);
      }
    });
  });

  describe('getSummonerSpells', () => {
    it('should fetch summoner spells successfully', async () => {
      const mockSpells = {
        'SummonerFlash': {
          id: 'SummonerFlash',
          name: 'Flash',
          description: 'Teleports your champion a short distance toward your cursor\'s location.',
          tooltip: 'Teleports your champion a short distance toward your cursor\'s location.',
          image: { full: 'SummonerFlash.png', sprite: 'spell0.png', group: 'spell' },
          cooldown: [300],
          cost: [0],
        },
      };
      
      mockHttpClient.get.mockResolvedValue(right({ 
        data: { data: mockSpells }, 
        status: 200, 
        statusText: 'OK', 
        headers: {} 
      }));

      const result = await dataDragonService.getSummonerSpells();
      
      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockSpells);
      }
    });
  });

  describe('asset URL methods', () => {
    it('should return asset path when includeFullUrl is false', () => {
      const service = new DataDragonService(mockHttpClient, { includeFullUrl: false });
      
      expect(service.getChampionImageUrl('Aatrox')).toBe('img/champion/Aatrox.jpg');
      expect(service.getItemImageUrl('1001')).toBe('img/item/1001.png');
      expect(service.getProfileIconUrl(1)).toBe('img/profileicon/1.png');
    });

    it('should return full URL when includeFullUrl is true', () => {
      const service = new DataDragonService(mockHttpClient, { 
        includeFullUrl: true,
        version: '13.1.1'
      });
      
      expect(service.getChampionImageUrl('Aatrox')).toBe('https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.jpg');
      expect(service.getItemImageUrl('1001')).toBe('https://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/1001.png');
      expect(service.getProfileIconUrl(1)).toBe('https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/1.png');
    });

    it('should handle champion skins correctly', () => {
      const service = new DataDragonService(mockHttpClient, { includeFullUrl: false });
      
      expect(service.getChampionImageUrl('Aatrox')).toBe('img/champion/Aatrox.jpg');
      expect(service.getChampionImageUrl('Aatrox', '0')).toBe('img/champion/Aatrox.jpg');
      expect(service.getChampionImageUrl('Aatrox', '1')).toBe('img/champion/Aatrox_1.jpg');
    });

    it('should handle champion splash art correctly', () => {
      const service = new DataDragonService(mockHttpClient, { includeFullUrl: false });
      
      expect(service.getChampionSplashUrl('Aatrox')).toBe('img/champion/splash/Aatrox.jpg');
      expect(service.getChampionSplashUrl('Aatrox', '1')).toBe('img/champion/splash/Aatrox_1.jpg');
    });

    it('should handle champion loading screen correctly', () => {
      const service = new DataDragonService(mockHttpClient, { includeFullUrl: false });
      
      expect(service.getChampionLoadingUrl('Aatrox')).toBe('img/champion/loading/Aatrox.jpg');
      expect(service.getChampionLoadingUrl('Aatrox', '1')).toBe('img/champion/loading/Aatrox_1.jpg');
    });
  });

  describe('updateConfig', () => {
    it('should update configuration correctly', () => {
      dataDragonService.updateConfig({
        version: '13.2.1',
        language: 'pt_BR',
        includeFullUrl: true,
      });
      
      expect(dataDragonService.getConfig()).toEqual({
        version: '13.2.1',
        language: 'pt_BR',
        baseUrl: 'https://ddragon.leagueoflegends.com',
        includeFullUrl: true,
      });
    });
  });
});
