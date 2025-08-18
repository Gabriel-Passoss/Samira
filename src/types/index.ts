import { z } from 'zod';

// Base API response schemas
export const BaseApiResponse = z.object({
  status: z.number(),
  message: z.string().optional(),
});

// Champion schemas
export const ChampionSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  title: z.string(),
  blurb: z.string(),
  info: z.object({
    attack: z.number(),
    defense: z.number(),
    magic: z.number(),
    difficulty: z.number(),
  }),
  image: z.object({
    full: z.string(),
    sprite: z.string(),
    group: z.string(),
  }),
  tags: z.array(z.string()),
  partype: z.string(),
  stats: z.object({
    hp: z.number(),
    hpperlevel: z.number(),
    mp: z.number(),
    mpperlevel: z.number(),
    movespeed: z.number(),
    armor: z.number(),
    armorperlevel: z.number(),
    spellblock: z.number(),
    spellblockperlevel: z.number(),
    attackrange: z.number(),
    hpregen: z.number(),
    hpregenperlevel: z.number(),
    mpregen: z.number(),
    mpregenperlevel: z.number(),
    crit: z.number(),
    critperlevel: z.number(),
    attackdamage: z.number(),
    attackdamageperlevel: z.number(),
    attackspeedperlevel: z.number(),
    attackspeed: z.number(),
  }),
});

export const ChampionsResponseSchema = z.record(z.string(), ChampionSchema);

// Summoner schemas
export const SummonerSchema = z.object({
  accountId: z.string().optional(),
  profileIconId: z.number(),
  revisionDate: z.number(),
  name: z.string().optional(),
  id: z.string().optional(),
  puuid: z.string(),
  summonerLevel: z.number(),
});

// Match schemas
export const MatchSchema = z.object({
  metadata: z.object({
    dataVersion: z.string(),
    matchId: z.string(),
    participants: z.array(z.string()),
  }),
  info: z.object({
    gameCreation: z.number(),
    gameDuration: z.number(),
    gameEndTimestamp: z.number(),
    gameId: z.number(),
    gameMode: z.string(),
    gameName: z.string(),
    gameStartTimestamp: z.number(),
    gameType: z.string(),
    gameVersion: z.string(),
    mapId: z.number(),
    participants: z.array(z.object({
      assists: z.number(),
      baronKills: z.number(),
      bountyLevel: z.number().optional(), // Make optional as it might not be present in all game modes
      champExperience: z.number(),
      champLevel: z.number(),
      championId: z.number(),
      championName: z.string(),
      championTransform: z.number(),
      consumablesPurchased: z.number(),
      damageDealtToBuildings: z.number(),
      damageDealtToObjectives: z.number(),
      damageDealtToTurrets: z.number(),
      damageSelfMitigated: z.number(),
      deaths: z.number(),
      detectorWardsPlaced: z.number(),
      doubleKills: z.number(),
      dragonKills: z.number(),
      firstBloodAssist: z.boolean(),
      firstBloodKill: z.boolean(),
      firstTowerAssist: z.boolean(),
      firstTowerKill: z.boolean(),
      gameEndedInEarlySurrender: z.boolean(),
      gameEndedInSurrender: z.boolean(),
      goldEarned: z.number(),
      goldSpent: z.number(),
      individualPosition: z.string(),
      inhibitorKills: z.number(),
      inhibitorTakedowns: z.number(),
      inhibitorsLost: z.number(),
      item0: z.number(),
      item1: z.number(),
      item2: z.number(),
      item3: z.number(),
      item4: z.number(),
      item5: z.number(),
      item6: z.number(),
      itemsPurchased: z.number(),
      killingSprees: z.number(),
      kills: z.number(),
      lane: z.string(),
      largestCriticalStrike: z.number(),
      largestKillingSpree: z.number(),
      largestMultiKill: z.number(),
      longestTimeSpentLiving: z.number(),
      magicDamageDealt: z.number(),
      magicDamageDealtToChampions: z.number(),
      magicDamageTaken: z.number(),
      neutralMinionsKilled: z.number(),
      nexusKills: z.number(),
      nexusLost: z.number(),
      nexusTakedowns: z.number(),
      objectivesStolen: z.number(),
      objectivesStolenAssists: z.number(),
      participantId: z.number(),
      pentaKills: z.number(),
      perks: z.object({
        statPerks: z.object({
          defense: z.number(),
          flex: z.number(),
          offense: z.number(),
        }),
        styles: z.array(z.object({
          description: z.string(),
          selections: z.array(z.object({
            perk: z.number(),
            var1: z.number(),
            var2: z.number(),
            var3: z.number(),
          })),
          style: z.number(),
        })),
      }),
      physicalDamageDealt: z.number(),
      physicalDamageDealtToChampions: z.number(),
      physicalDamageTaken: z.number(),
      profileIcon: z.number(),
      puuid: z.string(),
      quadraKills: z.number(),
      riotIdName: z.string().optional(), // Make optional as it might not be present in all responses
      riotIdTagline: z.string().optional(), // Make optional as it might not be present in all responses
      role: z.string(),
      sightWardsBoughtInGame: z.number(),
      spell1Casts: z.number(),
      spell2Casts: z.number(),
      spell3Casts: z.number(),
      spell4Casts: z.number(),
      summoner1Casts: z.number(),
      summoner1Id: z.number(),
      summoner2Casts: z.number(),
      summoner2Id: z.number(),
      summonerId: z.string(),
      summonerLevel: z.number(),
      summonerName: z.string(),
      teamEarlySurrendered: z.boolean(),
      teamId: z.number(),
      teamPosition: z.string(),
      timeCCingOthers: z.number(),
      timePlayed: z.number(),
      totalDamageDealt: z.number(),
      totalDamageDealtToChampions: z.number(),
      totalDamageShieldedOnTeammates: z.number(),
      totalDamageTaken: z.number(),
      totalHeal: z.number(),
      totalHealsOnTeammates: z.number(),
      totalMinionsKilled: z.number(),
      totalTimeCCDealt: z.number(),
      totalTimeDead: z.number().optional(), // Make optional as it might not be present in all responses
      totalUnitsHealed: z.number(),
      tripleKills: z.number(),
      trueDamageDealt: z.number(),
      trueDamageDealtToChampions: z.number(),
      trueDamageTaken: z.number(),
      turretKills: z.number(),
      turretTakedowns: z.number(),
      turretsLost: z.number(),
      unrealKills: z.number(),
      visionScore: z.number(),
      visionWardsBoughtInGame: z.number(),
      wardsKilled: z.number(),
      wardsPlaced: z.number(),
      win: z.boolean(),
    })),
    platformId: z.string(),
    queueId: z.number(),
    teams: z.array(z.object({
      bans: z.array(z.object({
        championId: z.number(),
        pickTurn: z.number(),
      })),
      objectives: z.object({
        baron: z.object({
          first: z.boolean(),
          kills: z.number(),
        }),
        champion: z.object({
          first: z.boolean(),
          kills: z.number(),
        }),
        dragon: z.object({
          first: z.boolean(),
          kills: z.number(),
        }),
        inhibitor: z.object({
          first: z.boolean(),
          kills: z.number(),
        }),
        riftHerald: z.object({
          first: z.boolean(),
          kills: z.number(),
        }),
        tower: z.object({
          first: z.boolean(),
          kills: z.number(),
        }),
      }),
      teamId: z.number(),
      win: z.boolean(),
    })),
    tournamentCode: z.string().optional(),
  }),
});

