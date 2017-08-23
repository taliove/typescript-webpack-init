var fs = require("fs");
var path = require("path")
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var chalk = require("chalk");

var argv;
try {
    argv = JSON.parse(process.env.npm_config_argv).original;
} catch (ex) {
    argv = process.argv;
}
var project = "";
if (argv && argv.length >= 3) {
    project = argv[2];
    var game_path = path.resolve(__dirname, '../src/projects/' + project + '/index.ts');
    if (!fs.existsSync(game_path)) {
        console.log(chalk.red('  项目「' + project + '」不存在，请检查项目名称。具体名称参见 src/projects/。\n'))
        return;
    }
} else {
    console.log(chalk.red('  请输入项目名称，具体名称参见 src/projects/。\n'))
    return;
}

console.log(chalk.green('  正在开发项目「' + project + '」'));

// add hot-reload related code to entry chunks
baseWebpackConfig.entry.app = "./src/projects/" + project + "/index.ts";//todo 设置热加载的入口
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/projects/' + project + '/index.html'),//'index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin()
    ]
})
