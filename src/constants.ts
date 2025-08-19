// League of Legends API Regions
export const REGIONS = {
  AMERICAS: 'americas',
  ASIA: 'asia',
  EUROPE: 'europe',
  SEA: 'sea',
} as const;

// Platform routing values
export const PLATFORMS = {
  BR1: 'br1',
  EUN1: 'eun1',
  EUW1: 'euw1',
  JP1: 'jp1',
  KR: 'kr',
  LA1: 'la1',
  LA2: 'la2',
  NA1: 'na1',
  OC1: 'oc1',
  PH2: 'ph2',
  RU: 'ru',
  SG2: 'sg2',
  TH2: 'th2',
  TR1: 'tr1',
  TW2: 'tw2',
  VN2: 'vn2',
} as const;

// Regional routing values
export const REGIONAL_ROUTING = {
  AMERICAS: 'americas',
  ASIA: 'asia',
  EUROPE: 'europe',
  SEA: 'sea',
} as const;

// API Endpoints
export const ENDPOINTS = {
  // Champion endpoints
  CHAMPIONS: '/lol/platform/v3/champions',
  CHAMPION_BY_ID: '/lol/platform/v3/champions/{id}',

  // Summoner endpoints
  SUMMONER_BY_ACCOUNT: '/lol/summoner/v4/summoners/by-account/{encryptedAccountId}',
  SUMMONER_BY_NAME: '/lol/summoner/v4/summoners/by-name/{summonerName}',
  SUMMONER_BY_PUUID: '/lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}',
  SUMMONER_BY_ID: '/lol/summoner/v4/summoners/{encryptedSummonerId}',

  // Match endpoints
  MATCH_BY_ID: '/lol/match/v5/matches/{matchId}',
  MATCHES_BY_PUUID: '/lol/match/v5/matches/by-puuid/{puuid}/ids',

  // League endpoints
  LEAGUE_ENTRIES_BY_PUUID: '/lol/league/v4/entries/by-puuid/{encryptedPUUID}',

  // Account endpoints
  ACCOUNT_BY_PUUID: '/riot/account/v1/accounts/by-puuid/{puuid}',
  ACCOUNT_BY_RIOT_ID: '/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}',

  // Champion Mastery endpoints
  CHAMPION_MASTERIES_BY_SUMMONER:
    '/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}',
  CHAMPION_MASTERY_BY_SUMMONER_AND_CHAMPION:
    '/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}/by-champion/{championId}',
  CHAMPION_MASTERY_SCORE_BY_SUMMONER:
    '/lol/champion-mastery/v4/scores/by-summoner/{encryptedSummonerId}',

  // Spectator endpoints
  CURRENT_GAME_BY_SUMMONER: '/lol/spectator/v5/active-games/by-summoner/{encryptedPUUID}',
  FEATURED_GAMES: '/lol/spectator/v5/featured-games',

  // Status endpoints
  PLATFORM_STATUS: '/lol/status/v4/platform-data',
} as const;

// Queue types
export const QUEUE_TYPES = {
  RANKED_SOLO_5x5: 420,
  RANKED_FLEX_SR: 440,
  NORMAL_BLIND_PICK: 430,
  NORMAL_DRAFT_PICK: 400,
  ARAM: 450,
  URF: 900,
  CLASH: 700,
} as const;

// Game modes
export const GAME_MODES = {
  CLASSIC: 'CLASSIC',
  ODIN: 'ODIN',
  ARAM: 'ARAM',
  TUTORIAL: 'TUTORIAL',
  URF: 'URF',
  DOOM_BOTS_TEEMO: 'DOOM_BOTS_TEEMO',
  ONE_FOR_ALL: 'ONE_FOR_ALL',
  ASCENSION: 'ASCENSION',
  FIRSTBLOOD: 'FIRSTBLOOD',
  KING_PORO: 'KING_PORO',
  SIEGE: 'SIEGE',
  ASSASSINATE: 'ASSASSINATE',
  ARSR: 'ARSR',
  DARKSTAR: 'DARKSTAR',
  STARGUARDIAN: 'STARGUARDIAN',
  PROJECT: 'PROJECT',
  GAMEMODEX: 'GAMEMODEX',
  ODYSSEY: 'ODYSSEY',
  NEXUS_SIEGE: 'NEXUS_SIEGE',
  DOOM_BOTS_V2: 'DOOM_BOTS_V2',
  OVERCHARGE: 'OVERCHARGE',
  SNOWURF: 'SNOWURF',
  TEEMO: 'TEEMO',
  ULTRA_RAPID_FIRE: 'ULTRA_RAPID_FIRE',
  BLOOD_HUNT: 'BLOOD_HUNT',
  NEXUS_BLITZ: 'NEXUS_BLITZ',
  ODYSSEY_EXTRACTION: 'ODYSSEY_EXTRACTION',
  TUTORIAL_MODULE_1: 'TUTORIAL_MODULE_1',
  TUTORIAL_MODULE_2: 'TUTORIAL_MODULE_2',
  TUTORIAL_MODULE_3: 'TUTORIAL_MODULE_3',
} as const;

// Map IDs
export const MAP_IDS = {
  SUMMONERS_RIFT: 11,
  SUMMONERS_RIFT_AUTUMN: 12,
  SUMMONERS_RIFT_SUMMER: 13,
  THE_PROVING_GROUNDS: 3,
  TWISTED_TREELINE_ORIGINAL: 10,
  THE_CRYSTAL_SCAR: 8,
  TWISTED_TREELINE: 10,
  HOWLING_ABYSS: 12,
  BUTCHERS_BRIDGE: 14,
  COSMIC_RUINS: 16,
  VALORAN_CITY_PARK: 18,
  SUBSTRUCTURE_43: 19,
  CRASH_SITE: 20,
  NEXUS_BLITZ: 21,
} as const;

// Champion tags
export const CHAMPION_TAGS = {
  FIGHTER: 'Fighter',
  TANK: 'Tank',
  MAGE: 'Mage',
  ASSASSIN: 'Assassin',
  MARKSMAN: 'Marksman',
  SUPPORT: 'Support',
} as const;

// Tier levels
export const TIERS = {
  IRON: 'IRON',
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
  EMERALD: 'EMERALD',
  DIAMOND: 'DIAMOND',
  MASTER: 'MASTER',
  GRANDMASTER: 'GRANDMASTER',
  CHALLENGER: 'CHALLENGER',
} as const;

// Rank divisions
export const RANKS = {
  I: 'I',
  II: 'II',
  III: 'III',
  IV: 'IV',
} as const;

export type Region = (typeof REGIONS)[keyof typeof REGIONS];
export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS];
export type RegionalRouting = (typeof REGIONAL_ROUTING)[keyof typeof REGIONAL_ROUTING];
export type QueueType = (typeof QUEUE_TYPES)[keyof typeof QUEUE_TYPES];
export type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];
export type MapId = (typeof MAP_IDS)[keyof typeof MAP_IDS];
export type ChampionTag = (typeof CHAMPION_TAGS)[keyof typeof CHAMPION_TAGS];
export type Tier = (typeof TIERS)[keyof typeof TIERS];
export type Rank = (typeof RANKS)[keyof typeof RANKS];
