import router from "./index"
import { getToken } from "../utils/cookies"
// 全局前置守卫
router.beforeEach((to, from) => {
  if (!getToken()) {
    if (to.name !== "Login") {
      return {
        name: "Login",
      }
    }
  }
})
// 全局后置守卫
router.afterEach((to, from) => {})
