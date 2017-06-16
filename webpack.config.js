const path = require('path');

module.exports = {
    entry: './src/index.js',
    // devtool: "cheap-eval-source-map",
    // devtool: "inline-source-map",
    // devtool: "source-map",
    output: {
        filename: './dest/bundle.js'
    }
};