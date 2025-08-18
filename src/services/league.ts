import { z } from "zod";
import { ENDPOINTS } from "../constants";
import { LeagueEntrySchema, type LeagueEntry } from "../types";
import { left, right, type Either } from "../types/either";
import type { HttpClient, ApiError } from "../utils/httpClient";

export class LeagueService {
  constructor(private readonly httpClient: HttpClient) {}

  async getEntriesByPuuid(puuid: string): Promise<Either<ApiError, LeagueEntry[]>> {
    const url = ENDPOINTS.LEAGUE_ENTRIES_BY_PUUID.replace('{encryptedPUUID}', puuid);
    const response = await this.httpClient.get<LeagueEntry[]>(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    
    try {
      const entries = z.array(LeagueEntrySchema).parse(response.value.data);
      return right(entries);
    } catch (error) {
      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'League entries data validation failed',
        details: error,
      });
    }
  }
}