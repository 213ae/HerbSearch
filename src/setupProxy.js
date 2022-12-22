const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware('/medinfo', {
    target: 'http://zcy.ckcest.cn/tcm/search/medinfo',
    pathRewrite: {
      '^/medinfo': '',
    },
    changeOrigin: true,
    secure: false
  }));
  app.use(createProxyMiddleware('/med', {
    target: 'http://zcy.ckcest.cn/tcm/universal_search/medicine/medicinelist',
    pathRewrite: {
      '^/med': '',
    },
    changeOrigin: true,
    secure: false
  }));
  app.use(createProxyMiddleware('/autocomplete', {
    target: 'http://zcy.ckcest.cn/tcm/autocomplete',
    pathRewrite: {
      '^/autocomplete': '',
    },
    changeOrigin: true,
    secure: false
  }));
  app.use(createProxyMiddleware('/similars', {
    target: 'http://zcy.ckcest.cn/tcm/search/medsimmediainfo',
    pathRewrite: {
      '^/similars': '',
    },
    changeOrigin: true,
    secure: false
  }));
  app.use(createProxyMiddleware('/token', {
    target: 'https://aip.baidubce.com/oauth/2.0/token',
    pathRewrite: {
      '^/token': '',
    },
    changeOrigin: true,
    secure: false
  }));
  app.use(createProxyMiddleware('/plant', {
    target: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant',
    pathRewrite: {
      '^/plant': '',
    },
    changeOrigin: true,
    secure: false
  }));
}