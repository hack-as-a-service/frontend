import { Badge } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { withCookies } from "../components/Chakra";
import HaasLayout, {
	SidebarBackButton,
	SidebarHeader,
	SidebarItem,
} from "../layouts/HaasLayout";
import { fetchSSR } from "../lib/fetch";
import { IUser } from "../types/haas";

export default function BeepPage(props: { user: IUser }) {
	const { data: user } = useSWR("/users/me", { fallbackData: props.user });

	return (
		<HaasLayout
			user={user}
			title="Yeah"
			sidebar={
				<>
					<SidebarBackButton href="/" />

					<SidebarHeader image="https://github.com/hackclub.png">
						Hack Club HQ
					</SidebarHeader>

					<SidebarItem href="/" icon="code" selected>
						Apps <Badge>7</Badge>
					</SidebarItem>
					<SidebarItem href="/" icon="person">
						People
					</SidebarItem>
					<SidebarItem href="/" icon="settings">
						Settings
					</SidebarItem>
				</>
			}
		>
			yeah
		</HaasLayout>
	);
}

export const getServerSideProps: GetServerSideProps = withCookies(
	async (ctx) => {
		try {
			const user = await fetchSSR("/users/me", ctx);

			return {
				props: {
					user,
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
