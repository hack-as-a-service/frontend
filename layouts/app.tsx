import React, { PropsWithChildren } from "react";
import DashboardLayout from "./dashboard";

import { Box, Heading } from "@chakra-ui/react";
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
    <DashboardLayout
      title={
        <Box>
          {!team.personal && (
            <span
              style={{
                fontSize: "20px",
                position: "absolute",
                top: "-10px",
              }}
            >
              {team.name || team.slug}
            </span>
          )}
          <span>{app.slug}</span>
        </Box>
      }
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
      <Heading as="h2" my={8}>
        {selected}
      </Heading>

      {children}
    </DashboardLayout>
  );
}
