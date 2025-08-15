import { ENDPOINTS } from "../constants";
import { AccountSchema } from "../types";
import { left, right } from "../types/either";
import type { HttpClient } from "../utils/httpClient";

export class AccountService {
  constructor(private readonly httpClient: HttpClient) {}

  async getAccountByPuuid(puuid: string) {
    const url = ENDPOINTS.ACCOUNT_BY_PUUID.replace('{puuid}', puuid);
    const response = await this.httpClient.get(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    const account = AccountSchema.parse(response.value.data);

    return right(account);
  }

  async getAccountByRiotId(gameName: string, tagLine: string) {
    const url = ENDPOINTS.ACCOUNT_BY_RIOT_ID.replace('{gameName}', gameName).replace('{tagLine}', tagLine);
    const response = await this.httpClient.get(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    const account = AccountSchema.parse(response.value.data);

    return right(account);
  }
}