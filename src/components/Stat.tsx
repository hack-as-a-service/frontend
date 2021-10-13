import { Flex, Text, Heading } from "@chakra-ui/react";

export function Stat({
	label,
	description,
	style,
}: {
	style?: React.CSSProperties;
	label: string;
	description: string;
}) {
	return (
		<Flex style={{ flexDirection: "column", ...style }}>
			<Text m="0" style={{ fontSize: "20px" }}>
				{label}
			</Text>
			<Heading style={{ fontSize: "40px" }}>{description}</Heading>
		</Flex>
	);
}
