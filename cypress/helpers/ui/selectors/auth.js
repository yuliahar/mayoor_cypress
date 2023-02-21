export const authSelectors = {
	logoutButton: 'span.anticon-logout',
	loginForm: {
		usernameInput: '[data-test-id="login-username"]',
		passwordInput: '[data-test-id="login-password"]',
		submitButton: '[data-test-id="login-submit-button"]',
	},
	changePasswordForm: {
		oldPasswordInput: '[name="oldPassword"]',
		newPasswordInput: '[name="newPassword"]',
		newPasswordRepeatInput: '[name="newPasswordRepeat"]',
	},
};
