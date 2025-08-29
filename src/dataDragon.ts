import { createDataDragonClient, HttpClient } from './utils/httpClient';
import { Either, left, right } from './types/either';
import { ApiError } from './utils/httpClient';
import {
  DataDragonConfig,
  ItemAsset,
  RuneAsset,
  SummonerSpellAsset,
  ItemAssetSchema,
  RuneAssetSchema,
  SummonerSpellAssetSchema,
} from './types';
import { z } from 'zod';
import type { DataDragonCache } from './types/dataDragon/cache';
import { ChampionResumeSchema, type ChampionResume } from './types/dataDragon/championResume';
import { ENDPOINTS } from './constants';

export class DataDragon {
  private client: HttpClient;
  private config: DataDragonConfig;
  private baseUrl = ENDPOINTS.DATA_DRAGON;
  private version: string;
  private language: string;
  private isVersionFetched: boolean = false;

  private initialized: boolean = false;
  private cache: DataDragonCache;

  constructor(config: DataDragonConfig = {}) {
    this.client = createDataDragonClient();
    this.config = config;
    this.config.includeFullUrl = this.config.includeFullUrl ? true : false;
    this.language = this.config.language ?? 'en_US';

    if (this.config.version === 'latest') {
      this.version = 'latest';
    } else {
      this.version = this.config.version!;
    }

    this.initialized = false;
    this.cache = {
      champions: null,
      items: null,
      runes: null,
      summonerSpells: null,
    };
  }

  /**
   * Initialize the Data Dragon service
   * This will fetch all the data and cache it
   */
  async init(): Promise<void> {
    await this.fetchAndSetLatestVersion();

    if (!this.initialized) {
      const [championsResult, itemsResult, runesResult, spellsResult] = await Promise.all([
        this.getChampions(),
        this.getItems(),
        this.getRunes(),
        this.getSummonerSpells(),
      ]);

      this.cache = {
        champions: championsResult.isRight() ? championsResult.value : null,
        items: itemsResult.isRight() ? itemsResult.value : null,
        runes: runesResult.isRight() ? runesResult.value : null,
        summonerSpells: spellsResult.isRight() ? spellsResult.value : null,
      };

      this.initialized = true;
    }
  }

  /**
   * Ensure the service is ready with the correct version
   */
  private async ensureVersionReady(): Promise<void> {
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
  async getChampions(version?: string): Promise<Either<ApiError, Record<string, ChampionResume>>> {
    const ver = version || this.version;
    const url = `${this.baseUrl}/cdn/${ver}/data/${this.language}/champion.json`;

    const response = await this.client.get<{ data: Record<string, ChampionResume> }>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      // Validate the response data with Zod
      const champions = z.record(z.string(), ChampionResumeSchema).parse(response.value.data.data);
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
  getChampionResumeById(championId: number): ChampionResume {
    if (!this.initialized || !this.cache.champions) {
      throw new Error('Data Dragon service not initialized');
    }

    for (const key in this.cache.champions) {
      if (this.cache.champions[key]!.key === championId.toString()) {
        return this.cache.champions[key]! as ChampionResume;
      }
    }

    throw new Error(`Champion with id ${championId} doesn't exist!`);
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
  getItemById(itemId: number): ItemAsset {
    if (!this.initialized || !this.cache.items) {
      throw new Error('Data Dragon service not initialized');
    }

    for (const key in this.cache.items) {
      if (key === itemId.toString()) {
        return this.cache.items[key]!;
      }
    }

    throw new Error(`Item with id ${itemId} doesn't exist!`);
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

  getRuneTreeById(runeTreeId: number): RuneAsset {
    if (!this.initialized || !this.cache.runes) {
      throw new Error('Data Dragon service not initialized');
    }

    for (const key in this.cache.runes) {
      if (this.cache.runes[key]!.id === runeTreeId) {
        return this.cache.runes[key]! as RuneAsset;
      }
    }

    throw new Error(`Rune with id ${runeTreeId} doesn't exist!`);
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

  getSummonerSpellById(spellId: number): SummonerSpellAsset {
    if (!this.initialized || !this.cache.summonerSpells) {
      throw new Error('Data Dragon service not initialized');
    }

    for (const key in this.cache.summonerSpells) {
      if (this.cache.summonerSpells[key]!.key === spellId.toString()) {
        return this.cache.summonerSpells[key]! as SummonerSpellAsset;
      }
    }

    throw new Error(`Summoner spell with id ${spellId} doesn't exist!`);
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
  getChampionImageUrl(championId: number): string {
    const championName = this.getChampionResumeById(championId).image.full;

    const imagePath = `img/champion/${championName}`;

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
  getRuneImageUrl(runeTree: number, runeId: number): string {
    const runeTreeData = this.getRuneTreeById(runeTree);
    const rune = runeTreeData.slots[0]!.runes.find((rune) => rune.id === runeId);

    if (!rune) {
      throw new Error(`Rune with id ${runeId} not found in rune tree ${runeTree}`);
    }

    return `${this.baseUrl}/cdn/img/${rune.icon}`;
  }

  getRuneTreeImageUrl(runeTree: number): string {
    const runeTreeIcon = this.getRuneTreeById(runeTree).icon;

    return `${this.baseUrl}/cdn/img/${runeTreeIcon}`;
  }

  /**
   * Get summoner spell image URL
   */
  getSummonerSpellImageUrl(spellId: number): string {
    const spellName = this.getSummonerSpellById(spellId).id;

    const imagePath = `img/spell/${spellName}.png`;
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
   * Update configuration
   */
  updateConfig(config: Partial<DataDragonConfig>): void {
    const oldVersion = this.config.version;
    this.config = { ...this.config, ...config };
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
