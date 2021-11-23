/// <reference types="cypress" />
import "cypress-react-selector";

declare global {
	namespace Cypress {
		interface Chainable {
			login(): void;
			logout(): void;
			getCy(id: string): Chainable;
		}
	}
}

Cypress.Commands.add("login", () => {
	cy.visit("/api/dev/login");

	cy.url().should("eq", "http://localhost:3000/dashboard");

	cy.getCookie("haas_token").should("exist");
});

Cypress.Commands.add("logout", () => {
	cy.visit("/api/logout");

	cy.url().should("eq", "http://localhost:3000/");

	cy.getCookie("haas_token").should("not.exist");
});

Cypress.Commands.add("getCy", (id: string) => {
	return cy.get(`[data-cy="${id}"]`);
});
