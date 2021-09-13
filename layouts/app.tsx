import React, { PropsWithChildren } from "react";
import DashboardLayout from "./dashboard";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { IApp, ITeam, IUser } from "../types/haas";
import { ChevronRight } from "react-feather";

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
    <DashboardLayout
      title={
        <Flex align="center">
          <span style={{ fontSize: "25px" }}>{team.name || team.slug}</span>
          <ChevronRight style={{ margin: "0px 10px" }} size={40} />
          <span>{app.slug}</span>
        </Flex>
      }
      image={team.avatar}
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
              icon: "explore",
              text: "Dashboard",
              url: `/apps/${app.slug}`,
              selected: selected == "Dashboard",
            },
            {
              icon: "search",
              text: "Logs",
              url: `/apps/${app.slug}/logs`,
              selected: selected == "Logs",
            },
            {
              icon: "share",
              text: "Deploy",
              url: `/apps/${app.slug}/deploy`,
              selected: selected == "Deploy",
            },
            {
              icon: "rep",
              text: "Addons",
              url: `/apps/${app.id}/addons`,
              selected: selected == "Addons",
            },
            {
              icon: "photo",
              text: "Environment",
              url: `/apps/${app.id}/environment`,
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
