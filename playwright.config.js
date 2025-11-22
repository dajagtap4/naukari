// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // 60 sec per test
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    headless: true,
    launchOptions: {
      slowMo: 1000,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
    {
      name: 'firefox',
      use: devices['Desktop Firefox'],
    },
    {
      name: 'webkit',
      use: devices['Desktop Safari'],
    },
  ],
});
