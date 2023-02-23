import './commands';
import 'cypress-plugin-api';
import 'cypress-map';
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', () => false);

before(function () {
	cy.task('cleanDb');
	cy.task('createAdminUser');
	Cypress.session.clearAllSavedSessions();
});
