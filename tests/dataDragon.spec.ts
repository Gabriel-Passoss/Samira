import { describe, it, expect, beforeAll } from 'vitest';
import { DataDragon } from '../src/dataDragon';

describe('Data Dragon Service E2E', () => {
  let dataDragon: DataDragon;

  beforeAll(async () => {
    // Check if API key is available
    if (!process.env.RIOT_API_KEY) {
      console.warn('⚠️  RIOT_API_KEY not found, using test key for debugging');
    }

    // Initialize Samira with Data Dragon configuration
    dataDragon = new DataDragon();

    await dataDragon.init();
  });

  describe('getLatestVersion', () => {
    it('should fetch latest Data Dragon version successfully', async () => {
      const result = await dataDragon.getLatestVersion();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const versions = result.value;
        expect(Array.isArray(versions)).toBe(true);
        expect(versions.length).toBeGreaterThan(0);
        expect(typeof versions[0]).toBe('string');

        expect(versions[0]).toMatch(/^\d+\.\d+\.\d+$/);
      }
    });
  });

  describe('getChampions', () => {
    it('should fetch all champions successfully', async () => {
      const result = await dataDragon.getChampions();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        const champions = result.value;
        expect(typeof champions).toBe('object');
        expect(Object.keys(champions).length).toBeGreaterThan(150);

        const firstChampion = Object.values(champions)[0];
        expect(firstChampion).toHaveProperty('id');
        expect(firstChampion).toHaveProperty('key');
        expect(firstChampion).toHaveProperty('name');
        expect(firstChampion).toHaveProperty('title');
        expect(firstChampion).toHaveProperty('image');
      }
    });
  });

  describe('getChampionById', () => {
    it('should fetch specific champion successfully', async () => {
      await dataDragon.init();
      const result = dataDragon.getChampionResumeById(266);

      expect(result).toBeDefined();
      if (result) {
        const champion = result;
        expect(champion.id).toBe('Aatrox');
        expect(champion.name).toBe('Aatrox');
        expect(champion.title).toContain('Darkin');
        expect(champion.image).toBeDefined();
      }
    });

    it('should handle non-existent champion gracefully', async () => {
      await dataDragon.init();
      expect(() => dataDragon.getChampionResumeById(999)).toThrow();
    });
  });

  describe('getItems', () => {
    it('should fetch all items successfully', async () => {
      const result = await dataDragon.getItems();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const items = result.value;
        expect(typeof items).toBe('object');
        expect(Object.keys(items).length).toBeGreaterThan(200); // Should have many items

        // Check a specific item structure
        const firstItem = Object.values(items)[0];
        expect(firstItem).toHaveProperty('name');
        expect(firstItem).toHaveProperty('description');
        expect(firstItem).toHaveProperty('image');
        expect(firstItem).toHaveProperty('gold');
        expect(firstItem).toHaveProperty('tags');
      }
    });
  });

  describe('getItem', () => {
    it('should fetch specific item successfully', async () => {
      await dataDragon.init();

      const result = dataDragon.getItemById(1001);

      expect(result).toBeDefined();
      if (result) {
        const item = result;
        expect(item.name).toContain('Boots');
        expect(item.image).toBeDefined();
        expect(item.gold).toBeDefined();
        expect(item.tags).toBeDefined();
      }
    });
  });

  describe('getRunes', () => {
    it('should fetch runes successfully', async () => {
      const result = await dataDragon.getRunes();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const runes = result.value;
        expect(Array.isArray(runes)).toBe(true);
        expect(runes.length).toBeGreaterThan(0);

        // Check rune structure
        const firstRune = runes[0];
        expect(firstRune).toHaveProperty('id');
        expect(firstRune).toHaveProperty('key');
        expect(firstRune).toHaveProperty('name');
        expect(firstRune).toHaveProperty('icon');
        expect(firstRune).toHaveProperty('slots');
      }
    });
  });

  describe('getRuneTreeById', () => {
    it('should fetch specific rune successfully', async () => {
      await dataDragon.init();
      const result = dataDragon.getRuneTreeById(8100);

      expect(result).toBeDefined();
      if (result) {
        const rune = result;
        expect(rune.id).toBe(8100);
        expect(rune.name).toBe('Domination');
        expect(rune.icon).toBeDefined();
      }
    });

    it('should handle non-existent rune gracefully', async () => {
      await dataDragon.init();
      expect(() => dataDragon.getRuneTreeById(999)).toThrow();
    });
  });

  describe('getSummonerSpells', () => {
    it('should fetch summoner spells successfully', async () => {
      const result = await dataDragon.getSummonerSpells();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const spells = result.value;
        expect(typeof spells).toBe('object');
        expect(Object.keys(spells).length).toBeGreaterThan(10); // Should have summoner spells

        // Check spell structure
        const firstSpell = Object.values(spells)[0];
        expect(firstSpell).toHaveProperty('id');
        expect(firstSpell).toHaveProperty('name');
        expect(firstSpell).toHaveProperty('description');
        expect(firstSpell).toHaveProperty('image');
        expect(firstSpell).toHaveProperty('cooldown');
        expect(firstSpell).toHaveProperty('cost');
      }
    });
  });

  describe('asset URL methods', () => {
    it('should return full URLs when includeFullUrl is true', () => {
      dataDragon.updateConfig({ includeFullUrl: true });
      const config = dataDragon.getConfig();

      expect(config.includeFullUrl).toBe(true);

      const championImageUrl = dataDragon.getChampionImageUrl('Aatrox');
      expect(championImageUrl).toMatch(
        /^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/.*\/img\/champion\/Aatrox\.png$/,
      );

      const itemImageUrl = dataDragon.getItemImageUrl('1001');
      expect(itemImageUrl).toMatch(
        /^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/.*\/img\/item\/1001\.png$/,
      );

      const profileIconUrl = dataDragon.getProfileIconUrl(1);
      expect(profileIconUrl).toMatch(
        /^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/.*\/img\/profileicon\/1\.png$/,
      );
    });

    it('should handle champion skins correctly', () => {
      const baseImageUrl = dataDragon.getChampionImageUrl('Aatrox');
      const skinImageUrl = dataDragon.getChampionImageUrl('Aatrox', '1');

      expect(baseImageUrl).not.toBe(skinImageUrl);
      expect(skinImageUrl).toContain('Aatrox_1.png');
    });

    it('should handle champion splash art correctly', () => {
      const splashUrl = dataDragon.getChampionSplashUrl('Aatrox');
      expect(splashUrl).toContain('img/champion/splash/Aatrox.png');

      const skinSplashUrl = dataDragon.getChampionSplashUrl('Aatrox', '1');
      expect(skinSplashUrl).toContain('img/champion/splash/Aatrox_1.png');
    });

    it('should handle champion splash art correctly', () => {
      const loadingUrl = dataDragon.getChampionLoadingUrl('Aatrox');
      expect(loadingUrl).toContain(
        'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg',
      );

      const skinLoadingUrl = dataDragon.getChampionLoadingUrl('Aatrox', '1');
      expect(skinLoadingUrl).toContain(
        'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_1.jpg',
      );
    });
  });

  describe('configuration updates', () => {
    it('should update configuration correctly', () => {
      const originalConfig = dataDragon.getConfig();

      dataDragon.updateConfig({
        language: 'pt_BR',
        includeFullUrl: false,
      });

      const updatedConfig = dataDragon.getConfig();
      expect(updatedConfig.language).toBe('pt_BR');
      expect(updatedConfig.includeFullUrl).toBe(false);
      expect(updatedConfig.version).toBe(originalConfig.version);

      const championImageUrl = dataDragon.getChampionImageUrl('Aatrox');
      expect(championImageUrl).toBe('img/champion/Aatrox.png');

      dataDragon.updateConfig(originalConfig);
    });
  });
});
