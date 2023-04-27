const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMiniPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const config = require("./config")

const htmlPluginList = Object.keys(baseWebpackConfig.entry).map(name => {
  return new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, `../dist/web/${name}.html`),
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    },
    chunks: [name],
  })
})

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    filename: path.posix.join('static', 'js/[name].[chunkhash].js'),
    chunkFilename: path.posix.join('static', 'js/[id].[chunkhash].js'),
  },
  optimization: {
    splitChunks: {
      // 代码分割配置
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      // 压缩CSS
      new CssMiniPlugin({
        test: /\.css$/g,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        }
      }),
      // 压缩 js
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
      }),
    ],
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        DEV: true,
        WECHAT: false
      },
    }),
    // 分离 css 文件
    new MiniCssExtractPlugin({
      filename: path.posix.join('static', 'css/[name].[hash].css'),
    }),
    ...htmlPluginList,
    // 当 vendor 模块没有改变时，保证模块 id 不变
    new webpack.ids.HashedModuleIdsPlugin(),
    new CopyPlugin({
      patterns: [
        ...config.web.copy
      ]
    }),
  ],
})

module.exports = webpackConfig
