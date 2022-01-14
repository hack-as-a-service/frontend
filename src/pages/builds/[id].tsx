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

type TDockerBuildEvent = IDockerBuildEvent & { ts: string };

interface IBuildStepData {
	stepLog: TDockerBuildEvent;
	beginContainerId?: string;
	endContainerId?: string;
	progressLogs: Map<
		string,
		TDockerBuildEvent & Required<Pick<TDockerBuildEvent, "id">>
	>;
	logs: TDockerBuildEvent[];
}

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
	user: IUser;
	build: IBuild;
	app: IApp;
}) {
	const router = useRouter();
	const { id } = router.query;

	const { data: build, mutate: mutateBuild } = useSWR(`/builds/${id}`, {
		fallbackData: props.build,
	});
	const { data: app } = useSWR(() => "/apps/" + build?.app_id, {
		fallbackData: props.app,
	});

	const [autoScroll, setAutoScroll] = useState(true);
	const [wordWrap, setWordWrap] = useState(true);

	const wrapStyle: CSSProperties = wordWrap
		? {
				whiteSpace: "pre-wrap",
				wordWrap: "break-word",
		  }
		: {};

	const logsElement = useRef<HTMLDivElement>(null);
	const [cloneLogs, setCloneLogs] = useState<string[]>([]);
	const [buildLogs, setBuildLogs] = useState<IBuildStepData[]>([]);
	const [deployLogs, setDeployLogs] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const { colorMode } = useColorMode();
	useEffect(() => {
		if (autoScroll && logsElement.current) {
			logsElement.current.scrollIntoView(false);
		}
	}, [buildLogs]);

	const { data: user } = useSWR("/users/me", { fallbackData: props.user });

	function processEvent(event: IPayload) {
		if ("Err" in event) {
			setError(event.Err);
		} else {
			const event2 = event.Ok;
			switch (event2.type) {
				case "git_clone":
					// XXX: for some reason this variable is needed for TS to infer types properly
					const cloneEv = event2.event;
					setCloneLogs((prev) => prev.concat(cloneEv));
					break;
				case "docker_build":
					const buildLog = event2.event;
					setBuildLogs((prev) => {
						const newArr = [...prev];
						if (buildLog.stream === "\n") return newArr;
						if (buildLog.stream?.startsWith("Step")) {
							if (
								newArr[newArr.length - 1]?.stepLog?.stream ===
								"Waiting for data..."
							) {
								newArr[newArr.length - 1].stepLog = {
									...buildLog,
									ts: event.ts,
								};
							} else {
								newArr.push({
									stepLog: { ...buildLog, ts: event.ts },
									progressLogs: new Map(),
									logs: [],
								});
							}
							return newArr;
						}
						if (newArr.length < 1) {
							// FIXME - should never happen?
							newArr.push({
								stepLog: {
									stream: "Waiting for data...",
									ts: Date.now().toString(),
								},
								progressLogs: new Map(),
								logs: [],
							});
						}
						const newStep = newArr[newArr.length - 1];
						const beginContainerIdRegex = /^ ---> Running in (\S+)\s*$/;
						if (beginContainerIdRegex.test(buildLog.stream)) {
							const containerId = beginContainerIdRegex
								.exec(buildLog.stream)[1];
							newStep.beginContainerId = containerId;
						}
						const endContainerIdRegex = /^ ---> (\S+)\s*$/;
						if (endContainerIdRegex.test(buildLog.stream)) {
							const containerId = endContainerIdRegex
								.exec(buildLog.stream)[1];
							newStep.endContainerId = containerId;
						}
						if (buildLog.id) {
							newStep.progressLogs.set(buildLog.id, {
								...buildLog,
								ts: event.ts,
							} as any);
						} else {
							newStep.logs.push({ ...buildLog, ts: event.ts });
						}
						newArr[newArr.length - 1] = newStep;
						return newArr;
					});
					break;
				case "deploy":
					// TODO: prettify the event
					const deployEv = event2.event;
					setDeployLogs((logs) => logs.concat([deployEv]));
					break;
			}
		}
	}

	useEffect(() => {
		setCloneLogs([]);
		setBuildLogs([]);
		setDeployLogs([]);
		const events: IPayload[] = build.events.map((x) => JSON.parse(x));
		events.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
		events.forEach(processEvent);

		// replay 1 event / 10 ms
		//let currentIdx = 0;
		//const pushNewLog = () => {
		//	let event = events[currentIdx++];
		//	//console.log(event);
		//	processEvent(event);
		//	if (currentIdx >= events.length) clearInterval(i);
		//};
		//const i = setInterval(pushNewLog, 10);
		//return () => clearInterval(i);

		// replay events with real relative offset
		//const beginTs = new Date(events[0].ts);
		//let timeouts = [];
		//for (const event of events) {
		//	const offset = new Date(event.ts).getTime() - beginTs.getTime();
		//	timeouts.push(setTimeout(() => processEvent(event), offset));
		//}
		//return () => timeouts.forEach(clearTimeout);
	}, [build]);

	// until we get sse
	useEffect(() => {
		const i = setInterval(() => mutateBuild(), 300);
		return () => clearInterval(i);
	}, []);

	// FIXME: use the Logs component
	return (
		<HaasLayout
			user={user}
			title={`Build ${build.id} for app ${app.slug}`}
			subtitle={`Build ${build?.id}`}
			sidebarSections={
				app
					? [
							{
								items: [
									{
										text: "Back",
										icon: "view-back",
										url: `/apps/${app.slug}`,
									},
								],
							},
					  ]
					: []
			}
		>
			<>
				{/* TODO: fix the accordion thingy, both levels */}
				<Head>
					<title>{`Build ${build.id} for app ${app.slug}`}</title>
				</Head>
				<Accordion allowToggle defaultIndex={1} ref={logsElement}>
					<AccordionItem>
						<Heading>
							<AccordionButton>
								<Box flex="1" textAlign="left">
									Clone
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
								{cloneLogs.map((log) => (
									<pre
										style={{
											...wrapStyle,
											fontSize: "0.8em",
											margin: "5px 0",
											padding: 0,
											overflow: "clip",
										}}
										key={log}
									>
										<Ansi>{log}</Ansi>
									</pre>
								))}
							</Box>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<Heading>
							<AccordionButton>
								<Box flex="1" textAlign="left">
									Build
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</Heading>
						<AccordionPanel>
							<Accordion
								allowToggle
								allowMultiple
								defaultIndex={[buildLogs.length - 1]}
							>
								{buildLogs.map((data, idx) => (
									<AccordionItem key={data.stepLog.ts}>
										<BuildStep
											wrapStyle={wrapStyle}
											data={data}
											isLast={idx === buildLogs.length - 1}
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
									Deploy
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
								{deployLogs.map((log) => (
									<pre
										style={{
											...wrapStyle,
											fontSize: "0.8em",
											margin: "5px 0",
											padding: 0,
											overflow: "clip",
										}}
										key={log}
									>
										<Ansi>{log}</Ansi>
									</pre>
								))}
							</Box>
						</AccordionPanel>
					</AccordionItem>
					{error && <Text my={4}>Error: {error}</Text>}
				</Accordion>
			</>
		</HaasLayout>
	);
}

function BuildStep({
	data,
	isLast,
	wrapStyle,
}: {
	data: IBuildStepData;
	isLast: boolean;
	wrapStyle: CSSProperties;
}) {
	const stepDetails = data.stepLog;
	const yeah = useAccordionItemState();
	const { colorMode } = useColorMode();
	useEffect(() => {
		if (isLast) {
			yeah.onOpen();
		} else {
			yeah.onClose();
		}
	}, [data, isLast]);
	return (
		<>
			<Heading>
				<AccordionButton>
					{/* TODO: Maybe add a little indicator icon for step status (loading, checkmark, cross) */}
					<Box flex="1" textAlign="left">
						{stepDetails.stream}
					</Box>
					<Box flex="1" textAlign="right" style={{ fontSize: "0.8em" }}>
						<code>
							{data.beginContainerId || (
								<>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								</>
							)}
						</code>
						{(data.beginContainerId || data.endContainerId) && <>&rarr;</>}
						<code>
							{data.endContainerId || (
								<>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								</>
							)}
						</code>
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
					{Array.from(data.progressLogs.values()).map((ev) => (
						<Fragment key={ev.id}>
							<pre
								style={{
									...wrapStyle,
									fontSize: "0.8em",
									margin: "5px 0",
									padding: 0,
									overflow: "clip",
								}}
							>
								<Ansi>{`${ev.id}: ${buildLogAsString(ev)}`}</Ansi>
								{ev.progressDetail &&
									ev.progressDetail?.current &&
									ev.progressDetail?.total && (
										<Flex minW="100%" mx={2} alignItems="center">
											<pre style={{ fontSize: "0.8em" }}>
												&rarr; {prettyBytes(ev.progressDetail.current)}
											</pre>
											<Progress
												mx="2"
												w="100px"
												colorScheme="red"
												size="xs"
												borderRadius={5}
												value={
													(ev.progressDetail.current /
														ev.progressDetail.total) *
														100 || undefined
												}
											/>
											<pre style={{ fontSize: "0.8em" }}>
												{prettyBytes(ev.progressDetail.total)}
											</pre>
										</Flex>
									)}
							</pre>
						</Fragment>
					))}
					{data.logs.map((ev) => (
						<Fragment key={ev.ts}>
							{/* TODO: deduplicate this with above section */}
							<pre
								style={{
									...wrapStyle,
									fontSize: "0.8em",
									margin: "5px 0",
									padding: 0,
									overflow: "clip",
								}}
							>
								<Ansi>{buildLogAsString(ev)}</Ansi>
							</pre>
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
			const [user, build] = await Promise.all(
				["/users/me", `/builds/${ctx.params.id}`].map((i) => fetchSSR(i, ctx))
			);

			const app = await fetchSSR(`/apps/${build.app_id}`, ctx);

			return {
				props: {
					user,
					build,
					app,
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
