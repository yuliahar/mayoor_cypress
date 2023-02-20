const apiGraphQLUrl = `${Cypress.env('apiUrl')}`;

Cypress.Commands.add('apiGraphQLRequest', (body, token = window.localStorage.getItem('auth-token')) => {
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	if (token) headers.Authorization = `Bearer ${token}`;
	return cy.request({
		method: 'POST',
		url: apiGraphQLUrl,
		headers,
		body,
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
