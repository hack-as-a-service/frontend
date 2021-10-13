import { mount } from "@cypress/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

export function mountChakra(node: React.ReactNode) {
	mount(<ChakraProvider theme={theme}>{node}</ChakraProvider>);
}
