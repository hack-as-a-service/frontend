import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchSSR } from "../../../lib/fetch";
import {
	Heading,
	Button,
	Text,
	Box,
	Grid,
	Input,
	useColorMode,
	FormControl,
	FormErrorMessage,
	useDisclosure,
} from "@chakra-ui/react";
import { ConfirmDelete } from "../../../components/ConfirmDelete";

import { GetServerSideProps } from "next";
import { IApp, ITeam, IUser } from "../../../types/haas";
import TeamLayout from "../../../layouts/TeamLayout";
import React, { useState } from "react";
import Head from "next/head";
import { withCookies } from "../../../components/Chakra";

export default function TeamSettingsPage(props: {
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
	const {
		isOpen: manageIsOpen,
		onOpen: manageOnOpen,
		onClose: manageOnClose,
	} = useDisclosure();
	const {
		isOpen: enableIsOpen,
		onOpen: enableOnOpen,
		onClose: enableOnClose,
	} = useDisclosure();
	const {
		isOpen: confirmIsOpen,
		onOpen: confirmOnOpen,
		onClose: confirmOnClose,
	} = useDisclosure();

	const [verb, setVerb] = useState("delete");

	const { colorMode } = useColorMode();

	return (
		<TeamLayout
			user={user}
			team={team}
			users={users}
			apps={apps}
			selected="Settings"
		>
			<Head>
				<title>{team.name || team.slug} - Settings</title>
			</Head>
			<Grid gap="10" my="5">
				<Box flexDirection="column">
					<Heading as="h2" fontSize="4xl" mb="4">
						Settings
					</Heading>
					<Heading as="h3" fontSize="2xl" mb={2}>
						Name
					</Heading>

					<FormControl isRequired>
						<Input
							placeholder={team.name}
							width="md"
							name="team"
							_placeholder={{
								color: colorMode == "dark" ? "white" : "black",
							}}
						/>
						<FormErrorMessage position="absolute">
							This field is required.
						</FormErrorMessage>
					</FormControl>
					<Button colorScheme="blue" type="submit" my={2} mb={6}>
						Update
					</Button>

					<Heading as="h3" fontSize="2xl" mb={1}>
						Delete
					</Heading>
					<Text>Warning: This will:</Text>
					<Box mx="10">
						<ul>
							<li>discard your HN balance</li>
							<li>
								destroy all data from this team&apos;s apps, controls, and
								add-ons
							</li>
							<li>stop any running containers</li>
							<li>release any domains associated with this team&apos;s apps</li>
						</ul>
					</Box>
					<Text py={3}>
						You will be asked to confirm this action in order to proceed.
					</Text>
					<Button
						colorScheme="red"
						onClick={() => {
							setVerb("delete");
							manageOnClose();
							confirmOnOpen();
						}}
					>
						Delete Team
					</Button>
					<ConfirmDelete
						isOpen={confirmIsOpen}
						onClose={confirmOnClose}
						onOpen={confirmOnOpen}
						verb={verb}
						name={team.name}
						onCancellation={manageOnOpen}
						onConfirmation={() => {}}
					/>
				</Box>
			</Grid>
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
