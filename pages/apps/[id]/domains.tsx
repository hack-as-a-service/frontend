import AppLayout from "../../../layouts/app";
import { Domain } from "../../../components/Domain";

import { Flex } from "@chakra-ui/react";
import {
  devUser1,
  personalAppWithDomain,
  personalTeam,
} from "../../../lib/dummyData";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import useSWR from "swr";

import { fetchSSR } from "../../../lib/fetch";
import { IApp, IAppWithDomain, ITeam, IUser } from "../../../types/haas";
export default function AppDomainOverview(props: {
  user: { user: IUser };
  app: { app: IAppWithDomain };
  team: { team: ITeam };
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: user } = useSWR("/users/me", { initialData: props.user });
  const { data: app } = useSWR(`/apps/${id}`, { initialData: props.app });
  const { data: team } = useSWR(() => "/teams/" + app.app.TeamID, {
    initialData: props.team,
  });
  return (
    <AppLayout
      selected="Domains"
      user={user.user}
      app={app.app}
      team={team.team}
    >
      {app.app.Domains.map((domain) => (
        <Domain
          key={domain.hostname}
          hostname={domain.hostname}
          config={domain.config}
        />
      ))}
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // try {
  //   const [user, app] = await Promise.all(
  //     ["/users/me", `/apps/${ctx.params.id}`].map((i) => fetchSSR(i, ctx))
  //   );

  //   const team = await fetchSSR(`/teams/${app.app.TeamID}`, ctx);

  //   return {
  //     props: {
  //       user,
  //       app,
  //       team,
  //     },
  //   };
  // } catch (e) {
  //   if (e.url == "/users/me") {
  //     return {
  //       redirect: {
  //         destination: "/login",
  //         permanent: false,
  //       },
  //     };
  //   } else {
  //     return {
  //       notFound: true,
  //     };
  //   }
  // }

  return {
    props: {
      user: { user: devUser1 },
      app: { app: personalAppWithDomain },
      team: { team: personalTeam },
    },
  };
};
