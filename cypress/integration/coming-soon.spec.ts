/// <reference types="cypress" />

describe("Coming Soon page", () => {
	it("redirects to dashboard", () => {
		cy.login();

		cy.visit("/");
		cy.url().should("eq", "http://localhost:3000/dashboard");
	});

	it("tells the user how to log in", () => {
		cy.logout();

		cy.get("p").contains("Log in");
	});
});
