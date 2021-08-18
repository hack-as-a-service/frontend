import AppLayout from "../../../layouts/app";
import { Domain } from "../../../components/Domain";
import { FormEvent } from "react";
import { Flex, Input, Button, useToast, Text } from "@chakra-ui/react";
import {
  devUser1,
  DNS,
  personalAppWithDomain,
  personalTeam,
} from "../../../lib/dummyData";
import { ErrorToast, SuccessToast } from "../../../components/Toast";
import { GetServerSideProps } from "next";
import { useState } from "react";
import useSWR, { mutate } from "swr";

import { fetchSSR } from "../../../lib/fetch";
import { IApp, IAppWithDomain, ITeam, IUser, IDNS } from "../../../types/haas";
export default function AppDomainOverview(props: {
  user: { user: IUser };
  app: { app: IAppWithDomain };
  team: { team: ITeam };
  dns: IDNS;
}) {
  // const { id } = router.query;
  const id = 2;
  const { dns } = props;
  const { data: user } = useSWR("/users/me", { initialData: props.user });
  const key = `/apps/${id}`;
  console.log("page key", key);
  const { data: app } = useSWR(key, {
    initialData: props.app,
    fetcher: () => props.app,
  });
  const { data: team } = useSWR(`/teams/${app.app.TeamID}`, {
    initialData: props.team,
  });

  return (
    <AppLayout
      selected="Domains"
      user={user.user}
      app={app.app}
      team={team.team}
    >
      <AddDomain app={app.app} />
      <Text w="100%" my="1">
        Need a domain? Feel free to use any subdomain of these domains:{" "}
        {dns.defaultSubdomains.join(", ")}
      </Text>
      {app.app.Domains.map((domain) => (
        <Domain
          dns={dns}
          key={domain.hostname}
          inUseByOtherApp={domain.inUseByOtherApp}
          onDelete={async () => {
            const newApp = {
              ...app.app,
              Domains: app.app.Domains.filter(
                (d) => d.hostname !== domain.hostname
              ),
            };
            const key = `/apps/${app.app.ID}`;
            console.log("del key", key);
            const m = await mutate(
              key,
              {
                app: newApp,
              },
              false
            );
            console.log("del mutation", m);
          }}
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
      dns: DNS,
    },
  };
};

function AddDomain({ app }: { app: IAppWithDomain }) {
  const [hostname, setHostname] = useState("");
  const toast = useToast();
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (app.Domains.findIndex((d) => d.hostname === hostname) !== -1) {
      toast({
        status: "error",
        duration: 5000,
        position: "top",
        render: () => (
          <ErrorToast
            text={`There's already a domain with hostname ${hostname} configured in app ${app.ShortName}.`}
          />
        ),
      });
      return;
    }
    try {
      const newApp: IAppWithDomain = {
        ...app,
        Domains: [
          ...app.Domains,
          { hostname, config: false, inUseByOtherApp: false },
        ],
      };
      console.log("newapp", newApp);
      const key = `/apps/${app.ID}`;
      console.log("add key", key);
      const m = await mutate(key, { app: newApp }, false);
      console.log("add mutate", m);
      toast({
        status: "success",
        duration: 5000,
        position: "top",
        render: () => (
          <SuccessToast
            text={`Added ${hostname} to ${app.ShortName}'s domains.`}
          />
        ),
      });
      setHostname("");
    } catch (e) {
      console.log(e);
      toast({
        status: "error",
        duration: 5000,
        position: "top",
        render: () => (
          <ErrorToast
            text={`Something went wrong adding ${hostname} to ${app.ShortName}'s domains.`}
          />
        ),
      });
    }
  }

  return (
    <Flex as="form" onSubmit={onSubmit}>
      <Input
        name="domain"
        value={hostname}
        placeholder="Add your domain..."
        required
        onChange={(evt) => setHostname(evt.target.value)}
      />
      <Button p="1.5" mx="1" variant="cta" type="submit">
        Add
      </Button>
    </Flex>
  );
}
