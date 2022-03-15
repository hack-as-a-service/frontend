/**
 * @type {import('next').NextConfig}
 */
module.exports = {
	async rewrites() {
		if (process.env.NO_PROXY === "true") return [];

		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:5000/api/:path*",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/apps/:slug/logs",
				destination: "/apps/:slug",
				permanent: false,
			},
		];
	},
	eslint: {
		dirs: ["src/pages/", "src/components/", "src/lib/", "src/layouts/"],
	},
};
