import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import Icon from "@hackclub/icons";
import useSWR from "swr";
import DashboardLayout from "../layouts/dashboard";
import { IUser } from "../types/haas";
import Link from "next/link";

export default function NotFound() {
	const { data: user } = useSWR<IUser>("/users/me");

	// It's OK if `user` is null here
	return (
		<DashboardLayout
			title="Page not found"
			sidebarSections={[
				{
					items: [
						{
							icon: "home",
							text: "Home",
							url: "/dashboard",
						},
					],
				},
			]}
			user={user}
		>
			<Heading textAlign="center" mt={32} fontWeight="normal">
				We&apos;ve searched near and far, but we can&apos;t seem to find this
				page. 😢
			</Heading>

			<Box textAlign="center" mt={12}>
				<Link href="/dashboard" passHref>
					<Button leftIcon={<Icon glyph="home" size={24} />}>Go home</Button>
				</Link>
			</Box>
		</DashboardLayout>
	);
}
