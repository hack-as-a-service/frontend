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
};
