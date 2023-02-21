const login = ({ email, password }) => {
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

const authService = {
	apiLoginWithoutSession: ({ email, password }) => {
		return login({ email, password });
	},

	apiLogin: ({ email, password }) => {
		Cypress.log({
			name: 'apiLogin',
			displayName: 'apiLogin',
			message: `🔐 Authenticating: ${email}`,
			autoEnd: false,
		});

		cy.session([email, password], () => {
			login({ email, password }).then(response => {
				window.localStorage.setItem('auth-token', response.body.data.login.token);
				return response;
			});
		});
	},

	apiChangePassword: ({ oldPassword, newPassword, token }) => {
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
	},

	apiGetCurrentUserInfo: token => {
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
		return cy.apiGraphQLRequest(body, token);
	},
};

export default authService;
