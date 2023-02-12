import { generateRandomUser } from '../../../utils/randomizer';
import { invalidPasswords } from '../../../data/auth';
import userService from '../../../helpers/api/userService';
import authService from '../../../helpers/api/authService';
import { verifyUserResponse } from '../../../helpers/api/asserts';
import { usersConstants } from '../../../data/constants';
import { addUserNegativeTestCases } from '../../../data/users';

describe('addUser', function () {
	after(function () {
		cy.task('db:dropUsers');
	});

	context('positive tests', function () {
		let userIDtoDelete;

		it('should create user with valid data and then login', function () {
			const testUser = generateRandomUser();

			userService.apiCreateUser(testUser).then(res => {
				const { addUser } = res.body.data;
				userIDtoDelete = addUser.id;
				verifyUserResponse(addUser, testUser);

				authService.apiLoginWithoutSession(testUser).then(res => {
					expect(res.body.data.login.token).to.be.not.null;
				});
			});
		});

		it('should create user with only required data', function () {
			const testUser = generateRandomUser();
			delete testUser.role;
			delete testUser.name;

			userService.apiCreateUser(testUser).then(res => {
				const { addUser } = res.body.data;
				userIDtoDelete = addUser.id;
				verifyUserResponse(addUser, testUser);
			});
		});

		it('should create a user with empty name', function () {
			const testUser = generateRandomUser({ name: '' });

			userService.apiCreateUser(testUser).then(res => {
				const { addUser } = res.body.data;
				userIDtoDelete = addUser.id;
				expect(addUser.name).to.eq(testUser.name);
			});
		});

		afterEach('mark user to delete', function () {
			userService.apiDeleteUser(userIDtoDelete);
		});
	});

	context('negative tests', function () {
		it('should return error when creating a user with already used email / username', function () {
			const testUser = generateRandomUser();
			let userIDtoDelete;

			userService.apiCreateUser(testUser).then(res => {
				userIDtoDelete = res.body.data.addUser.id;

				userService
					.apiCreateUser(testUser)
					.then(res => {
						expect(res.body.errors[0].message).to.eq(`User with email "${testUser.email}" already exists`);
						return res;
					})
					.then(() => {
						userService.apiDeleteUser(userIDtoDelete);
					});
			});
		});

		addUserNegativeTestCases.forEach(testCase => {
			it('should return error when creating a user with data: ' + JSON.stringify(testCase.user), function () {
				const testUser = generateRandomUser(testCase.user);

				userService.apiCreateUser(testUser).then(res => {
					expect(res.body.errors[0].message).to.eq(testCase.message);
				});
			});
		});

		invalidPasswords.forEach(password => {
			it('should return error when creating a user with insecure password: ' + password, function () {
				const testUser = generateRandomUser({ password: password });

				userService.apiCreateUser(testUser).then(res => {
					expect(res.body.errors[0].message).to.eq(usersConstants.addUser.INSECURE_PASSWORD);
				});
			});
		});
	});
});
