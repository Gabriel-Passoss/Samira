# Samira Types Documentation

This document shows all available TypeScript types and Zod schemas that can be imported from the `samira` library.

## Quick Import Examples

### Import Everything

```typescript
import * as Samira from 'samira';
// Access types as: Samira.Champion, Samira.Match, etc.
```

### Import Specific Types

```typescript
import { Champion, Match, LeagueEntry, Samira } from 'samira';
```

### Import Only Types

```typescript
import type { Champion, Match, LeagueEntry } from 'samira';
```

### Import Only Schemas

```typescript
import { ChampionSchema, MatchSchema, LeagueEntrySchema } from 'samira';
```

## Available Exports

### Main Classes

- `Samira` - Main library class
- `AccountService` - Account-related API calls
- `DataDragonService` - Game data and assets
- `LeagueService` - Ranked league information
- `MatchService` - Match data and history
- `SpectatorService` - Live game information
- `SummonerService` - Summoner profile data

### Utility Classes

- `HttpClient` - HTTP client with rate limiting
- `RateLimiter` - Rate limiting implementation

### Constants

- `REGIONS` - Available API regions
- `PLATFORMS` - Available game platforms
- `ENDPOINTS` - API endpoint constants

## Type Categories

### 1. Data Dragon Types

Champion, item, and game asset information.

```typescript
import {
  Champion, // Full champion data
  Champions, // Simplified champion list
  ChampionInfo, // Champion difficulty/role info
  ChampionStats, // Champion base stats
  ChampionSkin, // Champion skin data
  ChampionSpell, // Champion ability data
  ChampionPassive, // Champion passive ability
  ItemAsset, // Item information
  RuneAsset, // Rune information
  SummonerSpellAsset, // Summoner spell data
  DataDragonConfig, // Data Dragon configuration
} from 'samira';
```

### 2. Account & Summoner Types

User account and summoner profile data.

```typescript
import {
  Account, // Riot account information
  Summoner, // Summoner profile data
  ChampionMastery, // Champion mastery levels
} from 'samira';
```

### 3. League Types

Ranked league and competitive information.

```typescript
import {
  LeagueEntry, // Ranked league entry
  MiniSeries, // Promotion series data
  RankDivision, // Rank (I, II, III, IV, V, '')
  TierLevel, // Tier (IRON, BRONZE, SILVER, GOLD, PLATINUM, EMERALD, DIAMOND, MASTER, GRANDMASTER, CHALLENGER)
} from 'samira';
```

### 4. Match Types

Game match data and statistics.

```typescript
import {
  Match, // Complete match data
  MatchMetadata, // Match metadata
  MatchInfo, // Match information
  MatchParticipant, // Individual player data
  Challenge, // Advanced match statistics
  Mission, // Match missions/objectives
  MatchPerks, // Runes and masteries
  MatchTeam, // Team data
  Ban, // Champion bans
  Objective, // Objective data
  Objectives, // All objectives
} from 'samira';
```

### 5. Spectator Types

Live game and spectator information.

```typescript
import {
  CurrentGame, // Active game data
  FeaturedGames, // Featured games list
  FeaturedGameInfo, // Individual featured game
  SpectatorParticipant, // Player in spectator mode
  SpectatorPerks, // Player perks in spectator mode
  BannedChampion, // Banned champions
  GameCustomizationObject, // Game customization
  Observer, // Observer information
} from 'samira';
```

### 6. Utility Types

Helper types for error handling and API responses.

```typescript
import {
  Either, // Union type for success/error
  Left, // Error case constructor
  Right, // Success case constructor
  BaseApiResponse, // Base API response structure
} from 'samira';
```

## Zod Schemas

All types have corresponding Zod schemas for runtime validation:

```typescript
import {
  // Data Dragon schemas
  ChampionSchema,
  ChampionsSchema,
  ItemAssetSchema,
  RuneAssetSchema,
  SummonerSpellAssetSchema,

  // Account & Summoner schemas
  AccountSchema,
  SummonerSchema,
  ChampionMasterySchema,

  // League schemas
  LeagueEntrySchema,
  MiniSeriesSchema,
  RankSchema,
  TierSchema,

  // Match schemas
  MatchSchema,
  MatchParticipantSchema,
  ChallengeSchema,
  MissionSchema,

  // Spectator schemas
  CurrentGameSchema,
  FeaturedGamesSchema,
  SpectatorParticipantSchema,

  // Utility schemas
  BaseApiResponseSchema,
} from 'samira';
```

## Usage Examples

### Type-Safe API Responses

```typescript
import { Samira, Champion, ChampionSchema } from 'samira';

const samira = new Samira({ apiKey: 'your-key', platform: 'na1' });

// Get champion data with type safety
const result = await samira.dataDragon.getChampion('Annie');
if (result.isRight()) {
  const champion: Champion = result.value;
  console.log(champion.name); // TypeScript knows this is a string
}
```

### Runtime Validation

```typescript
import { ChampionSchema } from 'samira';

// Validate external data
const externalData = fetchChampionFromExternalSource();
const validatedChampion = ChampionSchema.parse(externalData);
// validatedChampion is now typed as Champion
```

### Error Handling with Either

```typescript
import { Either, Left, Right } from 'samira';

function processChampionData(data: unknown): Either<Error, Champion> {
  try {
    const champion = ChampionSchema.parse(data);
    return Right(champion);
  } catch (error) {
    return Left(new Error('Invalid champion data'));
  }
}

const result = processChampionData(someData);
if (result.isRight()) {
  // Success case
  const champion = result.value;
} else {
  // Error case
  const error = result.value;
}
```

### Building Custom Types

```typescript
import { Champion, Match } from 'samira';

// Create custom types using Samira's types
type ChampionWithMatches = {
  champion: Champion;
  matches: Match[];
  winRate: number;
};

type PlayerStats = {
  favoriteChampion: Champion;
  totalMatches: number;
  averageKDA: number;
};
```

## Type Safety Features

- **Full TypeScript Support**: All types are fully typed with proper interfaces
- **Zod Validation**: Runtime validation with Zod schemas
- **Either Types**: Functional error handling with Left/Right pattern
- **Strict Null Checks**: Proper handling of optional and nullable fields
- **Generic Support**: Flexible types that work with different data structures

## Best Practices

1. **Import Only What You Need**: Don't import everything if you only need a few types
2. **Use Type Imports**: Use `import type` for types you only need at compile time
3. **Validate External Data**: Use Zod schemas to validate data from external sources
4. **Handle Errors Properly**: Use Either types for proper error handling
5. **Leverage TypeScript**: Let TypeScript guide you with autocomplete and type checking

## Troubleshooting

### Common Import Issues

- **Module not found**: Ensure you've installed the package with `npm install samira`
- **Type not exported**: Check that the type exists in the source code
- **Schema not found**: Verify the schema name matches the type name + "Schema"

### Type Errors

- **Missing properties**: Check that your data matches the expected type structure
- **Validation failures**: Use Zod schemas to debug data structure issues
- **Union type issues**: Ensure you're handling all possible cases in Either types
