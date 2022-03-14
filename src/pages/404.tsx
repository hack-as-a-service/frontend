import { Button } from "@chakra-ui/button";
import { Heading, Flex } from "@chakra-ui/layout";
import Icon from "@hackclub/icons";
import Link from "next/link";

export default function NotFound() {
	return (
		<Flex
			direction="column"
			alignItems="center"
			justifyContent="center"
			height="100vh"
		>
			<Heading mb={10}>Page not found.</Heading>

			<Link href="/dashboard" passHref>
				<Button leftIcon={<Icon glyph="home" size={24} />}>Go home</Button>
			</Link>
		</Flex>
	);
}
