import { apiChangePassword, apiCreateUser, apiLogin } from '../../../helpers/api';
import { generateRandomUser } from '../../../utils/randomizer';
import { invalidPasswords } from '../../../data/auth';
import {
	INCORRECT_OLD_PASSWORD,
	INCORRECT_PASSWORD,
	INVALID_PASSWORD,
	MISSING_TOKEN,
	NO_PERMISSION,
	PASSWORDS_SAME,
	SHORT_PASSWORD,
} from '../../../constants/auth';

describe('Change password', function () {
	const testUser = generateRandomUser();

	before('create test user', function () {
		apiCreateUser(testUser).then(res => {
			cy.log('User created: ' + JSON.stringify(res.body.data.addUser));
		});
	});

	beforeEach('login test user and save token', function () {
		if (Cypress.config().skipBeforeEach) {
			return;
		}
		apiLogin(testUser).its('body.data.login.token').as('token');
	});

	it('should change password with valid data and login with new password', function () {
		const newPassword = testUser.password + '1';

		apiChangePassword({
			oldPassword: testUser.password,
			newPassword,
			token: this.token,
		}).then(res => {
			expect(res.body.data.changePassword.id).to.be.not.null;
			expect(res.body.data.changePassword.name).to.eq(testUser.name);
			expect(res.body.data.changePassword.email).to.eq(testUser.email);
			expect(res.body.data.changePassword.role).to.eq(testUser.role);
			expect(res.body.data.changePassword.canBeEdited).to.eq(true);
		});

		// should not be able to log in with old password
		apiLogin(testUser).then(res => {
			expect(res.body.errors[0].message).to.eq(INCORRECT_PASSWORD);
		});

		// should be able to log in with new password
		testUser.password = newPassword;
		apiLogin(testUser).then(res => {
			expect(res.body.data.login.token).to.not.be.null;
		});
	});

	it('should return error for empty new password', function () {
		apiChangePassword({
			oldPassword: testUser.password,
			newPassword: '',
			token: this.token,
		}).then(res => {
			expect(res.body.errors[0].message).to.eq(SHORT_PASSWORD);
		});
	});

	invalidPasswords.forEach(password => {
		it('should return error when invalid old password: ' + password, function () {
			apiChangePassword({
				oldPassword: testUser.password,
				newPassword: password,
				token: this.token,
			}).then(res => {
				expect(res.body.errors[0].message).to.eq(INVALID_PASSWORD);
			});
		});
	});

	it('should return error when empty old password', function () {
		const newPassword = testUser.password + '1';

		apiChangePassword({
			oldPassword: '',
			newPassword,
			token: this.token,
		}).then(res => {
			expect(res.body.errors[0].message).to.eq(INCORRECT_OLD_PASSWORD);
		});
	});

	it('should return error for missing token', function () {
		const newPassword = testUser.password + '1';

		apiChangePassword({
			oldPassword: testUser.password,
			newPassword,
		}).then(res => {
			expect(res.body.errors[0].message).to.eq(MISSING_TOKEN);
		});
	});

	it('should return error when oldPassword = newPassword', function () {
		apiChangePassword({
			oldPassword: testUser.password,
			newPassword: testUser.password,
			token: this.token,
		}).then(res => {
			expect(res.body.errors[0].message).to.eq(PASSWORDS_SAME);
		});
	});

	it('should return error for invalid token', function () {
		const invalid_token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYTFjMGNhMWNjNTIyZGM1NTJjYTlmYSIs' +
			'ImlhdCI6MTY3MTU0NTAzNCwiZXhwIjoxNjcxNjMxNDM0fQ.DPe1GbsEYmB3qDMVRG5Of3E9V6Xa8LBMS6v-t7USVA8';

		apiChangePassword({
			oldPassword: testUser.password,
			newPassword: testUser.password + '1',
			token: invalid_token,
		}).then(res => {
			expect(res.body.errors[0].message).to.eq('invalid signature');
		});
	});

	// describe('Change password', function () {
	it('should return error when no enough permissions', { skipBeforeEach: true }, function () {
		cy.fixture('admin').as('adminUser');

		cy.get('@adminUser').then(adminUser => {
			apiLogin(adminUser).its('body.data.login.token').as('token');

			cy.get('@token').then(token => {
				cy.log('token: ' + token);

				apiChangePassword({
					oldPassword: adminUser.password,
					newPassword: adminUser.password + '1',
					token,
				}).then(res => {
					expect(res.body.errors[0].message).to.eq(NO_PERMISSION);
				});
			});
		});
		// });
	});
});
