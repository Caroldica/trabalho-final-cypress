const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://automationexercise.com',
    specPattern: 'cypress/e2e/trabalho-final.cy.js',
    supportFile: 'cypress/support/e2e.js',

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },

  reporter: 'cypress-mochawesome-reporter',

  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Trabalho final - Automation Exercise',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
  },

  viewportWidth: 1366,
  viewportHeight: 900,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  screenshotOnRunFailure: true,
  video: false,

  retries: {
    runMode: 1,
    openMode: 0,
  },
});