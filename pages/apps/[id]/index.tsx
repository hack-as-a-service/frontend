import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import AppLayout from "../../../layouts/app";
import { fetchSSR } from "../../../lib/fetch";
import { IApp, ITeam, IUser } from "../../../types/haas";

export default function AppDashboardPage(props: {
  user: IUser;
  app: IApp;
  team: ITeam;
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: user } = useSWR("/users/me", { initialData: props.user });
  const { data: app } = useSWR(`/apps/${id}`, { initialData: props.app });
  const { data: team } = useSWR(`/teams/${app.team_id}`, {
    initialData: props.team,
  });

  return (
    <AppLayout selected="Dashboard" user={user} app={app} team={team}>
      <Head>
        <title>{app.slug} - Dashboard</title>
      </Head>
      App dashboard
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const [user, app] = await Promise.all(
      ["/users/me", `/apps/${ctx.params.id}`].map((i) => fetchSSR(i, ctx))
    );
    const team = await fetchSSR(`/teams/${app.team_id}`, ctx);

    return {
      props: {
        user,
        app,
        team,
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
