import { generateRandomUser } from '../../../utils/randomizer';
import authService from '../../../helpers/api/authService';
import userService from '../../../helpers/api/userService';
import { authConstants, commonConstants } from '../../../helpers/data/constants';

describe('login', function () {
	let testUser = generateRandomUser();

	before('create test user', function () {
		userService.apiCreateUser(testUser);
	});

	it('should login with valid credentials #smoke', function () {
		authService.apiLoginWithoutSession(testUser).then(res => {
			expect(res.body.data.login.token).to.not.be.null;
		});
	});

	[
		{ user: { email: '', password: testUser.password }, message: commonConstants.USER_NOT_FOUND },
		{ user: { email: testUser.email, password: '' }, message: authConstants.login.INCORRECT_PASSWORD },
		{ user: { email: 'invalid', password: testUser.password }, message: commonConstants.USER_NOT_FOUND },
		{ user: { email: testUser.email, password: 'invalid' }, message: authConstants.login.INCORRECT_PASSWORD },
	].forEach(test => {
		it(`should return error for login with invalid credentials: ${JSON.stringify(test.user)}`, function () {
			authService.apiLoginWithoutSession(test.user).then(res => {
				expect(res.body.errors[0].message).to.equal(test.message);
			});
		});
	});
});
