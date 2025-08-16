import { faker } from '@faker-js/faker';
import type { Summoner } from '../../src/types';

export interface MakeSummonerOptions {
  accountId?: string;
  profileIconId?: number;
  revisionDate?: number;
  name?: string;
  id?: string;
  puuid?: string;
  summonerLevel?: number;
}

export function makeSummoner(options: MakeSummonerOptions = {}): Summoner {
  return {
    accountId: options.accountId || faker.string.uuid(),
    profileIconId: options.profileIconId || faker.number.int({ min: 1, max: 30 }),
    revisionDate: options.revisionDate || faker.date.recent().getTime(),
    name: options.name || faker.internet.username(),
    id: options.id || faker.string.uuid(),
    puuid: options.puuid || faker.string.uuid(),
    summonerLevel: options.summonerLevel || faker.number.int({ min: 1, max: 500 }),
  };
}

export function makeSummonerArray(count: number, options: MakeSummonerOptions = {}): Summoner[] {
  return Array.from({ length: count }, () => makeSummoner(options));
}