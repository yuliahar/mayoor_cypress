export default function objectContains(container, contained) {
	// Lodash:
	return Cypress._.isEqual(Cypress._.pick(container, Cypress._.keys(contained)), contained);

	// native ES5 (shallow comparison):
	// return Object.keys(contained).every(function(key) {
	// 	return contained[key] === container[key];
	// });
}
