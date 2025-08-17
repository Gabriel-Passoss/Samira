import { ENDPOINTS } from "../constants";
import { CurrentGameSchema, FeaturedGamesSchema, type CurrentGame, type FeaturedGames } from "../types";
import { left, right, type Either } from "../types/either";
import type { ApiError, HttpClient } from "../utils/httpClient";

export class SpectatorService {
  constructor(private readonly httpClient: HttpClient) {}

  async getActiveGameByPuuid(puuid: string): Promise<Either<ApiError, CurrentGame>> {
    const url = ENDPOINTS.CURRENT_GAME_BY_SUMMONER.replace('{encryptedPUUID}', puuid);
    const response = await this.httpClient.get(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    const game = CurrentGameSchema.parse(response.value.data);

    return right(game);
  }

  async getFeaturedGames(): Promise<Either<ApiError, FeaturedGames>> {
    const url = ENDPOINTS.FEATURED_GAMES;
    const response = await this.httpClient.get(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    const featuredGames = FeaturedGamesSchema.parse(response.value.data);

    return right(featuredGames);
  }
}