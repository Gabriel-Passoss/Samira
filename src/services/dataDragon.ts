import { HttpClient } from '../utils/httpClient';
import { Either, left, right } from '../types/either';
import { ApiError } from '../utils/httpClient';
import {
  DataDragonConfig,
  ChampionAsset,
  ItemAsset,
  RuneAsset,
  SummonerSpellAsset,
  ChampionAssetSchema,
  ItemAssetSchema,
  RuneAssetSchema,
  SummonerSpellAssetSchema,
} from '../types';
import { z } from 'zod';

export class DataDragonService {
  private client: HttpClient;
  private config: DataDragonConfig;
  private baseUrl: string;
  private version: string;
  private language: string;
  private isVersionFetched: boolean = false;

  constructor(client: HttpClient, config: DataDragonConfig = {}) {
    this.client = client;
    this.config = {
      version: config.version || 'latest',
      language: config.language || 'en_US',
      baseUrl: config.baseUrl || 'https://ddragon.leagueoflegends.com',
      includeFullUrl: config.includeFullUrl || false,
    };

    this.baseUrl = this.config.baseUrl!;
    this.language = this.config.language!;

    // Set initial version - will be updated if 'latest' is specified
    if (this.config.version === 'latest') {
      this.version = 'latest'; // Will be fetched on first use
    } else {
      this.version = this.config.version!;
    }
  }

  /**
   * Ensure the service is ready with the correct version
   */
  private async ensureVersionReady(): Promise<void> {
    // If version is 'latest' and we haven't fetched it yet, fetch it now
    if (this.config.version === 'latest' && !this.isVersionFetched) {
      await this.fetchAndSetLatestVersion();
    }
  }

