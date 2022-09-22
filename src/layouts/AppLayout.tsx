import React, { PropsWithChildren } from "react";
import HaasLayout, {
	SidebarBackButton,
	SidebarItem,
	SidebarItemIcon,
} from "./HaasLayout";

import { IApp, ITeam, IUser } from "../types/haas";
import { Flex, Heading, Tooltip } from "@chakra-ui/react";

export default function AppLayout({
	children,
	selected,
	app,
	user,
	team,
}: PropsWithChildren<{
	selected: string;
	app: IApp;
	user: IUser;
	team: ITeam;
}>) {
	return (
		<HaasLayout
			title={selected}
			icon="code"
			user={user}
			sidebar={
				<>
					<SidebarBackButton
						href={team.personal ? "/dashboard" : `/teams/${team.slug}`}
					/>
					<Flex alignItems="center" mb={10}>
						<Tooltip label={team.name || team.slug} placement="top">
							<SidebarItemIcon image={team.avatar} icon="code" />
						</Tooltip>
						<Heading size="lg" fontFamily="mono" fontWeight="normal">
							{app.slug}
						</Heading>
					</Flex>
					<SidebarItem
						icon="search"
						href={`/apps/${app.slug}`}
						selected={selected == "Logs"}
					>
						Logs
					</SidebarItem>
					<SidebarItem
						icon="share"
						href={`/apps/${app.slug}/deploy`}
						selected={selected == "Deploy"}
					>
						Deploy
					</SidebarItem>
					<SidebarItem
						icon="web"
						href={`/apps/${app.slug}/domains`}
						selected={selected == "Domains"}
					>
						Domains
					</SidebarItem>
					<SidebarItem
						icon="rep"
						href={`/apps/${app.slug}/addons`}
						selected={selected == "Addons"}
					>
						Addons
					</SidebarItem>
					<SidebarItem
						icon="photo"
						href={`/apps/${app.slug}/environment`}
						selected={selected == "Environment"}
					>
						Environment
					</SidebarItem>
				</>
			}
		>
			{children}
		</HaasLayout>
	);
}
