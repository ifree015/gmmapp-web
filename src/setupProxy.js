const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/bfcs',
    createProxyMiddleware({
      target: process.env.WEB_ROOT_URL,
      changeOrigin: true,
      credentials: true,
    })
  );
};
