// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains
      },
    ],
  },
};