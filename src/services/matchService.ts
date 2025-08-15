import { HttpClient } from '../utils/httpClient';
import { MatchSchema } from '../types';
import { ENDPOINTS } from '../constants';
import type { Match } from '../types';

export interface MatchHistoryOptions {
  start?: number;
  count?: number;
  startTime?: number;
  endTime?: number;
  queue?: number;
  type?: string;
}

export interface MatchFilterOptions {
  championIds?: number[];
  queueIds?: number[];
  gameModes?: string[];
  startTime?: number;
  endTime?: number;
}

export class MatchService {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Get match by match ID
   */
  async getMatchById(matchId: string): Promise<Match> {
    const url = ENDPOINTS.MATCH_BY_ID.replace('{matchId}', matchId);
    const response = await this.client.get<Match>(url);
    
    return MatchSchema.parse(response.data);
  }

  /**
   * Get match history by PUUID
   */
  async getMatchHistoryByPUUID(puuid: string, options?: MatchHistoryOptions): Promise<string[]> {
    const params = new URLSearchParams();
    
    if (options?.start !== undefined) {
      params.append('start', options.start.toString());
    }
    
    if (options?.count !== undefined) {
      params.append('count', options.count.toString());
    }
    
    if (options?.startTime !== undefined) {
      params.append('startTime', options.startTime.toString());
    }
    
    if (options?.endTime !== undefined) {
      params.append('endTime', options.endTime.toString());
    }
    
    if (options?.queue !== undefined) {
      params.append('queue', options.queue.toString());
    }
    
    if (options?.type !== undefined) {
      params.append('type', options.type);
    }

    const url = `${ENDPOINTS.MATCHES_BY_PUUID.replace('{puuid}', puuid)}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.client.get<string[]>(url);
    
    return response.data;
  }

  /**
   * Get multiple matches by IDs
   */
  async getMatchesByIds(matchIds: string[]): Promise<Match[]> {
    const matches: Match[] = [];
    const errors: Array<{ id: string; error: any }> = [];
    
    // Process in parallel with rate limiting handled by the HTTP client
    const promises = matchIds.map(async (id) => {
      try {
        const match = await this.getMatchById(id);
        return match;
      } catch (error) {
        errors.push({ id, error });
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    
    // Filter out failed requests
    results.forEach((result) => {
      if (result) {
        matches.push(result);
      }
    });
    
    // Log errors if any
    if (errors.length > 0) {
      console.warn(`Failed to fetch ${errors.length} matches:`, errors);
    }
    
    return matches;
  }

  /**
   * Get recent matches for a summoner
   */
  async getRecentMatches(puuid: string, count: number = 20): Promise<Match[]> {
    const matchIds = await this.getMatchHistoryByPUUID(puuid, { count });
    return await this.getMatchesByIds(matchIds);
  }

  /**
   * Get matches within a time range
   */
  async getMatchesInTimeRange(puuid: string, startTime: number, endTime: number): Promise<Match[]> {
    const matchIds = await this.getMatchHistoryByPUUID(puuid, { startTime, endTime });
    return await this.getMatchesByIds(matchIds);
  }

  /**
   * Get matches by queue type
   */
  async getMatchesByQueue(puuid: string, queueId: number): Promise<Match[]> {
    const matchIds = await this.getMatchHistoryByPUUID(puuid, { queue: queueId });
    return await this.getMatchesByIds(matchIds);
  }

  /**
   * Get match duration in minutes
   */
  async getMatchDuration(matchId: string): Promise<number> {
    const match = await this.getMatchById(matchId);
    return Math.floor(match.info.gameDuration / 60);
  }

  /**
   * Get match creation date
   */
  async getMatchCreationDate(matchId: string): Promise<Date> {
    const match = await this.getMatchById(matchId);
    return new Date(match.info.gameCreation);
  }
}
