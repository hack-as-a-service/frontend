/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<Element>;
    logout(): Chainable<Element>;
  }
}

Cypress.Commands.add("login", () => {
  cy.visit("/api/dev/login");

  cy.url().should("eq", "http://localhost:3000/");

  cy.getCookie("haas_token").should("exist");
});

Cypress.Commands.add("logout", () => {
  cy.visit("/api/logout");

  cy.url().should("eq", "http://localhost:3000/");

  cy.getCookie("haas_token").should("not.exist");
});