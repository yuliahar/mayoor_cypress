// AUTHENTICATION
export const apiLogin = ({ email, password }) => {
	Cypress.log({
		name: 'apiLogin',
		displayName: 'apiLogin',
		message: `🔐 Authenticating: ${email}: ${password}`,
		autoEnd: false,
	});

	return cy.apiGraphQLRequest({
		query: `mutation login ($email: String!, $password: String!) {
            login (email: $email, password: $password) {
                token
            }
        }`,
		variables: {
			email,
			password,
		},
	});
};

export const apiChangePassword = ({ oldPassword, newPassword, token }) => {
	Cypress.log({
		name: 'apiChangePassword',
		displayName: 'apiChangePassword',
		message: `🔐 Change password: ${oldPassword}: ${newPassword}`,
		autoEnd: false,
	});

	return cy.apiGraphQLRequest(
		{
			query: `mutation changePassword ($oldPassword: String!, $newPassword: String!) {
							changePassword (oldPassword: $oldPassword, newPassword: $newPassword) {
									id
									name
									email
									role
									canBeEdited
							}
					}`,
			variables: {
				oldPassword,
				newPassword,
			},
		},
		token
	);
};

export const apiGetCurrentUserInfo = () => {
	Cypress.log({
		name: 'apiGetCurrentUserInfo',
		displayName: 'apiGetCurrentUserInfo',
		message: `Getting current user info`,
		autoEnd: false,
	});

	const body = {
		query: `query me {
          me {
              id
              name
              email
              role
              canBeEdited
          }
      }`,
		variables: {},
	};
	return cy.apiGraphQLRequest(body);
};

export const apiCreateUser = user => {
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

export const apiDeleteUser = id => {
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
};
