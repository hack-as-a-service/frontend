import { Flex, Heading, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { fetchSSR } from "../lib/fetch";
import { IUser } from "../types/haas";

export default function Home(props: { user?: IUser }) {
  const { data: user, error } = useSWR("/users/me", {
    initialData: props.user,
  });

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
          {error || !user ? (
            <>
              Got early access? <Link href="/dashboard">Log in.</Link>
            </>
          ) : (
            <>
              👋 Well hi there, <b>{user.name}</b>!{" "}
              <Link href="/dashboard">Continue to the dashboard.</Link>
            </>
          )}
        </Text>
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const user = await fetchSSR("/users/me", ctx);

    return {
      props: {
        user,
      },
    };
  } catch (e) {
    return {
      props: {
        user: null,
      },
    };
  }
};
