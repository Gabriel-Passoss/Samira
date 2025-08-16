import { ENDPOINTS } from "../constants";
import { AccountSchema, type Account } from "../types";
import { left, right, type Either } from "../types/either";
import type { HttpClient, ApiError } from "../utils/httpClient";

export class AccountService {
  constructor(private readonly httpClient: HttpClient) {}

  async getAccountByPuuid(puuid: string): Promise<Either<ApiError, Account>> {
    const url = ENDPOINTS.ACCOUNT_BY_PUUID.replace('{puuid}', puuid);
    const response = await this.httpClient.get<Account>(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    const account = AccountSchema.parse(response.value.data);

    return right(account);
  }

  async getAccountByRiotId(gameName: string, tagLine: string): Promise<Either<ApiError, Account>> {
    const url = ENDPOINTS.ACCOUNT_BY_RIOT_ID.replace('{gameName}', gameName).replace('{tagLine}', tagLine);
    const response = await this.httpClient.get<Account>(url);

    if (response.isLeft()) {
      return left(response.value);
    }
    const account = AccountSchema.parse(response.value.data);

    return right(account);
  }
}