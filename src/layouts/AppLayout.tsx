import React, { PropsWithChildren } from "react";
import HaasLayout from "./HaasLayout";

import { Box } from "@chakra-ui/react";
import { IApp, ITeam, IUser } from "../types/haas";

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
			title={app.slug}
			subtitle={!team.personal && (team.name || team.slug)}
			image={team.avatar}
			icon="code"
			user={user}
			sidebarSections={[
				{
					items: [
						{
							icon: "view-back",
							text: "Back",
							url: team.personal ? "/dashboard" : `/teams/${team.slug}`,
						},
					],
				},
				{
					items: [
						{
							icon: "search",
							text: "Logs",
							url: `/apps/${app.slug}`,
							selected: selected == "Logs",
						},
						{
							icon: "share",
							text: "Deploy",
							url: `/apps/${app.slug}/deploy`,
							selected: selected == "Deploy",
						},
						{
							icon: "web",
							text: "Domains",
							url: `/apps/${app.slug}/domains`,
							selected: selected == "Domains",
						},
						{
							icon: "rep",
							text: "Addons",
							url: `/apps/${app.slug}/addons`,
							selected: selected == "Addons",
						},
						{
							icon: "photo",
							text: "Environment",
							url: `/apps/${app.slug}/environment`,
							selected: selected == "Environment",
						},
					],
				},
			]}
		>
			{children}
		</HaasLayout>
	);
}
