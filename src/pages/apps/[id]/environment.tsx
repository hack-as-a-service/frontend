import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import AppLayout from "../../../layouts/app";
import fetchApi, { fetchSSR } from "../../../lib/fetch";
import {
  Text,
  Button,
  Flex,
  IconButton,
  Input,
  useToast,
  ButtonGroup,
} from "@chakra-ui/react";
import { IApp, ITeam, IUser } from "../../../types/haas";
import React, { useState } from "react";
import Icon from "@hackclub/icons";
import { ErrorToast, SuccessToast } from "../../../components/Toast";

function EnvVar({
  envVar,
  value,
  onRemove,
  onKeyChange,
  onValueChange,
  disabled,
}: {
  envVar: string;
  value: string;
  onRemove: () => void;
  onKeyChange: (key: string) => void;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Flex my={1}>
      <Input
        flex={1}
        placeholder="Key"
        value={envVar}
        mr={1}
        onChange={(e) => onKeyChange(e.target.value)}
        disabled={disabled}
        fontFamily="mono"
      />
      <Input
        flex={2}
        placeholder="Value"
        value={value}
        mr={2}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        fontFamily="mono"
      />
      <IconButton
        aria-label="Remove environment variable"
        icon={<Icon glyph="delete" />}
        disabled={disabled}
        onClick={() => onRemove()}
      />
    </Flex>
  );
}

export default function EnvironmentPage(props: {
  user: IUser;
  app: IApp;
  team: ITeam;
}) {
  const router = useRouter();
  const { id } = router.query;

  const { data: user } = useSWR("/users/me", { fallbackData: props.user });
  const { data: app } = useSWR(`/apps/${id}`, { fallbackData: props.app });
  const { data: team } = useSWR(() => "/teams/" + app.team_id, {
    fallbackData: props.team,
  });

  const [env, setEnv] = useState<{ key: string; value: string; id: string }[]>(
    []
  );
  const [loading, setLoading] = useState<string | null>(null);

  const toast = useToast();

  return (
    <AppLayout selected="Environment" user={user} app={app} team={team}>
      <ButtonGroup mb={5}>
        <Button
          isDisabled={!!loading}
          onClick={() =>
            setEnv((e) =>
              e.concat({ key: "", value: "", id: Math.random().toString() })
            )
          }
        >
          Add Pair
        </Button>
        <Button variant="cta" isLoading={!!loading} loadingText={loading}>
          Save
        </Button>
      </ButtonGroup>

      {env.map(({ key, value, id }) => (
        <EnvVar
          key={id}
          envVar={key}
          value={value}
          disabled={!!loading}
          onKeyChange={(e) => {
            setEnv(
              env.map((x) => {
                if (x.id == id) {
                  x.key = e;
                }

                return x;
              })
            );
          }}
          onValueChange={(e) => {
            setEnv(
              env.map((x) => {
                if (x.id == id) {
                  x.value = e;
                }

                return x;
              })
            );
          }}
          onRemove={() => {
            setEnv((e) => e.filter((x) => x.id != id));
          }}
        />
      ))}
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const [user, app] = await Promise.all(
      ["/users/me", `/apps/${ctx.params.id}`].map((i) => fetchSSR(i, ctx))
    );

    const team = await fetchSSR(`/teams/${app.team_id}`, ctx);

    return {
      props: {
        user,
        app,
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
