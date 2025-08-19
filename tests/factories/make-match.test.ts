import { describe, it, expect } from 'vitest';
import { makeMatch, makeMatchArray } from './make-match';
import { MatchSchema } from '../../src/types';

describe('Match Factory', () => {
  it('should generate a valid match', () => {
    const match = makeMatch();
    
    // Should pass Zod validation
    const validatedMatch = MatchSchema.parse(match);
    expect(validatedMatch).toBeDefined();
    expect(validatedMatch.metadata.matchId).toBeDefined();
    expect(validatedMatch.info.participants).toHaveLength(10);
  });

  it('should generate match with custom options', () => {
    const customMatch = makeMatch({
      matchId: 'CUSTOM_123',
      gameMode: 'ARAM',
      queueId: 450,
      platformId: 'NA1',
      participantsCount: 6,
    });

    expect(customMatch.metadata.matchId).toBe('CUSTOM_123');
    expect(customMatch.info.gameMode).toBe('ARAM');
    expect(customMatch.info.queueId).toBe(450);
    expect(customMatch.info.platformId).toBe('NA1');
    expect(customMatch.info.participants).toHaveLength(6);
  });

  it('should generate array of matches', () => {
    const matches = makeMatchArray(3, { gameMode: 'URF' });
    
    expect(matches).toHaveLength(3);
    matches.forEach(match => {
      expect(match.info.gameMode).toBe('URF');
      expect(MatchSchema.parse(match)).toBeDefined();
    });
  });

  it('should ensure team consistency', () => {
    const match = makeMatch();
    
    // First 5 participants should be on team 100
    for (let i = 0; i < 5; i++) {
      expect(match.info.participants[i].teamId).toBe(100);
    }
    
    // Last 5 participants should be on team 200
    for (let i = 5; i < 10; i++) {
      expect(match.info.participants[i].teamId).toBe(200);
    }
    
    // Team 100 and Team 200 should have opposite win values
    const team100Win = match.info.participants[0].win;
    const team200Win = match.info.participants[5].win;
    expect(team100Win).toBe(!team200Win);
  });

  it('should generate realistic game data', () => {
    const match = makeMatch();
    
    // Game duration should be reasonable (15-60 minutes)
    expect(match.info.gameDuration).toBeGreaterThanOrEqual(900); // 15 minutes
    expect(match.info.gameDuration).toBeLessThanOrEqual(3600);   // 60 minutes
    
    // Timestamps should be logical
    expect(match.info.gameEndTimestamp).toBeGreaterThan(match.info.gameCreation);
    expect(match.info.gameStartTimestamp).toBeGreaterThan(match.info.gameCreation);
    
    // Participants should have realistic stats
    match.info.participants.forEach(participant => {
      expect(participant.champLevel).toBeGreaterThanOrEqual(1);
      expect(participant.champLevel).toBeLessThanOrEqual(18);
      expect(participant.kills).toBeGreaterThanOrEqual(0);
      expect(participant.deaths).toBeGreaterThanOrEqual(0);
      expect(participant.assists).toBeGreaterThanOrEqual(0);
    });
  });
});
