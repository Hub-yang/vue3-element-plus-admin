const path = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const AutoImport = require("unplugin-auto-import/webpack")
const Components = require("unplugin-vue-components/webpack")
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers")

function resolve(dir) {
  return path.join(__dirname, dir)
}
// 自动导入elementPlus：组件+样式
const ElementPlus = require("unplugin-element-plus/webpack")
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "./",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  /** vue3.0内置了webpack所有东西，
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    // 解析svg图标文件为symbol
    // //cli 4.x写法
    const svgRule = config.module.rule("svg") // 将默认规则赋值给subRule变量
    svgRule.uses.clear() //删除已有的所有规则
    // // 添加要替换的规则
    // svgRule
    //   .use("svg-sprite-loader") //注册包
    //   .loader("svg-sprite-loader") //载入包
    //   .options({
    //     symbolId: "icon-[name]", //定义symbol元素id
    //     include: ["./src/components/svgIcon/icon"],
    //   })

    // cli5.x写法
    config.module
      .rule("svg")
      .exclude.add(resolve("./src/components/svgIcon/icon"))
      .end()
    config.module
      .rule("icons")
      .test(/.svg$/)
      .include.add(resolve("./src/components/svgIcon/icon"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end()
  },
  configureWebpack: (config) => {
    config.plugins.push(
      new NodePolyfillPlugin(),
      AutoImport({
        imports: ["vue", "vue-router"],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({})
    )
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/styles/main.scss";`,
      },
    },
    // requireModuleExtension: true,
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      [process.env.VUE_APP_API]: {
        target: process.env.VUE_APP_DEV_TARGET,
        changeOrigin: true,
        ws: false,
        secure: false,
        pathRewrite: {
          [`^${process.env.VUE_APP_API}`]: "",
        },
      },
    },
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {},
}
