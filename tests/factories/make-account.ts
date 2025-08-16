import { faker } from '@faker-js/faker';
import type { Account } from '../../src/types';

export interface MakeAccountOptions {
  puuid?: string;
  gameName?: string;
  tagLine?: string;
}

export function makeAccount(options: MakeAccountOptions = {}): Account {
  return {
    puuid: options.puuid || faker.string.uuid(),
    gameName: options.gameName || faker.internet.username(),
    tagLine: options.tagLine || faker.string.alphanumeric({ length: { min: 3, max: 5 } }).toUpperCase(),
  };
}

export function makeAccountArray(count: number, options: MakeAccountOptions = {}): Account[] {
  return Array.from({ length: count }, () => makeAccount(options));
}
