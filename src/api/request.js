import axios from "axios"
console.log(process.env.VUE_APP_API)
const service = axios.create({
  baseURL: "/devApi",
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
