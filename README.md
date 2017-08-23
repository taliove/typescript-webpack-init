# typescript-webpack-init

使用typescript+webpack初始化项目集。以创建SPA（单页应用）项目。

## 使用说明

在目录`src/projects`中新增项目名称，例如`test`，在其目录下创建入口文件：`index.ts`及`index.html`即可

## 命令

执行`npm run build`可进行全部项目（`projects`目录）生成。

执行`npm run build project-name`可进行指定项目生成。

执行`npm run dev project-name`可进行指定项目的热加载开发。

## 生成目录

所有项目都生成在目录`./dist/`下。

enjoy it.