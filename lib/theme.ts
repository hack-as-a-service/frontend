import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
  fonts: {
    heading: `"Phantom Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `"JetBrains Mono", monospace`,
  },
  components: {
    // Input: {
    //   parts: ["field"],
    //   baseStyle: {
    //     field: {
    //       border: "2px solid grey",
    //     },
    //   },
    // },
    Button: {
      baseStyle: {
        fontFamily: "heading",
      },
      variants: {
        cta: {
          bg: "linear-gradient(-45deg, #ec3750, #ff8c37)",
          color: "white",
          _hover: {
            _disabled: {
              bg: "linear-gradient(-45deg, #ec3750, #ff8c37)",
            },
          },
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
