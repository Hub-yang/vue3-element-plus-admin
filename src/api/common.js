import service from "./request"
// 上传文件接口
export function uploadFile(data = {}) {
  return service.request({
    method: "POST",
    url: "/upload",
    data,
  })
}
