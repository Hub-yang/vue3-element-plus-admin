import { getCategory } from "@/api/info"

export function categoryHook() {
  const infoData = reactive({
    category: 0,
    categoryOptions: [],
    cascaderProps: {
      label: "category_name",
      value: "id",
    },
  })

  // 获取分类列表
  const handlerGetCategory = () => {
    getCategory().then((res) => {
      infoData.categoryOptions = res.data
    })
  }
  return { infoData, handlerGetCategory }
}
