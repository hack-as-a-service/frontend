import AppLayout from "../../../layouts/app";

import { Stat } from "../../../components/Stat";
import { Addon } from "../../../components/Addon";

import { Flex } from "@chakra-ui/react";
import { devAddons } from "../../../lib/dummyData";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import useSWR from "swr";

import { fetchSSR } from "../../../lib/fetch";
import { IApp, ITeam, IUser } from "../../../types/haas";
export default function AppAddonOverview(props: {
	user: IUser;
	app: IApp;
	team: ITeam;
}) {
	const router = useRouter();
	const { id } = router.query;

	const { data: user } = useSWR("/users/me", { fallbackData: props.user });
	const { data: app } = useSWR(`/apps/${id}`, { fallbackData: props.app });
	const { data: team } = useSWR(() => "/teams/" + app.team_id, {
		fallbackData: props.team,
	});
	return (
		<AppLayout selected="Addons" user={user} app={app} team={team}>
			<Flex>
				<Stat
					style={{ marginRight: "100px" }}
					label="Active Addons"
					description="1"
				/>
				<Stat
					style={{ marginRight: "100px" }}
					label="Storage"
					description="2.4 GB"
				/>
			</Flex>
			{devAddons.map((addon) => (
				<Addon {...addon} key={addon.id} />
			))}
		</AppLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const [user, app] = await Promise.all(
			["/users/me", `/apps/${ctx.params.id}`].map((i) => fetchSSR(i, ctx))
		);

		const team = await fetchSSR(`/teams/${app.team_id}`, ctx);

		return {
			props: {
				user,
				app,
				team,
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
