import { faker } from '@faker-js/faker';
import type { Match } from '../../src/types';

export interface MakeMatchOptions {
  matchId?: string;
  gameMode?: string;
  queueId?: number;
  platformId?: string;
  gameCreation?: number;
  gameDuration?: number;
  participantsCount?: number;
}

export function makeMatch(options: MakeMatchOptions = {}): Match {
  const {
    matchId = faker.string.alphanumeric(20),
    gameMode = faker.helpers.arrayElement(['CLASSIC', 'ARAM', 'URF', 'NEXUS_BLITZ']),
    queueId = faker.helpers.arrayElement([420, 430, 440, 450, 700, 900, 1020]),
    platformId = faker.helpers.arrayElement(['NA1', 'EUW1', 'KR', 'BR1', 'EUN1']),
    gameCreation = faker.date.recent({ days: 30 }).getTime(),
    gameDuration = faker.number.int({ min: 900, max: 3600 }), // 15-60 minutes in seconds
    participantsCount = 10,
  } = options;

  const gameEndTimestamp = gameCreation + gameDuration * 1000;
  const gameStartTimestamp = gameCreation + 60000; // 1 minute after creation

  // Generate win values for teams first
  const team100Win = faker.datatype.boolean();
  const team200Win = !team100Win; // Ensure opposite values

  const participants = Array.from({ length: participantsCount }, (_, index) => ({
    assists: faker.number.int({ min: 0, max: 25 }),
    baronKills: faker.number.int({ min: 0, max: 3 }),
    bountyLevel: faker.number.int({ min: 0, max: 5 }),
    champExperience: faker.number.int({ min: 0, max: 25000 }),
    champLevel: faker.number.int({ min: 1, max: 18 }),
    championId: faker.number.int({ min: 1, max: 200 }),
    championName: faker.helpers.arrayElement(['Annie', 'Ashe', 'Garen', 'Lux', 'Yasuo', 'Zed']),
    championTransform: 0,
    consumablesPurchased: faker.number.int({ min: 0, max: 10 }),
    damageDealtToBuildings: faker.number.int({ min: 0, max: 15000 }),
    damageDealtToObjectives: faker.number.int({ min: 0, max: 20000 }),
    damageDealtToTurrets: faker.number.int({ min: 0, max: 12000 }),
    damageSelfMitigated: faker.number.int({ min: 0, max: 5000 }),
    deaths: faker.number.int({ min: 0, max: 15 }),
    detectorWardsPlaced: faker.number.int({ min: 0, max: 10 }),
    doubleKills: faker.number.int({ min: 0, max: 5 }),
    dragonKills: faker.number.int({ min: 0, max: 4 }),
    firstBloodAssist: faker.datatype.boolean(),
    firstBloodKill: faker.datatype.boolean(),
    firstTowerAssist: faker.datatype.boolean(),
    firstTowerKill: faker.datatype.boolean(),
    gameEndedInEarlySurrender: false,
    gameEndedInSurrender: faker.datatype.boolean(),
    goldEarned: faker.number.int({ min: 5000, max: 25000 }),
    goldSpent: faker.number.int({ min: 4000, max: 22000 }),
    individualPosition: faker.helpers.arrayElement([
      'TOP',
      'JUNGLE',
      'MIDDLE',
      'BOTTOM',
      'UTILITY',
    ]),
    inhibitorKills: faker.number.int({ min: 0, max: 3 }),
    inhibitorTakedowns: faker.number.int({ min: 0, max: 3 }),
    inhibitorsLost: faker.number.int({ min: 0, max: 3 }),
    item0: faker.number.int({ min: 0, max: 9999 }),
    item1: faker.number.int({ min: 0, max: 9999 }),
    item2: faker.number.int({ min: 0, max: 9999 }),
    item3: faker.number.int({ min: 0, max: 9999 }),
    item4: faker.number.int({ min: 0, max: 9999 }),
    item5: faker.number.int({ min: 0, max: 9999 }),
    item6: faker.number.int({ min: 0, max: 9999 }),
    itemsPurchased: faker.number.int({ min: 5, max: 20 }),
    killingSprees: faker.number.int({ min: 0, max: 8 }),
    kills: faker.number.int({ min: 0, max: 20 }),
    lane: faker.helpers.arrayElement(['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'NONE']),
    largestCriticalStrike: faker.number.int({ min: 0, max: 2000 }),
    largestKillingSpree: faker.number.int({ min: 0, max: 15 }),
    largestMultiKill: faker.number.int({ min: 0, max: 5 }),
    longestTimeSpentLiving: faker.number.int({ min: 300, max: 1800 }),
    magicDamageDealt: faker.number.int({ min: 0, max: 50000 }),
    magicDamageDealtToChampions: faker.number.int({ min: 0, max: 30000 }),
    magicDamageTaken: faker.number.int({ min: 0, max: 40000 }),
    neutralMinionsKilled: faker.number.int({ min: 0, max: 200 }),
    nexusKills: faker.number.int({ min: 0, max: 1 }),
    nexusLost: faker.number.int({ min: 0, max: 1 }),
    nexusTakedowns: faker.number.int({ min: 0, max: 1 }),
    objectivesStolen: faker.number.int({ min: 0, max: 3 }),
    objectivesStolenAssists: faker.number.int({ min: 0, max: 3 }),
    participantId: index + 1,
    pentaKills: faker.number.int({ min: 0, max: 1 }),
    perks: {
      statPerks: {
        defense: faker.number.int({ min: 5000, max: 5008 }),
        flex: faker.number.int({ min: 5008, max: 5008 }),
        offense: faker.number.int({ min: 5005, max: 5007 }),
      },
      styles: [
        {
          description: 'primaryStyle',
          selections: Array.from({ length: 4 }, () => ({
            perk: faker.number.int({ min: 8000, max: 9000 }),
            var1: faker.number.int({ min: 0, max: 3 }),
            var2: faker.number.int({ min: 0, max: 3 }),
            var3: faker.number.int({ min: 0, max: 3 }),
          })),
          style: faker.number.int({ min: 8000, max: 9000 }),
        },
        {
          description: 'subStyle',
          selections: Array.from({ length: 2 }, () => ({
            perk: faker.number.int({ min: 8000, max: 9000 }),
            var1: faker.number.int({ min: 0, max: 3 }),
            var2: faker.number.int({ min: 0, max: 3 }),
            var3: faker.number.int({ min: 0, max: 3 }),
          })),
          style: faker.number.int({ min: 8000, max: 9000 }),
        },
      ],
    },
    physicalDamageDealt: faker.number.int({ min: 0, max: 80000 }),
    physicalDamageDealtToChampions: faker.number.int({ min: 0, max: 40000 }),
    physicalDamageTaken: faker.number.int({ min: 0, max: 50000 }),
    profileIcon: faker.number.int({ min: 1, max: 1000 }),
    puuid: faker.string.uuid(),
    quadraKills: faker.number.int({ min: 0, max: 2 }),
    riotIdName: faker.internet.username(),
    riotIdTagline: faker.string.alphanumeric(4).toUpperCase(),
    role: faker.helpers.arrayElement(['SOLO', 'NONE', 'DUO_CARRY', 'DUO_SUPPORT']),
    sightWardsBoughtInGame: faker.number.int({ min: 0, max: 10 }),
    spell1Casts: faker.number.int({ min: 0, max: 50 }),
    spell2Casts: faker.number.int({ min: 0, max: 50 }),
    spell3Casts: faker.number.int({ min: 0, max: 50 }),
    spell4Casts: faker.number.int({ min: 0, max: 50 }),
    summoner1Casts: faker.number.int({ min: 0, max: 10 }),
    summoner1Id: faker.number.int({ min: 1, max: 14 }),
    summoner2Casts: faker.number.int({ min: 0, max: 10 }),
    summoner2Id: faker.number.int({ min: 1, max: 14 }),
    summonerId: faker.string.uuid(),
    summonerLevel: faker.number.int({ min: 1, max: 500 }),
    summonerName: faker.internet.username(),
    teamEarlySurrendered: false,
    teamId: index < 5 ? 100 : 200,
    teamPosition: faker.helpers.arrayElement(['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY']),
    timeCCingOthers: faker.number.int({ min: 0, max: 300 }),
    timePlayed: gameDuration,
    totalDamageDealt: faker.number.int({ min: 10000, max: 100000 }),
    totalDamageDealtToChampions: faker.number.int({ min: 5000, max: 60000 }),
    totalDamageShieldedOnTeammates: faker.number.int({ min: 0, max: 10000 }),
    totalDamageTaken: faker.number.int({ min: 5000, max: 80000 }),
    totalHeal: faker.number.int({ min: 0, max: 30000 }),
    totalHealsOnTeammates: faker.number.int({ min: 0, max: 20000 }),
    totalMinionsKilled: faker.number.int({ min: 0, max: 400 }),
    totalTimeCCDealt: faker.number.int({ min: 0, max: 600 }),
    totalTimeDead: faker.number.int({ min: 0, max: 600 }),
    totalUnitsHealed: faker.number.int({ min: 0, max: 5 }),
    tripleKills: faker.number.int({ min: 0, max: 3 }),
    trueDamageDealt: faker.number.int({ min: 0, max: 15000 }),
    trueDamageDealtToChampions: faker.number.int({ min: 0, max: 10000 }),
    trueDamageTaken: faker.number.int({ min: 0, max: 20000 }),
    turretKills: faker.number.int({ min: 0, max: 8 }),
    turretTakedowns: faker.number.int({ min: 0, max: 8 }),
    turretsLost: faker.number.int({ min: 0, max: 8 }),
    unrealKills: faker.number.int({ min: 0, max: 1 }),
    visionScore: faker.number.int({ min: 0, max: 100 }),
    visionWardsBoughtInGame: faker.number.int({ min: 0, max: 10 }),
    wardsKilled: faker.number.int({ min: 0, max: 20 }),
    wardsPlaced: faker.number.int({ min: 0, max: 30 }),
    win: index < 5 ? team100Win : team200Win, // Ensure team consistency
  }));

  const puuids = participants.map((p) => p.puuid);

  const teams = [
    {
      bans: Array.from({ length: 5 }, () => ({
        championId: faker.number.int({ min: 1, max: 200 }),
        pickTurn: faker.number.int({ min: 1, max: 10 }),
      })),
      objectives: {
        baron: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 3 }),
        },
        champion: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 50 }),
        },
        dragon: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 4 }),
        },
        inhibitor: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 3 }),
        },
        riftHerald: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 2 }),
        },
        tower: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 8 }),
        },
      },
      teamId: 100,
      win: participants[0].win,
    },
    {
      bans: Array.from({ length: 5 }, () => ({
        championId: faker.number.int({ min: 1, max: 200 }),
        pickTurn: faker.number.int({ min: 1, max: 10 }),
      })),
      objectives: {
        baron: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 3 }),
        },
        champion: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 50 }),
        },
        dragon: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 4 }),
        },
        inhibitor: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 3 }),
        },
        riftHerald: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 2 }),
        },
        tower: {
          first: faker.datatype.boolean(),
          kills: faker.number.int({ min: 0, max: 8 }),
        },
      },
      teamId: 200,
      win: participants[5].win,
    },
  ];

  return {
    metadata: {
      dataVersion: '2',
      matchId,
      participants: puuids,
    },
    info: {
      gameCreation,
      gameDuration,
      gameEndTimestamp,
      gameId: faker.number.int({ min: 1000000000, max: 9999999999 }),
      gameMode,
      gameName: faker.string.alphanumeric(10),
      gameStartTimestamp,
      gameType: 'MATCHED_GAME',
      gameVersion: faker.system.semver(),
      mapId: 11,
      participants,
      platformId,
      queueId,
      teams,
      tournamentCode: faker.helpers.maybe(() => faker.string.alphanumeric(8)),
    },
  };
}

export function makeMatchArray(count: number, options: MakeMatchOptions = {}): Match[] {
  return Array.from({ length: count }, () => makeMatch(options));
}

export function makeMatchWithCustomParticipants(
  participants: any[],
  options: MakeMatchOptions = {},
): Match {
  const match = makeMatch(options);
  match.info.participants = participants;
  match.metadata.participants = participants.map((p) => p.puuid);
  return match;
}
