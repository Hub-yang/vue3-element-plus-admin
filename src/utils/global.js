const globalFunction = {}
globalFunction.deleteConfirm = (params) => {
  ElMessageBox.confirm(
    params.message || "确认删除当前数据吗?删除之后无法恢复",
    params.title || "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      showClose: false,
      closeOnClickModal: false,
      type: "warning",
      beforeClose(action, instance, done) {
        if (action === "confirm") {
          // 判断thenFun并执行
          const isFunction =
            params.thenFun && params.thenFun instanceof Function
          instance.confirmButtonLoading = isFunction
          isFunction &&
            params
              .thenFun()
              .then(() => {
                instance.confirmButtonLoading = false
                done()
              })
              .catch(() => {
                instance.confirmButtonLoading = false
              })
        } else {
          done()
        }
      },
    }
  )
    .then(() => {})
    .catch(() => {})
}

globalFunction.message = (params) => {
  console.log(params)
}

export default {
  install(app) {
    // 注册全局方法
    app.config.globalProperties["deleteConfirm"] = globalFunction.deleteConfirm
    app.config.globalProperties["message"] = globalFunction.message
  },
}
