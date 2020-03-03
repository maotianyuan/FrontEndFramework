const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({template: './public/index.html'})
  ],
}