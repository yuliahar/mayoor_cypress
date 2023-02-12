// ============== AUTH =================
export const authConstants = {
	login: {
		INCORRECT_PASSWORD: 'Incorrect password',
	},
	changePassword: {
		INCORRECT_PASSWORD: 'Incorrect password',
		INCORRECT_OLD_PASSWORD: 'Incorrect old password',
		OLD_PASSWORD_INCORRECT: 'Old password is incorrect.',
		INVALID_PASSWORD:
			'The new password must contain at least one uppercase letter, ' +
			'one lowercase letter, one number and one special character.',
		SHORT_PASSWORD: 'The new password must be at least 6 characters long.',
		PASSWORDS_SAME: 'The new password must be different from the old password.',
		NO_PERMISSION: 'You cant change this users password.',
		SUCCESS_MESSAGE: 'Password successfully changed.',
		PASSWORDS_NOT_MATCHING: 'New passwords must match!',
	},
};

// =============== COMMON ==============
export const commonConstants = {
	EXPIRED_TOKEN: 'jwt expired',
	MALFORMED_TOKEN: 'jwt malformed',
	MISSING_TOKEN: 'No token provided',
	USER_NOT_FOUND: 'User not found',
};

// =============== USERS ==============
export const usersConstants = {
	addUser: {
		INVALID_EMAIL: 'Email has invalid format. Please try again.',
		SHORT_PASSWORD: 'Password should be at least 6 characters long.',
		LONG_PASSWORD: 'Password should be 20 characters maximum.',
		INSECURE_PASSWORD:
			'The password must contain at least one uppercase letter, ' +
			'one lowercase letter, one number and one special character.',
	},
};
