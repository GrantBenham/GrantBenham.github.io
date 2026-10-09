import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
import { site } from './src/config';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:4321${site.base}/`,
    browserName: 'chromium',
    launchOptions: existsSync('/usr/bin/chromium') ? { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } : {},
  },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: `http://127.0.0.1:4321${site.base}/`,
    reuseExistingServer: !process.env.CI,
  },
});
