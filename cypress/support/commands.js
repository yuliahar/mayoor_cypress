const apiGraphQLUrl = `${Cypress.env('apiUrl')}`;

Cypress.Commands.add('apiGraphQLRequest', (body, token) => {
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
