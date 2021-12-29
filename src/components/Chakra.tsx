import theme from "../theme";
import { deepmerge } from "deepmerge-ts";
import { GetServerSideProps } from "next";

import {
	ChakraProvider,
	cookieStorageManager,
	localStorageManager,
} from "@chakra-ui/react";

export function Chakra({ cookies, children }) {
	const colorModeManager =
		typeof cookies === "string"
			? cookieStorageManager(cookies)
			: localStorageManager;

	return (
		<ChakraProvider theme={theme} colorModeManager={colorModeManager}>
			{children}
		</ChakraProvider>
	);
}

export function withCookies(next: GetServerSideProps): GetServerSideProps {
	return async (ctx) => {
		return deepmerge(await next(ctx), {
			props: {
				cookies: ctx.req.headers.cookie ?? "",
			},
		});
	};
}
