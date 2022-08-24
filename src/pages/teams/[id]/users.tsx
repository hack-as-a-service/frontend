import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchSSR } from "../../../lib/fetch";

import { GetServerSideProps } from "next";
import { IApp, ITeam, IUser } from "../../../types/haas";
import TeamLayout from "../../../layouts/TeamLayout";
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
  Tooltip,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { withCookies } from "../../../components/Chakra";
import Icon from "@hackclub/icons";
import TeamInviteModal from "../../../components/TeamInviteModal";

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
	const { data: apps } = useSWR(`/teams/${id}/apps`, {
		fallbackData: props.apps,
	});

  const inviteModal = useDisclosure();

	return (
		<TeamLayout
			user={user}
			team={team}
			users={users}
			apps={apps}
			selected="Users"
      actionButton={
				<Tooltip label="Invite a teammate" placement="bottom">
					<IconButton
						aria-label="Invite a teammate"
						icon={<Icon glyph="plus" />}
						onClick={() => inviteModal.onOpen()}
					/>
				</Tooltip>
			}
		>
			<Head>
				<title>{team.name || team.slug} - Users</title>
			</Head>

      <TeamInviteModal
        isOpen={inviteModal.isOpen}
        onClose={inviteModal.onClose}
        onSubmit={() => console.log("hello")}
      />

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

export const getServerSideProps: GetServerSideProps = withCookies(
	async (ctx) => {
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
	}
);
