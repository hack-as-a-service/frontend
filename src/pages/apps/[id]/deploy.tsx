import { Box, Button, Input, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";
import useSWR from "swr";
import { withCookies } from "../../../components/Chakra";
import AppLayout from "../../../layouts/AppLayout";
import fetchApi, { fetchSSR } from "../../../lib/fetch";
import { IApp, ITeam, IUser } from "../../../types/haas";

export default function AppDeployPage(props: {
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

	const repoUrlRef = useRef<HTMLInputElement>(null);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		const url = repoUrlRef.current.value;
		const res = await fetchApi(`/apps/${id}/deploy`, {
			method: "POST",
			body: JSON.stringify({
				git_repository: url,
			}),
		});
		router.push(`/builds/${res.id}`);
	}

	return (
		<AppLayout selected="Deploy" user={user} app={app} team={team}>
			<Box as="form" onSubmit={onSubmit}>
				<Text htmlFor="repoUrl" as="label" my={0}>
					Git repository URL
					<br />
					<Text color="grey" size="xs" my={0}>
						Must be a public repository
					</Text>
				</Text>
				<Input name="repoUrl" type="url" required ref={repoUrlRef} />
				<Button variant="cta" mt={2} type="submit">
					Deploy
				</Button>
			</Box>
		</AppLayout>
	);
}

export const getServerSideProps: GetServerSideProps = withCookies(
	async (ctx) => {
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
	}
);
