import { Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";

function Error({ statusCode }) {
  return (
    <>
      <Head>
        <title>Error {statusCode} | Hack as a Service</title>
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
          Error {statusCode}
        </Heading>
        <Text my={1}>
          Would you like to go <Link href="/">back home</Link>?
        </Text>
      </Flex>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
