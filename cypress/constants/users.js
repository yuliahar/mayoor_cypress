const usersConstants = {
	addUserConstants: {
		INVALID_EMAIL: 'Email has invalid format. Please try again.',
		SHORT_PASSWORD: 'Password should be at least 6 characters long.',
		LONG_PASSWORD: 'Password should be 20 characters maximum.',
		INSECURE_PASSWORD:
			'The password must contain at least one uppercase letter, ' +
			'one lowercase letter, one number and one special character.',
	},
};

export const { INVALID_EMAIL, SHORT_PASSWORD, LONG_PASSWORD, INSECURE_PASSWORD } = usersConstants.addUserConstants;