// League schemas
export const LeagueEntrySchema = z.object({
  leagueId: z.string(),
  puuid: z.string(),
  queueType: z.string(),
  tier: z.string(),
  rank: z.string(),
  leaguePoints: z.number(),
  wins: z.number(),
  losses: z.number(),
  hotStreak: z.boolean(),
  veteran: z.boolean(),
  freshBlood: z.boolean(),
  inactive: z.boolean(),
  miniSeries: z.object({
    losses: z.number(),
    progress: z.string(),
    target: z.number(),
    wins: z.number(),
  }).optional(),
});

// Account schemas
export const AccountSchema = z.object({
  puuid: z.string(),
  gameName: z.string(),
  tagLine: z.string(),
});

// Champion Mastery schemas
export const ChampionMasterySchema = z.object({
  championId: z.number(),
  championLevel: z.number(),
  championPoints: z.number(),
  lastPlayTime: z.number(),
  championPointsSinceLastLevel: z.number(),
  championPointsUntilNextLevel: z.number(),
  chestGranted: z.boolean(),
  tokensEarned: z.number(),
  summonerId: z.string(),
});

// Spectator schemas
export const CurrentGameSchema = z.object({
  gameId: z.number(),
  gameType: z.string(),
  gameStartTime: z.number(),
  mapId: z.number(),
  gameLength: z.number(),
  platformId: z.string(),
  gameMode: z.string(),
  bannedChampions: z.array(z.object({
    championId: z.number(),
    teamId: z.number(),
    pickTurn: z.number(),
  })),
  gameQueueConfigId: z.number(),
  observers: z.object({
    encryptionKey: z.string(),
  }),
  participants: z.array(z.object({
    championId: z.number(),
    profileIconId: z.number(),
    bot: z.boolean(),
    teamId: z.number(),
    puuid: z.string().optional(), // Make optional as it might not be present in all responses
    spell1Id: z.number(),
    spell2Id: z.number(),
    gameCustomizationObjects: z.array(
      z.object({
        category: z.string(),
        content: z.string(),
      })
    ),
    perks: z.object({
      perkIds: z.array(z.number()),
      perkStyle: z.number(),
      perkSubStyle: z.number(),
    }).optional(), // Make optional as it might not be present in all responses
  })),
});

export const FeaturedGamesSchema = z.object({
  gameList: z.array(
    z.object({
      gameMode: z.string(),
      gameLength: z.number(),
      mapId: z.number(),
      gameType: z.string(),
      bannedChampions: z.array(
        z.object({
          pickTurn: z.number(),
          championId: z.number(),
          teamId: z.number(),
        })
      ),
      gameId: z.number(),
      observers: z.object({
        encryptionKey: z.string(),
      }),
      gameQueueConfigId: z.number(),
      participants: z.array(
        z.object({
          bot: z.boolean(),
          spell1Id: z.number(),
          spell2Id: z.number(),
          profileIconId: z.number(),
          puuid: z.string(),
          championId: z.number(),
          teamId: z.number(),
        })
      ),
      platformId: z.string(),
    })
  ),
  clientRefreshInterval: z.number().optional(),
});

// Type exports
export type Champion = z.infer<typeof ChampionSchema>;
export type ChampionsResponse = z.infer<typeof ChampionsResponseSchema>;
export type Summoner = z.infer<typeof SummonerSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type LeagueEntry = z.infer<typeof LeagueEntrySchema>;
export type Account = z.infer<typeof AccountSchema>;
export type ChampionMastery = z.infer<typeof ChampionMasterySchema>;
export type CurrentGame = z.infer<typeof CurrentGameSchema>;
export type FeaturedGames = z.infer<typeof FeaturedGamesSchema>;
export type BaseApiResponse = z.infer<typeof BaseApiResponse>;

// Data Dragon types and schemas
export * from './dataDragon';
