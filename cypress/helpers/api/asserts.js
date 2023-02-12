import objectContains from '../../utils/objectContains';

export const verifyUserResponse = (response, user) => {
	expect(response.id).to.be.not.null;
	expect(objectContains(response, Cypress._.omit(user, ['password']))).to.be.true;
	expect(response.canBeEdited).to.eq(true);
};
