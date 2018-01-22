const merge = require('webpack-merge');
const baseConfig = require('../../../webpack/webpack.dev.base.js');
var copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(baseConfig, {
        '../webcomponent/src/index.ts',
    plugins: [
        new copyWebpackPlugin([
            { from: '../examples/vendor/native-shim.js'  },
        ])
    ],
});