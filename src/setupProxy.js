const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend-service.default.svc.cluster.local',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  )
}
