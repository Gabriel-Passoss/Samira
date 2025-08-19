# Samira - League of Legends API Library

A TypeScript library for League of Legends API calls with built-in rate limiting, error handling, and type safety.

## Features

- 🚀 **Riot Games API Integration** - Full support for all major endpoints
- ⚡ **Built-in Rate Limiting** - Automatic rate limit handling and retry logic
- 🛡️ **Type Safety** - Full TypeScript support with Zod validation
- 🔄 **Regional & Platform Routing** - Smart routing for different API endpoints
- 🎯 **Error Handling** - Comprehensive error handling with Either types
- 📦 **Data Dragon Integration** - Access to League of Legends game assets
- 🧪 **Testing** - Comprehensive test suite with Vitest

## Installation

```bash
npm install samira
```

## Quick Start

```typescript
import { Samira } from 'samira';

const samira = new Samira({
  apiKey: 'your-riot-api-key',
  platform: 'na1',
  region: 'americas',
});

// Get summoner information
const summoner = await samira.summoner.getSummonerByPuuid('puuid-here');
```

## Configuration

```typescript
const samira = new Samira({
  apiKey: 'your-riot-api-key',
  platform: 'na1', // or 'euw1', 'kr', etc.
  region: 'americas', // or 'europe', 'asia', 'sea'
  dataDragon: {
    version: 'latest', // or specific version like '13.1.1'
    language: 'en_US', // or 'pt_BR', 'ko_KR', etc.
    includeFullUrl: true, // return full URLs for assets
  },
});
```

## Services

### Account Service
```typescript
// Get account by Riot ID
const account = await samira.account.getAccountByRiotId('GameName', 'TagLine');

// Get account by PUUID
const account = await samira.account.getAccountByPuuid('puuid-here');
```

### Summoner Service
```typescript
// Get summoner by PUUID
const summoner = await samira.summoner.getSummonerByPuuid('puuid-here');
```

### Match Service
```typescript
// Get match by ID
const match = await samira.match.getMatchById('match-id-here');

// Get match history
const matchHistory = await samira.match.getMatchHistoryByPUUID('puuid-here');

// Get recent matches
const recentMatches = await samira.match.getRecentMatches('puuid-here', 20);
```

### Spectator Service
```typescript
// Get active game by PUUID
const activeGame = await samira.spectator.getActiveGameByPuuid('puuid-here');

// Get featured games
const featuredGames = await samira.spectator.getFeaturedGames();
```

### Data Dragon Service
```typescript
// Get latest game version
const versions = await samira.dataDragon.getLatestVersion();

// Get all champions
const champions = await samira.dataDragon.getChampions();

// Get specific champion
const aatrox = await samira.dataDragon.getChampion('Aatrox');

// Get all items
const items = await samira.dataDragon.getItems();

// Get specific item
const doransBlade = await samira.dataDragon.getItem(1055);
```

## Types and Schemas

Samira provides comprehensive TypeScript types and Zod schemas for all API responses. You can import and use these types in your own code:

### Importing All Types

```typescript
import {
  // Core types
  Champion,
  Summoner,
  Match,
  LeagueEntry,
  Account,
  CurrentGame,
  
  // Zod schemas for validation
  ChampionSchema,
  SummonerSchema,
  MatchSchema,
  LeagueEntrySchema,
  AccountSchema,
  CurrentGameSchema,
  
  // Utility types
  Either,
  Left,
  Right,
  
  // Constants
  REGIONS,
  PLATFORMS,
  ENDPOINTS,
} from 'samira';
```

### Type Categories

#### Data Dragon Types
- `Champion`, `Champions` - Champion data and lists
- `ItemAsset`, `RuneAsset`, `SummonerSpellAsset` - Game assets
- `ChampionInfo`, `ChampionStats`, `ChampionSkin`, `ChampionSpell`, `ChampionPassive`

#### Account & Summoner Types
- `Account` - Riot account information
- `Summoner` - Summoner profile data
- `ChampionMastery` - Champion mastery information

#### League Types
- `LeagueEntry` - Ranked league information
- `MiniSeries` - Promotion series data
- `Rank`, `Tier` - Rank and tier enums

#### Match Types
- `Match`, `MatchMetadata`, `MatchInfo` - Match data structure
- `MatchParticipant` - Individual player data
- `Challenge`, `Mission` - Advanced match statistics
- `MatchTeam`, `Ban`, `Objective` - Team and objective data

#### Spectator Types
- `CurrentGame` - Active game information
- `FeaturedGames` - Featured games list
- `SpectatorParticipant` - Player data in spectator mode

### Using Zod Schemas for Validation

```typescript
import { ChampionSchema, MatchSchema } from 'samira';

// Validate API responses at runtime
const champion = ChampionSchema.parse(apiResponse);
const match = MatchSchema.parse(matchData);

// Type-safe data with validation
if (ChampionSchema.safeParse(data).success) {
  // data is now typed as Champion
  console.log(data.name);
}
```

### Error Handling with Either Types

