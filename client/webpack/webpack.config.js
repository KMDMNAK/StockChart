const path = require('path')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ts_rule = require('./ts_rule')
const rules = [ts_rule]
const htmlPlugins = require('./html')

module.exports = {
    entry: { 'index': path.join(__dirname, '..', 'src', 'pages', 'index.tsx') },
    output: {
        path: path.resolve(__dirname, '..', 'public'),
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },
    module: { rules },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        }
    },
    devServer: {
        contentBase: path.resolve(__dirname, '..', 'public'),
        hot: true,
        inline: true,
        proxy: {
            '/api': {
                target: process.env.WEBPACK_DEV_PROXY || 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    plugins: [new ForkTsCheckerWebpackPlugin(), new webpack.NamedModulesPlugin()].concat(htmlPlugins)
}