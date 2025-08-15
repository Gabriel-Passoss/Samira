import { describe, it, expect } from 'vitest';
import { makeAccount, makeAccountArray } from './make-account';
import { AccountSchema } from '../../src/types';

describe('Account Factory', () => {
  describe('makeAccount', () => {
    it('should generate a valid account', () => {
      const account = makeAccount();
      
      expect(account).toBeDefined();
      expect(account.puuid).toBeDefined();
      expect(account.gameName).toBeDefined();
      expect(account.tagLine).toBeDefined();
      expect(typeof account.puuid).toBe('string');
      expect(typeof account.gameName).toBe('string');
      expect(typeof account.tagLine).toBe('string');
      
      // Validate against Zod schema
      const result = AccountSchema.safeParse(account);
      expect(result.success).toBe(true);
    });

    it('should generate account with custom options', () => {
      const customOptions = {
        puuid: 'custom-puuid-123',
        gameName: 'CustomPlayer',
        tagLine: 'ABC'
      };
      
      const account = makeAccount(customOptions);
      
      expect(account.puuid).toBe(customOptions.puuid);
      expect(account.gameName).toBe(customOptions.gameName);
      expect(account.tagLine).toBe(customOptions.tagLine);
    });

    it('should generate different accounts on multiple calls', () => {
      const account1 = makeAccount();
      const account2 = makeAccount();
      
      expect(account1.puuid).not.toBe(account2.puuid);
      expect(account1.gameName).not.toBe(account2.gameName);
      expect(account1.tagLine).not.toBe(account2.tagLine);
    });
  });

  describe('makeAccountArray', () => {
    it('should generate array of accounts', () => {
      const count = 5;
      const accounts = makeAccountArray(count);
      
      expect(accounts).toHaveLength(count);
      accounts.forEach(account => {
        expect(account).toBeDefined();
        expect(account.puuid).toBeDefined();
        expect(account.gameName).toBeDefined();
        expect(account.tagLine).toBeDefined();
      });
    });

    it('should generate accounts with custom options', () => {
      const count = 3;
      const customOptions = { gameName: 'SamePlayer' };
      const accounts = makeAccountArray(count, customOptions);
      
      expect(accounts).toHaveLength(count);
      accounts.forEach(account => {
        expect(account.gameName).toBe(customOptions.gameName);
      });
    });
  });

  describe('tagLine format', () => {
    it('should generate tag lines with correct length range', () => {
      const account = makeAccount();
      
      expect(account.tagLine.length).toBeGreaterThanOrEqual(3);
      expect(account.tagLine.length).toBeLessThanOrEqual(5);
      expect(account.tagLine).toMatch(/^[A-Z0-9]+$/);
    });
  });
});
