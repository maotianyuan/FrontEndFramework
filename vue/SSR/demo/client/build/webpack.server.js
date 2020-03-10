const base = require('./webpack.base')
const merge = require('webpack-merge')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueServerRenderer = require('vue-server-renderer/server-plugin');

module.exports = merge(base, {
  entry: {
    server: path.resolve(__dirname, '../src/server.js'),
  },
  target: 'node',
  output: {
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new VueServerRenderer(),
    new HtmlWebpackPlugin({
      filename: 'server.html',
      template: path.resolve(__dirname, '../public/server.html'),
      excludeChunks: ['server']
    })
  ]
})