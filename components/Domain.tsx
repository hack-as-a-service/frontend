import {
  useColorModeValue,
  Flex,
  Button,
  Text,
  Heading,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Table,
} from "@chakra-ui/react";
import Icon from "@hackclub/icons";
import { IDNS, IDomain } from "../types/haas";

interface DomainProps extends IDomain {
  dns: IDNS;
  onDelete: () => any;
}
export function Domain({
  hostname,
  config,
  dns,
  onDelete,
  inUseByOtherApp,
}: DomainProps) {
  const border = useColorModeValue("#00000033", "#ffffff33");

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
          {!inUseByOtherApp && <DNSStatus status={config} />}
        </Flex>
        <Button onClick={onDelete} px="1.75em" type="button">
          Delete
        </Button>
      </Flex>
      {inUseByOtherApp ? (
        <Text w="full" textAlign="left" my="unset">
          This domain cannot be used because it is in use by another HaaS app.
        </Text>
      ) : (
        !config && <DNSDirections hostname={hostname} dns={dns} />
      )}
    </Flex>
  );
}

function DNSStatus(props: { status: boolean }) {
  const { status } = props;
  console.log("status", status);
  return (
    <Flex alignItems="center">
      <Icon glyph={status ? "checkmark" : "forbidden"} />
      <Text my="unset">{status ? "Valid" : "Invalid"} Configuration</Text>
    </Flex>
  );
}

function DNSDirections(props: { dns: IDNS; hostname: string }) {
  const { dns, hostname } = props;
  const secondary = useColorModeValue("gray.100", "gray.600");
  const name = hostname.split(".").slice(0, -2);
  return (
    <Flex width="100%" flexDirection="column" p="1.5">
      <Text my="auto" fontWeight="bold">
        DNS Configuration
      </Text>
      <Text my="auto">
        Set the following record on your DNS provider to continue:
      </Text>
      <Flex borderRadius="md" backgroundColor={secondary}>
        <Table my="1" width="min-content">
          <Thead py="auto">
            <Tr>
              <Th py="auto">Type</Th>
              <Th py="auto">Name</Th>
              <Th py="auto">Value</Th>
            </Tr>
          </Thead>
          <Tbody py="auto">
            <Tr py="auto">
              <Td py="auto">{dns.type}</Td>
              <Td py="auto">{name.length !== 0 ? name.join(".") : "@"}</Td>
              <Td py="auto">{dns.value}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
}
