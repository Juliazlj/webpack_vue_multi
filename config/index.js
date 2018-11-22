'use strict'

const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 代理
    proxyTable: {
      '/debug_api': {
        target: 'https://4g.tongxingzhe.cn',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/debug_api': ''
        }
      }
    },
    host: '0.0.0.0', // 指定要使用的主机。默认情况下，这是localhost。如果您希望外部可以访问，可以指定为0.0.0.0
    port: 8081,
    autoOpenBrowser: false, // 启动后自动打开网页
    errorOverlay: true, // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖
    notifyOnErrors: true, // 是否在终端看到webapck运行的警告和错误
    useEslint: true, // 是否使用eslint
    showEslintErrorsInOverlay: true, // 是否把eslint错误显示
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: false
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false, // 是否启用sourceMap
    devtool: 'source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // 使用`npm run build --report`对模块进行分析
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
