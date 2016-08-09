var path = require('path');

module.exports = {
    name: 'client code',
    entry: './main.js',
    output: {
        path: 'dist/',
        publicPath: 'dist',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.(js)$/,
                excludes: ['node_modules'],
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    plugins: ['transform-es2015-modules-commonjs']
                }
            }
        ]
    },
    externals: {
        // 'jquery': 'jQuery',
        'phaser': 'Phaser',
    }
};