import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	Input,
	useColorMode,
} from "@chakra-ui/react";
import { Formik, FormikHelpers } from "formik";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Domain from "../../../components/Domain";
import AppLayout from "../../../layouts/app";
import fetchApi, { fetchSSR } from "../../../lib/fetch";
import { IApp, IDomain, ITeam, IUser } from "../../../types/haas";

function AddDomainForm({
	onSubmit,
}: {
	onSubmit: (
		values: { domain: string },
		formikHelpers: FormikHelpers<{ domain: string }>
	) => void | Promise<unknown>;
}) {
	const { colorMode } = useColorMode();

	return (
		<Formik
			initialValues={{ domain: "" }}
			validate={({ domain }) => {
				if (!domain) {
					return { domain: undefined };
				}

				if (!/^([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,6}$/.test(domain)) {
					return {
						domain: "Invalid domain.",
					};
				}

				return {};
			}}
			onSubmit={onSubmit}
			validateOnChange={false}
		>
			{({
				handleSubmit,
				handleChange,
				handleBlur,
				values,
				isSubmitting,
				errors,
			}) => (
				<form onSubmit={handleSubmit}>
					<Flex mb={12} alignItems="center">
						<FormControl isRequired isInvalid={!!errors.domain}>
							<Input
								placeholder="mywebsite.com"
								size="lg"
								autoFocus
								name="domain"
								_placeholder={{
									color: colorMode == "dark" ? "white" : "black",
								}}
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.domain}
							/>
							<FormErrorMessage position="absolute">
								{errors.domain}
							</FormErrorMessage>
						</FormControl>

						<Button
							variant="cta"
							ml={3}
							flexShrink={0}
							isLoading={isSubmitting}
							type="submit"
						>
							Add Domain
						</Button>
					</Flex>
				</form>
			)}
		</Formik>
	);
}

export default function AppDashboardPage(props: {
	user: IUser;
	app: IApp;
	team: ITeam;
	domains: IDomain[];
}) {
	const router = useRouter();
	const { id } = router.query;

	const { data: user } = useSWR("/users/me", { fallbackData: props.user });
	const { data: app } = useSWR(`/apps/${id}`, { fallbackData: props.app });
	const { data: team } = useSWR(`/teams/${app.team_id}`, {
		fallbackData: props.team,
	});
	const { data: domains, mutate: mutateDomains } = useSWR(
		`/apps/${id}/domains`,
		{
			fallbackData: props.domains,
		}
	);

	return (
		<AppLayout selected="Domains" user={user} app={app} team={team}>
			<Head>
				<title>{app.slug} - Domains</title>
			</Head>

			<AddDomainForm
				onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
					try {
						const domain = await fetchApi(`/apps/${app.slug}/domains`, {
							method: "POST",
							body: JSON.stringify({ domain: values.domain }),
						});

						mutateDomains([...domains, domain], false);
						resetForm();
					} catch (e) {
						if (e.resp?.status === 409) {
							setErrors({
								domain: "This domain is already in use.",
							});
						} else {
							setErrors({ domain: "An unknown error occurred." });
						}
					}

					setSubmitting(false);
				}}
			/>

			{domains.map((d) => {
				return <Domain key={d.id} {...d} />;
			})}
		</AppLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const [user, app, domains] = await Promise.all(
			[
				"/users/me",
				`/apps/${ctx.params.id}`,
				`/apps/${ctx.params.id}/domains`,
			].map((i) => fetchSSR(i, ctx))
		);
		const team = await fetchSSR(`/teams/${app.team_id}`, ctx);

		return {
			props: {
				user,
				app,
				team,
				domains,
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
