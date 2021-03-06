const path = require('path')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const rules = require('./rules')
    // const rules = [ts_rule]
const htmlPlugins = require('./html')

const isDevelopment = true
module.exports = {
    entry: { 'index': path.join(__dirname, '..', 'src', 'pages', 'index.tsx') },
    output: {
        path: path.resolve(__dirname, '..', 'public'),
        filename: 'index.js',
        sourceMapFilename: '[name].map',
        publicPath: '/'
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
        },
        historyApiFallback: true
    },
    externals: {
        firebase: 'firebase'
    },
    devtool: isDevelopment ? '#eval-source-map' : 'source-map',
    plugins: [new ForkTsCheckerWebpackPlugin(), new webpack.NamedModulesPlugin()].concat(htmlPlugins)
}