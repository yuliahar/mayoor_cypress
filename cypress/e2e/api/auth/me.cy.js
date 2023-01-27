import { apiDeleteUser, apiGetCurrentUserInfo, apiRegisterAndLogin } from '../../../helpers/api';
import { generateRandomUser } from '../../../utils/randomizer';
import { EXPIRED_TOKEN, MALFORMED_TOKEN, MISSING_TOKEN, USER_NOT_FOUND } from '../../../constants/auth';

describe('/me', function () {
	const user = generateRandomUser();

	it('should return user info for valid authorized user', function () {
		apiRegisterAndLogin(user);
		apiGetCurrentUserInfo().then(res => {
			expect(res.body.data.me.name).to.equal(user.name);
			expect(res.body.data.me.email).to.equal(user.email);
			expect(res.body.data.me.role).to.equal(user.role);
		});
	});

	context('should return error for unauthorized or unknown user', function () {
		before('clear session', function () {
			Cypress.session.clearCurrentSessionData();
		});

		[
			{
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld1VzZXJAZ21haWwuY29tIiwia' +
					'WQiOiJjbGRjajh3ZWkwMDAyZjBteHJrOGFtMXJnIiwiaWF0IjoxNjc1MjE4NDA5LCJleHAiOjE2NzUyNjE2MDl9' +
					'.hfdz4bpVc6mRFrGqUIa' +
					'GB3nqLQHTn650soCKg2C0AeM',
				message: EXPIRED_TOKEN,
			},
			{
				token: 'invalid token',
				message: MALFORMED_TOKEN,
			},
			{
				token: '',
				message: MISSING_TOKEN,
			},
			{
				token: null,
				message: MISSING_TOKEN,
			},
		].forEach(({ token, message }) => {
			it('should return error for invalid token: ' + token, function () {
				apiGetCurrentUserInfo(token).then(res => {
					expect(res.body.errors[0].message).to.equal(message);
				});
			});
		});

		it('should return error for deleted user', function () {
			apiRegisterAndLogin(user).then(() => {
				apiDeleteUser(user.id).then(() => {
					apiGetCurrentUserInfo().then(res => {
						expect(res.body.errors[0].message).to.equal(USER_NOT_FOUND);
					});
				});
			});
		});
	});
});
