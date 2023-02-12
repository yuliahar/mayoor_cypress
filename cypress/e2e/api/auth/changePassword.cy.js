import { generateRandomUser } from '../../../utils/randomizer';
import { invalidPasswords } from '../../../data/auth';
import userService from '../../../helpers/api/userService';
import authService from '../../../helpers/api/authService';
import { authConstants, commonConstants } from '../../../data/constants';
import { verifyUserResponse } from '../../../helpers/api/asserts';

describe('changePassword', function () {
	const testUser = generateRandomUser();

	context('authorized user', function () {
		before('create test user', function () {
			userService.apiCreateUser(testUser);
		});

		beforeEach('login test user and save token', function () {
			if (Cypress.config().skipBeforeEach) {
				return;
			}
			authService.apiLogin(testUser);
		});

		it('should change password with valid data and login with new password', function () {
			const newPassword = testUser.password + '1';

			authService
				.apiChangePassword({
					oldPassword: testUser.password,
					newPassword,
				})
				.then(res => {
					const { changePassword } = res.body.data;
					verifyUserResponse(changePassword, testUser);
				});

			// should not be able to log in with old password
			authService.apiLoginWithoutSession(testUser).then(res => {
				expect(res.body.errors[0].message).to.eq(authConstants.login.INCORRECT_PASSWORD);
			});

			// should be able to log in with new password
			testUser.password = newPassword;
			authService.apiLoginWithoutSession(testUser).then(res => {
				expect(res.body.data.login.token).to.not.be.null;
			});
		});

		it('should return error for empty new password', function () {
			authService
				.apiChangePassword({
					oldPassword: testUser.password,
					newPassword: '',
					token: this.token,
				})
				.then(res => {
					expect(res.body.errors[0].message).to.eq(authConstants.changePassword.SHORT_PASSWORD);
				});
		});

		invalidPasswords.forEach(password => {
			it('should return error when invalid old password: ' + password, function () {
				authService
					.apiChangePassword({
						oldPassword: testUser.password,
						newPassword: password,
						token: this.token,
					})
					.then(res => {
						expect(res.body.errors[0].message).to.eq(authConstants.changePassword.INVALID_PASSWORD);
					});
			});
		});

		it('should return error when empty old password', function () {
			const newPassword = testUser.password + '1';

			authService
				.apiChangePassword({
					oldPassword: '',
					newPassword,
					token: this.token,
				})
				.then(res => {
					expect(res.body.errors[0].message).to.eq(authConstants.changePassword.INCORRECT_OLD_PASSWORD);
				});
		});

		it('should return error when oldPassword = newPassword', function () {
			authService
				.apiChangePassword({
					oldPassword: testUser.password,
					newPassword: testUser.password,
					token: this.token,
				})
				.then(res => {
					expect(res.body.errors[0].message).to.eq(authConstants.changePassword.PASSWORDS_SAME);
				});
		});

		it('should return error when no enough permissions', { skipBeforeEach: true }, function () {
			cy.fixture('admin').as('adminUser');

			cy.get('@adminUser').then(adminUser => {
				authService.apiLogin(adminUser);

				authService
					.apiChangePassword({
						oldPassword: adminUser.password,
						newPassword: adminUser.password + '1',
					})
					.then(res => {
						expect(res.body.errors[0].message).to.eq(authConstants.changePassword.NO_PERMISSION);
					});
			});
		});
	});

	context('unauthorized user', function () {
		it('should return error for missing token', function () {
			const newPassword = testUser.password + '1';

			authService
				.apiChangePassword({
					oldPassword: testUser.password,
					newPassword,
				})
				.then(res => {
					expect(res.body.errors[0].message).to.eq(commonConstants.MISSING_TOKEN);
				});
		});

		it('should return error for invalid token', function () {
			const invalid_token =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYTFjMGNhMWNjNTIyZGM1NTJjYTlmYSIs' +
				'ImlhdCI6MTY3MTU0NTAzNCwiZXhwIjoxNjcxNjMxNDM0fQ.DPe1GbsEYmB3qDMVRG5Of3E9V6Xa8LBMS6v-t7USVA8';

			authService
				.apiChangePassword({
					oldPassword: testUser.password,
					newPassword: testUser.password + '1',
					token: invalid_token,
				})
				.then(res => {
					expect(res.body.errors[0].message).to.eq('invalid signature');
				});
		});
	});
});
