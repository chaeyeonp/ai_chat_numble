import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    video: true,
    videoCompression: false,
    trashAssetsBeforeRuns: true,
    videoUploadOnPasses: false,
    videosFolder: "cypress/videos",
    baseUrl: "https://ai-chat-numble.vercel.app/",
  },
  defaultCommandTimeout: 60000,
  retries: 1,
});
