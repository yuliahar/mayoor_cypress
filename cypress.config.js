const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    env: {
      snapshotOnly: true,
      apiUrl: 'http://localhost:3000/api/graphql',
    },
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    video: false,
    watchForFileChanges: false,
  },
});
