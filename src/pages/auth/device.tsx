import {
	Box,
	Flex,
	Heading,
	HStack,
	PinInput,
	PinInputField,
	useToast,
	Button,
} from "@chakra-ui/react";
import Icon from "@hackclub/icons";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useRef, useState } from "react";
import { ArrowRight } from "react-feather";
import { withCookies } from "../../components/Chakra";
import { fetchSSR } from "../../lib/fetch";

export default function CLIAuthPage() {
	const toast = useToast();

	const [appName, setAppName] = useState<string | undefined>(undefined);
	const code = useRef<string | undefined>(undefined);
	const submitButton = useRef(null);

	const [pageState, setPageState] = useState<undefined | "loading" | "success">(
		undefined
	);

	return (
		<Flex
			alignItems="center"
			justifyContent="center"
			height="100vh"
			flexDirection="column"
		>
			<Head>
				<title>Device Authentication</title>
			</Head>

			<Box
				bgGradient="linear(to top left, #ec3750, #ff8c37)"
				borderRadius="2xl"
				boxShadow="lg"
				p={4}
				mb={6}
				color="white"
			>
				{pageState === "success" ? (
					<Icon glyph="checkmark" size={50} />
				) : (
					<Icon glyph="terminal" size={50} />
				)}
			</Box>
			{appName && (
				<Heading size="2xl" mb={8}>
					Log in to{" "}
					<Flex
						display="inline-flex"
						color="red"
						bgGradient="linear(to top left, #ec3750, #ff8c37)"
						bgClip="text"
					>
						{appName}
					</Flex>
				</Heading>
			)}

			<Heading size="md" fontWeight="normal" fontFamily="body">
				{pageState === "success"
					? "You've been logged in!"
					: "Enter the code displayed on your device."}
			</Heading>

			{pageState !== "success" && (
				<form
					onSubmit={async (e) => {
						e.preventDefault();

						setPageState("loading");

						try {
							const r = await fetch(
								process.env.NEXT_PUBLIC_API_BASE +
									`/oauth/device_authorizations/${code.current}/approve`,
								{
									method: "POST",
								}
							);
							if (!r.ok) {
								throw { resp: r };
							}

							setPageState("success");
						} catch (e) {
							toast({
								title: "Something went wrong.",
								status: "error",
								position: "top",
							});

							setPageState(undefined);
						}
					}}
				>
					<Flex mt="8" alignItems="center">
						<HStack>
							<PinInput
								isDisabled={!!appName}
								size="lg"
								autoFocus
								onComplete={async (value) => {
									try {
										const r = await fetch(
											process.env.NEXT_PUBLIC_API_BASE +
												`/oauth/device_authorizations/${value}/app_name`
										);
										if (!r.ok) {
											throw { resp: r };
										}

										setAppName(await r.text());

										code.current = value;

										submitButton.current.focus();
									} catch (e) {
										toast({
											title: "Code is invalid or expired.",
											status: "error",
											position: "top",
										});
										setAppName(undefined);
									}
								}}
							>
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
							</PinInput>
						</HStack>

						<Button
							type="submit"
							variant="cta"
							rightIcon={<ArrowRight size={20} />}
							disabled={!appName}
							ml={8}
							ref={submitButton}
							isLoading={pageState === "loading"}
						>
							Confirm
						</Button>
					</Flex>
				</form>
			)}
		</Flex>
	);
}

export const getServerSideProps: GetServerSideProps = withCookies(
	async (ctx) => {
		try {
			await fetchSSR("/users/me", ctx);

			return {
				props: {},
			};
		} catch (e) {
			console.log(e);

			return {
				redirect: {
					destination: "/api/login?return_to=/auth/device",
					permanent: false,
				},
			};
		}
	}
);
