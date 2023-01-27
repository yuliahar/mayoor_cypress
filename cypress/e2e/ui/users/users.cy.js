import { login } from '../../../helpers/ui';

describe('Work with table', function () {
	const testUser = {
		email: `test.user${Date.now()}@email.com`,
		password: 'password',
		name: 'Margarita Ivanova',
		role: 'Administration',
	};

	beforeEach(function () {
		login({ email: 'admin', password: 'admin' });
		cy.visit('/users');
	});

	it('should add new user', function () {
		cy.get('[placeholder="Login email"]')
			.parents('[class="ant-row"]')
			.within(row => {
				cy.wrap(row).find('[data-test-id="form-item-email"]').type(testUser.email);
				cy.wrap(row).find('[data-test-id="form-item-password"]').type(testUser.password);
				cy.wrap(row).find('[data-test-id="form-item-name"]').type(testUser.name);
				cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
			});
		cy.get('.ant-select-dropdown').contains(testUser.role).click();
		cy.contains('button', 'Add').click();

		cy.contains('.ant-message-success', 'User created').should('be.visible');
	});

	it('should edit existing user by email', function () {
		const getRowWithUserToEdit = email => cy.get(`[value="${email}"]`).parents('[class="ant-row"]');

		getRowWithUserToEdit(testUser.email).within(row => {
			cy.wrap(row)
				.find('[data-test-id="form-item-name"]')
				.type('New Full Name' + Date.now());
			cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
		});
		cy.get('.ant-select-dropdown').contains('Executive').click();

		getRowWithUserToEdit(testUser.email).within(() => {
			cy.contains('button', 'Save').click();
		});

		cy.contains('.ant-message-success', 'User updated').should('be.visible');
	});
});
