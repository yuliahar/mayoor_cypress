import { generateRandomUser } from '../../../utils/randomizer';
import userService from '../../../helpers/api/userService';
import authService from '../../../helpers/api/authService';
import { commonConstants } from '../../../helpers/data/constants';
import { verifyUserResponse } from '../../../helpers/api/asserts';
import { authNegativeTestCases } from '../../../helpers/data/auth';

describe('me', function () {
	context('for valid authorized user', function () {
		const user = generateRandomUser();

		it('should return user info for valid authorized user', function () {
			userService.apiRegisterAndLogin(user);
			authService.apiGetCurrentUserInfo().then(res => {
				expect(res.body.errors).to.be.undefined;
				verifyUserResponse(res.body.data.me, user);
			});
		});
	});

	context('for unauthorized or unknown user', function () {
		const user = generateRandomUser();

		authNegativeTestCases.forEach(({ token, message }) => {
			it('should return error for invalid token: ' + token, function () {
				authService.apiGetCurrentUserInfo(token).then(res => {
					expect(res.body.errors[0].message).to.equal(message);
					expect(res.body.data.me).to.be.null;
				});
			});
		});

		it('should return error for deleted user', function () {
			userService.apiRegisterAndLogin(user).as('apiRegisterAndLogin');

			cy.get('@apiRegisterAndLogin').then(() => {
				userService.apiDeleteUser(user.id).as('apiDeleteUser');
			});

			cy.get('@apiDeleteUser').then(() => {
				authService.apiGetCurrentUserInfo().then(res => {
					expect(res.body.errors[0].message).to.equal(commonConstants.USER_NOT_FOUND);
					expect(res.body.data.me).to.be.null;
				});
			});
		});
	});
});
