// AUTH
const authConstants = {
	loginConstants: {
		INCORRECT_PASSWORD: 'Incorrect password',
	},
	changePasswordConstants: {
		INCORRECT_PASSWORD: 'Incorrect password',
		INCORRECT_OLD_PASSWORD: 'Incorrect old password',
		INVALID_PASSWORD:
			'The new password must contain at least one uppercase letter, ' +
			'one lowercase letter, one number and one special character.',
		SHORT_PASSWORD: 'The new password must be at least 6 characters long.',
		PASSWORDS_SAME: 'The new password must be different from the old password.',
		NO_PERMISSION: 'You cant change this users password.',
	},
};

const commonConstants = {
	authentication: {
		EXPIRED_TOKEN: 'jwt expired',
		MALFORMED_TOKEN: 'jwt malformed',
		MISSING_TOKEN: 'No token provided',
		USER_NOT_FOUND: 'User not found',
	},
};

export const { loginConstants, changePasswordConstants } = authConstants;

export const { EXPIRED_TOKEN, MALFORMED_TOKEN, MISSING_TOKEN, USER_NOT_FOUND } = commonConstants.authentication;
