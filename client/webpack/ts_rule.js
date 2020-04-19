module.exports = {
    test: /\.(j|t)sx?$/,
    exclude: [
        /node_modules/
    ],
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: false,
            babelrc: false,
            presets: [
                [
                    '@babel/preset-env',
                    //{ targets: { browsers: 'last 2 versions' } } // or whatever your project requires
                    { 'targets': { 'browsers': ['last 2 chrome versions'] } }
                ],
                '@babel/preset-typescript',
                '@babel/preset-react'
            ],
            plugins: [
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                'react-hot-loader/babel'
            ]
        }
    }
}