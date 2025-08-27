import { REGIONS, PLATFORMS, type Region, type Platform } from './constants';
import { HttpClient, createPlatformClient, createRegionalClient } from './utils/httpClient';
import { AccountService } from './services/account';
import { MatchService } from './services/match';
import { SpectatorService } from './services/spectator';
import { SummonerService } from './services/summoner';
import { LeagueService } from './services/league';

export interface SamiraConfig {
  apiKey: string;
  region: Region;
}

export class Samira {
  private config: SamiraConfig;
  private platformClient: HttpClient;
  private regionalClient: HttpClient;

  // Services
  public account: AccountService;
  public match: MatchService;
  public spectator: SpectatorService;
  public summoner: SummonerService;
  public league: LeagueService;

  constructor(config: SamiraConfig) {
    this.config = config;

    // Validate API key
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error('API key is required');
    }

    // Initialize HTTP clients
    this.platformClient = createPlatformClient(
      regionToPlatform(this.config.region as Region),
      this.config.apiKey,
    );

    this.regionalClient = createRegionalClient(this.config.region, this.config.apiKey);

    // Initialize services with smart routing
    this.account = new AccountService(this.platformClient);
    this.match = new MatchService(this.platformClient);
    this.spectator = new SpectatorService(this.regionalClient);
    this.summoner = new SummonerService(this.regionalClient);
    this.league = new LeagueService(this.regionalClient);
  }

  getConfig(): SamiraConfig {
    return { ...this.config };
  }

  /**
   * Update the API key
   */
  updateApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.platformClient.updateApiKey(apiKey);
    this.regionalClient.updateApiKey(apiKey);
  }

  /**
   * Update the region
   */
  updateRegion(region: Region): void {
    this.config.region = region;
    this.regionalClient = createRegionalClient(region, this.config.apiKey);
    this.account = new AccountService(this.regionalClient);
    this.match = new MatchService(this.regionalClient);
  }

  getRegionalClient(): HttpClient {
    return this.regionalClient;
  }

  getPlatformClient(): HttpClient {
    return this.platformClient;
  }

  /**
   * Get available platforms
   */
  static getAvailablePlatforms(): Record<string, string> {
    return { ...PLATFORMS };
  }

  /**
   * Get available regions
   */
  static getAvailableRegions(): Record<string, string> {
    return { ...REGIONS };
  }

  /**
   * Validate platform
   */
  static isValidPlatform(platform: string): boolean {
    return Object.values(PLATFORMS).includes(platform as any);
  }

  /**
   * Validate region
   */
  static isValidRegion(region: string): boolean {
    return Object.values(REGIONS).includes(region as any);
  }
}

/**
 * Create a Samira instance with default configuration
 */
export function createSamira(apiKey: string, region: Region): Samira {
  return new Samira({
    apiKey,
    region,
  });
}

export function regionToPlatform(region: Region): Platform {
  const regionMap: { [key in Region]: Platform } = {
    br1: PLATFORMS.AMERICAS,
    eun1: PLATFORMS.EUROPE,
    euw1: PLATFORMS.EUROPE,
    jp1: PLATFORMS.ASIA,
    kr: PLATFORMS.ASIA,
    la1: PLATFORMS.AMERICAS,
    la2: PLATFORMS.AMERICAS,
    na1: PLATFORMS.AMERICAS,
    oc1: PLATFORMS.SEA,
    ru: PLATFORMS.EUROPE,
    tr1: PLATFORMS.EUROPE,
    ph2: PLATFORMS.SEA,
    sg2: PLATFORMS.SEA,
    th2: PLATFORMS.SEA,
    vn2: PLATFORMS.SEA,
    tw2: PLATFORMS.ASIA,
  };

  if (region in regionMap) {
    return regionMap[region];
  } else {
    throw new Error(`Region ${region} doesn't exist!`);
  }
}
