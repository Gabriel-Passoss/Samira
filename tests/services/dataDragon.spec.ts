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

    // Create the service with the mocked client and a specific version to avoid version fetching
    dataDragonService = new DataDragonService(mockHttpClient, { version: '13.1.1' });
  });

  describe('constructor', () => {
    it('should create DataDragonService instance with default config', () => {
      const defaultService = new DataDragonService(mockHttpClient);
      expect(defaultService).toBeInstanceOf(DataDragonService);
      expect(defaultService.getConfig()).toEqual({
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
      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockVersions,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await dataDragonService.getLatestVersion();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockVersions);
      }
    });
  });

  describe('latest version initialization', () => {
    it('should handle latest version initialization correctly', async () => {
      const latestService = new DataDragonService(mockHttpClient, { version: 'latest' });

      // Mock the version fetching
      const mockVersions = ['13.1.1', '13.1.2', '13.2.1'];
      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockVersions,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      // This should trigger version fetching
      const result = await latestService.getChampion('Aatrox');

      // The service should now have fetched the latest version
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'https://ddragon.leagueoflegends.com/api/versions.json',
      );
    });
  });

  describe('getChampions', () => {
    it('should fetch champions successfully', async () => {
      const mockChampions = {
        Aatrox: {
          version: '13.1.1',
          id: 'Aatrox',
          key: '266',
          name: 'Aatrox',
          title: 'the Darkin Blade',
          blurb:
            'Once honored defenders of Shurima against the Void, Aatrox and his brethren would eventually become an even greater threat to Runeterra.',
          image: {
            full: 'Aatrox.png',
            sprite: 'champion0.png',
            group: 'champion',
            x: 0,
            y: 0,
            w: 48,
            h: 48,
          },
          tags: ['Fighter', 'Tank'],
          partype: 'Blood Well',
          info: { attack: 8, defense: 4, magic: 3 },
          stats: {
            hp: 580,
            hpperlevel: 90,
            mp: 0,
            mpperlevel: 0,
            movespeed: 345,
            armor: 38,
            armorperlevel: 3.25,
            spellblock: 32,
            spellblockperlevel: 1.25,
            attackrange: 175,
            hpregen: 3,
            hpregenperlevel: 1,
            mpregen: 0,
            mpregenperlevel: 0,
            crit: 0,
            critperlevel: 0,
            attackdamage: 60,
            attackdamageperlevel: 5,
            attackspeedperlevel: 2.5,
            attackspeed: 0.651,
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(
        right({
          data: { data: mockChampions },
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

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
        blurb:
          'Once honored defenders of Shurima against the Void, Aatrox and his brethren would eventually become an even greater threat to Runeterra.',
        tags: ['Fighter', 'Tank'],
        partype: 'Blood Well',
        info: { attack: 8, defense: 4, magic: 3, difficulty: 4 },
        image: {
          full: 'Aatrox.png',
          sprite: 'champion0.png',
          group: 'champion',
          x: 0,
          y: 0,
          w: 48,
          h: 48,
        },
        stats: {
          hp: 580,
          hpperlevel: 90,
          mp: 0,
          mpperlevel: 0,
          movespeed: 345,
          armor: 38,
          armorperlevel: 3.25,
          spellblock: 32,
          spellblockperlevel: 1.25,
          attackrange: 175,
          hpregen: 3,
          hpregenperlevel: 1,
          mpregen: 0,
          mpregenperlevel: 0,
          crit: 0,
          critperlevel: 0,
          attackdamage: 60,
          attackdamageperlevel: 5,
          attackspeedperlevel: 2.5,
          attackspeed: 0.651,
        },
        skins: [{ id: '266000', num: 0, name: 'Aatrox', chromas: false }],
        lore: 'Aatrox is a legendary warrior, one of only five that remain of an ancient race known as the Darkin.',
        allytips: [
          'Use Umbral Dash while casting The Darkin Blade to increase your chances of hitting the enemy.',
        ],
        enemytips: [
          "Aatrox's Infernal Chains are easier to escape when running towards the sides or at Aatrox.",
        ],
        spells: [
          {
            id: 'AatroxQ',
            name: 'The Darkin Blade',
            description: 'Aatrox slams his greatsword down.',
            tooltip: 'Aatrox slams his greatsword down, dealing physical damage.',
            leveltip: { label: ['Damage'], effect: ['10/30/50/70/90'] },
            maxrank: 5,
            cooldown: [14, 13, 12, 11, 10],
            cooldownBurn: '14/13/12/11/10',
            cost: [0],
            costBurn: '0',
            effect: [[0], [0], [0], [0], [0]],
            effectBurn: ['0', '0', '0', '0', '0'],
            costType: 'No Cost',
            maxammo: '-1',
            range: [0],
            rangeBurn: '0',
            image: {
              full: 'AatroxQ.png',
              sprite: 'spell0.png',
              group: 'spell',
              x: 0,
              y: 0,
              w: 48,
              h: 48,
            },
            resource: 'No Cost',
          },
        ],
        passive: {
          name: 'Deathbringer Stance',
          description: "Periodically, Aatrox's next basic attack deals bonus physical damage.",
          image: {
            full: 'Aatrox_Passive.png',
            sprite: 'passive0.png',
            group: 'passive',
            x: 0,
            y: 0,
            w: 48,
            h: 48,
          },
        },
      };

      mockHttpClient.get.mockResolvedValue(
        right({
          data: { data: { Aatrox: mockChampion } },
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

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
          plaintext: 'Slightly increases Movement Speed',
          image: { full: '1001.png', sprite: 'item0.png', group: 'item', x: 0, y: 0, w: 48, h: 48 },
          gold: { base: 300, purchasable: true, total: 300, sell: 210 },
          tags: ['Boots'],
          maps: { '11': true, '12': true, '21': true, '22': true },
          stats: {},
        },
      };

      mockHttpClient.get.mockResolvedValue(
        right({
          data: { data: mockItems },
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

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
        plaintext: 'Slightly increases Movement Speed',
        image: { full: '1001.png', sprite: 'item0.png', group: 'item', x: 0, y: 0, w: 48, h: 48 },
        gold: { base: 300, purchasable: true, total: 300, sell: 210 },
        tags: ['Boots'],
        maps: { '11': true, '12': true, '21': true, '22': true },
        stats: {},
      };

      mockHttpClient.get.mockResolvedValue(
        right({
          data: { data: { '1001': mockItem } },
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

      const result = await dataDragonService.getItem('1001');

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value).toEqual(mockItem);
      }
    });

    it('should return error for non-existent item', async () => {
      mockHttpClient.get.mockResolvedValue(
        right({
          data: { data: {} },
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

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
                  shortDesc:
                    'Basic attacks against a champion apply a stack for 4 seconds. At 3 stacks, the target takes 40-180 bonus adaptive damage.',
                  longDesc:
                    'Basic attacks against a champion apply a stack for 4 seconds. At 3 stacks, the target takes 40-180 bonus adaptive damage.',
                },
              ],
            },
          ],
        },
      ];

      mockHttpClient.get.mockResolvedValue(
        right({
          data: mockRunes,
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

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
        SummonerFlash: {
          id: 'SummonerFlash',
          name: 'Flash',
          description: "Teleports your champion a short distance toward your cursor's location.",
          tooltip: "Teleports your champion a short distance toward your cursor's location.",
          maxrank: 1,
          cooldown: [300],
          cooldownBurn: '300',
          cost: [0],
          costBurn: '0',
          effect: [[0]],
          effectBurn: ['0'],
          key: '4',
          summonerLevel: 7,
          modes: ['NexusBlitz', 'SummonersRift', 'HowlingAbyss', 'Tutorial'],
          costType: 'No Cost',
          maxammo: '-1',
          range: [0],
          rangeBurn: '0',
          image: {
            full: 'SummonerFlash.png',
            sprite: 'spell0.png',
            group: 'spell',
            x: 0,
            y: 0,
            w: 48,
            h: 48,
          },
          resource: 'No Cost',
        },
      };

      mockHttpClient.get.mockResolvedValue(
        right({
          data: { data: mockSpells },
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );

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

      expect(service.getChampionImageUrl('Aatrox')).toBe('img/champion/Aatrox.png');
      expect(service.getItemImageUrl('1001')).toBe('img/item/1001.png');
      expect(service.getProfileIconUrl(1)).toBe('img/profileicon/1.png');
    });

    it('should return full URL when includeFullUrl is true', () => {
      const service = new DataDragonService(mockHttpClient, {
        includeFullUrl: true,
        version: '13.1.1',
      });

      expect(service.getChampionImageUrl('Aatrox')).toBe(
        'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png',
      );
      expect(service.getItemImageUrl('1001')).toBe(
        'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/1001.png',
      );
      expect(service.getProfileIconUrl(1)).toBe(
        'https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/1.png',
      );
    });

    it('should handle champion skins correctly', () => {
      const service = new DataDragonService(mockHttpClient, { includeFullUrl: false });

      expect(service.getChampionImageUrl('Aatrox')).toBe('img/champion/Aatrox.png');
      expect(service.getChampionImageUrl('Aatrox', '0')).toBe('img/champion/Aatrox.png');
      expect(service.getChampionImageUrl('Aatrox', '1')).toBe('img/champion/Aatrox_1.png');
    });

    it('should handle champion splash art correctly', () => {
      const service = new DataDragonService(mockHttpClient, { includeFullUrl: false });

      expect(service.getChampionSplashUrl('Aatrox')).toBe('img/champion/splash/Aatrox.png');
      expect(service.getChampionSplashUrl('Aatrox', '1')).toBe('img/champion/splash/Aatrox_1.png');
    });

    it('should handle champion loading screen correctly', () => {
      const service = new DataDragonService(mockHttpClient, { includeFullUrl: false });

      expect(service.getChampionLoadingUrl('Aatrox')).toBe(
        'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg',
      );
      expect(service.getChampionLoadingUrl('Aatrox', '1')).toBe(
        'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_1.jpg',
      );
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
