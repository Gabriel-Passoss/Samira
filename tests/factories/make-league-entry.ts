import { faker } from '@faker-js/faker';
import { LeagueEntry, Tier, Rank } from '../../src/types';

export interface MakeLeagueEntryOptions {
  leagueId?: string;
  puuid?: string;
  summonerId?: string;
  summonerName?: string;
  queueType?: string;
  tier?: Tier;
  rank?: Rank;
  leaguePoints?: number;
  wins?: number;
  losses?: number;
  hotStreak?: boolean;
  veteran?: boolean;
  freshBlood?: boolean;
  inactive?: boolean;
  includeMiniSeries?: boolean;
  miniSeriesProgress?: string;
}

export function makeLeagueEntry(options: MakeLeagueEntryOptions = {}): LeagueEntry {
  const {
    leagueId = faker.string.uuid(),
    puuid = faker.string.uuid(),
    queueType = faker.helpers.arrayElement([
      'RANKED_SOLO_5x5',
      'RANKED_FLEX_SR',
      'RANKED_TFT',
      'RANKED_TFT_TURBO',
      'RANKED_TFT_DOUBLE_UP',
    ]),
    tier = faker.helpers.arrayElement([
      'IRON',
      'BRONZE',
      'SILVER',
      'GOLD',
      'PLATINUM',
      'EMERALD',
      'DIAMOND',
      'MASTER',
      'GRANDMASTER',
      'CHALLENGER',
    ]),
    rank = faker.helpers.arrayElement(['I', 'II', 'III', 'IV']),
    leaguePoints = faker.number.int({ min: 0, max: 100 }),
    wins = faker.number.int({ min: 0, max: 100 }),
    losses = faker.number.int({ min: 0, max: 100 }),
    hotStreak = faker.helpers.arrayElement([true, false]),
    veteran = faker.helpers.arrayElement([true, false]),
    freshBlood = faker.helpers.arrayElement([true, false]),
    inactive = faker.helpers.arrayElement([true, false]),
    includeMiniSeries = false,
    miniSeriesProgress = faker.helpers.arrayElement(['W', 'L', 'N', 'WWN', 'LLN', 'WLN']),
  } = options;

  // Note: In real LoL data, Master+ tiers don't have ranks
  const finalRank = ['CHALLENGER', 'GRANDMASTER', 'MASTER'].includes(tier) ? '' : rank;

  const baseEntry: LeagueEntry = {
    leagueId,
    puuid,
    queueType,
    tier,
    rank: finalRank,
    leaguePoints,
    wins,
    losses,
    hotStreak,
    veteran,
    freshBlood,
    inactive,
  };
  if (includeMiniSeries) {
    const progress = miniSeriesProgress;
    const target = progress.length;
    const miniSeriesWins = (progress.match(/W/g) || []).length;
    const miniSeriesLosses = (progress.match(/L/g) || []).length;

    return {
      ...baseEntry,
      miniSeries: {
        losses: miniSeriesLosses,
        progress,
        target,
        wins: miniSeriesWins,
      },
    };
  }

  return baseEntry;
}

export function makeLeagueEntries(count: number, options: MakeLeagueEntryOptions = {}): LeagueEntry[] {
  return Array.from({ length: count }, () => makeLeagueEntry(options));
}

export function makeLeagueEntriesWithDifferentQueues(): LeagueEntry[] {
  return [
    makeLeagueEntry({
      queueType: 'RANKED_SOLO_5x5',
      tier: 'GOLD',
      rank: 'I',
      leaguePoints: 100,
      wins: 20,
      losses: 15,
    }),
    makeLeagueEntry({
      queueType: 'RANKED_FLEX_SR',
      tier: 'SILVER',
      rank: 'III',
      leaguePoints: 50,
      wins: 10,
      losses: 12,
    }),
    makeLeagueEntry({
      queueType: 'RANKED_TFT',
      tier: 'PLATINUM',
      rank: 'II',
      leaguePoints: 75,
      wins: 25,
      losses: 20,
    }),
  ];
}

export function makeLeagueEntriesWithDifferentTiers(): LeagueEntry[] {
  return [
    makeLeagueEntry({
      tier: 'IRON',
      rank: 'IV',
      leaguePoints: 0,
      wins: 5,
      losses: 15,
    }),
    makeLeagueEntry({
      tier: 'GOLD',
      rank: 'II',
      leaguePoints: 75,
      wins: 15,
      losses: 10,
    }),
    makeLeagueEntry({
      tier: 'PLATINUM',
      rank: 'I',
      leaguePoints: 100,
      wins: 25,
      losses: 20,
    }),
    makeLeagueEntry({
      tier: 'CHALLENGER',
      leaguePoints: 1250,
      wins: 150,
      losses: 50,
      veteran: true,
    }),
  ];
}

export function makeLeagueEntryWithMiniSeries(options: MakeLeagueEntryOptions = {}): LeagueEntry {
  return makeLeagueEntry({
    ...options,
    includeMiniSeries: true,
  });
}
