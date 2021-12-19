import Icon from "@hackclub/icons";
import Link from "next/link";
import React, { PropsWithChildren, ReactElement } from "react";
import {
	Avatar,
	Box,
	useBreakpointValue,
	Flex,
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	Heading,
	IconButton,
	SystemStyleObject,
	useColorMode,
	Badge,
	Tooltip,
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
		imageComponent = (
			<Avatar
				src={image}
				borderRadius="md"
				bg={colorMode === "dark" ? "gray.700" : "gray.50"}
				mr={4}
				flexShrink={0}
			/>
		);
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
						? "gray.700"
						: "gray.50"
				}
				mr={4}
				flexShrink={0}
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
	actionButton,
	items,
}: {
	title?: string;
	actionButton?: ReactElement;
	items: ISidebarItem[];
}) {
	return (
		<Box mt={8}>
			<Flex alignItems="center" justifyContent="space-between">
				{title && <Heading size="md">{title}</Heading>}
				{actionButton}
			</Flex>
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

function SidebarHeader({ avatar, name }: { avatar?: string; name: string }) {
	return (
		<Flex
			alignItems="center"
			position="sticky"
			top={0}
			py="24px"
			px="50px"
			background="inherit"
			zIndex={5}
		>
			<Tooltip label={name} placement="right">
				<Avatar src={avatar} />
			</Tooltip>

			<Box flexGrow={1} />

			<ColorSwitcher />
			{/* <IconButton mx="5px" aria-label="Controls" background="inherit">
				<Icon glyph="controls" size={32} />
			</IconButton> */}
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
	actionButton?: ReactElement;
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

export default function HaasLayout({
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
	const variant = useBreakpointValue({ base: "hide", lg: "show" });

	if (image && icon) {
		avatar = (
			<Avatar
				size="md"
				src={image}
				icon={<Icon glyph={icon} />}
				borderRadius={8}
				bg={colorMode == "dark" ? "gray.700" : "gray.50"}
				color={colorMode == "dark" ? "gray.100" : "black"}
				mr={8}
			/>
		);
	} else if (image) {
		avatar = (
			<Avatar
				size="md"
				src={image}
				borderRadius={8}
				bg={colorMode == "dark" ? "gray.700" : "gray.50"}
				color={colorMode == "dark" ? "gray.100" : "black"}
				mr={8}
			/>
		);
	} else if (icon) {
		avatar = (
			<Avatar
				size="md"
				icon={<Icon glyph={icon} />}
				borderRadius={8}
				bg={colorMode == "dark" ? "gray.700" : "gray.50"}
				color={colorMode == "dark" ? "gray.100" : "black"}
				mr={8}
			/>
		);
	}

	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Flex minHeight="100vh" flexGrow={0}>
			{/* instead of null, render in a drawer */}
			{variant === "show" ? (
				<Sidebar user={user} sidebarSections={sidebarSections} />
			) : (
				<Drawer placement="left" onClose={onClose} isOpen={isOpen} size="md">
					<DrawerOverlay />
					<DrawerContent>
						<DrawerBody p="0">
							<Sidebar
								user={user}
								sidebarSections={sidebarSections}
								onClose={onClose}
							/>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			)}

			<Box flex={"1 1 auto"} px="50px" py="35px" overflowX="auto">
				{variant === "hide" && (
					<IconButton
						aria-label="Show Menu"
						icon={<Icon glyph="menu" size={32} onClick={onOpen} />}
					/>
				)}
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

function Sidebar({
	user,
	sidebarSections,
	onClose,
}: {
	user: IUser;
	sidebarSections: ISidebarSection[];
	onClose?: () => void;
}) {
	const { colorMode } = useColorMode();
	return (
		<Box
			flexBasis={400}
			flexShrink={0}
			flexGrow={0}
			minH={"100vh"}
			overflowX="auto"
			py="30px"
			background={colorMode === "dark" ? "gray.900" : "gray.50"}
			data-cy="sidebar"
		>
			{onClose && (
				<IconButton
					mx={50}
					my={1}
					aria-label="Hide Menu"
					icon={<Icon glyph="view-close" size={32} />}
					onClick={onClose}
				/>
			)}
			<SidebarHeader avatar={user?.avatar} name={user?.name} />
			<Box mt="40px" px="50px">
				{sidebarSections.map((v, i) => {
					return (
						<SidebarSection
							key={i}
							title={v.title}
							actionButton={v.actionButton}
							items={v.items}
						/>
					);
				})}
			</Box>
		</Box>
	);
}