```typescript
import { Either, Left, Right } from 'samira';

// Handle API responses with type safety
const result: Either<Error, Champion> = await getChampionData();

if (result.isRight()) {
  const champion = result.value; // Type: Champion
  console.log(champion.name);
} else {
  const error = result.value; // Type: Error
  console.error(error.message);
}
```
const items = await samira.dataDragon.getItems();

// Get specific item
const boots = await samira.dataDragon.getItem('1001');

// Get runes
const runes = await samira.dataDragon.getRunes();

// Get summoner spells
const spells = await samira.dataDragon.getSummonerSpells();
```

## Asset URLs

The Data Dragon service provides methods to generate asset URLs:

```typescript
// Champion images
const championImage = samira.dataDragon.getChampionImageUrl('Aatrox');
const skinImage = samira.dataDragon.getChampionImageUrl('Aatrox', '1'); // Skin ID 1

// Item images
const itemImage = samira.dataDragon.getItemImageUrl('1001');

// Profile icons
const profileIcon = samira.dataDragon.getProfileIconUrl(1);

// Champion splash art
const splashArt = samira.dataDragon.getChampionSplashUrl('Aatrox');
const skinSplash = samira.dataDragon.getChampionSplashUrl('Aatrox', '1');

// Champion loading screens
const loadingScreen = samira.dataDragon.getChampionLoadingUrl('Aatrox');
const skinLoading = samira.dataDragon.getChampionLoadingUrl('Aatrox', '1');

// Rune images
const runeImage = samira.dataDragon.getRuneImageUrl(8000);

// Summoner spell images
const spellImage = samira.dataDragon.getSummonerSpellImageUrl('SummonerFlash');
```

### URL Configuration

You can control whether the service returns full URLs or just asset paths:

```typescript
// Initialize with full URLs
const samira = new Samira({
  apiKey: 'your-key',
  dataDragon: {
    includeFullUrl: true, // Returns: https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png
  },
});

// Initialize with asset paths only
const samira = new Samira({
  apiKey: 'your-key',
  dataDragon: {
    includeFullUrl: false, // Returns: img/champion/Aatrox.png
  },
});

// Update configuration at runtime
samira.dataDragon.updateConfig({
  includeFullUrl: true,
  language: 'pt_BR',
  version: '13.2.1',
});
```

## Routing

### Platform Routing (Game-specific endpoints)
```typescript
samira.usePlatformRouting(); // Uses platform-specific endpoints
// Examples: /lol/summoner/v4/, /lol/match/v5/, /lol/spectator/v5/
```

### Regional Routing (Account endpoints)
```typescript
samira.useRegionalRouting(); // Uses regional endpoints
// Examples: /riot/account/v1/
```

## Error Handling

All service methods return `Either<ApiError, T>` types for robust error handling:

```typescript
const result = await samira.summoner.getSummonerByPuuid('puuid-here');

if (result.isRight()) {
  // Success case
  const summoner = result.value;
  console.log('Summoner name:', summoner.name);
} else {
  // Error case
  const error = result.value;
  console.error('Error:', error.message);
  console.error('Status:', error.status);
}
```

## Rate Limiting

The library automatically handles Riot Games API rate limits:

```typescript
// Check rate limit status
const status = samira.getHttpClient().getRateLimitStatus();
console.log('Can make request:', status.canMakeRequest);
console.log('Requests in window:', status.requestsInWindow);
console.log('Delay until next:', status.delayUntilNext);

// Reset rate limiter if needed
samira.getHttpClient().resetRateLimiter();
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- tests/services/summoner.spec.ts

# Run with coverage
npm run test:coverage
```

## API Reference

### Samira Class
- `constructor(config: SamiraConfig)`
- `getConfig(): SamiraConfig`
- `getHttpClient(): HttpClient`
- `updateApiKey(apiKey: string): void`
- `updatePlatform(platform: string): void`
- `updateRegion(region: string): void`
- `useRegionalRouting(): void`
- `usePlatformRouting(): void`

### Data Dragon Service
- `getLatestVersion(): Promise<Either<ApiError, string[]>>`
- `getChampions(version?: string): Promise<Either<ApiError, Record<string, ChampionAsset>>>`
- `getChampion(championId: string, version?: string): Promise<Either<ApiError, ChampionAsset>>`
- `getItems(version?: string): Promise<Either<ApiError, Record<string, ItemAsset>>>`
- `getItem(itemId: string, version?: string): Promise<Either<ApiError, ItemAsset>>`
- `getRunes(version?: string): Promise<Either<ApiError, RuneAsset[]>>`
- `getSummonerSpells(version?: string): Promise<Either<ApiError, Record<string, SummonerSpellAsset>>>`
- `getAssetUrl(assetPath: string): string`
- `getChampionImageUrl(championId: string, skinId?: string): string`
- `getItemImageUrl(itemId: string): string`
- `getProfileIconUrl(iconId: number): string`
- `getChampionSplashUrl(championId: string, skinId?: string): string`
- `getChampionLoadingUrl(championId: string, skinId?: string): string`
- `getRuneImageUrl(runeId: number): string`
- `getSummonerSpellImageUrl(spellId: string): string`
- `updateConfig(config: Partial<DataDragonConfig>): void`
- `getConfig(): DataDragonConfig`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
