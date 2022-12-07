import axios from "axios"
import router from "../router/index"
import {
  getToken,
  getUsername,
  removeToken,
  removeUsername,
} from "../utils/cookies"
console.log("环境变量=====")
console.log(process.env.VUE_APP_API)
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 携带token与用户名
    if (getToken()) {
      config.headers["Token"] = getToken()
    }
    if (getUsername()) {
      config.headers["Username"] = getUsername()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.resCode === 0) {
      return Promise.resolve(data)
    } else {
      ElMessage({ message: data.message, type: "error", duration: 2000 })
      return Promise.reject(data)
    }
  },
  (error) => {
    const errorData = JSON.parse(error.request.response)
    if (errorData.msg) {
      ElMessage({ message: errorData.msg, type: "error", duration: 2000 })
    }
    // token失效，自动退出
    if (errorData.resCode === 1010) {
      router.replace("/login")
      removeToken()
      removeUsername()
    }
    return Promise.reject(errorData)
  }
)

export default service
