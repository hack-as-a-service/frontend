import useSWR from "swr";
import { Heading, Button, Text, Box, Grid } from "@chakra-ui/react";

import { GetServerSideProps } from "next";
import { fetchSSR } from "../lib/fetch";
import { IApp, ITeam, IUser } from "../types/haas";
import Head from "next/head";
import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { withCookies } from "../components/Chakra";

export default function Settings(props: {
	user: IUser;
	teams: ITeam[];
	personalApps: IApp[];
}) {
	const { data: teams } = useSWR("/users/me/teams", {
		fallbackData: props.teams,
	});
	const { data: user } = useSWR("/users/me", { fallbackData: props.user });
	const { data: personalApps } = useSWR(
		`/teams/${teams.find((t) => t.personal).id}/apps`,
		{ fallbackData: props.personalApps }
	);

	return (
		<>
			<Head>
				<title>Settings</title>
			</Head>

			<DashboardLayout
				user={user}
				teams={teams}
				selected="Settings"
				personalApps={personalApps}
			>
				<Grid gap="10" my="5">
					<Box flexDirection="column">
						<Heading as="h3" fontSize="2xl">
							Delete
						</Heading>
						<Text>Warning: This will:</Text>
						<Box mx="10">
							<ul>
								<li>remove you from all your teams</li>
								<li>delete any teams where you are the only user</li>
								<li>
									<strong>
										shut down and delete all apps associated with those teams,
									</strong>
									including addons, domains, and other data that may be stored
								</li>
							</ul>
						</Box>
						<Text>
							You will be asked to confirm this action in order to proceed.
						</Text>
						<Button my={2} colorScheme="red">
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
						<Button my={2}>Export</Button>
					</Box>
				</Grid>
			</DashboardLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = withCookies(
	async (ctx) => {
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
	}
);
