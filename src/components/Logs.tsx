import React, { useState, useEffect, useRef, CSSProperties } from "react";
import {
	Box,
	useColorMode,
	FormControl,
	FormLabel,
	Switch,
} from "@chakra-ui/react";

export type LogsProps<T> = {
	render: (item: T) => React.ReactElement;
	keyer: (item: T) => React.Key;
	logs: T[];
};

export default function Logs<T>({ logs, render, keyer }: LogsProps<T>) {
	const { colorMode } = useColorMode();
	const [autoScroll, setAutoScroll] = useState(true);
	const [wordWrap, setWordWrap] = useState(false);

	const logsElement = useRef(null);

	const wrapStyle: CSSProperties = wordWrap
		? {
				whiteSpace: "pre-wrap",
				wordWrap: "break-word",
		  }
		: {};

	useEffect(() => {
		if (autoScroll && logsElement.current) {
			logsElement.current.scroll({
				top: logsElement.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [logs]);

	return (
		<>
			<FormControl display="flex" alignItems="center" my={1}>
				<FormLabel m="0" mx={1}>
					Auto Scroll
					<Switch
						mx={1}
						isChecked={autoScroll}
						onChange={() => setAutoScroll(!autoScroll)}
					/>
				</FormLabel>

				<FormLabel m="0" mx={1}>
					Word Wrap
					<Switch
						mx={1}
						isChecked={wordWrap}
						onChange={() => setWordWrap(!wordWrap)}
					/>
				</FormLabel>
			</FormControl>
			<Box
				ref={logsElement}
				bg={colorMode == "dark" ? "steel" : "sunken"}
				borderRadius="10px"
				maxWidth="100%"
				height="500px"
				overflowY="auto"
				p={1}
				fontSize="sm"
			>
				{logs.map((log) => (
					<pre
						key={keyer(log)}
						style={{
							...wrapStyle,
							margin: "5px 0",
							padding: 0,
							fontSize: "inherit",
							overflow: "clip",
						}}
					>
						{render(log)}
					</pre>
				))}
			</Box>
		</>
	);
}
