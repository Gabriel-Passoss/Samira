import { ENDPOINTS } from '../constants';
import { SummonerSchema, type Summoner } from '../types';
import { left, right, type Either } from '../types/either';
import type { ApiError, HttpClient } from '../utils/httpClient';

export class SummonerService {
  constructor(private readonly httpClient: HttpClient) {}

  async getSummonerByPuuid(puuid: string): Promise<Either<ApiError, Summoner>> {
    const url = ENDPOINTS.SUMMONER_BY_PUUID.replace('{encryptedPUUID}', puuid);
    const response = await this.httpClient.get(url);

    if (response.isLeft()) {
      return left(response.value);
    }

    try {
      const summoner = SummonerSchema.parse(response.value.data);
      return right(summoner);
    } catch (error) {
      // Log the validation error details for debugging
      if (error instanceof Error && 'issues' in error) {
        console.error('Summoner validation failed for puuid:', puuid);
        console.error('Validation issues:', JSON.stringify((error as any).issues, null, 2));

        // Log the actual response data to help debug
        console.error('Actual API response:', JSON.stringify(response.value.data, null, 2));
      }

      return left({
        status: 400,
        statusText: 'Validation Error',
        message: 'Summoner data validation failed',
        details: error,
      });
    }
  }
}
