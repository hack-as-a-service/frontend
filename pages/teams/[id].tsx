import App from "../../components/App";
import DashboardLayout, { ISidebarItem } from "../../layouts/dashboard";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetchApi, { fetchSSR } from "../../lib/fetch";
import {
  Flex,
  Text,
  Heading,
  Grid,
  Box,
  Avatar,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SystemStyleObject,
  useDisclosure,
  propNames,
} from "@chakra-ui/react";

import Icon from "@hackclub/icons";
import { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { ITeam, IUser } from "../../types/haas";

function Field({
  label,
  description,
  sx,
}: { label: string; description: string } & { sx?: SystemStyleObject }) {
  return (
    <Flex flexDirection="column" sx={sx}>
      <Text fontSize="20px" my={1}>
        {label}
      </Text>
      <Heading fontSize="40px">{description}</Heading>
    </Flex>
  );
}

function TeamMember({
  name,
  avatar,
  sx,
}: { name: string; avatar: string } & { sx?: SystemStyleObject }) {
  return (
    <Flex sx={{ alignItems: "center", ...sx }}>
      <Avatar src={avatar} mr={1} />
      <Text sx={{ fontSize: 20 }} my={1}>
        {name}
      </Text>
    </Flex>
  );
}

function InviteModal({
  team,
  visible,
  onSelect,
  onClose,
}: {
  team: any;
  visible: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (query == "") {
      setUsers([]);
    } else {
      fetchApi(`/users/search?excludeSelf=true&q=${query}`).then((res) => {
        setUsers(res.users);
      });
    }
  }, [query]);

  return (
    <Modal
      onClose={onClose}
      isOpen={visible}
      // title={`Invite someone to ${team.Name}`}
      // visible={visible}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader py={1}>
          <Heading as="h1" my={1} fontWeight="normal">
            Invite someone to{" "}
            <Text as="span" fontWeight="bold">
              {team.Name}
            </Text>
          </Heading>
        </ModalHeader>
        <ModalCloseButton float="right" top={1.5} right={2} />
        <ModalBody>
          <Box as="form">
            <Input
              onInput={(e) => setQuery((e.target as any).value)}
              placeholder="Search for a user..."
              autoFocus
              // px={2}
            />
          </Box>
          {users.length > 0 && (
            <Box mt={2}>
              {users.map((user: IUser) => {
                const isInTeam = team.Users.some((i) => i.ID == user.id);

                return (
                  <Flex
                    key={user.id}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    mt="8px"
                  >
                    <TeamMember avatar={user.avatar} name={user.name} />
                    {!isInTeam ? (
                      <Icon
                        glyph="plus"
                        style={{ cursor: "pointer" }}
                        onClick={() => onSelect(user.id)}
                      />
                    ) : (
                      <Icon glyph="checkmark" color="green" />
                    )}
                  </Flex>
                );
              })}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default function TeamPage(props: {
  user: IUser;
  users: IUser[];
  team: ITeam;
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: team, mutate: mutateTeam } = useSWR(`/teams/${id}`, {
    initialData: props.team,
  });
  const { data: user } = useSWR("/users/me", { initialData: props.user });
  const { data: users } = useSWR(`/teams/${id}/users`, {
    initialData: props.users,
  });

  const [expenses, setExpenses] = useState(0);
  const expensesWs = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!team) return;
    // TODO: fix
    setExpenses(0);
  }, [team]);

  useEffect(() => {
    if (!id) return;
    expensesWs.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_BASE.replace(
        "http",
        "ws"
      )}/teams/${id}/expenses`
    );
    expensesWs.current.onopen = () => {
      console.log("[+] Expenses WebSocket is open");
    };
    expensesWs.current.onclose = () => {
      console.log("[-] Expenses WebSocket is closed");
    };
    expensesWs.current.onmessage = (e) => {
      const expense = parseFloat(JSON.parse(e.data));
      // console.log(`Raw ${e.data}, parsed ${expense}`);
      setExpenses((e) => e + expense);
    };

    return () => expensesWs.current?.close();
  }, [id]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const inviteUser = async (id: string) => {
    await fetchApi(`/teams/${team.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        AddUsers: [id],
      }),
    });

    await mutateTeam();
  };

  return (
    <DashboardLayout
      title={team ? team.name : ""}
      image={team?.avatar || undefined}
      user={user}
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
          title: "Apps",
          items: [],
          // items: team
          //   ? team.team.Apps.length > 0
          //     ? team.team.Apps.map(
          //         (app: any): ISidebarItem => ({
          //           text: app.Name,
          //           icon: "code",
          //           url: `/apps/${app.ID}`,
          //         })
          //       )
          //     : [{ text: "This team doesn't have any apps yet 😢" }]
          //   : [],
        },
      ]}
    >
      {team && (
        <InviteModal
          team={team}
          visible={isOpen}
          onSelect={inviteUser}
          onClose={onClose}
        />
      )}

      <Flex>
        <Field label="Apps" description="1" sx={{ marginRight: "100px" }} />
        <Field
          label="Users"
          description={users.length.toString()}
          sx={{ marginRight: "100px" }}
        />
        <Field label="Expenses" description={`${expenses.toFixed(5)} HN`} />
      </Flex>

      <Flex mt="35px" sx={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* {team && team.Apps.length > 0 ? (
          <Grid
            gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
            gap={2}
            flex="1 0 auto"
          >
            {team.Apps.map((app: any) => {
              return (
                <App
                  key={app.ID}
                  name={app.Name}
                  shortName={app.ShortName}
                  url={`/apps/${app.ID}`}
                />
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ flex: 1 }}>This team doesn't have any apps yet 😢</Box>
        )} */}

        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis="auto"
          sx={{
            "@media screen and (min-width: 1300px)": {
              flexBasis: 400,
            },
          }}
          ml={1}
          p={2}
        >
          <Flex alignItems="center">
            <Heading mr={1} size="md">
              Team members
            </Heading>
            <IconButton
              onClick={onOpen}
              aria-label="Invite users"
              background="inherit"
            >
              <Icon glyph="plus" />
            </IconButton>
          </Flex>

          {users &&
            users.map((user: IUser) => {
              return (
                <TeamMember
                  name={user.name}
                  avatar={user.avatar}
                  sx={{ margin: "10px 0" }}
                  key={user.id}
                />
              );
            })}
        </Box>
      </Flex>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const [user, team, users] = await Promise.all(
      [
        "/users/me",
        `/teams/${ctx.params.id}`,
        `/teams/${ctx.params.id}/users`,
      ].map((i) => fetchSSR(i, ctx))
    );

    if (team.personal) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
        users,
        team,
      },
    };
  } catch (e) {
    if (e.url == "/users/me") {
      return {
        redirect: {
          destination: "/api/login",
          permanent: false,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }
};
