import { generateRandomUser } from '../../../utils/randomizer';
import authService from '../../../helpers/api/authService';
import userService from '../../../helpers/api/userService';

describe('Users', function () {
	const testUser = generateRandomUser();

	beforeEach(function () {
		cy.fixture('admin').then(admin => {
			authService.apiLogin(admin);
			cy.visit('/users');
		});
	});

	context('add user:', function () {
		const getRowWithAddForm = () => cy.get('[placeholder="Login email"]').parents('[class="ant-row"]');

		it('should add new user with valid data #smoke', function () {
			getRowWithAddForm().within(row => {
				cy.wrap(row).find('[data-test-id="form-item-email"]').type(testUser.email);
				cy.wrap(row).find('[data-test-id="form-item-password"]').type(testUser.password);
				cy.wrap(row).find('[data-test-id="form-item-name"]').type(testUser.name);
				cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
			});
			const roleText = testUser.role.charAt(0).toUpperCase() + testUser.role.slice(1).toLowerCase();
			cy.get('.ant-select-dropdown').contains(roleText).click();
			cy.contains('button', 'Add').click();

			cy.contains('.ant-message-success', 'User created').should('be.visible');
		});

		it('should verify that factory is selected in roles dropdown by default', function () {
			getRowWithAddForm().within(row => {
				cy.wrap(row).find('.ant-select-selector').contains('Factory').should('be.visible');
			});
		});

		it('should verify that required texts appear when submitting empty form', function () {
			cy.contains('button', 'Add').click();

			cy.get('[data-test-id="form-item-email"]')
				.last()
				.parents('.ant-form-item-control')
				.find('.ant-form-item-explain-error')
				.should('have.text', 'Required');

			cy.get('[data-test-id="form-item-password"]')
				.last()
				.parents('.ant-form-item-control')
				.find('.ant-form-item-explain-error')
				.should('have.text', 'Required');

			cy.get('[data-test-id="form-item-name"]')
				.last()
				.parents('.ant-form-item-control')
				.find('.ant-form-item-explain-error')
				.should('have.text', 'Required');
		});

		it('should display error when creating a user with already used email', function () {
			const randomUser = generateRandomUser();

			userService.apiCreateUser(randomUser);

			getRowWithAddForm().within(row => {
				cy.wrap(row).find('[data-test-id="form-item-email"]').type(randomUser.email);
				cy.wrap(row).find('[data-test-id="form-item-password"]').type(randomUser.password);
				cy.wrap(row).find('[data-test-id="form-item-name"]').type(randomUser.name);
				cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
			});
			const roleText = randomUser.role.charAt(0).toUpperCase() + randomUser.role.slice(1).toLowerCase();
			cy.get('.ant-select-dropdown').contains(roleText).click();
			cy.contains('button', 'Add').click();

			const errorMessage = `User with email "${randomUser.email}" already exists`;
			cy.contains('.ant-message-error', errorMessage).should('be.visible');
		});

		it('should return error when creating a user with invalid email', function () {
			getRowWithAddForm().within(row => {
				cy.wrap(row).find('[data-test-id="form-item-email"]').type('invalidEmail');
				cy.wrap(row).find('[data-test-id="form-item-password"]').type(testUser.password);
				cy.wrap(row).find('[data-test-id="form-item-name"]').type(testUser.name);
				cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
			});
			const roleText = testUser.role.charAt(0).toUpperCase() + testUser.role.slice(1).toLowerCase();
			cy.get('.ant-select-dropdown').contains(roleText).click();
			cy.contains('button', 'Add').click();

			cy.contains('.ant-message-error', 'Email has invalid format. Please try again.').should('be.visible');
		});
	});

	context('edit user:', function () {
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
});
