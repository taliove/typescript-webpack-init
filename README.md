# typescript-webpack-init

使用typescript+webpack初始化项目集。以创建SPA（单页应用）项目。

## 使用说明

1. 克隆仓库
2. 在根目录下执行`npm intsall`
3. 在目录`src/projects`中新增项目名称，例如`test`，在其目录下创建入口文件：`index.ts`及`index.html`即可
4. 在各自项目目录下，可设置项目资源文件夹`static`，该文件夹在生成项目时，直接拷贝至项目生成根目录

## 命令

执行`npm run build`可进行全部项目（`projects`目录）生成。

执行`npm run build project-name`可进行指定项目生成。

执行`npm run dev project-name`可进行指定项目的热加载开发。

## 项目配置

在项目文件夹下创建文件`config.json`可用于配置生成。

|属性名称|类型|默认值|说明|
|----|----|----|----|
|js-name|string|[name].[chunkhash:8].js|输出js名称|
|css-name|string|[name].[contenthash:8].css|输出css名称|
|port|int|9001|dev端口号|

## 生成目录

所有项目都生成在目录`./dist/`下。

## 感谢

- [vue](https://github.com/vuejs/vue)
- [webpack](https://github.com/webpack/webpack)

enjoy it.