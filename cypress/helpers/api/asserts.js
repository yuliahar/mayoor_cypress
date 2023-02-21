export default function objectContains(container, contained) {
	// Lodash:
	return Cypress._.isEqual(Cypress._.pick(container, Cypress._.keys(contained)), contained);

	// native ES5 (shallow comparison):
	// return Object.keys(contained).every(function(key) {
	// 	return contained[key] === container[key];
	// });
}

export const verifyUserResponse = (response, user) => {
	expect(response.id, 'Expected response to have not null id').to.be.not.null;
	expect(objectContains(response, Cypress._.omit(user, ['password'])), 'Expected response contains user data').to.be
		.true;
	expect(response.canBeEdited, 'Expected response to be editable').to.eq(true);
};
