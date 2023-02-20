import { generateRandomUser } from '../../../utils/randomizer';
import authService from '../../../helpers/api/authService';
import userService from '../../../helpers/api/userService';
import { aliasMutation, aliasQuery } from '../../../utils/graphql-test-utils';
import { login, logout } from '../../../helpers/ui/actions';
import { verifyElementVisible } from '../../../helpers/ui/asserts';
import { headerSelectors } from '../../../helpers/ui/selectors/header';
import { addUserNegativeTestCases } from '../../../helpers/data/users';

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

	// const getRowWithAddForm = () => cy.get('[placeholder="Login email"]').parents('[class="ant-row"]');
	const getRowWithAddForm = () => cy.contains('button', 'Add').parents('[class="ant-row"]');

	const selectRole = role => {
		const roleText = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
		cy.get('.ant-select-dropdown').contains(roleText).click();
	};

	const getByTestId = (element, testId) => cy.wrap(element).find(`[data-test-id="${testId}"]`);

	const createUser = user => {
		getRowWithAddForm().within(row => {
			getByTestId(row, 'form-item-email').type(user.email);
			getByTestId(row, 'form-item-password').type(user.password);
			getByTestId(row, 'form-item-name').type(user.name);
			cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
		});
		selectRole(user.role);
		cy.contains('button', 'Add').click();
		cy.wait('@gqlCreateUserMutation');
	};

	const getRowWithUserToEdit = email => cy.get(`[value="${email}"]`).parents('[class="ant-row"]').first();

	it('should add new user with valid data #smoke', function () {
		createUser(testUser);

		cy.contains('.ant-message-success', 'User created').should('be.visible');

		// Check that user is added to the list
		cy.wait('@gqlGetAllUsersQuery');
		getRowWithUserToEdit(testUser.email).within(row => {
			cy.wrap(row).find('[data-test-id="form-item-name"]').should('have.value', testUser.name);
		});

		// Check that form is reset
		getRowWithAddForm().within(row => {
			getByTestId(row, 'form-item-email').should('have.value', '');
			getByTestId(row, 'form-item-password').should('have.value', '');
			getByTestId(row, 'form-item-name').should('have.value', '');
			cy.wrap(row).find('.ant-select-selection-search-input').should('have.value', '');
		});
	});

	it('should verify that factory is selected in roles dropdown by default', function () {
		getRowWithAddForm().within(row => {
			cy.wrap(row).find('.ant-select-selector').contains('Factory').should('be.visible');
		});
	});

	it('should verify that required texts appear when submitting empty form', function () {
		cy.contains('button', 'Add').click();

		cy.get('[data-test-id="form-item-email"]')
			.last()
			.parents('.ant-form-item-control')
			.find('.ant-form-item-explain-error')
			.should('have.text', 'Required');

		cy.get('[data-test-id="form-item-password"]')
			.last()
			.parents('.ant-form-item-control')
			.find('.ant-form-item-explain-error')
			.should('have.text', 'Required');

		cy.get('[data-test-id="form-item-name"]')
			.last()
			.parents('.ant-form-item-control')
			.find('.ant-form-item-explain-error')
			.should('have.text', 'Required');
	});

	it('should display error when creating a user with already used email', function () {
		const randomUser = generateRandomUser();
		userService.apiCreateUser(randomUser);

		createUser(randomUser);

		const errorMessage = `User with email ${randomUser.email} already exists`;
		verifyElementVisible('.ant-message-error', errorMessage);
	});

	addUserNegativeTestCases.forEach(testCase => {
		it(testCase.title, function () {
			createUser(Object.assign(testUser, testCase.user));

			verifyElementVisible('.ant-message-error', testCase.message);
		});
	});

	it('should create user with valid data and login as new user', function () {
		const randomUser = generateRandomUser();

		createUser(randomUser);

		verifyElementVisible('.ant-message-success', 'User created');

		logout();
		login(randomUser.email, randomUser.password);

		verifyElementVisible(headerSelectors.userNameText, randomUser.name);
	});

	it.skip('should verify if the form loads correctly', function () {
		// TODO: Ensure that the form is displayed
		//  with all the necessary input fields, etc.
		// TODO: Ensure that the default values of the input fields are set correctly.
	});
});
