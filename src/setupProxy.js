const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend-service',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  )
}
