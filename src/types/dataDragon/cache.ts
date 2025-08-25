import { z } from 'zod';
import { ChampionResumeSchema } from './championResume';
import { ItemAssetSchema } from './item';
import { RuneAssetSchema } from './rune';
import { SummonerSpellAssetSchema } from './summonerSpell';

export const DataDragonCacheSchema = z.object({
  champions: z.record(z.string(), ChampionResumeSchema).nullable(),
  items: z.record(z.string(), ItemAssetSchema).nullable(),
  runes: z.array(RuneAssetSchema).nullable(),
  summonerSpells: z.record(z.string(), SummonerSpellAssetSchema).nullable(),
});

export type DataDragonCache = z.infer<typeof DataDragonCacheSchema>;
