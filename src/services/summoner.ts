import { ENDPOINTS } from "../constants";
import { SummonerSchema } from "../types";
import { left, right } from "../types/either";
import type { HttpClient } from "../utils/httpClient";

export class SummonerService {
  constructor(private readonly httpClient: HttpClient) {}

  async getSummonerByPuuid(puuid: string) {
    const url = ENDPOINTS.SUMMONER_BY_PUUID.replace('{puuid}', puuid);
    const response = await this.httpClient.get(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    const summoner = SummonerSchema.parse(response.value.data);

    return right(summoner);
  }
}