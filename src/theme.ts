import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
	fonts: {
		heading: `"Phantom Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
		mono: `"JetBrains Mono", monospace`,
	},
	initialColorMode: "dark",
	useSystemColorMode: true,
	colors: {
		darker: "#121217",
		dark: "#17171d",
		darkless: "#252429",
		black: "#1f2d3d",
		steel: "#273444",
		slate: "#3c4858",
		muted: "#8492a6",
		smoke: "#e0e6ed",
		snow: "#f9fafc",
		elevated: "#ffffff",
		sheet: "#f9fafc",
		sunken: "#e0e6ed",
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
