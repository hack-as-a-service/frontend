import { Badge, IconButton, useDisclosure } from "@chakra-ui/react";
import HaasLayout, {
	SidebarItem,
	SidebarSectionHeader,
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

	return (
		<HaasLayout
			title={selected}
			sidebar={
				<>
					<SidebarSectionHeader>Personal</SidebarSectionHeader>
					<SidebarItem
						href="/dashboard"
						selected={selected == "Apps"}
						icon="code"
					>
						Apps
						{!!personalApps.length && (
							<Badge ml={2}>{personalApps.length}</Badge>
						)}
					</SidebarItem>
					<SidebarItem
						href="/settings"
						selected={selected == "Settings"}
						icon="settings"
					>
						Settings
					</SidebarItem>

					<SidebarSectionHeader
						actionButton={
							<IconButton
								aria-label="Create a team"
								icon={<Icon glyph="plus" />}
								onClick={teamModal.onOpen}
								data-cy="create-team"
							/>
						}
					>
						Teams
					</SidebarSectionHeader>
					{teams
						.filter((t) => !t.personal)
						.map((team) => (
							<SidebarItem
								href={`/teams/${team.slug}`}
								icon="person"
								image={team.avatar}
								key={team.id}
							>
								{team.name || team.slug}
							</SidebarItem>
						))}
				</>
			}
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
					try {
						await fetchApi(`/teams/${v.invite}/invite`, {
							headers: {
								"Content-Type": "application/json",
							},
							method: "POST",
						});

						teamModal.onClose();
					} catch (e) {
						setErrors({
							invite: "Invalid invite code!",
						});
					}

					setSubmitting(false);
				}}
			/>

			{children}
		</HaasLayout>
	);
}
