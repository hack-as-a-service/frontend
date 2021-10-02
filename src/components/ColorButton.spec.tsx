import { useColorMode, ColorMode } from "@chakra-ui/react";
import { mountChakra } from "../lib/testHelpers";
import ColorButton from "./ColorButton";

beforeEach(() => {
  // Chakra stores color mode in local storage
  cy.clearLocalStorage();
  // Workaround for cypress-react-selector, makes react selector work between component tests
  global.isReactLoaded = false;
});

it("has an aria-label", () => {
  mountChakra(<ColorButton />);
  cy.waitForReact();
  cy.react("ColorButton").should("have.attr", "aria-label");
});

it("changes color mode", () => {
  function ActualColorMode(_: { colorMode: ColorMode; }) {
    return <></>;
  }
  function GetColorMode() {
    let { colorMode } = useColorMode();
    return <ActualColorMode colorMode={colorMode} />;
  }
  mountChakra(<>
    <ColorButton />
    <GetColorMode />
  </>);
  cy.waitForReact();
  cy.getReact("ActualColorMode").getProps("colorMode").should("equal", "light");
  cy.react("ColorButton").click();
  cy.getReact("ActualColorMode").getProps("colorMode").should("equal", "dark");
  cy.react("ColorButton").click();
  cy.getReact("ActualColorMode").getProps("colorMode").should("equal", "light");
});
