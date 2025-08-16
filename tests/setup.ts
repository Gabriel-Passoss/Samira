import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  
  // Ensure RIOT_API_KEY is available for tests
  if (!process.env.RIOT_API_KEY) {
    console.warn('⚠️  RIOT_API_KEY not found in .env file. Using test API key.');
    process.env.RIOT_API_KEY = 'test-api-key-for-testing';
  }
  
  // Mock console methods to reduce noise in tests
  // global.console = {
  //   ...console,
  //   log: vi.fn(),
  //   debug: vi.fn(),
  //   info: vi.fn(),
  //   warn: vi.fn(),
  //   error: vi.fn(),
  // };
});

// Global test cleanup
afterAll(() => {
  // Clean up any global mocks or state
});

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  vi.resetAllMocks();
});

// Mock fetch globally if needed
global.fetch = vi.fn();

// Mock timers
vi.useFakeTimers();
