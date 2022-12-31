import service from "./request"

// 添加父级分类接口
export function firstCategoryAdd(data = {}) {
  return service({
    method: "POST",
    url: "/news/addFirstCategory/",
    data,
  })
}

// 获取分类列表接口
export function getCategory(data = {}) {
  return service({
    method: "POST",
    url: "/news/getCategoryAll/",
    data,
  })
}

// 添加子级分类接口
export function childCategoryAdd(data = {}) {
  return service({
    method: "POST",
    url: "/news/addFirstCategory/",
    data,
  })
}

// 编辑分类接口
export function categoryEdit(data = {}) {
  return service({
    method: "POST",
    url: "/news/editCategory/",
    data,
  })
}

// 删除分类接口
export function categoryDel(data = {}) {
  return service({
    method: "POST",
    url: "/news/deleteCategory/",
    data,
  })
}
