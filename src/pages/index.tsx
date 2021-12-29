import { Flex, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { fetchSSR } from "../lib/fetch";
import { withCookies } from "../components/Chakra";
export default function Home() {
	return (
		<>
			<Head>
				<title>Hack as a Service</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Flex
				as="main"
				height="100vh"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
			>
				<Heading as="h1" fontSize="8rem" lineHeight="1.15">
					Coming Soon
				</Heading>
				<Text my={1}>
					Got early access?{" "}
					<Link href="/dashboard" passHref>
						<ChakraLink color="blue.300">Log in.</ChakraLink>
					</Link>
				</Text>
			</Flex>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = withCookies(async (ctx) => {
	try {
		await fetchSSR("/users/me", ctx);

		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	} catch (e) {
		return {
			props: {
				user: null,
			},
		};
	}
});
