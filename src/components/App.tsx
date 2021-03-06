import { LinkBox, Flex, Heading, useColorMode, Box } from "@chakra-ui/react";
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
					justifyContent="flex-start"
					borderRadius="10px"
					cursor="pointer"
					bg={colorMode == "dark" ? "gray.700" : "gray.200"}
					p="30px"
					height="100%"
				>
					<Box
						flexShrink={0}
						borderRadius="50%"
						h={3}
						w={3}
						bg={enabled ? "green.300" : "red.300"}
						mr={5}
					/>

					<Heading as="h2" fontWeight="normal" fontSize={23} fontFamily="mono">
						{name}
					</Heading>
				</Flex>
			</LinkBox>
		</Link>
	);
}
