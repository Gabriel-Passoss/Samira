import z from 'zod';
import { AssetImageSchema } from './assetImage';

export const ChampionResumeSchema = z.object({
  version: z.string(),
  id: z.string(),
  key: z.string(),
  name: z.string(),
  title: z.string(),
  blurb: z.string(),
  info: z.object({
    attack: z.number(),
    defense: z.number(),
    magic: z.number(),
  }),
  image: AssetImageSchema,
  tags: z.array(z.string()),
  partype: z.string(),
  stats: z.object({
    hp: z.number(),
    hpperlevel: z.number(),
    mp: z.number(),
    mpperlevel: z.number(),
    movespeed: z.number(),
    armor: z.number(),
    armorperlevel: z.number(),
    spellblock: z.number(),
    spellblockperlevel: z.number(),
    attackrange: z.number(),
    hpregen: z.number(),
    hpregenperlevel: z.number(),
    mpregen: z.number(),
    mpregenperlevel: z.number(),
    crit: z.number(),
    critperlevel: z.number(),
    attackdamage: z.number(),
    attackdamageperlevel: z.number(),
    attackspeedperlevel: z.number(),
    attackspeed: z.number(),
  }),
});

export type ChampionResume = z.infer<typeof ChampionResumeSchema>;
