import { Heading } from "@chakra-ui/layout";
import useSWR from "swr";
import DashboardLayout from "../layouts/dashboard";
import { IUser } from "../types/haas";

export default function NotFound() {
	const { data: user } = useSWR<IUser>("/users/me");

	// It's OK if `user` is null here
	return (
		<DashboardLayout title="Page not found" sidebarSections={[]} user={user}>
			<Heading textAlign="center" mt={32} fontWeight="normal">
				We&apos;ve searched near and far, but we can&apos;t seem to find this
				page. 😢
			</Heading>
		</DashboardLayout>
	);
}
