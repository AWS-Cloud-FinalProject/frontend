const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend-service:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  )
}
