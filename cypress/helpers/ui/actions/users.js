// USERS => LIST
import { clickElement, findIn } from './common';
import { usersSelectors } from '../selectors/users';
import { commonSelectors } from '../selectors/common';

export const selectRole = role => {
	const roleText = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
	clickElement(usersSelectors.table.roles.rolesDropdown, roleText);
};

export const createUser = user => {
	getRowWithAddForm().within(row => {
		findIn(row, usersSelectors.table.form.emailInput).type(user.email);
		findIn(row, usersSelectors.table.form.passwordInput).type(user.password);
		findIn(row, usersSelectors.table.form.nameInput).type(user.name);
		findIn(row, usersSelectors.table.roles.roleSearchInput).click({ force: true });
	});
	selectRole(user.role);
	cy.contains('button', 'Add').click();
	cy.wait('@gqlCreateUserMutation');
};

export const getRowWithUser = email => cy.get(`[value="${email}"]`).parents('[class="ant-row"]');

// const getRowWithAddForm = () => cy.get('[placeholder="Login email"]').parents('[class="ant-row"]');
export const getRowWithAddForm = () => cy.contains('button', 'Add').parents('[class="ant-row"]');

export const getExplainedError = selector =>
	cy.get(selector).last().parents('.ant-form-item-control').find(commonSelectors.explainErrorMessage);
