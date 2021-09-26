import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchSSR } from "../../../lib/fetch";

import { GetServerSideProps } from "next";
import { IApp, ITeam, IUser } from "../../../types/haas";
import TeamLayout from "../../../layouts/team";
import React from "react";

import {
  Avatar,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  Heading,
} from "@chakra-ui/react";
import Head from "next/head";

export default function TeamPage(props: {
  user: IUser;
  users: IUser[];
  team: ITeam;
  apps: IApp[];
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: team } = useSWR(`/teams/${id}`, {
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
      selected="Users"
    >
      <Head>
        <title>{team.name || team.slug} - Users</title>
      </Head>

      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
        </Thead>

        <Tbody>
          {users.map((u) => (
            <Tr key={u.id}>
              <Td>
                <Flex align="center">
                  <Avatar src={u.avatar} mr={4} />
                  <Text fontSize="20px" fontWeight="bold">
                    <Heading fontSize="xl" display="inline-block">
                      {u.name}
                    </Heading>{" "}
                    {u.id == user.id && <Badge>You</Badge>}
                  </Text>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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
