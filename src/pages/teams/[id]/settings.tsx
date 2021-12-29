import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchSSR } from "../../../lib/fetch";

import { GetServerSideProps } from "next";
import { IApp, ITeam, IUser } from "../../../types/haas";
import TeamLayout from "../../../layouts/TeamLayout";
import React from "react";
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
			hi
		</TeamLayout>
	);
}

export const getServerSideProps: GetServerSideProps = withCookies(async (ctx) => {
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
});
