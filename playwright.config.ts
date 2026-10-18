import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './src/config/env';

/**
 * Chromium-only by assignment scope.
 * Separate projects keep UI and API discovery obvious for agents:
 * - chromium-ui  → tests/ui
 * - chromium-api → tests/api
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Flakes should be fixed at the root; retries would hide them.
  retries: 0,
  // The shared demo site sheds load under parallel browsers ("queue full").
  // Keep local concurrency low so tests do not amplify that failure mode.
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          framework: 'Playwright + TypeScript',
          app: 'automationexercise.com',
        },
      },
    ],
  ],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium-ui',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
