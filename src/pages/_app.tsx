import { SWRConfig } from "swr";
import fetchApi from "../lib/fetch";
import Router from "next/router";
import NProgress from "nprogress";
import { Chakra } from "../components/Chakra";

import "@hackclub/theme/fonts/reg-bold.css";
import "../styles/globals.css";
import "../styles/nprogress.css";

let progressBarTimeout = null;

const startProgressBar = () => {
	clearTimeout(progressBarTimeout);
	progressBarTimeout = setTimeout(NProgress.start, 500);
};

const stopProgressBar = () => {
	clearTimeout(progressBarTimeout);
	NProgress.done();
};

NProgress.configure({
	showSpinner: false,
});

Router.events.on("routeChangeStart", () => startProgressBar());
Router.events.on("routeChangeComplete", () => stopProgressBar());
Router.events.on("routeChangeError", () => stopProgressBar());

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
