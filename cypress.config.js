const { defineConfig } = require('cypress');
const { dropUsers } = require('./cypress/utils/deleteUsers');

module.exports = defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000',
		chromeWebSecurity: false,
		excludeSpecPattern: ['**/api/variables.cy.js'],
		env: {
			snapshotOnly: true,
			apiUrl: 'http://localhost:3000/api/graphql',
		},
		experimentalRunAllSpecs: true,
		experimentalMemoryManagement: true,
		setupNodeEvents(on, config) {
			// implement node event listeners here
			on('task', {
				'db:dropUsers': () => {
					return dropUsers();
				},
			});
			return config;
		},
		video: false,
		watchForFileChanges: false,
	},
});
