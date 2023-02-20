import { commonConstants, usersConstants } from './constants';

export const addUserNegativeTestCases = [
	{
		user: { email: 'invalidEmail' },
		message: usersConstants.addUser.INVALID_EMAIL,
	},
	{
		user: { email: '' },
		message: usersConstants.addUser.INVALID_EMAIL,
	},
	{
		user: { password: '' },
		message: commonConstants.SHORT_PASSWORD,
	},
	{
		user: { password: '123' },
		message: commonConstants.SHORT_PASSWORD,
	},
	{
		user: { password: '123456789012345678901' },
		message: commonConstants.LONG_PASSWORD,
	},
];
