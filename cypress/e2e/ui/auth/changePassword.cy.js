import { apiAuthorizeUser, apiCreateUser, apiRegisterAndLogin } from '../../../helpers/api';
import { generateRandomUser } from '../../../utils/randomizer';

describe('Change password', function () {
	let testUser;
	const newPassword = 'newPa33word!';

	context('Positive tests', function () {
		it('should change password with valid data and login with new password', function () {
			testUser = generateRandomUser();
			apiRegisterAndLogin(testUser);

			cy.visit('/orders/list');
			cy.contains('header button', testUser.name).click();

			cy.get('[name="oldPassword"]').type(testUser.password);
			cy.get('[name="newPassword"]').type(newPassword);
			cy.get('[name="newPasswordRepeat"]').type(newPassword);
			cy.contains('button', 'Change password').click();

			cy.contains('div.ant-message-custom-content.ant-message-success', 'Password successfully changed.').should(
				'be.visible'
			);

			cy.get('span.ant-modal-close-icon').click();
			cy.get('span.anticon-logout').click();

			cy.get('[data-test-id="login-username"]').type(testUser.email);
			cy.get('[data-test-id="login-password"]').type(newPassword);
			cy.get('[data-test-id="login-submit-button"]').click();

			cy.contains('header span', testUser.name);
		});
	});

	context('Negative tests', function () {
		before(function () {
			testUser = generateRandomUser();
			apiCreateUser(testUser);
		});

		beforeEach(function () {
			apiAuthorizeUser(testUser);
			cy.visit('/orders/list');
			cy.contains('header button', testUser.name).click();
		});

		it('should display error for empty old password', function () {
			cy.get('[name="oldPassword"]').clear().blur();
			cy.get('[name="newPassword"]').type(newPassword);
			cy.get('[name="newPasswordRepeat"]').type(newPassword);
			cy.contains('button', 'Change password').click();

			cy.get('.ant-form-item-explain-error').should('be.visible').and('have.text', 'Old password is incorrect.');
		});

		it('should display error for empty new password', function () {
			cy.get('[name="oldPassword"]').type(testUser.password);
			cy.get('[name="newPassword"]').clear().blur();
			cy.get('[name="newPasswordRepeat"]').type(newPassword);
			cy.contains('button', 'Change password').click();

			cy.get('.ant-form-item-explain-error').should('be.visible').and('have.text', 'New passwords must match!');
		});

		it('should display error for empty new password repeat', function () {
			cy.get('[name="oldPassword"]').type(testUser.password);
			cy.get('[name="newPassword"]').type(newPassword);
			cy.get('[name="newPasswordRepeat"]').clear().blur();
			cy.contains('button', 'Change password').click();

			cy.get('.ant-form-item-explain-error').should('be.visible').and('have.text', 'New passwords must match!');
		});

		it('should display error for new password and repeat not matching', function () {
			cy.get('[name="oldPassword"]').type(testUser.password);
			cy.get('[name="newPassword"]').type(newPassword);
			cy.get('[name="newPasswordRepeat"]').type('invalidPassword');
			cy.contains('button', 'Change password').click();

			cy.get('.ant-form-item-explain-error').should('be.visible').and('have.text', 'New passwords must match!');
		});

		it('should display error for invalid new password', function () {
			cy.get('[name="oldPassword"]').type(testUser.password);
			cy.get('[name="newPassword"]').type('invalidPassword');
			cy.get('[name="newPasswordRepeat"]').type('invalidPassword');
			cy.contains('button', 'Change password').click();

			const errorMessage = 'Error while changing the password';
			cy.get('.ant-message-custom-content').should('be.visible').and('have.text', errorMessage);
		});

		it('should display error for old password not matching', function () {
			cy.get('[name="oldPassword"]').type('invalidPassword');
			cy.get('[name="newPassword"]').type(newPassword);
			cy.get('[name="newPasswordRepeat"]').type(newPassword);
			cy.contains('button', 'Change password').click();

			cy.get('.ant-form-item-explain-error').should('be.visible').and('have.text', 'Old password is incorrect.');
		});
	});
});
