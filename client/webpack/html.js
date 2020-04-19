const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const templatePath = path.resolve(__dirname, 'template.html')
module.exports = [new HtmlWebpackPlugin({
    hash: true,
    filename: path.join(
        __dirname,
        '..',
        'public',
        'index.html'
    ),
    chunks: [
        'index'
    ],
    template: templatePath
})]