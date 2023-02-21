export const verifyElementVisible = (selector, text) => {
	if (text) {
		cy.get(selector).should('be.visible').and('contain', text);
	} else {
		cy.get(selector).should('be.visible');
	}
};

export const verifyElementDisabled = selector => {
	cy.get(selector).should('be.disabled');
};
