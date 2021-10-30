/// <reference types="cypress" />

describe("Dashboard", () => {
	beforeEach(() => {
		cy.login();
	});

	it("can create an app", () => {
		const random = Cypress._.random(0, 1e6);
		const appName = `test-app-${random}`;

		cy.getCy("app-create-modal").should("not.exist");

		cy.getCy("create-app").click();

		cy.getCy("app-create-modal").should("exist");

		cy.getCy("create-app-modal-slug").type(appName);
		cy.getCy("create-app-modal-submit").click();

		cy.location("pathname").should("eq", `/apps/${appName}`);

		cy.go("back");

		cy.getCy("personal-apps").contains(appName);
	});

	it("can create a team without a display name", () => {
		const random = Cypress._.random(0, 1e6);
		const teamName = `test-team-no-display-${random}`;

		cy.getCy("team-create-modal").should("not.exist");

		cy.getCy("create-team").click();

		cy.getCy("team-create-modal").should("exist");

		cy.getCy("create-team-modal-slug").type(teamName);

		cy.getCy("create-team-modal-submit").click();

		cy.location("pathname").should("eq", `/teams/${teamName}`);

		cy.go("back");

		cy.getCy("sidebar").contains(teamName);
	});

	it("can create a team with a display name", () => {
		const random = Cypress._.random(0, 1e6);
		const teamName = `test-team-${random}`;

		cy.getCy("team-create-modal").should("not.exist");

		cy.getCy("create-team").click();

		cy.getCy("team-create-modal").should("exist");

		cy.getCy("create-team-modal-slug").type(teamName);
		cy.getCy("create-team-modal-name").type("Test Team");

		cy.getCy("create-team-modal-submit").click();

		cy.location("pathname").should("eq", `/teams/${teamName}`);

		cy.go("back");

		cy.getCy("sidebar").contains("Test Team");
	});
});
