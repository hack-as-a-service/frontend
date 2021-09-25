import {
  Flex,
  Heading,
  useColorMode,
  Box,
  Tooltip,
  Spinner,
  Badge,
  Button,
  ButtonGroup,
  Text,
  Table,
  Tr,
  Td,
  Th,
  useClipboard,
} from "@chakra-ui/react";
import Icon from "@hackclub/icons";
import React from "react";

function DNSRecordTable({ domain }: { domain: string }) {
  const { colorMode } = useColorMode();

  const split = domain.split(".");

  const { hasCopied, onCopy } = useClipboard(
    split.length == 2 ? "167.99.113.134" : "hackclub.app."
  );

  return (
    <Table
      mt={5}
      maxWidth="600px"
      bg={colorMode == "dark" ? "gray.900" : "white"}
      borderRadius="lg"
    >
      <Tr>
        <Th>Type</Th>
        <Th>Name</Th>
        <Th>Value</Th>
      </Tr>
      <Tr>
        <Td fontFamily="mono">{split.length == 2 ? "A" : "CNAME"}</Td>
        <Td fontFamily="mono">
          {split.length == 2 ? "@" : split.slice(0, -2).join(".")}
        </Td>
        <Td fontFamily="mono">
          {split.length == 2 ? "167.99.113.134" : "hackclub.app."}{" "}
          <Button size="sm" onClick={onCopy} ml={3}>
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </Td>
      </Tr>
    </Table>
  );
}

export default function Domain({
  domain,
  verified,
  loading = false,
  defaultDomain = false,
}: {
  domain: string;
  verified: boolean;
  loading?: boolean;
  defaultDomain?: boolean;
}) {
  const { colorMode } = useColorMode();

  return (
    <Flex
      flexDir="column"
      borderRadius="10px"
      bg={colorMode == "dark" ? "gray.700" : "gray.200"}
      transition="all 200ms"
      p="30px"
      my={5}
    >
      <Flex alignItems="center" justifyContent="flex-start">
        {loading ? (
          <Box mr={5}>
            <Spinner color="orange.300" thickness="3px" />
          </Box>
        ) : verified ? (
          <Tooltip label="This domain has been verified.">
            <Box mr={5} color="green.400">
              <Icon glyph="checkmark" />
            </Box>
          </Tooltip>
        ) : (
          <Box mr={5} color="red.400">
            <Icon glyph="important" />
          </Box>
        )}

        {verified ? (
          <a
            href={`https://${domain}`}
            target="_blank"
            rel="noreferrer"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Heading
              as="h2"
              fontWeight="normal"
              fontSize={20}
              fontFamily="mono"
            >
              {domain}
            </Heading>
            {defaultDomain && (
              <Badge colorScheme="orange" ml={2}>
                Default
              </Badge>
            )}
            <Box ml={2} display="inline-block" color="gray.500">
              <Icon glyph="external" />
            </Box>
          </a>
        ) : (
          <Heading as="h2" fontWeight="normal" fontSize={20} fontFamily="mono">
            {domain}
          </Heading>
        )}

        {loading && (
          <Box color={colorMode == "dark" ? "gray.400" : "gray.500"} ml={2}>
            Verifying configuration...
          </Box>
        )}

        <ButtonGroup ml="auto">
          {!verified && (
            <Button variant="cta" isDisabled={loading}>
              Activate
            </Button>
          )}
          <Button>Delete</Button>
        </ButtonGroup>
      </Flex>

      {!loading && !verified && (
        <>
          <Heading color="red.400" size="lg" mt={3}>
            Error activating domain.
          </Heading>

          <Text>
            Please add the following record to your domain&apos;s DNS
            configuration.
          </Text>

          <DNSRecordTable domain={domain} />
        </>
      )}
    </Flex>
  );
}
