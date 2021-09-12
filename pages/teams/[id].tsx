import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchSSR } from "../../lib/fetch";
import { Box, Grid } from "@chakra-ui/react";

import { GetServerSideProps } from "next";
import { IApp, ITeam, IUser } from "../../types/haas";
import TeamLayout from "../../layouts/team";
import React from "react";
import App from "../../components/App";

export default function TeamPage(props: {
  user: IUser;
  users: IUser[];
  team: ITeam;
  apps: IApp[];
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: team, mutate: mutateTeam } = useSWR(`/teams/${id}`, {
    initialData: props.team,
  });
  const { data: user } = useSWR("/users/me", { initialData: props.user });
  const { data: users } = useSWR(`/teams/${id}/users`, {
    initialData: props.users,
  });
  const { data: apps } = useSWR(`/teams/${id}/apps`, {
    initialData: props.apps,
  });

  return (
    <TeamLayout
      user={user}
      team={team}
      users={users}
      apps={apps}
      selected="Apps"
    >
      {apps.length > 0 ? (
        <Grid
          gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
          gap={2}
          flex="1 0 auto"
        >
          {apps.map((app: IApp) => {
            return (
              <App
                key={app.id}
                name={app.slug}
                url={`/apps/${app.slug}`}
                enabled={app.enabled}
              />
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ flex: 1 }}>This team doesn't have any apps yet 😢</Box>
      )}
    </TeamLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const [user, team, users, apps] = await Promise.all(
      [
        "/users/me",
        `/teams/${ctx.params.id}`,
        `/teams/${ctx.params.id}/users`,
        `/teams/${ctx.params.id}/apps`,
      ].map((i) => fetchSSR(i, ctx))
    );

    return {
      props: {
        user,
        users,
        team,
        apps,
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
