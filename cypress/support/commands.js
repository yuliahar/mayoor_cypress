const apiGraphQLUrl = `${Cypress.env('apiUrl')}`;

Cypress.Commands.add('apiGraphQLRequest', body => {
	const authToken = window.localStorage.getItem('auth-token');

	return cy.api({
		method: 'POST',
		url: apiGraphQLUrl,
		body,
		headers: {
			Authorization: authToken ? `Bearer ${authToken}` : undefined,
			'Content-Type': 'application/json',
		},
		failOnStatusCode: false,
	});
});
