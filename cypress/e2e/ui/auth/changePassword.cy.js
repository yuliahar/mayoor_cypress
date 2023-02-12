import { generateRandomUser } from '../../../utils/randomizer';
import userService from '../../../helpers/api/userService';
import authService from '../../../helpers/api/authService';
import { changePassword, closeModal, login, logout } from '../../../helpers/ui/actions';
import { authConstants } from '../../../data/constants';
import { verifyElementVisible, verifyMessageDisplayed } from '../../../helpers/ui/asserts';
import { headerSelectors } from '../../../helpers/ui/selectors/header';
import { changePasswordSelectors } from '../../../helpers/ui/selectors/auth';

describe('Change password', function () {
	const newPassword = 'newPa33word!';

	context('Positive tests', function () {
		it('should change password with valid data and login with new password', function () {
			const testUser = generateRandomUser();
			userService.apiRegisterAndLogin(testUser);

			cy.visit('/');
			changePassword(testUser.name, testUser.password, newPassword);

			const successMessage = authConstants.changePassword.SUCCESS_MESSAGE;
			verifyMessageDisplayed(changePasswordSelectors.successMessage, successMessage);

			closeModal();
			logout();
			login(testUser.email, newPassword);

			verifyElementVisible(headerSelectors.userNameText, testUser.name);
		});
	});

	context('Negative tests', function () {
		let testUser = generateRandomUser();

		before(function () {
			userService.apiCreateUser(testUser);
		});

		beforeEach(function () {
			authService.apiLogin(testUser);
			cy.visit('/');
		});

		[
			{
				oldPassword: '',
				newPassword: newPassword,
				newPasswordRepeat: newPassword,
				message: authConstants.changePassword.OLD_PASSWORD_INCORRECT,
			},
			{
				oldPassword: testUser.password,
				newPassword: '',
				newPasswordRepeat: newPassword,
				message: authConstants.changePassword.PASSWORDS_NOT_MATCHING,
			},
			{
				oldPassword: testUser.password,
				newPassword: newPassword,
				newPasswordRepeat: '',
				message: authConstants.changePassword.PASSWORDS_NOT_MATCHING,
			},
			{
				oldPassword: testUser.password,
				newPassword: newPassword,
				newPasswordRepeat: 'invalidPassword',
				message: authConstants.changePassword.PASSWORDS_NOT_MATCHING,
			},
			{
				oldPassword: 'invalidPassword',
				newPassword: newPassword,
				newPasswordRepeat: newPassword,
				message: authConstants.changePassword.OLD_PASSWORD_INCORRECT,
			},
		].forEach(test => {
			it('should display error for wrong data: ' + JSON.stringify(test), function () {
				changePassword(testUser.name, test.oldPassword, test.newPassword, test.newPasswordRepeat);
				verifyMessageDisplayed(changePasswordSelectors.errorMessage, test.message);
			});
		});

		it('should display error for invalid new password', function () {
			changePassword(testUser.name, testUser.password, 'invalidPassword');

			const errorMessage = 'Error while changing the password';
			cy.get('.ant-message-custom-content').should('be.visible').and('have.text', errorMessage);
		});
	});
});
