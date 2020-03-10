const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../../server/build')
    },
    devServer: {
        historyApiFallback: {
            rewrites: [
                {from: /^\/client/, to: '/client.html'}
            ]
        }
    },
    module: {
        rules: [
            {
                test:/\.js/,
                use:{
                    loader:'babel-loader',
                    options:{presets:['@babel/preset-env']}
                }
            },
            {
                test:/\.vue/,
                use:'vue-loader'
            },
            {
                test:/\.css/,
                use:['vue-style-loader','css-loader']
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin()
    ]
}