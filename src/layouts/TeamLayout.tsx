import { Badge } from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement } from "react";
import { IApp, ITeam, IUser } from "../types/haas";
import HaasLayout, {
	SidebarBackButton,
	SidebarHeader,
	SidebarItem,
} from "./HaasLayout";

export default function TeamLayout({
	children,
	selected,
	team,
	user,
	apps,
	users,
	actionButton,
}: PropsWithChildren<{
	team: ITeam;
	selected: string;
	user: IUser;
	apps: IApp[];
	users: IUser[];
	actionButton?: ReactElement;
}>) {
	return (
		<HaasLayout
			title={selected}
			user={user}
			icon="person"
			image={team.avatar || undefined}
			actionButton={actionButton}
			sidebar={
				<>
					<SidebarBackButton href="/dashboard" />

					<SidebarHeader image={team.avatar} icon="person">
						{team.name || team.slug}
					</SidebarHeader>

					<SidebarItem
						href={`/teams/${team.slug}`}
						icon="code"
						selected={selected == "Apps"}
					>
						Apps
						{!!apps.length && <Badge ml={2}>{apps.length}</Badge>}
					</SidebarItem>

					{!team.personal && (
						<>
							<SidebarItem
								href={`/teams/${team.slug}/users`}
								icon="person"
								selected={selected == "Users"}
							>
								Users
								{!!users.length && <Badge ml={2}>{users.length}</Badge>}
							</SidebarItem>
							<SidebarItem
								href={`/teams/${team.slug}/settings`}
								icon="settings"
								selected={selected == "Settings"}
							>
								Settings
							</SidebarItem>
						</>
					)}
				</>
			}
		>
			{children}
		</HaasLayout>
	);
}
