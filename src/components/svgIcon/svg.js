// 获取当前svg目录所有以.svg为后缀的文件
const context = require.context("./icon", false, /\.svg$/)

// 解析获取到的svg文件的名称并返回
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext)
}

// 执行
requireAll(context)
