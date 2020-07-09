const base = require('./webpack.base');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueClientRender = require('vue-server-renderer/client-plugin')

module.exports = merge(base,{
    entry: {
        client:path.resolve(__dirname, '../src/client.js'),
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'client.html',
            template:path.resolve(__dirname,'../public/client.html')
        }),
        new VueClientRender()
    ]
})