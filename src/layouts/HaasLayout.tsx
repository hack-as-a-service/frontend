import Icon from "@hackclub/icons";
import NextLink from "next/link";
import React, { PropsWithChildren, ReactElement } from "react";
import {
	Avatar,
	Box,
	useBreakpointValue,
	Flex,
	useDisclosure,
	Heading,
	IconButton,
	SystemStyleObject,
	useColorMode,
	Tooltip,
	Link,
	ChakraProps,
	forwardRef,
} from "@chakra-ui/react";
import { Glyph } from "../types/glyph";
import ColorSwitcher from "../components/ColorButton";
import { IUser } from "../types/haas";

export function SidebarBackButton({
	href,
	...props
}: { href: string } & ChakraProps): ReactElement {
	return (
		<NextLink href={href} passHref>
			<Link display="flex" alignItems="center" mb={props.mb || 3} {...props}>
				<Icon glyph="view-back" size={24}></Icon>
				Back
			</Link>
		</NextLink>
	);
}

export const SidebarItemIcon = forwardRef(
	(
		{
			selected = false,
			image,
			icon,
			...props
		}: { selected?: boolean; image?: string; icon?: Glyph },
		ref
	) => {
		const { colorMode } = useColorMode();

		if (image) {
			return (
				<Avatar
					ref={ref}
					src={image}
					borderRadius="md"
					bg={colorMode === "dark" ? "gray.700" : "gray.50"}
					mr={4}
					flexShrink={0}
					ignoreFallback
					{...props}
				/>
			);
		} else if (icon) {
			return (
				<Flex
					ref={ref}
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
					{...props}
				>
					<Icon glyph={icon} color={selected ? "white" : null} />
				</Flex>
			);
		}
	}
);

export interface SidebarItemProps {
	image?: string;
	icon?: Glyph;
	badge?: string;
	href: string;
	selected?: boolean;
}

export function SidebarItem({
	image,
	icon,
	children,
	href,
	sx,
	selected,
}: PropsWithChildren<SidebarItemProps> & { sx?: SystemStyleObject }) {
	return (
		<NextLink href={href}>
			<a>
				<Flex
					alignItems="center"
					sx={{
						alignItems: "center",
						...sx,
					}}
					my={3}
				>
					{(image || icon) && (
						<SidebarItemIcon image={image} icon={icon} selected={selected} />
					)}
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
			</a>
		</NextLink>
	);
}

export function SidebarSectionHeader({
	actionButton,
	children,
}: PropsWithChildren<{
	actionButton?: ReactElement;
}>) {
	return (
		<Flex
			_notFirst={{ mt: 8 }}
			alignItems="center"
			justifyContent="space-between"
		>
			<Heading size="md">{children}</Heading>
			{actionButton}
		</Flex>
	);
}

export function SidebarHeader({
	image,
	icon,
	children,
	...props
}: PropsWithChildren<{ image?: string; icon?: Glyph } & ChakraProps>) {
	return (
		<Flex alignItems="center" mb={props.mb || 10} {...props}>
			<SidebarItemIcon image={image} icon={icon} />{" "}
			<Heading size="lg">{children}</Heading>
		</Flex>
	);
}

function AppHeader({ avatar, name }: { avatar?: string; name: string }) {
	return (
		<Flex
			alignItems="center"
			position="sticky"
			top={0}
			pt={12}
			pb={12}
			px="50px"
			background="inherit"
			zIndex={5}
		>
			<Tooltip label={name} placement="right">
				<Avatar src={avatar} ignoreFallback />
			</Tooltip>

			<Box flexGrow={1} />

			<ColorSwitcher />
			<IconButton mx="5px" aria-label="Controls" background="inherit">
				<NextLink href="/settings" passHref>
					<Icon glyph="controls" size={32} />
				</NextLink>
			</IconButton>
			<IconButton mx="5px" aria-label="Log out" background="inherit">
				<NextLink href="/api/logout" passHref>
					<Icon glyph="door-leave" size={32} />
				</NextLink>
			</IconButton>
		</Flex>
	);
}

export interface ISidebarSection {
	title?: string;
	actionButton?: ReactElement;
	items: SidebarItemProps[];
}

export default function HaasLayout({
	title,
	subtitle,
	image,
	icon,
	children,
	user,
	actionButton,
	sidebar,
}: PropsWithChildren<{
	title: string | ReactElement;
	image?: string;
	icon?: Glyph;
	subtitle?: string | ReactElement;
	user?: IUser;
	actionButton?: ReactElement;
	sidebar?: ReactElement;
}>) {
	const { colorMode } = useColorMode();

	let avatar: ReactElement;
	const variant = useBreakpointValue({ base: "hide", lg: "show" }, "show");

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
				ignoreFallback
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
		<Flex height="100vh" flexGrow={0}>
			{/* TO BE UNCOMMENTED SOON */}

			{/* {variant === "show" ? ( */}
			<Sidebar user={user}>{sidebar}</Sidebar>
			{/* ) : (
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
			)} */}

			<Box flex={"1 1 auto"} px="50px" pb="35px" overflowX="auto">
				{variant === "hide" && (
					<IconButton
						aria-label="Show Menu"
						icon={<Icon glyph="menu" size={32} onClick={onOpen} />}
					/>
				)}
				<Flex alignItems="center" py={10} zIndex={5}>
					{avatar}

					<Box position="relative">
						{subtitle && (
							<Heading
								as="h2"
								fontSize="xl"
								position="absolute"
								top="-20px"
								whiteSpace="nowrap"
							>
								{subtitle}
							</Heading>
						)}
						<Heading as="h1" fontSize={50}>
							{title}
						</Heading>
					</Box>
					{actionButton && <Box ml={8}>{actionButton}</Box>}
				</Flex>
				{children}
			</Box>
		</Flex>
	);
}

function Sidebar({
	user,
	onClose,
	children,
}: PropsWithChildren<{
	user: IUser;
	onClose?: () => void;
}>) {
	const { colorMode } = useColorMode();

	return (
		<Box
			flexBasis={400}
			flexShrink={0}
			flexGrow={0}
			minH={"100vh"}
			overflowX="auto"
			pb={8}
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
			<AppHeader avatar={user?.avatar} name={user?.name} />
			<Box mt="40px" px="50px">
				{children}
			</Box>
		</Box>
	);
}
