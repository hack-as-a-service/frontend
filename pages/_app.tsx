import theme from "../lib/theme";
import { SWRConfig } from "swr";
import fetchApi from "../lib/fetch";
import { ChakraProvider } from "@chakra-ui/react";
import "@hackclub/theme/fonts/reg-bold.css";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher: fetchApi }}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SWRConfig>
  );
}

export default MyApp;
