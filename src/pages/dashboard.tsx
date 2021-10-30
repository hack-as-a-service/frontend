import useSWR from "swr";
import { Heading, IconButton, useDisclosure, Grid } from "@chakra-ui/react";
import App from "../components/App";
import DashboardLayout, {
	ISidebarItem,
	ISidebarSection,
} from "../layouts/dashboard";
import { GetServerSideProps } from "next";
import fetchApi, { fetchSSR } from "../lib/fetch";
import { IApp, ITeam, IUser } from "../types/haas";
import Head from "next/head";
import Icon from "@hackclub/icons";
import AppCreateModal from "../components/AppCreateModal";
import TeamCreateModal from "../components/TeamCreateModal";
import { useRouter } from "next/router";

export default function Dashboard(props: {
	user: IUser;
	teams: ITeam[];
	personalApps: IApp[];
}) {
	const { data: teams, mutate: mutateTeams } = useSWR("/users/me/teams", {
		fallbackData: props.teams,
	});
	const { data: user } = useSWR("/users/me", { fallbackData: props.user });
	const { data: personalApps, mutate: mutatePersonalApps } = useSWR(
		`/teams/${teams.find((t) => t.personal).id}/apps`,
		{ fallbackData: props.personalApps }
	);
	const appModal = useDisclosure();
	const teamModal = useDisclosure();

	const router = useRouter();

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
				title="Personal Apps"
				sidebarSections={sidebarSections}
				user={user}
				actionButton={
					<IconButton
						aria-label="Create an app"
						onClick={appModal.onOpen}
						data-cy="create-app"
					>
						<Icon glyph="plus" />
					</IconButton>
				}
			>
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
				<AppCreateModal
					onClose={appModal.onClose}
					isOpen={appModal.isOpen}
					onSubmit={async (v, { setSubmitting, setErrors }) => {
						try {
							const app: IApp = await fetchApi(
								`/teams/${teams.find((t) => t.personal).slug}/apps`,
								{
									headers: {
										"Content-Type": "application/json",
									},
									method: "POST",
									body: JSON.stringify({ slug: v.slug }),
								}
							);

							mutatePersonalApps([...personalApps, app], false);

							appModal.onClose();

							router.push(`/apps/${v.slug}`);
						} catch (e) {
							if (e.resp?.status === 409) {
								setErrors({
									slug: "This name is already taken by another app.",
								});
							}
						}

						setSubmitting(false);
					}}
				/>
				{personalApps.length > 0 ? (
					<Grid
						gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
						gap={8}
						flex="1 0 auto"
						mt={2}
						data-cy="personal-apps"
					>
						{personalApps.map((app: IApp) => {
							return (
								<App
									url={`/apps/${app.slug}`}
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