  /**
   * Fetch and set the latest Data Dragon version
   */
  private async fetchAndSetLatestVersion(): Promise<void> {
    try {
      const versionsResult = await this.getLatestVersion();
      if (versionsResult.isRight()) {
        const versions = versionsResult.value;
        if (versions.length > 0) {
          const latestVersion = versions[0];
          if (latestVersion) {
            this.version = latestVersion;
            this.isVersionFetched = true;
            console.log(`🔄 Data Dragon service using latest version: ${this.version}`);
          } else {
            throw new Error('No valid version found in versions array');
          }
        } else {
          throw new Error('No versions available from Data Dragon API');
        }
      } else {
        throw new Error(`Failed to fetch latest version: ${versionsResult.value.message}`);
      }
    } catch (error) {
      console.error('❌ Error fetching latest version:', error);
      throw new Error(
        `Failed to initialize Data Dragon service: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get the latest Data Dragon version
   */
  async getLatestVersion(): Promise<Either<ApiError, string[]>> {
    const url = `${this.baseUrl}/api/versions.json`;
    const response = await this.client.get<string[]>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    return right(response.value.data);
  }

  /**
   * Get all champions data
   */
  async getChampions(version?: string): Promise<Either<ApiError, Record<string, ChampionAsset>>> {
    const ver = version || this.version;
    const url = `${this.baseUrl}/cdn/${ver}/data/${this.language}/champion.json`;
    const response = await this.client.get<{ data: Record<string, ChampionAsset> }>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      // Validate the response data with Zod
      const champions = z.record(z.string(), ChampionAssetSchema).parse(response.value.data.data);
      return right(champions);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Champions data validation failed',
        details: error,
      });
    }
  }

  /**
   * Get specific champion data
   */
  async getChampion(
    championId: string,
    version?: string,
  ): Promise<Either<ApiError, ChampionAsset>> {
    // Ensure version is ready if using 'latest'
    await this.ensureVersionReady();

    const ver = version || this.version;
    const url = `${this.baseUrl}/cdn/${ver}/data/${this.language}/champion/${championId}.json`;
    const response = await this.client.get<{ data: Record<string, ChampionAsset> }>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      // Extract the champion data (the response has a nested structure)
      const championData = response.value.data.data;
      const championKey = Object.keys(championData)[0];

      if (!championKey) {
        return left({
          status: 404,
          statusText: 'Not Found',
          message: `Champion ${championId} not found`,
        });
      }

      const champion = championData[championKey];
      if (!champion) {
        return left({
          status: 404,
          statusText: 'Not Found',
          message: `Champion ${championId} data is invalid`,
        });
      }

      // Validate the champion data with Zod
      const validatedChampion = ChampionAssetSchema.parse(champion);
      return right(validatedChampion);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Champion data validation failed',
        details: error,
      });
    }
  }

  /**
   * Get all items data
   */
  async getItems(version?: string): Promise<Either<ApiError, Record<string, ItemAsset>>> {
    // Ensure version is ready if using 'latest'
    await this.ensureVersionReady();

    const ver = version || this.version;
    const url = `${this.baseUrl}/cdn/${ver}/data/${this.language}/item.json`;
    const response = await this.client.get<{ data: Record<string, ItemAsset> }>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      // Validate the response data with Zod
      const items = z.record(z.string(), ItemAssetSchema).parse(response.value.data.data);
      return right(items);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Items data validation failed',
        details: error,
      });
    }
  }

  /**
   * Get specific item data
   */
  async getItem(itemId: string, version?: string): Promise<Either<ApiError, ItemAsset>> {
    // Ensure version is ready if using 'latest'
    await this.ensureVersionReady();

    const ver = version || this.version;
    const url = `${this.baseUrl}/cdn/${ver}/data/${this.language}/item.json`;
    const response = await this.client.get<{ data: Record<string, ItemAsset> }>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    const item = response.value.data.data[itemId];
    if (!item) {
      return left({
        status: 404,
        statusText: 'Not Found',
        message: `Item with ID ${itemId} not found`,
      });
    }

    try {
      // Validate the item data with Zod
      const validatedItem = ItemAssetSchema.parse(item);
      return right(validatedItem);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Item data validation failed',
        details: error,
      });
    }
  }

  /**
   * Get runes data
   */
  async getRunes(version?: string): Promise<Either<ApiError, RuneAsset[]>> {
    // Ensure version is ready if using 'latest'
    await this.ensureVersionReady();

    const ver = version || this.version;
    const url = `${this.baseUrl}/cdn/${ver}/data/${this.language}/runesReforged.json`;
    const response = await this.client.get<RuneAsset[]>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      // Validate the response data with Zod
      const runes = z.array(RuneAssetSchema).parse(response.value.data);
      return right(runes);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Runes data validation failed',
        details: error,
      });
    }
  }

  /**
   * Get summoner spells data
   */
  async getSummonerSpells(
    version?: string,
  ): Promise<Either<ApiError, Record<string, SummonerSpellAsset>>> {
    // Ensure version is ready if using 'latest'
    await this.ensureVersionReady();

    const ver = version || this.version;
    const url = `${this.baseUrl}/cdn/${ver}/data/${this.language}/summoner.json`;
    const response = await this.client.get<{ data: Record<string, SummonerSpellAsset> }>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      // Validate the response data with Zod
      const spells = z.record(z.string(), SummonerSpellAssetSchema).parse(response.value.data.data);
      return right(spells);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Summoner spells data validation failed',
        details: error,
      });
    }
  }

  /**
   * Get asset URL (full URL or path based on config)
   */
  getAssetUrl(assetPath: string): string {
    if (this.config.includeFullUrl) {
      return `${this.baseUrl}/cdn/${this.version}/${assetPath}`;
    }
    return assetPath;
  }

  /**
   * Get champion image URL
   */
  getChampionImageUrl(championId: string, skinId?: string): string {
    const imagePath = skinId
      ? `img/champion/${championId}${skinId === '0' ? '' : `_${skinId}`}.png`
      : `img/champion/${championId}.png`;

    return this.getAssetUrl(imagePath);
  }

  /**
   * Get item image URL
   */
  getItemImageUrl(itemId: string): string {
    const imagePath = `img/item/${itemId}.png`;
    return this.getAssetUrl(imagePath);
  }

  /**
   * Get rune image URL
   */
  getRuneImageUrl(runeId: number): string {
    const imagePath = `img/${runeId}.png`;
    return this.getAssetUrl(imagePath);
  }

  /**
   * Get summoner spell image URL
   */
  getSummonerSpellImageUrl(spellId: string): string {
    const imagePath = `img/spell/${spellId}.png`;
    return this.getAssetUrl(imagePath);
  }

  /**
   * Get profile icon URL
   */
  getProfileIconUrl(iconId: number): string {
    const imagePath = `img/profileicon/${iconId}.png`;
    return this.getAssetUrl(imagePath);
  }

  /**
   * Get champion splash art URL
   */
  getChampionSplashUrl(championId: string, skinId?: string): string {
    const imagePath = skinId
      ? `img/champion/splash/${championId}${skinId === '0' ? '_0' : `_${skinId}`}.png`
      : `img/champion/splash/${championId}.png`;

    return this.getAssetUrl(imagePath);
  }

  /**
   * Get champion loading screen URL
   */
  getChampionLoadingUrl(championId: string, skinId?: string): string {
    const imageUrl = skinId
      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}${skinId === '0' && skinId !== undefined ? '_0' : `_${skinId}`}.jpg`
      : `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`;

    return imageUrl;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<DataDragonConfig>): void {
    const oldVersion = this.config.version;
    this.config = { ...this.config, ...config };
    this.baseUrl = this.config.baseUrl || 'https://ddragon.leagueoflegends.com';
    this.language = this.config.language || 'en_US';

    // If version changed to 'latest', reset the fetched state
    if (this.config.version === 'latest' && oldVersion !== 'latest') {
      this.isVersionFetched = false;
    } else if (this.config.version !== 'latest') {
      this.version = this.config.version!;
      this.isVersionFetched = true; // Mark as fetched since we're using a specific version
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): DataDragonConfig {
    return { ...this.config };
  }
}
