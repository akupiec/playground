const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    // devtool: 'cheap',
    devtool: 'cheap-eval-source-map',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    devServer: {
        // hot: true, // Tell the dev-server we're using HMR
        publicPath: '/'
    },
};