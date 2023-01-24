const login = ({ email, password }) => {
	cy.visit('/');

	cy.get('[data-test-id="login-username"]').type(email);
	cy.get('[data-test-id="login-password"]').type(password);
	cy.get('[data-test-id="login-submit-button"]').click();

	cy.contains('John Doe').should('be.visible');
};

describe('Work with table', function () {
	beforeEach(function () {
		login({ email: 'admin', password: 'admin' });
		cy.visit('/users');
	});

	it('should add new user', function () {
		cy.get('[placeholder="Login email"]')
			.parents('[class="ant-row"]')
			.within(row => {
				cy.wrap(row).find('[data-test-id="form-item-email"]').type(`test.user${Date.now()}@email.com`);
				cy.wrap(row).find('[data-test-id="form-item-password"]').type('password');
				cy.wrap(row).find('[data-test-id="form-item-name"]').type('Margarita Ivanova');
				cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
			});
		cy.get('.ant-select-dropdown').contains('Administration').click();
		cy.contains('button', 'Add').click();

		cy.contains('.ant-message-success', 'User created').should('be.visible');
	});

	it('should edit existing user by email', function () {
		const testEmail = 'test.user@email.com';

		const getRowWithUserToEdit = email => cy.get(`[value="${email}"]`).parents('[class="ant-row"]');

		getRowWithUserToEdit(testEmail).within(row => {
			cy.wrap(row)
				.find('[data-test-id="form-item-name"]')
				.type('New Full Name' + Date.now());
			cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
		});
		cy.get('.ant-select-dropdown').contains('Executive').click();

		getRowWithUserToEdit(testEmail).within(() => {
			cy.contains('button', 'Save').click();
		});

		cy.contains('.ant-message-success', 'User updated').should('be.visible');
	});
});
