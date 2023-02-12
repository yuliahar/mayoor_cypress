export const login = (email, password) => {
	cy.get('[data-test-id="login-username"]').type(email);
	cy.get('[data-test-id="login-password"]').type(password);
	cy.get('[data-test-id="login-submit-button"]').click();
};

export const changePassword = (name, password, newPassword, newPasswordRepeat = newPassword) => {
	cy.contains('header button', name).click();

	if (!password) {
		cy.get('[name="oldPassword"]').clear().blur();
	} else {
		cy.get('[name="oldPassword"]').type(password);
	}
	if (!newPassword) {
		cy.get('[name="newPassword"]').clear().blur();
	} else {
		cy.get('[name="newPassword"]').type(newPassword);
	}
	if (!newPasswordRepeat) {
		cy.get('[name="newPasswordRepeat"]').clear().blur();
	} else {
		cy.get('[name="newPasswordRepeat"]').type(newPasswordRepeat);
	}
	cy.contains('button', 'Change password').click();
};

export const logout = () => {
	cy.get('span.anticon-logout').click();
};

export const closeModal = () => {
	cy.get('span.ant-modal-close-icon').click();
};
