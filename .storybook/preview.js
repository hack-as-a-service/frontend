import "@hackclub/theme/fonts/reg-bold.css";
import haasTheme from "../lib/fullTheme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  chakra: { theme: haasTheme },
  backgrounds: { disable: true },
};
