import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  reporter: "list",
  use: { baseURL: "http://localhost:3101", reducedMotion: "reduce" },
  webServer: { command: "npx next start -p 3101", url: "http://localhost:3101", reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
  ],
});
