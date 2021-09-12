import {
  LinkBox,
  Flex,
  Heading,
  Text,
  useColorMode,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export default function App({
  name,
  url,
  enabled,
}: {
  name: string;
  url: string;
  enabled: boolean;
}) {
  const { colorMode } = useColorMode();

  return (
    <Link href={url} passHref>
      <LinkBox>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          borderRadius="10px"
          cursor="pointer"
          bg={colorMode == "dark" ? "slate" : "sunken"}
          p="30px"
          height="100%"
        >
          <Heading as="h2" sx={{ fontWeight: "normal" }}>
            {name}
          </Heading>

          <Box
            flexShrink={0}
            borderRadius="50%"
            h={3}
            w={3}
            bg={enabled ? "green" : "red"}
          />
        </Flex>
      </LinkBox>
    </Link>
  );
}
