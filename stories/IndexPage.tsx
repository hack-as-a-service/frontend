import { Flex, Heading, Text } from "@chakra-ui/react";

export function IndexPage() {
  return (
    <Flex
      as="main"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading variant="heading" id="heading" fontSize="8rem" lineHeight="1.15">
        Coming Soon
      </Heading>
      <Text id="subtitle" my={1}>
        Hack as a Service | A <a href="https://hackclub.com">Hack Club</a>{" "}
        project
      </Text>
    </Flex>
  );
}
