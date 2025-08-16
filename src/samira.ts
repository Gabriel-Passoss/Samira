import { REGIONS, PLATFORMS } from './constants';
import { HttpClient, createPlatformClient, createRegionalClient } from './utils/httpClient';
import { AccountService } from './services/account';
import { MatchService } from './services/match';
import { SpectatorService } from './services/spectator';
import { SummonerService } from './services/summoner';

export interface SamiraConfig {
  apiKey: string;
  platform?: string;
  region?: string;
}

export class Samira {
  private config: SamiraConfig;
  private httpClient: HttpClient;
  
  // Services
  public account: AccountService;
  public match: MatchService;
  public spectator: SpectatorService;
  public summoner: SummonerService;

  constructor(config: SamiraConfig) {
    this.config = config;
    
    // Validate API key
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error('API key is required');
    }

    // Set default platform and region if not provided
    this.config.platform = config.platform || PLATFORMS.NA1;
    this.config.region = config.region || REGIONS.AMERICAS;

    // Initialize HTTP client
    this.httpClient = createPlatformClient(this.config.platform, this.config.apiKey);

    // Initialize services
    this.account = new AccountService(this.httpClient);
    this.match = new MatchService(this.httpClient);
    this.spectator = new SpectatorService(this.httpClient);
    this.summoner = new SummonerService(this.httpClient);
  }

  /**
   * Get current configuration
   */
  getConfig(): SamiraConfig {
    return { ...this.config };
  }

  /**
   * Get the HTTP client instance
   */
  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  /**
   * Update the API key
   */
  updateApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.httpClient.updateApiKey(apiKey);
  }

  /**
   * Update the platform
   */
  updatePlatform(platform: string): void {
    this.config.platform = platform;
    // Recreate HTTP client with new platform
    this.httpClient = createPlatformClient(platform, this.config.apiKey);
    // Reinitialize services with new client
    this.account = new AccountService(this.httpClient);
    this.match = new MatchService(this.httpClient);
    this.spectator = new SpectatorService(this.httpClient);
    this.summoner = new SummonerService(this.httpClient);
  }

  /**
   * Update the region
   */
  updateRegion(region: string): void {
    this.config.region = region;
    // Recreate HTTP client with new region
    this.httpClient = createRegionalClient(region, this.config.apiKey);
    // Reinitialize services with new client
    this.account = new AccountService(this.httpClient);
    this.match = new MatchService(this.httpClient);
    this.spectator = new SpectatorService(this.httpClient);
    this.summoner = new SummonerService(this.httpClient);
  }

  /**
   * Switch to regional routing for account-related endpoints
   */
  useRegionalRouting(): void {
    if (this.config.region) {
      this.httpClient = createRegionalClient(this.config.region, this.config.apiKey);
      // Reinitialize services with new client
      this.account = new AccountService(this.httpClient);
      this.match = new MatchService(this.httpClient);
      this.spectator = new SpectatorService(this.httpClient);
      this.summoner = new SummonerService(this.httpClient);
    }
  }

  /**
   * Switch to platform routing for game-specific endpoints
   */
  usePlatformRouting(): void {
    if (this.config.platform) {
      this.httpClient = createPlatformClient(this.config.platform, this.config.apiKey);
      // Reinitialize services with new client
      this.account = new AccountService(this.httpClient);
      this.match = new MatchService(this.httpClient);
      this.spectator = new SpectatorService(this.httpClient);
      this.summoner = new SummonerService(this.httpClient);
    }
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

  /**
   * Get platform from region
   */
  static getPlatformFromRegion(region: string): string {
    const regionToPlatform: Record<string, string> = {
      [REGIONS.AMERICAS]: PLATFORMS.NA1,
      [REGIONS.EUROPE]: PLATFORMS.EUW1,
      [REGIONS.ASIA]: PLATFORMS.KR,
      [REGIONS.SEA]: PLATFORMS.SG2,
    };

    return regionToPlatform[region] || PLATFORMS.NA1;
  }

  /**
   * Get region from platform
   */
  static getRegionFromPlatform(platform: string): string {
    const platformToRegion: Record<string, string> = {
      [PLATFORMS.NA1]: REGIONS.AMERICAS,
      [PLATFORMS.LA1]: REGIONS.AMERICAS,
      [PLATFORMS.LA2]: REGIONS.AMERICAS,
      [PLATFORMS.BR1]: REGIONS.AMERICAS,
      [PLATFORMS.EUW1]: REGIONS.EUROPE,
      [PLATFORMS.EUN1]: REGIONS.EUROPE,
      [PLATFORMS.TR1]: REGIONS.EUROPE,
      [PLATFORMS.RU]: REGIONS.EUROPE,
      [PLATFORMS.KR]: REGIONS.ASIA,
      [PLATFORMS.JP1]: REGIONS.ASIA,
      [PLATFORMS.OC1]: REGIONS.SEA,
      [PLATFORMS.PH2]: REGIONS.SEA,
      [PLATFORMS.SG2]: REGIONS.SEA,
      [PLATFORMS.TH2]: REGIONS.SEA,
      [PLATFORMS.TW2]: REGIONS.SEA,
      [PLATFORMS.VN2]: REGIONS.SEA,
    };

    return platformToRegion[platform] || REGIONS.AMERICAS;
  }


}

/**
 * Create a Samira instance with default configuration
 */
export function createSamira(apiKey: string, platform?: string, region?: string): Samira {
  return new Samira({
    apiKey,
    ...(platform && { platform }),
    ...(region && { region }),
  });
}

/**
 * Create a Samira instance for a specific platform
 */
export function createPlatformSamira(apiKey: string, platform: string): Samira {
  const region = Samira.getRegionFromPlatform(platform);
  return new Samira({
    apiKey,
    platform,
    region,
  });
}

/**
 * Create a Samira instance for a specific region
 */
export function createRegionalSamira(apiKey: string, region: string): Samira {
  const platform = Samira.getPlatformFromRegion(region);
  return new Samira({
    apiKey,
    platform,
    region,
  });
}
