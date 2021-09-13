import useSWR from "swr";
import {
  Heading,
  IconButton,
  useDisclosure,
  useToast,
  Grid,
} from "@chakra-ui/react";
import App from "../components/App";
import DashboardLayout, {
  ISidebarItem,
  ISidebarSection,
} from "../layouts/dashboard";
import { GetServerSideProps } from "next";
import { fetchSSR } from "../lib/fetch";
import { IApp, ITeam, IUser } from "../types/haas";
import Head from "next/head";
import Icon from "@hackclub/icons";
import AppCreateModal from "../components/AppCreateModal";
import { useRouter } from "next/router";

export default function Dashboard(props: { user: IUser; teams: ITeam[] }) {
  const { data: teams } = useSWR("/users/me/teams", {
    initialData: props.teams,
  });
  const { data: user } = useSWR("/users/me", { initialData: props.user });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const teamList = teams
    .filter((t) => !t.personal)
    .map(
      (i: ITeam): ISidebarItem => ({
        icon: "person",
        image: i.avatar || undefined,
        text: i.name || i.slug,
        url: `/teams/${i.slug}`,
      })
    );

  const sidebarSections: ISidebarSection[] = [
    {
      title: "Personal",
      items: [
        {
          text: "Apps",
          icon: "code",
          url: "/dashboard",
          selected: true,
        },
        {
          text: "Billing",
          icon: "bank-account",
          url: "/billing",
          selected: false,
        },
        {
          text: "Settings",
          icon: "settings",
          url: "/settings",
          selected: false,
        },
      ],
    },
    {
      title: "Teams",
      items:
        teamList.length > 0
          ? teamList
          : [{ text: "You're not a part of any teams." }],
    },
    ,
  ];

  const toast = useToast();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Hack as a Service</title>
      </Head>
      <DashboardLayout
        title="Personal Apps"
        sidebarSections={sidebarSections}
        user={user}
        actionButton={
          <IconButton aria-label="Create an app" onClick={onOpen}>
            <Icon glyph="plus" />
          </IconButton>
        }
      >
        <AppCreateModal
          onClose={onClose}
          isOpen={isOpen}
          onSubmit={async (e, { setSubmitting }) => {
            // try {
            //   const resp = await fetchApi("/apps/", {
            //     method: "POST",
            //     body: JSON.stringify({
            //       Name: e.name || e.id,
            //       ShortName: e.id,
            //       TeamID: personalTeam.team.ID,
            //     }),
            //   });
            //   onClose();
            //   router.push(`/apps/${resp.app.ID}/deploy`);
            //   await mutatePersonalTeam();
            // } catch (e) {
            //   toast({
            //     status: "error",
            //     duration: 5000,
            //     position: "top",
            //     render: () => (
            //       <ErrorToast text="Your app couldn't be created. The ID may already be taken." />
            //     ),
            //   });
            // }
          }}
        />
        {false ? (
          <Grid
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
            gap={2}
            flex="1 0 auto"
            mt={2}
          >
            {[].map((app: IApp) => {
              return (
                <App
                  url={`/apps/${app.id}`}
                  name={app.slug}
                  key={app.id}
                  enabled={app.enabled}
                />
              );
            })}
          </Grid>
        ) : (
          <Heading as="h3" size="sm" fontWeight="normal" mt={1}>
            You don&apos;t have any personal apps quite yet. 😢
          </Heading>
        )}
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const [user, teams] = await Promise.all(
      ["/users/me", "/users/me/teams"].map((i) => fetchSSR(i, ctx))
    );

    return {
      props: {
        user,
        teams,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/api/login",
        permanent: false,
      },
    };
  }
};
