import { apiCreateUser, apiLogin } from '../../../helpers/api';
import { generateRandomUser } from '../../../utils/randomizer';

const USER_NOT_FOUND = 'User not found';
const INCORRECT_PASSWORD = 'Incorrect password';

describe('Login', function () {
	let testUser = generateRandomUser();

	before('create test user', function () {
		apiCreateUser(testUser).then(res => {
			cy.log('User created: ' + JSON.stringify(res.body.data.addUser));
		});
	});

	it('should login with valid credentials #smoke', function () {
		apiLogin(testUser).then(res => {
			expect(res.body.data.login.token).to.not.be.null;
		});
	});

	[
		{ user: { email: '', password: testUser.password }, message: USER_NOT_FOUND },
		{ user: { email: testUser.email, password: '' }, message: INCORRECT_PASSWORD },
		{ user: { email: 'invalid', password: testUser.password }, message: USER_NOT_FOUND },
		{ user: { email: testUser.email, password: 'invalid' }, message: INCORRECT_PASSWORD },
	].forEach(test => {
		it(`should return error for login with invalid credentials: ${JSON.stringify(test.user)}`, function () {
			apiLogin(test.user).then(res => {
				expect(res.body.errors[0].message).to.equal(test.message);
			});
		});
	});
});
