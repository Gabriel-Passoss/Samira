# Samira

A TypeScript library for League of Legends API calls with Zod validation.

## Features

- 🚀 **TypeScript First**: Built with TypeScript for excellent type safety
- 🛡️ **Zod Validation**: Runtime validation of all API responses using Zod schemas
- 📊 **Comprehensive Types**: Full type definitions for all LoL API endpoints
- 🔧 **Easy Configuration**: Simple setup with sensible defaults

## Installation

```bash
npm install samira
```

## Quick Start

```typescript
import { createSamira, Samira } from 'samira';

// Create a Samira instance
const samira = createSamira('YOUR_RIOT_API_KEY');

// Validate API responses
const championData = Samira.validateChampion(rawChampionData);
const summonerData = Samira.validateSummoner(rawSummonerData);

// Get available platforms and regions
const platforms = Samira.getAvailablePlatforms();
const regions = Samira.getAvailableRegions();
```

## Environment Variables

For testing and development, you can use environment variables:

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Add your Riot Games API key to `.env`:
```env
RIOT_API_KEY=your-actual-api-key-here
```

3. The library will automatically use the API key from environment variables when available.

## Available Types

- `Champion` - Champion information
- `Summoner` - Summoner data
- `Match` - Match details
- `LeagueEntry` - Ranked league information
- `Account` - Riot account data
- `ChampionMastery` - Champion mastery data
- `CurrentGame` - Active game information

## Available Constants

- `REGIONS` - API regions (americas, europe, asia, sea)
- `PLATFORMS` - Platform endpoints (na1, euw1, kr, etc.)
- `ENDPOINTS` - API endpoint paths
- `QUEUE_TYPES` - Game queue types
- `GAME_MODES` - Game modes
- `TIERS` - Ranked tiers
- `RANKS` - Rank divisions

## Testing

The library includes comprehensive tests using Vitest:

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

Tests automatically use your `RIOT_API_KEY` from the `.env` file if available, or fall back to a test API key.

## License

MIT
