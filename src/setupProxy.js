const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend-service:80',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  )
}
