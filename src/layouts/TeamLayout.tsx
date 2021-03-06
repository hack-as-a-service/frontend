import React, { PropsWithChildren, ReactElement } from "react";
import { IApp, ITeam, IUser } from "../types/haas";
import HaasLayout from "./HaasLayout";

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
			title={team.name || team.slug}
			user={user}
			icon="person"
			image={team.avatar || undefined}
			actionButton={actionButton}
			sidebarSections={[
				{
					items: [
						{
							text: "Back",
							icon: "view-back",
							url: "/dashboard",
						},
					],
				},
				{
					items: team.personal
						? [
								{
									text: "Apps",
									url: `/teams/${team.slug}`,
									icon: "code",
									badge: apps.length.toString(),
									selected: selected === "Apps",
								},
						  ]
						: [
								{
									text: "Apps",
									url: `/teams/${team.slug}`,
									icon: "code",
									badge: apps.length.toString(),
									selected: selected === "Apps",
								},
								{
									text: "Users",
									url: `/teams/${team.slug}/users`,
									badge: users.length.toString(),
									icon: "person",
									selected: selected === "Users",
								},
								{
									text: "Settings",
									url: `/teams/${team.slug}/settings`,
									icon: "settings",
									selected: selected === "Settings",
								},
						  ],
				},
			]}
		>
			{children}
		</HaasLayout>
	);
}
