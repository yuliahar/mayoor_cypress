import { generateRandomUser } from '../../../utils/randomizer';
import userService from '../../../helpers/api/userService';
import authService from '../../../helpers/api/authService';
import { changePassword, closeModal, login, logout } from '../../../helpers/ui/actions';
import { authConstants, commonConstants } from '../../../helpers/data/constants';
import { verifyElementVisible } from '../../../helpers/ui/asserts';
import { headerSelectors } from '../../../helpers/ui/selectors/header';
import { authSelectors } from '../../../helpers/ui/selectors/auth';

describe('Change password', function () {
	const newPassword = 'newPa33word!';

	context('Positive tests', function () {
		it('should change password with valid data and login with new password', function () {
			const testUser = generateRandomUser();
			userService.apiRegisterAndLogin(testUser);

			cy.visit('/');
			changePassword(testUser.name, testUser.password, newPassword);

			const successMessage = authConstants.changePassword.SUCCESS_MESSAGE;
			verifyElementVisible(authSelectors.successMessage, successMessage);

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
				title: 'should display error when new password and repeat password are not the same',
				oldPassword: testUser.password,
				newPassword: newPassword,
				newPasswordRepeat: 'invalidPassword',
				message: authConstants.changePassword.PASSWORDS_NOT_MATCHING,
			},
			{
				title: 'should display error when old password is incorrect',
				oldPassword: 'invalidPassword',
				newPassword: newPassword,
				message: authConstants.changePassword.OLD_PASSWORD_INCORRECT,
			},
			{
				title: 'should display error when new password is not secure',
				oldPassword: testUser.password,
				newPassword: '1234567',
				message: commonConstants.INSECURE_PASSWORD,
			},
			{
				title: 'should display error when new password is too short',
				oldPassword: testUser.password,
				newPassword: '12',
				message: commonConstants.SHORT_PASSWORD,
			},
			{
				title: 'should display error when new password is too long',
				oldPassword: testUser.password,
				newPassword: '123Pa33word!123Pa33word!123P',
				message: commonConstants.LONG_PASSWORD,
			},
			{
				title: 'should display error when new password is the same as old password',
				oldPassword: testUser.password,
				newPassword: testUser.password,
				message: authConstants.changePassword.SAME_PASSWORD,
			},
		].forEach(test => {
			it(test.title, function () {
				changePassword(testUser.name, test.oldPassword, test.newPassword, test.newPasswordRepeat);
				verifyElementVisible(authSelectors.errorMessage, test.message);
			});
		});
	});
});
