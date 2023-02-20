import { authSelectors } from './selectors/auth';
import { headerSelectors } from './selectors/header';

// AUTH
export const login = (email, password) => {
	fillLoginForm(email, password);
	cy.get(authSelectors.loginForm.submitButton).click();
};

export const fillLoginForm = (email, password) => {
	cy.get(authSelectors.loginForm.usernameInput).clearAndType(email).blur();
	cy.get(authSelectors.loginForm.passwordInput).clearAndType(password).blur();
};

export const changePassword = (name, password, newPassword, newPasswordRepeat = newPassword) => {
	cy.contains(headerSelectors.userNameText, name).click();

	cy.get('[name="oldPassword"]').clearAndType(password).blur();
	cy.get('[name="newPassword"]').clearAndType(newPassword).blur();
	cy.get('[name="newPasswordRepeat"]').clearAndType(newPasswordRepeat).blur();
	cy.contains('button', 'Change password').click();
};

export const logout = () => {
	cy.get('span.anticon-logout').click();
};

export const closeModal = () => {
	cy.get('span.ant-modal-close-icon').click();
};
