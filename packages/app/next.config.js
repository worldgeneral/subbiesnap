module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "https://api.subbiesnap.com"}/:path*`,
      },
    ];
  },
};
