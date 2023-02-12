import { commonConstants } from './constants';

export const invalidPasswords = [
	' passworD2!', //with space in the beginning
	'passworD2! ', //with space at the end
	'passwor D2!', //with space in the middle
	'password2!', //with no one upper case
	'PASSWORD2!', //with no one lower case
	'passworD!', //with no one digit
	'passworD2', //with no one spec.chars
];

export const authNegativeTestCases = [
	{
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld1VzZXJAZ21haWwuY29tIiwia' +
			'WQiOiJjbGRjajh3ZWkwMDAyZjBteHJrOGFtMXJnIiwiaWF0IjoxNjc1MjE4NDA5LCJleHAiOjE2NzUyNjE2MDl9' +
			'.hfdz4bpVc6mRFrGqUIa' +
			'GB3nqLQHTn650soCKg2C0AeM',
		message: commonConstants.EXPIRED_TOKEN,
	},
	{
		token: 'invalid token',
		message: commonConstants.MALFORMED_TOKEN,
	},
	{
		token: '',
		message: commonConstants.MISSING_TOKEN,
	},
	{
		token: null,
		message: commonConstants.MISSING_TOKEN,
	},
];
