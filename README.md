bug 指南
1:复现：vueconfigjs 中配置自动导入 scss，其中导入全局样式文件 normailze.scss，在文件中设置 scope 时不生效；------>解决方案：全局样式在 main.js 中导入，全局变量在 main.scss 中配置

2:报错：![image-20221205160149204](/Users/shuai/Library/Application Support/typora-user-images/image-20221205160149204.png)

报错，原因是由于在webpack5中移除了nodejs核心模块的polyfill自动引入，所以需要手动引入

解决方案：

安装 npm install [node](https://so.csdn.net/so/search?q=node&spm=1001.2101.3001.7020)-polyfill-webpack-plugin

在vue.config.json中添加：

```js
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

configureWebpack: {
	plugins: [new NodePolyfillPlugin()]
}
```

### 疑问：P68 删除重复动作

### 1.初始化项目即仓库

#### 1-1.创建 feature-config 分支，初始化项目

#### 1-2.配置 vue.config.js√

#### 1-3.新建 styles 目录，新建 main.js 文件，加载到项目中全局使用（vue.config.js），这里注意配置时根据 sass-loader 版本不同的属性名

#### 1-4.删除浏览器默认样式 √

 **normalize.scss 并导入到 main.scss**

#### 1-5.安装 element-plus，配置按需自动导入

```js
configureWebpack: (config) => {
  config.plugins.push(
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  )
},
```

#### 1-6.合并分支

### 2.登录注册业务

#### 2-1.创建 feature-account 分支，开发登录注册**业务**

-  **密码加密第三方包：sha1、md5、base64**

- **处理cookies包：js-cookie**
- **关闭elementplus校验规则控制台警告**
  - node_modules----element-plus----es----utils----vue----error.mjs，将console.warn(error)注释
