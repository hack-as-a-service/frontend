/// <reference types="cypress" />

describe("Coming Soon page", () => {
	it("shows the logged in user", () => {
		cy.login();

		cy.get("p").contains("Test user");
	});

	it("tells the user how to log in", () => {
		cy.logout();

		cy.get("p").contains("Log in");
	});
});
