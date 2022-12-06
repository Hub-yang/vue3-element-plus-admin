import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
// 引入全局样式
import "./styles/normalize.scss"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import SvgIcon from "./components/svgIcon/Index.vue"
// 批量导入.svg文件
import "./components/svgIcon/svg"

const app = createApp(App)
// 全局注册icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 注册全局svg组件
app.component("svg-icon", SvgIcon)

app.use(store).use(router).mount("#app")
