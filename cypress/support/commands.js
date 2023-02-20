const apiGraphQLUrl = `${Cypress.env('apiUrl')}`;

Cypress.Commands.add('apiGraphQLRequest', (body, token = window.localStorage.getItem('auth-token')) => {
	return cy.api({
		method: 'POST',
		url: apiGraphQLUrl,
		headers: {
			Accept: 'application/json',
			Authorization: token ? `Bearer ${token}` : undefined,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
		failOnStatusCode: false,
	});
});

Cypress.Commands.add('clearAndType', { prevSubject: true }, (subject, value, ...args) => {
	return value
		? cy
				.wrap(subject)
				.clear()
				.type(value, ...args)
		: cy.wrap(subject).clear();
});
