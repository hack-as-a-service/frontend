import theme from "../lib/theme";
import { extendTheme } from "@chakra-ui/react";

const haasTheme = extendTheme(theme as any, {
    components: {
      Input: {
        parts: ["field"],
        baseStyle: {
          field: {
            border: "2px solid grey",
          },
        },
      },
      Avatar: {
        parts: ["container"],
        baseStyle: {
          container: {
            boxShadow: "0 4px 12px 0 rgba(0,0,0,.1)",
          },
        },
      },
    },
  });

export default haasTheme