export const login = ({ email, password }) => {
	cy.session([email, password], () => {
		cy.visit('/');

		cy.get('[data-test-id="login-username"]').type(email);
		cy.get('[data-test-id="login-password"]').type(password);
		cy.get('[data-test-id="login-submit-button"]').click();

		cy.contains('John Doe').should('be.visible');
	});
};
