import auth from './authService';

const createUser = user => {
	Cypress.log({
		name: 'apiCreateUser',
		displayName: 'apiCreateUser',
		message: `Creating user: ${user.email}`,
		autoEnd: false,
	});

	const body = {
		query: `mutation addUser ($input: CreateUserInput!) {
            addUser (input: $input) {
                id
                name
                email
                role
                canBeEdited
            }
        }`,
		variables: {
			input: {
				email: user.email,
				password: user.password,
				name: user.name,
				role: user.role,
			},
		},
	};

	return cy.apiGraphQLRequest(body);
};

const userService = {
	apiCreateUser: user => {
		return createUser(user);
	},

	apiDeleteUser: id => {
		Cypress.log({
			name: 'apiDeleteUser',
			displayName: 'apiDeleteUser',
			message: `Deleting user with id: ${id}`,
			autoEnd: false,
		});

		return cy.apiGraphQLRequest({
			query: `mutation deleteUser ($id: ID!) {
          deleteUser (id: $id) {
              id
              name
              email
              role
              canBeEdited
          }
      }`,
			variables: {
				id,
			},
		});
	},

	apiRegisterAndLogin: user => {
		const { email, password } = user;

		Cypress.log({
			name: 'apiRegisterAndLogin',
			displayName: 'apiRegisterAndLogin',
			message: `🔐 Registering and authenticating: ${email}: ${password}`,
			autoEnd: false,
		});

		return createUser(user).then(response => {
			user.id = response.body.data.addUser.id;
			return auth.apiLogin(user);
		});
	},
};

export default userService;
