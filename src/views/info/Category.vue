<template>
  <el-button type="danger" @click="handlerCategory('firstCategoryAdd')"
    >添加一级分类</el-button
  >
  <hr class="spacing-hr" />
  <el-row :gutter="20">
    <el-col :span="10">
      <el-tree
        node-key="id"
        ref="categoryTree"
        :data="treeData.categoryOptions"
        :props="data.defaultProps"
        @node-click="handleNodeClick"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="danger"
              round
              size="small"
              @click="handlerCategory('childCategoryAdd', node)"
              >添加子级</el-button
            >
            <el-button
              type="success"
              round
              size="small"
              @click="
                handlerCategory(
                  node.level === 1 ? 'parentCategoryEdit' : 'childCategoryEdit',
                  node
                )
              "
              >编辑</el-button
            >
            <el-button
              round
              size="small"
              @click="handlerCategory('deleteCategory', node)"
              >删除</el-button
            >
          </span>
        </template>
      </el-tree>
    </el-col>
    <el-col :span="14">
      <h4 class="column">{{ config[config.type].title }}</h4>
      <el-form label-width="140px">
        <el-form-item label="父级分类名称：">
          <el-input
            style="width: 20%"
            v-model.trim="data.parentCategory"
            :disabled="config[config.type].parentDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="子级分类名称：" v-if="config[config.type].subShow">
          <el-input
            style="width: 20%"
            v-model.trim="data.subCategory"
            :disabled="config[config.type].subDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            :loading="data.buttonLoading"
            @click="handlerSubmit"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  firstCategoryAdd,
  childCategoryAdd,
  categoryEdit,
  categoryDel,
} from "@/api/info"
import { ElMessage, ElMessageBox } from "element-plus"
import { categoryHook } from "@/hooks/infoHook"
const { infoData: treeData, handlerGetCategory } = categoryHook()

onBeforeMount(() => {
  // 获取分类列表
  handlerGetCategory()
})

const data = reactive({
  defaultProps: {
    children: "children",
    label: "category_name",
  },
  // 父级分类名称
  parentCategory: "父级内容演示",
  // 子级分类名称
  subCategory: "子级内容演示",
  // 确定按钮加载状态
  buttonLoading: false,
  // 添加/编辑子级时存储的父级信息
  parentCategoryData: null,
  // 编辑子级时存储的子级信息
  subCategoryData: null,
})

const config = reactive({
  type: "default", //操作类型
  default: {
    title: "分类标题",
    parentDisabled: true,
    subDisabled: true,
    subShow: true,
    clear: ["parentCategory", "subCategory"],
  },
  firstCategoryAdd: {
    title: "添加父级分类",
    parentDisabled: false,
    subDisabled: true,
    subShow: false,
    clear: ["parentCategory", "subCategory"],
  },
  childCategoryAdd: {
    title: "添加子级分类",
    parentDisabled: true,
    subDisabled: false,
    subShow: true,
    clear: ["subCategory"],
    create: ["parentCategory"],
  },
  parentCategoryEdit: {
    title: "编辑父级分类",
    parentDisabled: false,
    subDisabled: true,
    subShow: false,
    create: ["parentCategory"],
  },
  childCategoryEdit: {
    title: "编辑子级分类",
    parentDisabled: true,
    subDisabled: false,
    subShow: true,
    create: ["parentCategory", "subCategory"],
  },
})

const handleNodeClick = (data) => {}

const categoryTree = ref(null)
// 添加一级分类
const handlerCategory = (type, nodeData) => {
  config.type = type === "deleteCategory" ? "default" : type
  // 判断操作类型
  if (type === "childCategoryEdit") {
    // 保存子级信息
    data.subCategoryData = nodeData || null
    data.parentCategoryData = nodeData.parent || null
  } else {
    // 添加子级时保存父级信息
    data.parentCategoryData = nodeData || null
  }

  // 删除分类
  type === "deleteCategory" && handlerDeleteConfirm()
  // 删除内容，还原内容
  handlerInputValue()
}

// 删除还原文本框内容
const handlerInputValue = () => {
  // 获取删除数据的对象
  const clearObject = config[config.type].clear
  if (clearObject && clearObject.length > 0) {
    clearObject.forEach((item) => {
      data[item] = ""
    })
  }
  // 获取还原数据的对象
  const createObject = config[config.type].create
  if (createObject && createObject.length > 0) {
    createObject.forEach((item) => {
      // 还原为保存的信息
      data[item] = data[`${item}Data`].data.category_name
    })
  }
}

