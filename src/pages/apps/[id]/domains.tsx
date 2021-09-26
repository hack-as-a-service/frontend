import { Button, Flex, Input, useColorMode } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Domain from "../../../components/Domain";
import AppLayout from "../../../layouts/app";
import { fetchSSR } from "../../../lib/fetch";
import { IApp, IDomain, ITeam, IUser } from "../../../types/haas";

export default function AppDashboardPage(props: {
  user: IUser;
  app: IApp;
  team: ITeam;
  domains: IDomain[];
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: user } = useSWR("/users/me", { initialData: props.user });
  const { data: app } = useSWR(`/apps/${id}`, { initialData: props.app });
  const { data: team } = useSWR(`/teams/${app.team_id}`, {
    initialData: props.team,
  });
  const { data: domains } = useSWR(`/apps/${id}/domains`, {
    initialData: props.domains,
  });

  const { colorMode } = useColorMode();

  return (
    <AppLayout selected="Domains" user={user} app={app} team={team}>
      <Head>
        <title>{app.slug} - Domains</title>
      </Head>

      <Flex /* maxWidth={500} */ mb={10} alignItems="center">
        <Input
          placeholder="mywebsite.com"
          size="lg"
          _placeholder={{ color: colorMode == "dark" ? "white" : "black" }}
        />

        <Button variant="cta" ml={3} flexShrink={0}>
          Add Domain
        </Button>
      </Flex>

      {domains.map((d) => {
        return <Domain key={d.id} {...d} />;
      })}
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const [user, app, domains] = await Promise.all(
      [
        "/users/me",
        `/apps/${ctx.params.id}`,
        `/apps/${ctx.params.id}/domains`,
      ].map((i) => fetchSSR(i, ctx))
    );
    const team = await fetchSSR(`/teams/${app.team_id}`, ctx);

    return {
      props: {
        user,
        app,
        team,
        domains,
      },
    };
  } catch (e) {
    if (e.url == "/users/me") {
      return {
        redirect: {
          destination: "/api/login",
          permanent: false,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }
};
