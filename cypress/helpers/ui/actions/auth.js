import { authSelectors } from '../selectors/auth';
import { headerSelectors } from '../selectors/header';
import { commonSelectors } from '../selectors/common';

// LOGIN
export const login = (email, password) => {
	fillLoginForm(email, password);
	cy.get(authSelectors.loginForm.submitButton).click();
};

export const fillLoginForm = (email, password) => {
	cy.get(authSelectors.loginForm.usernameInput).clearAndType(email).blur();
	cy.get(authSelectors.loginForm.passwordInput).clearAndType(password).blur();
};

// CHANGE PASSWORD
export const changePassword = (name, password, newPassword, newPasswordRepeat = newPassword) => {
	cy.contains(headerSelectors.userNameText, name).click();

	cy.get(authSelectors.changePasswordForm.oldPasswordInput).clearAndType(password).blur();
	cy.get(authSelectors.changePasswordForm.newPasswordInput).clearAndType(newPassword).blur();
	cy.get(authSelectors.changePasswordForm.newPasswordRepeatInput).clearAndType(newPasswordRepeat).blur();
	cy.contains('button', 'Change password').click();
};

export const closeModal = () => {
	cy.get(commonSelectors.closeModalButton).click();
};

// LOGOUT
export const logout = () => {
	cy.get(authSelectors.logoutButton).click();
};
