/// <reference types="cypress" />

describe("Coming Soon page", () => {
  it('says "Coming Soon"', () => {
    cy.visit("/");

    cy.get("h1").contains("Coming Soon");
  });
});
