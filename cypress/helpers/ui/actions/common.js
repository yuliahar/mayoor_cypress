// COMMON
export const findIn = (parent, selector) => {
	return cy.wrap(parent).find(selector);
};

export const clickElement = (selector, text) => {
	if (text) {
		cy.contains(selector, text).click();
	} else {
		cy.get(selector).click();
	}
};
