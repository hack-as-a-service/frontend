import { mountChakra } from "../lib/testHelpers";
import { ConfirmDelete } from "./ConfirmDelete";

// eslint-disable-next-line @typescript-eslint/no-empty-function
function empty() {}

beforeEach(() => {
  global.isReactLoaded = false;
});

const name = "test";
const buttonText = "button_text";
const fns = {
  confirm: empty,
  cancel: empty,
  close: empty,
};

it("has an input", () => {
  mountChakra(
    <ConfirmDelete
      name={name}
      onConfirmation={empty}
      onCancellation={empty}
      isOpen={true}
      onOpen={empty}
      onClose={empty}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete").get("input").should("exist");
});

it("shows the button text", () => {
  mountChakra(
    <ConfirmDelete
      name={name}
      buttonText={buttonText}
      onConfirmation={fns.confirm}
      onCancellation={empty}
      isOpen={true}
      onOpen={empty}
      onClose={empty}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete").get("button").contains(buttonText).should("exist");
});

it("shows the app name", () => {
  mountChakra(
    <ConfirmDelete
      name={name}
      onConfirmation={fns.confirm}
      onCancellation={empty}
      isOpen={true}
      onOpen={empty}
      onClose={empty}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete").get("*").contains(name).should("exist");
});

it("disables the button when the input does not contain the app name", () => {
  mountChakra(
    <ConfirmDelete
      name={name}
      buttonText={buttonText}
      onConfirmation={fns.confirm}
      onCancellation={empty}
      isOpen={true}
      onOpen={empty}
      onClose={empty}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete")
    .get("button")
    .contains(buttonText)
    .should("be.disabled");
});

it("enables the button when the input contains the app name", () => {
  mountChakra(
    <ConfirmDelete
      name={name}
      buttonText={buttonText}
      onConfirmation={fns.confirm}
      onCancellation={empty}
      isOpen={true}
      onOpen={empty}
      onClose={empty}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete").get("input").type(name);
  cy.react("ConfirmDelete")
    .get("button")
    .contains(buttonText)
    .should("not.be.disabled");
});

it("calls the confirmation callback", () => {
  cy.spy(fns, "confirm");

  mountChakra(
    <ConfirmDelete
      name={name}
      buttonText={buttonText}
      onConfirmation={fns.confirm}
      onCancellation={empty}
      isOpen={true}
      onOpen={empty}
      onClose={empty}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete").get("input").type(name);
  cy.react("ConfirmDelete")
    .get("button")
    .contains(buttonText)
    .click()
    .then(() => expect(fns.confirm).to.be.calledOnce);
});

it("calls the cancellation callback", () => {
  cy.spy(fns, "cancel");

  mountChakra(
    <ConfirmDelete
      name={name}
      onConfirmation={empty}
      onCancellation={fns.cancel}
      isOpen={true}
      onOpen={empty}
      onClose={empty}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete").get("button").contains("Cancel").click();
  cy.then(() => expect(fns.cancel).to.be.calledOnce);
});

it("calls the close callback", () => {
  cy.spy(fns, "close");

  mountChakra(
    <ConfirmDelete
      name={name}
      buttonText={buttonText}
      onConfirmation={empty}
      onCancellation={empty}
      isOpen={true}
      onOpen={empty}
      onClose={fns.close}
    />
  );
  cy.waitForReact();
  cy.react("ConfirmDelete").get("input").type(name);
  cy.react("ConfirmDelete").get("button").contains(buttonText).click();
  cy.react("ConfirmDelete").get("button").contains("Cancel").click();
  cy.react("ConfirmDelete").get("[aria-label=Close]").click();
  cy.then(() => expect(fns.close).to.be.calledThrice);
});
