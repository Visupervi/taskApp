const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  // app.use(
  //   proxy('/', {
  //     target: 'http://pre.xxynet.com/shopguide/api/',
  //     changeOrigin: true,
  //     pathRewrite:{
  //       "^/api":"/"
  //     }
  //   })
  // )
}
