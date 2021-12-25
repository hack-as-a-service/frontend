import { SWRConfig } from "swr";
import fetchApi from "../lib/fetch";
import Router from "next/router";
import NProgress from "nprogress";
import { Chakra } from "../components/Chakra";

import "@hackclub/theme/fonts/reg-bold.css";
import "../styles/globals.css";
import "../styles/nprogress.css";

NProgress.configure({
	showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
	return (
		<SWRConfig value={{ fetcher: fetchApi }}>
			<Chakra cookies={pageProps.cookies}>
				<Component {...pageProps} />
			</Chakra>
		</SWRConfig>
	);
}

export default MyApp;

export { getServerSideProps } from "../components/Chakra";
