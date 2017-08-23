/**
 * Created by tangf on 2017/7/31.
 */
require('./check-versions')()

process.env.NODE_ENV = 'production'

var fs = require("fs")
var gulp = require("gulp")
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var merge = require('webpack-merge')
var utils = require("./utils")
var async = require("async")

var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var argv;
try {
    argv = JSON.parse(process.env.npm_config_argv).original;
} catch (ex) {
    argv = process.argv;
}
var project_name = "";
var projects = [];
if (argv && argv.length >= 3) {
    project_name = argv[2];
    var project_path = path.resolve(__dirname, '../src/projects/' + project_name + '/index.ts');
    if (!fs.existsSync(project_path)) {
        console.log(chalk.red('  项目「' + project_name + '」不存在，请检查项目名称。具体名称参见 src/projects/。\n'))
        return;
    }
} else {
    projects = fs.readdirSync(path.resolve(__dirname, '../src/projects'));
    if (!projects || projects.length === 0) {
        console.log(chalk.red('  在目录 src/projects/ 中未找到项目。\n'))
        return;
    }
}

var buildItem = function (item, callback) {
    var app_entry = path.resolve(__dirname, '../src/projects/' + item + '/index.ts');
    var app_html_entry = path.resolve(__dirname, '../src/projects/' + item + '/index.html');
    if (!fs.existsSync(app_entry)) {
        // throw '  游戏「' + item + '」入口文件 index.js 不存在，请检查项目。\n';
        console.log(chalk.red('\n  项目「' + item + '」入口文件 index.ts 不存在，请检查项目。'));
        if (callback) {
            callback();
        }
        return true;
    }
    if (!fs.existsSync(app_html_entry)) {
        // throw '  游戏「' + item + '」入口文件 index.html 不存在，请检查项目。\n';
        console.log(chalk.red('\n  项目「' + item + '」入口文件 index.html 不存在，请检查项目。'));
        if (callback) {
            callback();
        }
        return true;
    }
    var currentWebpackConfig = merge(webpackConfig, {
        entry: {
            app: app_entry
        },
        output: {
            filename: path.posix.join(item, '/js/[name].[chunkhash:8].js')
        },
        plugins: [
            new ExtractTextPlugin({
                filename: path.posix.join(item, '/css/[name].[contenthash:8].css')
            }),
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, '../dist/' + item + '/index.html'),
                template: app_html_entry,
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
            })
        ]
    });
    console.log(chalk.yellow('\n  正在编译项目「' + item + '」'));
    console.log(chalk.yellow('\n  入口「' + app_entry + '」'));

    webpack(currentWebpackConfig, function (err, stats) {
        if (err) throw err
        // process.stdout.write(stats.toString({
        //         colors: true,
        //         modules: false,
        //         children: false,
        //         chunks: false,
        //         chunkModules: false
        //     }) + '\n\n')
        console.log(chalk.cyan('  项目[' + item + ']编译完成。用时：' + (stats.endTime - stats.startTime) + 'ms\n'))
        if (callback) {
            callback();
        }
    })
    return true;
}

var build = function (items, cb) {
    spinner.start()
    async.eachSeries(items, function (item, callback) {
        buildItem(item, callback);
    }, function (err) {
        spinner.stop();
        if (err) {
            console.log(chalk.red("  错误:" + err));
        } else {
            console.log(chalk.yellow(
                '  提示: 生成的文件只能在HTTP服务器上运行。\n' +
                '  直接打开 index.html 文件无效。\n'
            ))
        }
        spinner.stop();
        if (cb) {
            cb(err);
        }
    })
}

var spinner = ora('正在编译，请稍候...')

async.waterfall([
    function (cb) {
        if (project_name) {
            var del = [
                path.join(config.build.assetsRoot, config.build.assetsSubDirectory, 'assets/projects/' + project_name),
                path.join(config.build.assetsRoot, config.build.assetsSubDirectory, project_name),
                path.join(config.build.assetsRoot, project_name),
            ];
            async.eachSeries(del, function (item, callback) {
                rm(item, err => {
                    callback(err);
                });
            }, function (err) {
                cb(err)
            });
        } else {
            rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
                cb(err);
            });
        }
    },
    function (data, cb) {
        if (project_name) {
            //  单项时
            projects = [project_name];
        }
        build(projects, cb);
    }
], function (err) {
    if (err) {
        console.log(chalk.red(err));
    }
});

// rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
//     if (err) throw err
//     if (game) {
//         //  单项时
//         games = [game];
//     }
//     build(games);
// })
