import { HttpClient } from '../utils/httpClient';
import { MatchSchema } from '../types';
import { ENDPOINTS } from '../constants';
import type { Match } from '../types';
import { Either, left, right } from '../types/either';
import { ApiError } from '../utils/httpClient';

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
  async getMatchById(matchId: string): Promise<Either<ApiError, Match>> {
    const url = ENDPOINTS.MATCH_BY_ID.replace('{matchId}', matchId);
    const response = await this.client.get<Match>(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      const match = MatchSchema.parse(response.value.data);
      return right(match);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Match data validation failed',
        details: error,
      });
    }
  }

  /**
   * Get match history by PUUID
   */
  async getMatchHistoryByPUUID(
    puuid: string,
    options?: MatchHistoryOptions,
  ): Promise<Either<ApiError, string[]>> {
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

    if (response.isLeft()) {
      return left(response.value);
    }

    return right(response.value.data);
  }

  /**
   * Get multiple matches by IDs
   */
  async getMatchesByIds(matchIds: string[]): Promise<Either<ApiError, Match[]>> {
    const matches: Match[] = [];
    const errors: Array<{ id: string; error: any }> = [];

    // Process in parallel with rate limiting handled by the HTTP client
    const promises = matchIds.map(async (id) => {
      return await this.getMatchById(id);
    });

    const results = await Promise.all(promises);

    // Filter out failed requests and extract successful matches
    results.forEach((result) => {
      if (result.isRight()) {
        matches.push(result.value);
      } else {
        errors.push({ id: 'unknown', error: result.value });
      }
    });

    // Log errors if any
    if (errors.length > 0) {
      console.warn(`Failed to fetch ${errors.length} matches:`, errors);
    }

    return right(matches);
  }

  /**
   * Get recent matches for a summoner
   */
  async getRecentMatches(puuid: string, count: number = 20): Promise<Either<ApiError, Match[]>> {
    const matchIds = await this.getMatchHistoryByPUUID(puuid, { count });
    if (matchIds.isLeft()) {
      return left(matchIds.value);
    }
    return await this.getMatchesByIds(matchIds.value);
  }

  /**
   * Get matches within a time range
   */
  async getMatchesInTimeRange(
    puuid: string,
    startTime: number,
    endTime: number,
  ): Promise<Either<ApiError, Match[]>> {
    const matchIds = await this.getMatchHistoryByPUUID(puuid, { startTime, endTime });
    if (matchIds.isLeft()) {
      return left(matchIds.value);
    }
    return await this.getMatchesByIds(matchIds.value);
  }

  /**
   * Get matches by queue type
   */
  async getMatchesByQueue(puuid: string, queueId: number): Promise<Either<ApiError, Match[]>> {
    const matchIds = await this.getMatchHistoryByPUUID(puuid, { queue: queueId });
    if (matchIds.isLeft()) {
      return left(matchIds.value);
    }
    return await this.getMatchesByIds(matchIds.value);
  }

  /**
   * Get match duration in minutes
   */
  async getMatchDuration(matchId: string): Promise<Either<ApiError, number>> {
    const match = await this.getMatchById(matchId);
    if (match.isLeft()) {
      return left(match.value);
    }
    return right(Math.floor(match.value.info.gameDuration / 60));
  }

  /**
   * Get match creation date
   */
  async getMatchCreationDate(matchId: string): Promise<Either<ApiError, Date>> {
    const match = await this.getMatchById(matchId);
    if (match.isLeft()) {
      return left(match.value);
    }
    return right(new Date(match.value.info.gameCreation));
  }
}
