import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import portfinder from 'portfinder';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMiniPlugin from "css-minimizer-webpack-plugin";
import config, { getAbsPath } from './config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const LOCALHOST_PORT = +(process.env.PORT || "") || 8080;

let filterEntries = Object.keys(config.web.entry).filter(name => name != 'lit');
console.log(filterEntries);
let htmlPluginList = config.isDev 
  ? filterEntries.map(name => {
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: 'index.dev.html',
      inject: true,
      chunks: [name],
    })
  }) 
  : filterEntries.map(name => {
    return new HtmlWebpackPlugin({
      filename: getAbsPath(`./dist/web/${name}.html`),
      template: 'index.prod.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunks: [name],
    });
  });

const webBaseConfig:webpack.Configuration & {devServer?: any} = {
  mode: config.isDev ? "development" : "production",
  devtool: config.isDev ? "cheap-module-source-map" : false,
  entry: config.web.entry,
  output: config.web.output,
  module: {
    rules: [
      {
        test: /\.css$/,
        // @ts-ignore
        use: [ config.isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(config.web.defines),
    ...htmlPluginList,
    new CopyPlugin({ patterns: [...config.web.copy] }),
  ]
}

if (config.isDev) { // Developement mode.
  console.log("development");
  webBaseConfig.devServer = {
    historyApiFallback: {
      rewrites: [{from: /.*/, to: '/index.html'}],
    },
    hot: true,
    compress: true,
    host: process.env.HOST || 'localhost',
    port: LOCALHOST_PORT,
    open: true, // 自动打开浏览器
    client: {
      logging: 'warn',
      overlay: { // 展示全屏报错
        warnings: false,
        errors: true
      },
    },
    static: {
      publicPath: '/',
    },
    proxy: {},
  }
  webBaseConfig.watchOptions = {
    poll: false,
  }
  webBaseConfig.plugins!.unshift(new webpack.HotModuleReplacementPlugin());

} else { // Production mode.
  console.log("production");
  webBaseConfig.optimization = {
    splitChunks: {
      // 代码分割配置
      chunks: 'async',
      minSize: 30000,
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
  }
  webBaseConfig.plugins!.push(new MiniCssExtractPlugin({ filename: path.posix.join('static', 'css/[name].[hash].css') }));
  webBaseConfig.plugins!.push(new webpack.ids.HashedModuleIdsPlugin())
}

// @ts-ignore
const webpackConfig = merge(webBaseConfig, config.commonWebpackConfig);

export default config.isDev 
  ? new Promise((resolve, reject) => {
    portfinder.basePort = LOCALHOST_PORT;
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        // @ts-ignore
        webpackConfig.devServer.port = port;

        resolve(webpackConfig);
      }
    });
  }) 
  : webpackConfig;
