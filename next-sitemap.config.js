/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://web.cricap.com/', // Ensure this is correct
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
  
//   module.exports = config;
// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: "/socket.io/:path*", // Match WebSocket URL
//         destination: "https://backend.stage.cricap.com/socket.io/:path*", // Replace with your WebSocket server URL
//       },
//     ];
//   },
//   webpack(config) {
//     // Set up proxy for WebSocket
//     config.plugins.push(
//       new createProxyMiddleware('/socket.io', {
//         target: 'https://backend.stage.cricap.com',  // Your WebSocket server URL
//         changeOrigin: true,
//         ws: true,  // Enable WebSocket proxying
//       })
//     );
//     return config;
//   },
//   // other next.js config options...
// };
