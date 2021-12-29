// TODO: toggles for auto scroll/word wrap, display other events, connect to build endpoints + sse
import { useRouter } from "next/router";
import { Fragment, useEffect, useState, useRef, CSSProperties } from "react";
import useSWR from "swr";
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	useAccordionItemState,
	Box,
	Flex,
	Progress,
	Text,
	useColorMode,
	Heading,
} from "@chakra-ui/react";
import HaasLayout from "../../layouts/HaasLayout";
import { GetServerSideProps } from "next";
import { fetchSSR } from "../../lib/fetch";
import { IApp, IBuild, IUser } from "../../types/haas";
import Ansi from "ansi-to-react";
import successLogs from "../../lib/successBuildEventLogs.json";
import prettyBytes from "pretty-bytes";
import Head from "next/head";
import { IDockerBuildEvent, IPayload } from "../../types/build";
import { withCookies } from "../../components/Chakra";

const eventsByStep = (entries: [string, IDockerBuildEvent][]) => {
	const steps = new Map<string, IDockerBuildEvent[]>();
	for (let e = 0; e < entries.length; e++) {
		const [currentBuildId, currentBuild] = entries[e];
		currentBuild.id = currentBuildId;
		// TODO: Make this check less sus? not every log beginning with 'step' is actually a step
		if (currentBuild?.stream?.substring(0, 4) === "Step") {
			steps.set(currentBuildId, [currentBuild]);
		} else {
			const keys = Array.from(steps.keys());
			const yeah = keys[keys.length - 1];
			steps.set(yeah, [...steps.get(yeah), currentBuild]);
		}
	}
	return steps;
};

function parseEvent(s: string): IPayload {
	const event = JSON.parse(s);
	event.date = new Date(event.ts / 1000000);
	return event;
}

const buildLogAsString = (log: IDockerBuildEvent) => {
	let val = "";
	if (log?.stream) val += log.stream;
	if (log?.status) val += log.status;
	return val === "" ? null : val;
};

export default function BuildPage(props: {
	user: { user: IUser };
	build: { build: IBuild };
	app: { app: IApp };
}) {
	const router = useRouter();
	const { id } = router.query;

	// const { data: build, mutate: mutateBuild } = useSWR(`/builds/${id}`, {
	// 	fallbackData: props.build,
	// });
	// const { data: app } = useSWR(() => "/apps/" + build?.build.AppID, {
	// 	fallbackData: props.app,
	// });

	const [autoScroll, setAutoScroll] = useState(true);
	const [wordWrap, setWordWrap] = useState(true);

	const wrapStyle: CSSProperties = wordWrap
		? {
				whiteSpace: "pre-wrap",
				wordWrap: "break-word",
		  }
		: {};

	const logsElement = useRef<HTMLDivElement>(null);
	const [logs, setLogs] = useState<Map<string, IDockerBuildEvent>>(new Map());
	useEffect(() => {
		if (autoScroll && logsElement.current) {
			logsElement.current.scrollIntoView(false);
		}
	}, [logs]);

	const { data: user } = useSWR("/users/me", { fallbackData: props.user });

	useEffect(() => {
		const dummy = successLogs;
		let currentIdx = 0;
		const lastIdx = dummy.length;

		const pushNewLog = () => {
			const newLog = dummy[currentIdx];
			setLogs((prev) => {
				const newMap = new Map(prev);
				if (newLog.stream === "\n") return newMap;
				if (!newLog.id) {
					const newId = Date.now().toString();
					newMap.set(newId, { ...newLog, id: newId });
					return newMap;
				}

				for (const id in logs.keys()) {
					if (id === newLog.id) {
						newMap.set(newLog.id, newLog);
						return newMap;
					}
				}
				newMap.set(newLog.id, newLog);
				return newMap;
			});
			if (++currentIdx === lastIdx) clearInterval(i);
		};

		const i = setInterval(pushNewLog, 100);
		return () => clearInterval(i);
	}, []);

	const buildSteps = Array.from(eventsByStep(Array.from(logs.entries())));
	return (
		<HaasLayout
			user={user?.user}
			// title={`Build ${build?.build.ID} for app ${app?.app.slug}`}
			title={`the-hacker-express`}
			subtitle={`Build 293`}
			sidebarSections={[]}
			// sidebarSections={
			// 	app
			// 		? [
			// 				{
			// 					items: [
			// 						{
			// 							text: "Back",
			// 							icon: "view-back",
			// 							url: `/apps/${app.app.id}`,
			// 						},
			// 					],
			// 				},
			// 		  ]
			// 		: []
			// }
		>
			<>
				{/* <Head><title>{`Build ${build?.build.ID} for app ${app?.app.slug}`}</title></Head> */}
				<Accordion allowToggle defaultIndex={0} ref={logsElement}>
					<AccordionItem>
						<Heading>
							<AccordionButton>
								<Box flex="1" textAlign="left">
									Build Logs
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</Heading>
						<AccordionPanel>
							<Accordion
								allowToggle
								allowMultiple
								defaultindex={[buildSteps.length - 1]}
							>
								{buildSteps.map(([id, evs], idx) => (
									<AccordionItem key={id}>
										<BuildStep
											wrapStyle={wrapStyle}
											evs={evs}
											isLast={idx === buildSteps.length - 1}
										/>
									</AccordionItem>
								))}
							</Accordion>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<Heading>
							<AccordionButton>
								<Box flex="1" textAlign="left">
									Deploy Logs
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</Heading>
						<AccordionPanel>
							<Text>yeah yeah</Text>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</>
		</HaasLayout>
	);
}

