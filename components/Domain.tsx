import {
  useColorModeValue,
  Flex,
  Button,
  Text,
  Heading,
  Img,
} from "@chakra-ui/react";
import Icon from "@hackclub/icons";
import { IDomain } from "../types/haas";

export function Domain({ hostname, config }: IDomain) {
  console.log(hostname, config);
  const border = useColorModeValue("#00000033", "#ffffff33");
  const secondary = useColorModeValue("gray.500", "gray.600");
  return (

      <Flex
        margin="2em"
        borderRadius="xl"
        borderColor={border}
        borderWidth="thin"
        padding="2"
        alignItems="center"
        flexDirection="column"
      >
        <Flex width="100%" justifyContent="space-between">
          <Flex flexDirection="column">
            <Heading>{hostname}</Heading>
            <Config status={config} />
          </Flex>
          <Button px="1.75em" type="button">
            Delete
          </Button>
        </Flex>
       {!config && <Flex width="100%">
         <Text>DNS Configuration</Text>
         <Text>Set the following record on your DNS provider to continue:</Text>
       </Flex>}
      </Flex>

  );
}

function Config(props: { status: boolean }) {
  const { status } = props;
  console.log("status", status);
  return (
    <Flex alignItems="center">
      <Icon glyph={status ? "checkmark" : "forbidden"} />
      <Text my="unset">{status ? "Valid" : "Invalid"} Configuration</Text>
    </Flex>
  );
}
