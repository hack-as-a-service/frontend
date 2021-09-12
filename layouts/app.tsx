import { PropsWithChildren } from "react";
import DashboardLayout from "./dashboard";

import { Heading } from "@chakra-ui/react";
import { IApp, ITeam, IUser } from "../types/haas";

export default function AppLayout({
  children,
  selected,
  app,
  user,
  team,
}: PropsWithChildren<{
  selected: string;
  app?: IApp;
  user?: IUser;
  team?: ITeam;
}>) {
  return (
    <DashboardLayout
      title={app?.slug}
      user={user}
      sidebarSections={[
        {
          items: [
            {
              icon: "view-back",
              text: "Back",
              url:
                team?.personal === false
                  ? `/teams/${app?.team_id}`
                  : "/dashboard",
            },
          ],
        },
        {
          title: app?.slug,
          items: [
            {
              icon: "explore",
              text: "Dashboard",
              url: `/apps/${app?.id}`,
              selected: selected == "Dashboard",
            },
            {
              icon: "search",
              text: "Logs",
              url: `/apps/${app?.id}/logs`,
              selected: selected == "Logs",
            },
            {
              icon: "share",
              text: "Deploy",
              url: `/apps/${app?.id}/deploy`,
              selected: selected == "Deploy",
            },
            {
              icon: "rep",
              text: "Addons",
              url: `/apps/${app?.id}/addons`,
              selected: selected == "Addons",
            },
            {
              icon: "photo",
              text: "Environment",
              url: `/apps/${app?.id}/environment`,
              selected: selected == "Environment",
            },
          ],
        },
      ]}
    >
      <Heading as="h2" my={2}>
        {selected}
      </Heading>

      {children}
    </DashboardLayout>
  );
}
