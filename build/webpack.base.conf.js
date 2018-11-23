'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require(
//   'webpack-bundle-analyzer').BundleAnalyzerPlugin
const glob = require('glob')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
// 生成html页面
let htmlWebpackPlugins = []
glob.sync('./src/pages/**/html.js').forEach(path => {
  const chunk = path.split('/pages/')[1].split('/html.js')[0]
  const filename = chunk + '.html'
  const htmlConf = {
    filename: filename,
    template: path,
    chunks: [chunk],
    inject: true
  }
  if (process.env.NODE_ENV === 'production') {
    Object.assign(htmlConf, {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  }
  htmlWebpackPlugins.push(new HtmlWebpackPlugin(htmlConf))
})
// eslint rule
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  exclude: /node_modules/,
  include: [resolve('src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: utils.allEntries,
  output: {
    path: config.build.assetsRoot,
    filename: 'assets/js/[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    // 别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      css: resolve('src/css'),
      img: resolve('src/img'),
      pages: resolve('src/pages'),
      'jquery': 'jquery',
      layout: resolve('src/layout'),
      comps: resolve('src/components')
    }
  },
  module: {
    rules: [
      ...(process.env.NODE_ENV === 'development' && config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve('.cache')
            }
          },
          'babel-loader'
        ],
        exclude: /node_modules/,
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(html|ejs)$/,
        use: [
          {
            loader: 'ejs-loader'
          }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    // 不需要import就可以打包的
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    ...htmlWebpackPlugins,
    new VueLoaderPlugin()
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      maxInitialRequests: 10,
      cacheGroups: {
        vendor: {
          test: /(babel|jquery|fastclick|vue.esm.js)/,
          name: 'vendor',
          chunks: 'all'
        },
        common: {
          test: /(\.(png|jpe?g|gif|svg))/,
          name: 'app',
          chunks: 'initial',
          minChunks: 10
        },
        app: {
          test: /(Lang|ConstVal|Pagination|Tips|pageStatus|api[\\/]index|css[\\/]common.css)/,
          name: 'app',
          chunks: 'initial',
          minChunks: 1
        }
      }
    }
  }
}
