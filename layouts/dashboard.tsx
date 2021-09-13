import Icon from "@hackclub/icons";
import Link from "next/link";
import { PropsWithChildren, ReactElement } from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  SystemStyleObject,
  useColorMode,
  Badge,
} from "@chakra-ui/react";
import { Glyph } from "../types/glyph";
import ColorSwitcher from "../components/ColorButton";
import { IUser } from "../types/haas";

function SidebarItem({
  image,
  icon,
  children,
  url,
  sx,
  selected,
}: PropsWithChildren<ISidebarItem> & { sx?: SystemStyleObject }) {
  const { colorMode } = useColorMode();
  let imageComponent: ReactElement;

  if (image) {
    imageComponent = <Avatar src={image} borderRadius={8} bg="sunken" mr={4} />;
  } else if (icon) {
    imageComponent = (
      <Flex
        width="48px"
        height="48px"
        borderRadius={8}
        alignItems="center"
        justifyContent="center"
        boxShadow="0 4px 12px 0 rgba(0,0,0,.1)"
        background={
          selected
            ? "linear-gradient(-45deg, #ec3750, #ff8c37)"
            : colorMode === "dark"
            ? "slate"
            : "sunken"
        }
        mr={4}
      >
        <Icon glyph={icon} color={selected ? "white" : null} />
      </Flex>
    );
  }

  const item = (
    <Flex
      alignItems="center"
      sx={{
        alignItems: "center",
        ...(url ? { cursor: "pointer" } : {}),
        ...sx,
      }}
      my={2.5}
    >
      {(image || icon) && imageComponent}
      <Heading
        as="h3"
        size="md"
        sx={{
          fontWeight: "normal",
          ...(image || icon
            ? { whiteSpace: "nowrap", overflow: "hidden" }
            : {}),
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </Heading>
    </Flex>
  );

  if (url) {
    return <Link href={url}>{item}</Link>;
  }

  return item;
}

function SidebarSection({
  title,
  items,
}: {
  title?: string;
  items: ISidebarItem[];
}) {
  return (
    <Box mt={8}>
      {title && <Heading size="md">{title}</Heading>}
      {items.map((item) => {
        return (
          <SidebarItem key={item.text} {...item}>
            {item.text} {item.badge && <Badge>{item.badge}</Badge>}
          </SidebarItem>
        );
      })}
    </Box>
  );
}

function SidebarHeader({ avatar }: { avatar?: string }) {
  return (
    <Flex
      alignItems="center"
      position="sticky"
      top={0}
      py="24px"
      px="50px"
      background="inherit"
    >
      <Avatar src={avatar} />
      <Box flexGrow={1} />
      <ColorSwitcher />
      <IconButton mx="5px" aria-label="Controls" background="inherit">
        <Icon glyph="controls" size={32} />
      </IconButton>
      <IconButton mx="5px" aria-label="Log out" background="inherit">
        <Link href="/api/logout" passHref>
          <Icon glyph="door-leave" size={32} />
        </Link>
      </IconButton>
    </Flex>
  );
}

export interface ISidebarSection {
  title?: string;
  items: ISidebarItem[];
}

export interface ISidebarItem {
  image?: string;
  icon?: Glyph;
  text: string;
  badge?: string;
  url?: string;
  selected?: boolean;
}

export default function DashboardLayout({
  title,
  image,
  icon,
  sidebarSections,
  children,
  user,
  actionButton,
}: PropsWithChildren<{
  title: string | ReactElement;
  image?: string;
  icon?: Glyph;
  sidebarSections: ISidebarSection[];
  user?: IUser;
  actionButton?: ReactElement;
}>) {
  const { colorMode } = useColorMode();

  let avatar: ReactElement;

  if (image && icon) {
    avatar = (
      <Avatar
        size="md"
        src={image}
        icon={<Icon glyph={icon} />}
        borderRadius={8}
        bg="sunken"
        mr={8}
      />
    );
  } else if (image) {
    avatar = (
      <Avatar size="md" src={image} borderRadius={8} bg="sunken" mr={8} />
    );
  } else if (icon) {
    avatar = (
      <Avatar
        size="md"
        icon={<Icon glyph={icon} />}
        borderRadius={8}
        bg="sunken"
        mr={8}
      />
    );
  }

  return (
    <Flex minHeight="100vh" flexGrow={0}>
      <Box
        flexBasis={400}
        flexShrink={0}
        flexGrow={0}
        py="30px"
        background={colorMode === "dark" ? "darker" : "snow"}
      >
        <SidebarHeader avatar={user?.avatar} />
        <Box mt="40px" px="50px">
          {sidebarSections.map((v, i) => {
            return <SidebarSection key={i} title={v.title} items={v.items} />;
          })}
        </Box>
      </Box>
      <Box flex={"1 1 auto"} px="50px" py="35px" overflowX="auto">
        <Flex alignItems="center" position="sticky" top={0} py={2} mb={8}>
          {avatar}

          <Heading as="h1" fontSize={50}>
            {title}
          </Heading>

          {actionButton && <Box ml={8}>{actionButton}</Box>}
        </Flex>

        {children}
      </Box>
    </Flex>
  );
}
