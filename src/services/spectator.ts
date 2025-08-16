import { ENDPOINTS } from "../constants";
import { CurrentGameSchema } from "../types";
import { left, right } from "../types/either";
import type { HttpClient } from "../utils/httpClient";

export class SpectatorService {
  constructor(private readonly httpClient: HttpClient) {}

  async getActiveGameByPuuid(puuid: string) {
    const url = ENDPOINTS.CURRENT_GAME_BY_SUMMONER.replace('{encryptedPUUID}', puuid);
    const response = await this.httpClient.get(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    const game = CurrentGameSchema.parse(response.value.data);

    return right(game);
  }
}