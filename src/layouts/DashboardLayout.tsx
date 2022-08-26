import { IconButton, useDisclosure } from "@chakra-ui/react";
import HaasLayout, {
	ISidebarItem,
	ISidebarSection,
} from "../layouts/HaasLayout";
import { IApp, ITeam, IUser } from "../types/haas";
import Icon from "@hackclub/icons";
import { useRouter } from "next/router";
import React, { PropsWithChildren, ReactElement } from "react";
import fetchApi from "../lib/fetch";
import TeamCreateModal from "../components/TeamCreateModal";
import { nanoid } from "nanoid";

export default function DashboardLayout({
	user,
	teams,
	personalApps,
	selected,
	children,
	actionButton,
}: PropsWithChildren<{
	user: IUser;
	teams: ITeam[];
	personalApps: IApp[];
	selected: string;
	actionButton?: ReactElement;
}>) {
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
					selected: selected === "Personal Apps",
					badge: personalApps.length.toString(),
				},
				{
					text: "Settings",
					icon: "settings",
					url: "/settings",
					selected: selected === "Settings",
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
		<HaasLayout
			title={selected}
			sidebarSections={sidebarSections}
			user={user}
			actionButton={actionButton}
		>
			<TeamCreateModal
				onClose={teamModal.onClose}
				isOpen={teamModal.isOpen}
				onCreate={async (v, { setErrors, setSubmitting }) => {
					try {
						// TODO: mutate SWR state after creating team
						await fetchApi("/teams", {
							headers: {
								"Content-Type": "application/json",
							},
							method: "POST",
							body: JSON.stringify({
								slug: v.slug,
								name: v.name,
								invite: nanoid(7),
							}),
						});

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
        onJoin={async (v, { setErrors, setSubmitting }) => {
          
        }}
			/>

			{children}
		</HaasLayout>
	);
}
