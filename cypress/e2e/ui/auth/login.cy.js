import { generateRandomUser } from '../../../utils/randomizer';
import userService from '../../../helpers/api/userService';

describe('Login', function () {
	const testUser = generateRandomUser();

	before(function () {
		userService.apiCreateUser(testUser);
	});

	beforeEach(function () {
		cy.visit('/orders/list');
	});

	after(function () {
		cy.task('db:dropUsers');
	});

	it('should login user with valid credentials', function () {
		cy.get('[data-test-id="login-username"]').type(testUser.email);
		cy.get('[data-test-id="login-password"]').type(testUser.password);
		cy.get('[data-test-id="login-submit-button"]').click();

		cy.contains('header span', testUser.name);
	});

	it('should verify that login button is disabled for empty email', function () {
		cy.get('[data-test-id="login-username"]').clear().blur();
		cy.get('[data-test-id="login-password"]').type(testUser.password);

		cy.get('[data-test-id="login-submit-button"]').should('be.disabled');
	});

	it('should verify that login button is disabled for empty password', function () {
		cy.get('[data-test-id="login-username"]').type(testUser.email);
		cy.get('[data-test-id="login-password"]').clear().blur();

		cy.get('[data-test-id="login-submit-button"]').should('be.disabled');
	});

	it('should display error for non-existing user', function () {
		cy.get('[data-test-id="login-username"]').type('invalidEmail');
		cy.get('[data-test-id="login-password"]').type(testUser.password);
		cy.get('[data-test-id="login-submit-button"]').click();

		cy.contains('.ant-form-item-explain-error', 'User not found');
	});

	it('should return error for login with invalid password', function () {
		cy.get('[data-test-id="login-username"]').type(testUser.email);
		cy.get('[data-test-id="login-password"]').type('invalidPassword');
		cy.get('[data-test-id="login-submit-button"]').click();

		cy.contains('.ant-form-item-explain-error', 'Invalid password');
	});
});
