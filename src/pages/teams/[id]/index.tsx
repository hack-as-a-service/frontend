import { useRouter } from "next/router";
import useSWR from "swr";
import fetchApi, { fetchSSR } from "../../../lib/fetch";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

import { GetServerSideProps } from "next";
import { IApp, ITeam, IUser } from "../../../types/haas";
import TeamLayout from "../../../layouts/team";
import React from "react";
import App from "../../../components/App";
import Head from "next/head";
import Icon from "@hackclub/icons";
import AppCreateModal from "../../../components/AppCreateModal";

export default function TeamPage(props: {
  user: IUser;
  users: IUser[];
  team: ITeam;
  apps: IApp[];
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: team } = useSWR(`/teams/${id}`, {
    fallbackData: props.team,
  });
  const { data: user } = useSWR("/users/me", { fallbackData: props.user });
  const { data: users } = useSWR(`/teams/${id}/users`, {
    fallbackData: props.users,
  });
  const { data: apps, mutate: mutateApps } = useSWR(`/teams/${id}/apps`, {
    fallbackData: props.apps,
  });

  const appModal = useDisclosure();

  return (
    <TeamLayout
      user={user}
      team={team}
      users={users}
      apps={apps}
      selected="Apps"
      actionButton={
        <Tooltip label="Create an app" placement="bottom">
          <IconButton
            aria-label="Create an app"
            icon={<Icon glyph="plus" />}
            onClick={() => appModal.onOpen()}
          />
        </Tooltip>
      }
    >
      <Head>
        <title>{team.name || team.slug} - Apps</title>
      </Head>

      <AppCreateModal
        onClose={appModal.onClose}
        isOpen={appModal.isOpen}
        onSubmit={async (v, { setSubmitting, setErrors }) => {
          try {
            const app: IApp = await fetchApi(`/teams/${team.slug}/apps`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ slug: v.slug }),
            });

            mutateApps([...apps, app], false);

            appModal.onClose();

            router.push(`/apps/${v.slug}`);
          } catch (e) {
            if (e.resp?.status === 409) {
              setErrors({
                slug: "This name is already taken by another app.",
              });
            }
          }

          setSubmitting(false);
        }}
      />

      {apps.length > 0 ? (
        <Grid
          gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
          gap={8}
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
        <Box sx={{ flex: 1 }}>This team doesn&apos;t have any apps yet 😢</Box>
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
