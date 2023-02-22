import { generateRandomUser } from '../../../utils/randomizer';
import authService from '../../../helpers/api/authService';
import { aliasMutation, aliasQuery } from '../../../utils/graphql-test-utils';
import { createUser, getExplainedError } from '../../../helpers/ui/actions/users';
import { getRowWithAddForm, getRowWithUser } from '../../../helpers/ui/actions/users';
import { clickElement, findIn } from '../../../helpers/ui/actions/common';
import { usersSelectors } from '../../../helpers/ui/selectors/users';
import { commonSelectors } from '../../../helpers/ui/selectors/common';
import { verifyElementVisible } from '../../../helpers/ui/asserts/asserts';
import userService from '../../../helpers/api/userService';
import { addUserNegativeTestCases } from '../../../helpers/data/users';
import { login, logout } from '../../../helpers/ui/actions/auth';
import { headerSelectors } from '../../../helpers/ui/selectors/header';

describe('Users', function () {
	let testUser = null;

	beforeEach(function () {
		cy.fixture('admin').then(admin => {
			authService.apiLogin(admin);
			cy.visit('/users');
		});
		cy.intercept('POST', `/api/graphql`, req => {
			aliasQuery(req, 'GetAllUsers');
			aliasMutation(req, 'CreateUser');
		});
		testUser = generateRandomUser();
	});

	it('should add new user with valid data #smoke', function () {
		createUser(testUser);
		verifyElementVisible(commonSelectors.successMessage, 'User created');

		// Check that user is added to the list
		cy.wait('@gqlGetAllUsersQuery');
		getRowWithUser(testUser.email).within(row => {
			findIn(row, usersSelectors.table.form.nameInput).should('have.value', testUser.name);
		});

		// Check that form is reset
		getRowWithAddForm().within(row => {
			findIn(row, usersSelectors.table.form.emailInput).should('have.value', '');
			findIn(row, usersSelectors.table.form.passwordInput).should('have.value', '');
			findIn(row, usersSelectors.table.form.nameInput).should('have.value', '');
			findIn(row, usersSelectors.table.form.selectedRole).should('have.text', 'Factory');
		});
	});

	it('should verify that factory is selected in roles dropdown by default', function () {
		getRowWithAddForm().within(row => {
			findIn(row, usersSelectors.table.form.selectedRole).should('be.visible').and('have.text', 'Factory');
		});
	});

	it('should verify that required texts appear when submitting empty form', function () {
		clickElement('button', 'Add');

		Object.entries(usersSelectors.table.form)
			.filter(([key]) => key.includes('Input'))
			.forEach(([key]) => {
				getExplainedError(usersSelectors.table.form[key]).should('be.visible').and('have.text', 'Required');
			});
	});

	it('should display error when creating a user with already used email', function () {
		const randomUser = generateRandomUser();
		userService.apiCreateUser(randomUser);

		createUser(randomUser);

		const errorMessage = `User with email ${randomUser.email} already exists`;
		verifyElementVisible(commonSelectors.toastErrorMessage, errorMessage);
	});

	addUserNegativeTestCases.forEach(testCase => {
		it(testCase.title, function () {
			createUser(Object.assign(testUser, testCase.user));

			verifyElementVisible(commonSelectors.toastErrorMessage, testCase.message);
		});
	});

	it('should create user with valid data and login as new user', function () {
		const randomUser = generateRandomUser();

		createUser(randomUser);
		verifyElementVisible(commonSelectors.successMessage, 'User created');
		logout();
		login(randomUser.email, randomUser.password);

		verifyElementVisible(headerSelectors.userNameText, randomUser.name);
	});
	//
	// it.skip('should verify if the form loads correctly', function () {
	// 	// TODO: Ensure that the form is displayed
	// 	//  with all the necessary input fields, etc.
	// 	// TODO: Ensure that the default values of the input fields are set correctly.
	// });
});