function BuildStep({
	evs,
	isLast,
	wrapStyle,
}: {
	evs: IDockerBuildEvent[];
	isLast: boolean;
	wrapStyle: CSSProperties;
}) {
	const stepDetails = evs[0];
	const yeah = useAccordionItemState();
	const { colorMode } = useColorMode();
	useEffect(() => {
		if (isLast) {
			yeah.onOpen();
		} else {
			yeah.onClose();
		}
	}, [evs]);
	return (
		<>
			<Heading>
				<AccordionButton>
					{/* TODO: Maybe add a little indicator icon for step status (loading, checkmark, cross) */}
					<Box flex="1" textAlign="left">
						{stepDetails?.stream || "wat"}
					</Box>
					<AccordionIcon />
				</AccordionButton>
			</Heading>
			<AccordionPanel>
				<Box
					bg={colorMode == "dark" ? "steel" : "sunken"}
					p={4}
					borderRadius="10px"
				>
					{evs.slice(1).map((val) => (
						<Fragment key={val?.id}>
							<pre
								style={{
									...wrapStyle,
									fontSize: "0.8em",
									margin: "5px 0",
									padding: 0,
									overflow: "clip",
								}}
							>
								<Ansi>{buildLogAsString(val)}</Ansi>
							</pre>
							{val?.progress_detail &&
								val?.progress_detail?.current !==
									val?.progress_detail?.total && (
									<Flex minW="100%" mx={2} alignItems="center">
										<pre style={{ fontSize: "0.8em" }}>
											&rarr; {prettyBytes(val.progress_detail.current)}
										</pre>
										<Progress
											mx="2"
											w="100px"
											colorScheme="red"
											size="xs"
											borderRadius={5}
											value={
												(val.progress_detail.current /
													val.progress_detail.total) *
													100 || undefined
											}
										/>
										<pre style={{ fontSize: "0.8em" }}>
											{prettyBytes(val.progress_detail.total)}
										</pre>
									</Flex>
								)}
						</Fragment>
					))}
				</Box>
			</AccordionPanel>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = withCookies(
	async (ctx) => {
		try {
			// const [user, build] = await Promise.all(
			// 	["/users/me", `/builds/${ctx.params.id}`].map((i) => fetchSSR(i, ctx))
			// );

			const [user] = await Promise.all(
				["/users/me"].map((i) => fetchSSR(i, ctx))
			);

			// const app = await fetchSSR(`/apps/${build.build.AppID}`, ctx);

			return {
				props: {
					user,
					// build,
					// app,
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
	}
);
