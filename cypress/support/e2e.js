import './commands';
import 'cypress-plugin-api';
import 'cypress-map';

Cypress.on('uncaught:exception', () => false);

before(function () {
	Cypress.session.clearAllSavedSessions();
});
