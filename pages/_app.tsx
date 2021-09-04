import haasTheme from "../lib/fullTheme";
import { SWRConfig } from "swr";
import fetchApi from "../lib/fetch";
import { ChakraProvider } from "@chakra-ui/react";
import "@hackclub/theme/fonts/reg-bold.css";
import { useState } from "react";
import ThemeContext from "../lib/disable_theme";

function MyApp({ Component, pageProps }) {
  const [themeEnabled, setThemeEnabled] = useState(true);

  return (
    <SWRConfig value={{ fetcher: fetchApi }}>
      <ThemeContext.Provider value={{ themeEnabled, setThemeEnabled }}>
        {themeEnabled ? (
          <ChakraProvider theme={haasTheme}>
            <Component {...pageProps} />
          </ChakraProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeContext.Provider>
    </SWRConfig>
  );
}

export default MyApp;
