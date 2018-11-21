'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlFlexiblePlugin = require('./html-flexible-plugin')
// const BundleAnalyzerPlugin = require(
//   'webpack-bundle-analyzer').BundleAnalyzerPlugin
const glob = require('glob')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let htmlWebpackPlugins = []
const processHtml = (filename, chunk, path) => {
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
}
glob.sync('./src/pages/**/html.js').forEach(path => {
  const chunk = path.split('/pages/')[1].split('/html.js')[0]
  const filename = chunk + '.html'
  processHtml(filename, chunk, path)
})
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
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      libs: resolve('src/libs'),
      css: resolve('src/css'),
      img: resolve('src/img'),
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
        },
        exclude: [
          path.join(__dirname, '../src/img/img_bg.png'),
          path.join(__dirname, '../src/img/thumb/hd_share_img.png'),
          path.join(__dirname, '../src/img/ic_logo_o.png')
        ]
      },
      {
        test: /img_bg\.png|hd_share_img\.png|ic_logo_o\.png|favicon\.ico$/,
        loader: 'file-loader',
        options: {
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    ...htmlWebpackPlugins,
    // new HtmlFlexiblePlugin({options: ''}),
    new VueLoaderPlugin()
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      maxInitialRequests: 10,
      cacheGroups: {
        anas: {
          test: /utils[\\/]statistics/,
          name: 'anas',
          chunks: 'initial',
          minChunks: 1
        },
        vendor: {
          test: /(jquery|fastclick|vue.esm.js)/,
          name: 'vendor',
          chunks: 'all'
        },
        cosUpload: {
          test: /(cosUploadUtil|exif|lrz.all.bundle|qcloud_sdk)/,
          name: 'upload',
          chunks: 'initial',
          minChunks: 1
        },
        common: {
          test: /(\.(png|jpe?g|gif|svg))/,
          name: 'app',
          chunks: 'initial',
          minChunks: 10
        },
        app: {
          test: /(rFixNav|Lang|ConstVal|Pagination|Tips|pageStatus|api[\\/]index|api[\\/]base|libs[\\/]app|aui-dialog|aui-toast|app_api|wx-base|css[\\/]common.css|aui.2.0.css)/,
          name: 'app',
          chunks: 'initial',
          minChunks: 1
        }
      }
    }
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
