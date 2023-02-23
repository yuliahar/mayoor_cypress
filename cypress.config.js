const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const User = require('./cypress/helpers/models/user');
const Material = require('./cypress/helpers/models/material');
const Order = require('./cypress/helpers/models/order');
const OrderItem = require('./cypress/helpers/models/orderItem');
const Customer = require('./cypress/helpers/models/customer');

const fetchConfigurationByFile = file => {
	const pathOfConfigurationFile = `config/cypress.${file}.json`;

	return file && fs.readJson(path.join(__dirname, './cypress/', pathOfConfigurationFile));
};

module.exports = defineConfig({
	e2e: {
		chromeWebSecurity: false,
		defaultCommandTimeout: 15000,
		excludeSpecPattern: ['**/api/variables.cy.js'],
		env: {
			snapshotOnly: true,
		},
		experimentalRunAllSpecs: true,
		experimentalMemoryManagement: true,
		requestTimeout: 15000,
		responseTimeout: 15000,
		reporter: 'cypress-multi-reporters',
		reporterOptions: {
			reporterEnabled: 'mochawesome',
			mochawesomeReporterOptions: {
				reportDir: 'cypress/reports/mocha',
				quite: true,
				overwrite: false,
				html: false,
				json: true,
			},
		},
		setupNodeEvents(on, config) {
			const environment = config.env.configFile || 'development';
			const configurationForEnvironment = fetchConfigurationByFile(environment);

			on('task', {
				cleanDb: async () =>
					Promise.all([
						OrderItem.deleteMany(),
						Order.deleteMany(),
						Customer.deleteMany(),
						Material.deleteMany(),
						User.deleteMany(),
					]),
				createUser: User.createUser,
				createAdminUser: User.createAdminUser,
				deleteAllUsers: User.deleteMany,
				deleteAllMaterials: Material.deleteMany,
				deleteAllOrders: Order.deleteMany,
				deleteAllOrderItems: OrderItem.deleteMany,
				deleteAllCustomers: Customer.deleteMany,
			});

			on('after:spec', (spec, results) => {
				if (results && results.video) {
					// Do we have failures for any retry attempts?
					const failures = _.some(results.tests, test => {
						return _.some(test.attempts, { state: 'failed' });
					});
					if (!failures) {
						// delete the video if the spec passed and no tests retried
						return fs.remove(results.video, function (err) {
							if (err && err.code == 'ENOENT') {
								// file doesn't exist
								console.info("File doesn't exist, won't remove it.");
							} else if (err) {
								// other errors, e.g. maybe we don't have enough permission
								console.error('Error occurred while trying to remove file.');
							} else {
								console.info(`Video ${results.video} removed.`);
							}
						});
					}
				}
			});

			return configurationForEnvironment || config;
		},
		viewportHeight: 1080,
		viewportWidth: 1920,
		watchForFileChanges: false,
	},
});
