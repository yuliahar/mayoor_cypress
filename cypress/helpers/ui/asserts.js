export const verifyMessageDisplayed = (selector, message) => {
	cy.get(selector).should('be.visible').and('have.text', message);
};

export const verifyElementVisible = (selector, text) => {
	if (text) {
		cy.contains('header span', text).should('be.visible');
	} else {
		cy.get(selector).should('be.visible');
	}
};
