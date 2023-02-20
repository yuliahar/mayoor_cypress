import './commands';
import 'cypress-plugin-api';
import 'cypress-map';

Cypress.on('uncaught:exception', () => false);

before(function () {
	// cy.task('db:dropUsers');
	Cypress.session.clearAllSavedSessions();
});
