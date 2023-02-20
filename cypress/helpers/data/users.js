import { commonConstants, usersConstants } from './constants';

export const addUserNegativeTestCases = [
	{
		title: 'should return error when creating a user with invalid email',
		user: { email: 'invalidEmail' },
		message: usersConstants.addUser.INVALID_EMAIL,
	},
	{
		title: 'should return error when creating a user with invalid password',
		user: { password: 'password' },
		message: commonConstants.INSECURE_PASSWORD,
	},
	{
		title: 'should return error when short password',
		user: { password: '123' },
		message: commonConstants.SHORT_PASSWORD,
	},
	{
		title: 'should return error when long password',
		user: { password: '123456789012345678901' },
		message: commonConstants.LONG_PASSWORD,
	},
];
