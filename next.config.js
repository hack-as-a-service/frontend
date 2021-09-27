module.exports = {
  async rewrites() {
    if (process.env.NO_PROXY) return [];

    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};
