import { describe, it, expect } from 'vitest';
import { makeActiveGame, makeActiveGameArray } from './make-active-game';
import { CurrentGameSchema } from '../../src/types';

describe('Active Game Factory', () => {
  describe('makeActiveGame', () => {
    it('should generate a valid active game', () => {
      const activeGame = makeActiveGame();
      
      expect(activeGame).toBeDefined();
      expect(activeGame.gameId).toBeDefined();
      expect(activeGame.gameType).toBeDefined();
      expect(activeGame.gameStartTime).toBeDefined();
      expect(activeGame.mapId).toBeDefined();
      expect(activeGame.gameLength).toBeDefined();
      expect(activeGame.platformId).toBeDefined();
      expect(activeGame.gameMode).toBeDefined();
      expect(activeGame.bannedChampions).toBeDefined();
      expect(activeGame.gameQueueConfigId).toBeDefined();
      expect(activeGame.observers).toBeDefined();
      expect(activeGame.participants).toBeDefined();
      
      // Validate against Zod schema
      const result = CurrentGameSchema.safeParse(activeGame);
      expect(result.success).toBe(true);
    });

    it('should generate active game with custom options', () => {
      const customOptions = {
        gameId: 1234567890,
        gameType: 'CUSTOM_GAME',
        gameStartTime: 1640995200000,
        mapId: 11,
        gameLength: 1800,
        platformId: 'NA1',
        gameMode: 'CLASSIC',
        gameQueueConfigId: 420,
        participantsCount: 6,
        bannedChampionsCount: 5
      };
      
      const activeGame = makeActiveGame(customOptions);
      
      expect(activeGame.gameId).toBe(customOptions.gameId);
      expect(activeGame.gameType).toBe(customOptions.gameType);
      expect(activeGame.gameStartTime).toBe(customOptions.gameStartTime);
      expect(activeGame.mapId).toBe(customOptions.mapId);
      expect(activeGame.gameLength).toBe(customOptions.gameLength);
      expect(activeGame.platformId).toBe(customOptions.platformId);
      expect(activeGame.gameMode).toBe(customOptions.gameMode);
      expect(activeGame.gameQueueConfigId).toBe(customOptions.gameQueueConfigId);
      expect(activeGame.participants).toHaveLength(customOptions.participantsCount);
      expect(activeGame.bannedChampions).toHaveLength(customOptions.bannedChampionsCount);
    });

    it('should generate different active games on multiple calls', () => {
      const activeGame1 = makeActiveGame();
      const activeGame2 = makeActiveGame();
      
      expect(activeGame1.gameId).not.toBe(activeGame2.gameId);
      expect(activeGame1.gameStartTime).not.toBe(activeGame2.gameStartTime);
    });
  });

  describe('makeActiveGameArray', () => {
    it('should generate array of active games', () => {
      const count = 3;
      const activeGames = makeActiveGameArray(count);
      
      expect(activeGames).toHaveLength(count);
      activeGames.forEach(activeGame => {
        expect(activeGame).toBeDefined();
        expect(activeGame.gameId).toBeDefined();
        expect(activeGame.gameMode).toBeDefined();
        expect(activeGame.participants).toBeDefined();
      });
    });

    it('should generate active games with custom options', () => {
      const count = 2;
      const customOptions = { gameMode: 'ARAM' };
      const activeGames = makeActiveGameArray(count, customOptions);
      
      expect(activeGames).toHaveLength(count);
      activeGames.forEach(activeGame => {
        expect(activeGame.gameMode).toBe(customOptions.gameMode);
      });
    });
  });

  describe('data validation', () => {
    it('should generate valid game IDs', () => {
      const activeGame = makeActiveGame();
      
      expect(activeGame.gameId).toBeGreaterThanOrEqual(1000000000);
      expect(activeGame.gameId).toBeLessThanOrEqual(9999999999);
    });

    it('should generate valid map IDs', () => {
      const validMapIds = [11, 12, 14, 16, 18, 21, 22];
      const activeGame = makeActiveGame();
      
      expect(validMapIds).toContain(activeGame.mapId);
    });

    it('should generate valid platform IDs', () => {
      const validPlatformIds = ['NA1', 'EUW1', 'EUN1', 'KR', 'BR1', 'LA1', 'LA2', 'OC1', 'TR1', 'RU', 'JP1'];
      const activeGame = makeActiveGame();
      
      expect(validPlatformIds).toContain(activeGame.platformId);
    });

    it('should generate valid game modes', () => {
      const validGameModes = ['CLASSIC', 'ARAM', 'URF', 'NEXUS_BLITZ', 'ULTBOOK'];
      const activeGame = makeActiveGame();
      
      expect(validGameModes).toContain(activeGame.gameMode);
    });

    it('should generate valid game queue config IDs', () => {
      const validQueueIds = [0, 400, 420, 430, 440, 450, 700, 900, 1020, 1300];
      const activeGame = makeActiveGame();
      
      expect(validQueueIds).toContain(activeGame.gameQueueConfigId);
    });

    it('should generate valid game length', () => {
      const activeGame = makeActiveGame();
      
      expect(activeGame.gameLength).toBeGreaterThanOrEqual(0);
      expect(activeGame.gameLength).toBeLessThanOrEqual(3600);
    });

    it('should generate valid game start time', () => {
      const activeGame = makeActiveGame();
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      expect(activeGame.gameStartTime).toBeLessThanOrEqual(now);
      expect(activeGame.gameStartTime).toBeGreaterThan(oneDayAgo);
    });
  });

  describe('participants structure', () => {
    it('should generate correct team distribution', () => {
      const activeGame = makeActiveGame({ participantsCount: 10 });
      
      const team100 = activeGame.participants.filter(p => p.teamId === 100);
      const team200 = activeGame.participants.filter(p => p.teamId === 200);
      
      expect(team100).toHaveLength(5);
      expect(team200).toHaveLength(5);
    });

    it('should generate valid spell IDs', () => {
      const validSpellIds = [1, 3, 4, 6, 7, 11, 12, 13, 14, 21];
      const activeGame = makeActiveGame();
      
      activeGame.participants.forEach(participant => {
        expect(validSpellIds).toContain(participant.spell1Id);
        expect(validSpellIds).toContain(participant.spell2Id);
      });
    });

    it('should generate valid champion IDs', () => {
      const activeGame = makeActiveGame();
      
      activeGame.participants.forEach(participant => {
        expect(participant.championId).toBeGreaterThanOrEqual(1);
        expect(participant.championId).toBeLessThanOrEqual(200);
      });
    });

    it('should generate valid profile icon IDs', () => {
      const activeGame = makeActiveGame();
      
      activeGame.participants.forEach(participant => {
        expect(participant.profileIconId).toBeGreaterThanOrEqual(1);
        expect(participant.profileIconId).toBeLessThanOrEqual(30);
      });
    });
  });

  describe('banned champions structure', () => {
    it('should generate valid banned champion data', () => {
      const activeGame = makeActiveGame({ bannedChampionsCount: 5 });
      
      expect(activeGame.bannedChampions).toHaveLength(5);
      activeGame.bannedChampions.forEach(banned => {
        expect(banned.championId).toBeGreaterThanOrEqual(1);
        expect(banned.championId).toBeLessThanOrEqual(200);
        expect([100, 200]).toContain(banned.teamId);
        expect(banned.pickTurn).toBeGreaterThanOrEqual(1);
        expect(banned.pickTurn).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('observers structure', () => {
    it('should generate valid encryption key', () => {
      const activeGame = makeActiveGame();
      
      expect(activeGame.observers.encryptionKey).toBeDefined();
      expect(activeGame.observers.encryptionKey.length).toBeGreaterThanOrEqual(20);
      expect(activeGame.observers.encryptionKey.length).toBeLessThanOrEqual(30);
    });
  });

  describe('perks structure', () => {
    it('should generate valid perk data', () => {
      const activeGame = makeActiveGame();
      
      activeGame.participants.forEach(participant => {
        expect(participant.perks.perkIds.length).toBeGreaterThanOrEqual(6);
        expect(participant.perks.perkIds.length).toBeLessThanOrEqual(9);
        expect(participant.perks.perkStyle).toBeGreaterThanOrEqual(8000);
        expect(participant.perks.perkStyle).toBeLessThanOrEqual(9000);
        expect(participant.perks.perkSubStyle).toBeGreaterThanOrEqual(8000);
        expect(participant.perks.perkSubStyle).toBeLessThanOrEqual(9000);
      });
    });
  });
});
