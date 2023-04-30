const path = require('path')

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    index: path.resolve(__dirname, '../src/pages/index.tsx'),
    log: path.resolve(__dirname, '../src/pages/log.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/web'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['...', ".tsx", ".ts", '.js', '.jsx', '.json'],
    alias: {
      src: path.resolve(__dirname, "../src/"),
      api: path.resolve(__dirname, "../src/api"),
      wasm: path.resolve(__dirname, "../wasm/"  + (Reflect.has(process.env, "WECHAT") ? "mp" : "web" )),
      wts: path.resolve(__dirname, "../src/wts"),
      css: path.resolve(__dirname, "../src/assets/css"),
    },
    fallback: {
      path: false,
      pref_hook: false,
      ws: false,
      fs: false,
      crypto: false,
      http: false,
      https: false,
      worker_threads: false
    }
  },
}
