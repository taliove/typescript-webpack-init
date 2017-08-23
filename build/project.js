var path = require('path')
var fs = require('fs')
var chalk = require('chalk')
var utils = require("./utils")

var default_config = {
    "js-name": "[name].[chunkhash:8].js",
    "css-name": "[name].[contenthash:8].css",
    "port": 9001
};

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

exports.project_name = project_name;
exports.projects = projects;

/**
 * 获取单个项目的配置
 */
exports.get_config = function (pname) {
    var item = pname || project_name;
    if (!project_name) {
        return default_config;
    }
    var app_dir = "../src/projects/" + item;
    var app_config_entry = path.resolve(__dirname, app_dir + '/config.json');
    app_config = default_config;
    if (fs.existsSync(app_config_entry)) {
        console.log(chalk.white('\n  项目「' + item + '」使用配置文件。'));
        app_config = utils.extend(true, default_config, require(app_config_entry));
    }
    return app_config;
}

/**
 * 获取原始的资源路径
 */
exports.get_static_path = function (pname) {
    var item = pname || project_name;
    return path.resolve(__dirname, '../src/projects/' + item + '/static');
}