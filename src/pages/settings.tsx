import useSWR from "swr";
import {
	Heading,
	IconButton,
	useDisclosure,
	Button,
	Text,
	Box,
	Grid,
} from "@chakra-ui/react";

import DashboardLayout, {
	ISidebarItem,
	ISidebarSection,
} from "../layouts/dashboard";
import { GetServerSideProps } from "next";
import fetchApi, { fetchSSR } from "../lib/fetch";
import { IApp, ITeam, IUser } from "../types/haas";
import Head from "next/head";
import Icon from "@hackclub/icons";
import TeamCreateModal from "../components/TeamCreateModal";
import { ConfirmDelete } from "../components/ConfirmDelete";
import { useRouter } from "next/router";
import React from "react";

export default function Settings(props: {
	user: IUser;
	teams: ITeam[];
	personalApps: IApp[];
}) {
	const { data: teams, mutate: mutateTeams } = useSWR("/users/me/teams", {
		fallbackData: props.teams,
	});
	const { data: user } = useSWR("/users/me", { fallbackData: props.user });

	const router = useRouter();
	const {
		isOpen: confirmIsOpen,
		onOpen: confirmOnOpen,
		onClose: confirmOnClose,
	} = useDisclosure();

	const teamModal = useDisclosure();

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
					selected: false,
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
					selected: true,
				},
			],
		},
		{
			title: "Teams",
			actionButton: (
				<IconButton
					aria-label="Create a team"
					icon={<Icon glyph="plus" />}
					onClick={teamModal.onOpen}
					data-cy="create-team"
				/>
			),
			items:
				teamList.length > 0
					? teamList
					: [{ text: "You're not a part of any teams." }],
		},
		,
	];

	return (
		<>
			<Head>
				<title>Personal Apps</title>
			</Head>

			<DashboardLayout
				title={user.name}
				sidebarSections={sidebarSections}
				user={user}
			>
				<Heading>Settings</Heading>
				<Grid gap="10" my="5">
					<Box flexDirection="column">
						<Heading as="h3" fontSize="2xl">
							Delete
						</Heading>
						<Text my="1">
							Warning: This will:
							<Box mx="10">
								<ul>
									<li>remove you from all your teams</li>
									<li>delete any teams where you are the only user</li>
									<li>
										<strong>
											shut down and delete all apps associated with those teams
										</strong>
										, including addons, domains, and other data that may be
										stored
									</li>
								</ul>
							</Box>
							You will be asked to confirm this action in order to proceed.
						</Text>
						<Button colorScheme="red" onClick={() => confirmOnOpen()}>
							Delete
						</Button>
					</Box>
					<Box flexDirection="column">
						<Heading as="h3" fontSize="2xl">
							Export
						</Heading>
						<Text my="1">
							Download all your user data as JSON. This may take a while to
							aggregate - we&apos;ll send you a Slack DM when your download is
							ready.
						</Text>
						<Button>Export</Button>
					</Box>
				</Grid>
			</DashboardLayout>
			<ConfirmDelete
				name={user.name}
				onConfirmation={() => console.log("nice")}
				isOpen={confirmIsOpen}
				onClose={confirmOnClose}
				onOpen={confirmOnOpen}
				verb="delete"
				onCancellation={confirmOnClose}
			/>
			<TeamCreateModal
				onClose={teamModal.onClose}
				isOpen={teamModal.isOpen}
				onSubmit={async (v, { setErrors, setSubmitting }) => {
					try {
						const team: ITeam = await fetchApi("/teams", {
							headers: {
								"Content-Type": "application/json",
							},
							method: "POST",
							body: JSON.stringify({ slug: v.slug, name: v.name }),
						});

						mutateTeams([...teams, team], false);

						teamModal.onClose();

						router.push(`/teams/${v.slug}`);
					} catch (e) {
						if (e.resp?.status === 409) {
							setErrors({
								slug: "This URL is already taken by another team.",
							});
						}
					}

					setSubmitting(false);
				}}
			/>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const [user, teams] = await Promise.all(
			["/users/me", "/users/me/teams"].map((i) => fetchSSR(i, ctx))
		);

		const personalApps: IApp[] = await fetchSSR(
			`/teams/${teams.find((t) => t.personal).id}/apps`,
			ctx
		);

		return {
			props: {
				user,
				teams,
				personalApps,
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
