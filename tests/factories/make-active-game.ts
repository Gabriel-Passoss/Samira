import { faker } from '@faker-js/faker';
import type { CurrentGame } from '../../src/types';

export interface MakeActiveGameOptions {
  gameId?: number;
  gameType?: string;
  gameStartTime?: number;
  mapId?: number;
  gameLength?: number;
  platformId?: string;
  gameMode?: string;
  gameQueueConfigId?: number;
  participantsCount?: number;
  bannedChampionsCount?: number;
}

export function makeActiveGame(options: MakeActiveGameOptions = {}): CurrentGame {
  const participantsCount = options.participantsCount || 10;
  const bannedChampionsCount = options.bannedChampionsCount || faker.number.int({ min: 0, max: 10 });
  
  return {
    gameId: options.gameId || faker.number.int({ min: 1000000000, max: 9999999999 }),
    gameType: options.gameType || faker.helpers.arrayElement(['CUSTOM_GAME', 'MATCHED_GAME', 'TUTORIAL_GAME']),
    gameStartTime: options.gameStartTime || faker.date.recent().getTime(),
    mapId: options.mapId || faker.helpers.arrayElement([11, 12, 14, 16, 18, 21, 22]),
    gameLength: options.gameLength || faker.number.int({ min: 0, max: 3600 }),
    platformId: options.platformId || faker.helpers.arrayElement(['NA1', 'EUW1', 'EUN1', 'KR', 'BR1', 'LA1', 'LA2', 'OC1', 'TR1', 'RU', 'JP1']),
    gameMode: options.gameMode || faker.helpers.arrayElement(['CLASSIC', 'ARAM', 'URF', 'NEXUS_BLITZ', 'ULTBOOK']),
    bannedChampions: Array.from({ length: bannedChampionsCount }, () => ({
      championId: faker.number.int({ min: 1, max: 200 }),
      teamId: faker.helpers.arrayElement([100, 200]),
      pickTurn: faker.number.int({ min: 1, max: 10 }),
    })),
    gameQueueConfigId: options.gameQueueConfigId || faker.helpers.arrayElement([0, 400, 420, 430, 440, 450, 700, 900, 1020, 1300]),
    observers: {
      encryptionKey: faker.string.alphanumeric({ length: { min: 20, max: 30 } }),
    },
    participants: Array.from({ length: participantsCount }, (_, index) => ({
      teamId: index < 5 ? 100 : 200,
      spell1Id: faker.helpers.arrayElement([1, 3, 4, 6, 7, 11, 12, 13, 14, 21]),
      spell2Id: faker.helpers.arrayElement([1, 3, 4, 6, 7, 11, 12, 13, 14, 21]),
      championId: faker.number.int({ min: 1, max: 200 }),
      profileIconId: faker.number.int({ min: 1, max: 30 }),
      puuid: faker.string.uuid(), // Add puuid field that the schema expects
      bot: false,
      gameCustomizationObjects: [],
      perks: {
        perkIds: Array.from({ length: faker.number.int({ min: 6, max: 9 }) }, () => faker.number.int({ min: 8000, max: 9000 })),
        perkStyle: faker.number.int({ min: 8000, max: 9000 }),
        perkSubStyle: faker.number.int({ min: 8000, max: 9000 }),
      },
    })),
  };
}

export function makeActiveGameArray(count: number, options: MakeActiveGameOptions = {}): CurrentGame[] {
  return Array.from({ length: count }, () => makeActiveGame(options));
}