const handlerSubmit = () => {
  // 判断操作
  if (config.type === "firstCategoryAdd") {
    handlerFirstCategoryAdd()
  }
  if (config.type === "childCategoryAdd") {
    handlerChildCategoryAdd()
  }
  if (
    config.type === "childCategoryEdit" ||
    config.type === "parentCategoryEdit"
  ) {
    handlerCategoryEdit()
  }
}

// 添加父级分类
const handlerFirstCategoryAdd = () => {
  // 内容为空时提示
  if (!data.parentCategory) {
    ElMessage.error("父级分类名称不能为空")
    return false
  }
  // 按钮加载状态
  data.buttonLoading = true
  // 执行接口
  firstCategoryAdd({ categoryName: data.parentCategory }).then(
    (res) => {
      data.buttonLoading = false
      ElMessage({ message: res.message, type: "success", duration: 2000 })
      data.parentCategory = ""
      // 追加新增数据，刷新视图
      categoryTree.value.append(res.data)
    },
    (err) => {
      data.buttonLoading = false
      throw new Error("handlerFirstCategoryAdd():接口报错" + err)
    }
  )
}

// 添加子级分类
const handlerChildCategoryAdd = () => {
  if (!data.subCategory) {
    ElMessage.error("子级分类名称不能为空")
    return false
  }
  data.buttonLoading = true
  // 请求接口
  childCategoryAdd({
    categoryName: data.subCategory,
    parentId: data.parentCategoryData.data.id,
  }).then(
    (res) => {
      data.buttonLoading = false
      ElMessage({ message: res.message, type: "success", duration: 2000 })
      data.subCategory = ""
      // 追加新增数据，刷新视图
      categoryTree.value.append(res.data, data.parentCategoryData)
    },
    (err) => {
      data.buttonLoading = false
      throw new Error("handlerFirstCategoryAdd():接口报错" + err)
    }
  )
}

// 编辑分类
const handlerCategoryEdit = () => {
  if (!data.subCategory || !data.parentCategory) {
    const message = config.type === "parentCategoryEdit" ? "父级" : "子级"
    ElMessage.error(message + "分类不能为空")
    return false
  }
  // 拿到存储的节点信息
  const nodeParent = data.parentCategoryData
    ? data.parentCategoryData.data
    : null
  const nodeSub = data.subCategoryData ? data.subCategoryData.data : null

  // 判断编辑内容
  if (
    config.type === "parentCategoryEdit" &&
    nodeParent.category_name == data.parentCategory
  ) {
    ElMessage.warning("请输入新的分类名称")
    return false
  }
  if (
    config.type === "childCategoryEdit" &&
    nodeSub.category_name == data.subCategory
  ) {
    ElMessage.warning("请输入新的分类名称")
    return false
  }

  data.buttonLoading = true
  // 请求接口
  categoryEdit({
    categoryName:
      config.type === "parentCategoryEdit"
        ? data.parentCategory
        : data.subCategory,
    id: config.type === "parentCategoryEdit" ? nodeParent.id : nodeSub.id,
  }).then(
    (res) => {
      data.buttonLoading = false
      ElMessage({ message: res.message, type: "success", duration: 2000 })
      // 同步更新
      const nodeData =
        config.type === "parentCategoryEdit" ? nodeParent : nodeSub
      nodeData.category_name = res.data.category_name
    },
    (err) => {
      data.buttonLoading = false
      throw new Error("categoryEdit():接口报错" + err)
    }
  )
  // 强制刷新
  window.location.reload()
}

// 删除分类
const handlerDeleteConfirm = () => {
  ElMessageBox.confirm("确认删除该分类吗，删除后无法恢复", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    showClose: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "warning",
    beforeClose(action, instance, done) {
      if (action === "confirm") {
        // 加载状态
        instance.confirmButtonLoading = true
        // 调用删除分类接口
        categoryDel({ categoryId: data.parentCategoryData.data.id })
          .then((res) => {
            ElMessage.success(res.message)
            instance.confirmButtonLoading = false
            done()
            // 删除节点，同步更新
            categoryTree.value.remove(data.parentCategoryData)
            // 强制刷新
            window.location.reload()
          })
          .catch((err) => {
            instance.confirmButtonLoading = false
            done()
            throw new Error("categoryDel():接口报错" + err)
          })
      } else {
        done()
      }
    },
  })
}
</script>

<style scoped lang="scss">
.spacing-hr {
  border: none;
  border-top: 1px solid #e9e9e9;
  margin: 30px 0;
}

:deep(.el-tree-node__label) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  flex: 1 1 0%;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding-right: 0;

  button {
    padding: 6px 12px;
    margin: 8px 3px;
    font-size: 12px;
    height: auto;
  }
}

.column {
  height: 44px;
  padding: 0 20px;
  margin-bottom: 30px;
  line-height: 44px;
  border-radius: 6px;
  background-color: #f3f3f3;
}
</style>
