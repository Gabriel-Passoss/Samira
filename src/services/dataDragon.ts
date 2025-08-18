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

  constructor(client: HttpClient, config: DataDragonConfig = {}) {
    this.client = client;
    this.config = {
      version: config.version || 'latest',
      language: config.language || 'en_US',
      baseUrl: config.baseUrl || 'https://ddragon.leagueoflegends.com',
      includeFullUrl: config.includeFullUrl || false,
    };
    
    this.baseUrl = this.config.baseUrl!;
    this.version = this.config.version!;
    this.language = this.config.language!;
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
  async getChampion(championId: string, version?: string): Promise<Either<ApiError, ChampionAsset>> {
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
  async getSummonerSpells(version?: string): Promise<Either<ApiError, Record<string, SummonerSpellAsset>>> {
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
      ? `img/champion/${championId}${skinId === '0' ? '' : `_${skinId}`}.jpg`
      : `img/champion/${championId}.jpg`;
    
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
      ? `img/champion/splash/${championId}${skinId === '0' ? '' : `_${skinId}`}.jpg`
      : `img/champion/splash/${championId}.jpg`;
    
    return this.getAssetUrl(imagePath);
  }

  /**
   * Get champion loading screen URL
   */
  getChampionLoadingUrl(championId: string, skinId?: string): string {
    const imagePath = skinId 
      ? `img/champion/loading/${championId}${skinId === '0' ? '' : `_${skinId}`}.jpg`
      : `img/champion/loading/${championId}.jpg`;
    
    return this.getAssetUrl(imagePath);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<DataDragonConfig>): void {
    this.config = { ...this.config, ...config };
    this.baseUrl = this.config.baseUrl || 'https://ddragon.leagueoflegends.com';
    this.version = this.config.version || 'latest';
    this.language = this.config.language || 'en_US';
  }

  /**
   * Get current configuration
   */
  getConfig(): DataDragonConfig {
    return { ...this.config };
  }
}
