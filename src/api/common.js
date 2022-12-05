import service from "./request"
// 获取验证码接口
export function GetCode(data) {
  return service.request({
    method: "post",
    url: "/getCode/",
    data,
  })
}
