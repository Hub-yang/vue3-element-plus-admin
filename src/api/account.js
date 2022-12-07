import service from "./request"
// 获取验证码接口
export function GetCode(data) {
  return service.request({
    method: "post",
    url: "/getCode/",
    data,
  })
}

// http状态码异常演示接口
export function ErrorHttp(data) {
  return service({
    method: "POST",
    url: "/error/",
    data,
  })
}

// 注册接口
export function Register(data = {}) {
  return service({
    method: "POST",
    url: "/register/",
    data,
  })
}

// 登录接口
export function Login(data = {}) {
  return service({
    method: "POST",
    url: "/login/",
    data,
  })
}

// 退出登录
export function Logout() {
  return service({
    method: "POST",
    url: "/logout/",
  })
}
