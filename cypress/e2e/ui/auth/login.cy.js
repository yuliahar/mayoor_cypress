import { generateRandomUser } from '../../../utils/randomizer';
import userService from '../../../helpers/api/userService';
import { fillLoginForm, login } from '../../../helpers/ui/actions/auth';
import { verifyElementDisabled, verifyElementVisible } from '../../../helpers/ui/asserts/asserts';
import { headerSelectors } from '../../../helpers/ui/selectors/header';
import { authConstants, commonConstants } from '../../../helpers/data/constants';
import { authSelectors } from '../../../helpers/ui/selectors/auth';
import { commonSelectors } from '../../../helpers/ui/selectors/common';

describe('Login', function () {
	const testUser = generateRandomUser();

	before(function () {
		userService.apiCreateUser(testUser);
	});

	beforeEach(function () {
		cy.visit('/');
	});

	it('should login user with valid credentials', function () {
		login(testUser.email, testUser.password);
		verifyElementVisible(headerSelectors.userNameText, testUser.name);
	});

	it('should verify that login button is disabled for empty email', function () {
		fillLoginForm('', testUser.password);
		verifyElementDisabled(authSelectors.loginForm.submitButton);
	});

	it('should verify that login button is disabled for empty password', function () {
		fillLoginForm(testUser.email, '');
		verifyElementDisabled(authSelectors.loginForm.submitButton);
	});

	it('should display error for non-existing user', function () {
		login('invalidEmail', testUser.password);
		verifyElementVisible(commonSelectors.explainErrorMessage, commonConstants.USER_NOT_FOUND);
	});

	it('should return error for login with invalid password', function () {
		login(testUser.email, 'invalidPassword');
		verifyElementVisible(commonSelectors.explainErrorMessage, authConstants.login.INVALID_PASSWORD);
	});
});
