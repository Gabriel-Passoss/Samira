import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { Samira } from '../../src/samira';
import { REGIONS, PLATFORMS } from '../../src/constants';

describe('Data Dragon Service E2E', () => {
  let samira: Samira;

  beforeAll(() => {
    // Check if API key is available
    if (!process.env.RIOT_API_KEY) {
      console.warn('⚠️  RIOT_API_KEY not found, using test key for debugging');
    }

    console.log('🔑 Using API key:', process.env.RIOT_API_KEY);

    // Initialize Samira with Data Dragon configuration
    samira = new Samira({
      apiKey: process.env.RIOT_API_KEY!,
      platform: PLATFORMS.NA1,
      region: REGIONS.AMERICAS,
      dataDragon: {
        version: '15.16.1',
        language: 'en_US',
        includeFullUrl: true,
      },
    });
    
    console.log('🚀 Samira initialized with config:', samira.getConfig());
  });

  const waitForRateLimit = async () => {
    const status = samira.getHttpClient().getRateLimitStatus();
    
    if (!status.canMakeRequest) {
      const delay = status.delayUntilNext;
      await new Promise(resolve => setTimeout(resolve, delay + 100));
    }
    
    if (status.requestsInWindow >= 80) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  beforeEach(async () => {
    await waitForRateLimit();
  });

  describe('getLatestVersion', () => {
    it('should fetch latest Data Dragon version successfully', async () => {
      const result = await samira.dataDragon.getLatestVersion();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const versions = result.value;
        expect(Array.isArray(versions)).toBe(true);
        expect(versions.length).toBeGreaterThan(0);
        expect(typeof versions[0]).toBe('string');
        
        // Version should be in format like "13.1.1"
        expect(versions[0]).toMatch(/^\d+\.\d+\.\d+$/);
        
        console.log('📦 Latest versions:', versions.slice(0, 3));
      }
    });
  });

  describe('getChampions', () => {
    it('should fetch all champions successfully', async () => {
      const result = await samira.dataDragon.getChampions();

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const champions = result.value;
        expect(typeof champions).toBe('object');
        expect(Object.keys(champions).length).toBeGreaterThan(150); // Should have many champions
        
        // Check a specific champion structure (some fields are optional)
        const firstChampion = Object.values(champions)[0];
        expect(firstChampion).toHaveProperty('id');
        expect(firstChampion).toHaveProperty('key');
        expect(firstChampion).toHaveProperty('name');
        expect(firstChampion).toHaveProperty('title');
        expect(firstChampion).toHaveProperty('image');
        
        // These fields are optional in the API response
        if (firstChampion.skins) {
          expect(Array.isArray(firstChampion.skins)).toBe(true);
        }
        if (firstChampion.spells) {
          expect(Array.isArray(firstChampion.spells)).toBe(true);
        }
        if (firstChampion.passive) {
          expect(typeof firstChampion.passive).toBe('object');
        }
      }
    });
  });

  describe('getChampion', () => {
    it('should fetch specific champion successfully', async () => {
      const result = await samira.dataDragon.getChampion('Aatrox');

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const champion = result.value;
        expect(champion.id).toBe('Aatrox');
        expect(champion.name).toBe('Aatrox');
        expect(champion.title).toContain('Darkin');
        expect(champion.image).toBeDefined();
        expect(champion.skins).toBeDefined();
        expect(champion.spells).toBeDefined();
        expect(champion.passive).toBeDefined();
      }
    });

    it('should handle non-existent champion gracefully', async () => {
      const result = await samira.dataDragon.getChampion('NonExistentChampion');

      expect(result.isLeft()).toBe(true);
      if (result.isLeft()) {
        expect(result.value.status).toBe(403);
      }
    });
  });

  describe('getItems', () => {
    it('should fetch all items successfully', async () => {
      const result = await samira.dataDragon.getItems();

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
      const result = await samira.dataDragon.getItem('1001'); // Boots of Speed

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        const item = result.value;
        expect(item.name).toContain('Boots');
        expect(item.image).toBeDefined();
        expect(item.gold).toBeDefined();
        expect(item.tags).toBeDefined();
      }
    });
  });

  describe('getRunes', () => {
    it('should fetch runes successfully', async () => {
      const result = await samira.dataDragon.getRunes();

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

  describe('getSummonerSpells', () => {
    it('should fetch summoner spells successfully', async () => {
      const result = await samira.dataDragon.getSummonerSpells();

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
      const config = samira.dataDragon.getConfig();
      expect(config.includeFullUrl).toBe(true);
      
      const championImageUrl = samira.dataDragon.getChampionImageUrl('Aatrox');
      expect(championImageUrl).toMatch(/^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/.*\/img\/champion\/Aatrox\.png$/);
      
      const itemImageUrl = samira.dataDragon.getItemImageUrl('1001');
      expect(itemImageUrl).toMatch(/^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/.*\/img\/item\/1001\.png$/);
      
      const profileIconUrl = samira.dataDragon.getProfileIconUrl(1);
      expect(profileIconUrl).toMatch(/^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/.*\/img\/profileicon\/1\.png$/);
    });

    it('should handle champion skins correctly', () => {
      const baseImageUrl = samira.dataDragon.getChampionImageUrl('Aatrox');
      const skinImageUrl = samira.dataDragon.getChampionImageUrl('Aatrox', '1');
      
      expect(baseImageUrl).not.toBe(skinImageUrl);
      expect(skinImageUrl).toContain('Aatrox_1.png');
    });

    it('should handle champion splash art correctly', () => {
      const splashUrl = samira.dataDragon.getChampionSplashUrl('Aatrox');
      expect(splashUrl).toContain('img/champion/splash/Aatrox.png');
      
      const skinSplashUrl = samira.dataDragon.getChampionSplashUrl('Aatrox', '1');
      expect(skinSplashUrl).toContain('img/champion/splash/Aatrox_1.png');
    });

    it('should handle champion splash art correctly', () => {
      const loadingUrl = samira.dataDragon.getChampionLoadingUrl('Aatrox');
      expect(loadingUrl).toContain('https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg');
      
      const skinLoadingUrl = samira.dataDragon.getChampionLoadingUrl('Aatrox', '1');
      expect(skinLoadingUrl).toContain('https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_1.jpg');
    });
  });

  describe('configuration updates', () => {
    it('should update configuration correctly', () => {
      const originalConfig = samira.dataDragon.getConfig();
      
      samira.dataDragon.updateConfig({
        language: 'pt_BR',
        includeFullUrl: false,
      });
      
      const updatedConfig = samira.dataDragon.getConfig();
      expect(updatedConfig.language).toBe('pt_BR');
      expect(updatedConfig.includeFullUrl).toBe(false);
      expect(updatedConfig.version).toBe(originalConfig.version); // Should remain unchanged
      
      // Test that asset URLs now return paths instead of full URLs
      const championImageUrl = samira.dataDragon.getChampionImageUrl('Aatrox');
      expect(championImageUrl).toBe('img/champion/Aatrox.png');
      
      // Restore original config
      samira.dataDragon.updateConfig(originalConfig);
      
      console.log('⚙️  Configuration updated successfully');
    });
  });
});
