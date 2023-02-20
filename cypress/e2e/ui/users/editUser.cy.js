describe('Edit User', function () {
	it('should edit existing user by email', function () {
		// const getRowWithUserToEdit = email => cy.get(`[value="${email}"]`).parents('[class="ant-row"]');
		//
		// getRowWithUserToEdit(testUser.email).within(row => {
		// 	cy.wrap(row)
		// 		.find('[data-test-id="form-item-name"]')
		// 		.type('New Full Name' + Date.now());
		// 	cy.wrap(row).find('.ant-select-selection-search-input').click({ force: true });
		// });
		// cy.get('.ant-select-dropdown').contains('Executive').click();
		//
		// getRowWithUserToEdit(testUser.email).within(() => {
		// 	cy.contains('button', 'Save').click();
		// });
		//
		// cy.contains('.ant-message-success', 'User updated').should('be.visible');
	});
});
