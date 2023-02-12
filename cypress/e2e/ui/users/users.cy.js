import { generateRandomUser } from '../../../utils/randomizer';
import authService from '../../../helpers/api/authService';

describe('Users', function () {
	const testUser = generateRandomUser();

	before(function () {
		cy.task('db:dropUsers');
	});

	beforeEach(function () {
		cy.fixture('admin').then(admin => {
			authService.apiLogin(admin);
			cy.visit('/users');
		});
	});

	context('add user:', function () {
		it('should add new user with valid data', function () {
			cy.get('[placeholder="Login email"]')
				.parents('[class="ant-row"]')
				.within(row => {
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
			cy.get('.ant-select-selector').last().should('have.text', 'Factory');
		});

		it('should display error when creating a user with already used email', function () {});
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
