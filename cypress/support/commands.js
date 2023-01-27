const apiGraphQLUrl = `${Cypress.env('apiUrl')}`;

Cypress.Commands.add('apiGraphQLRequest', (body, currentToken) => {
	const token = currentToken ? currentToken : window.localStorage.getItem('auth-token');

	return cy.api({
		method: 'POST',
		url: apiGraphQLUrl,
		body,
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
			'Content-Type': 'application/json',
		},
		failOnStatusCode: false,
	});
});
