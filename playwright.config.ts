// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL for API tests
    baseURL: 'https://reqres.in/api',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // API request timeout
    actionTimeout: 30000,
    
    // Global request headers
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },

  // Configure projects for major browsers (for API testing, we mainly need one)
  projects: [
    {
      name: 'API Tests',
      testMatch: '**/*.spec.ts',
    },
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
});