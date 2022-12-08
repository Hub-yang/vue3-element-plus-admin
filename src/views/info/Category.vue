<template>
  <el-button type="danger" @click="handlerCategory('firstCategoryAdd')"
    >添加一级分类</el-button
  >
  <hr class="spacing-hr" />
  <el-row :gutter="20">
    <el-col :span="7">
      <el-tree
        :data="data.treeData"
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
              @click="handlerCategory('childCategoryAdd')"
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
            <el-button round size="small">删除</el-button>
          </span>
        </template>
      </el-tree>
    </el-col>
    <el-col :span="17">
      <h4 class="column">{{ config[config.type].title }}</h4>
      <el-form label-width="140px">
        <el-form-item label="父级分类名称：">
          <el-input
            style="width: 20%"
            v-model="data.parentCategory"
            :disabled="config[config.type].parentDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="子级分类名称：" v-if="config[config.type].subShow">
          <el-input
            style="width: 20%"
            v-model="data.subCategory"
            :disabled="config[config.type].subDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" :loading="data.buttonLoading"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
const data = reactive({
  treeData: [
    {
      label: "Level 1",
      children: [
        {
          label: "Level 1-1",
          children: [
            {
              label: "Level 1-1-1",
            },
          ],
        },
      ],
    },
  ],

  defaultProps: {
    children: "children",
    label: "label",
  },
  // 父级分类名称
  parentCategory: "父级内容演示",
  // 子级分类名称
  subCategory: "子级内容演示",
  // 确定按钮加载状态
  buttonLoading: false,
})

const config = reactive({
  type: "default", //操作类型
  default: {
    title: "分类标题",
    parentDisabled: true,
    subDisabled: true,
    subShow: true,
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
  },
  childCategoryEdit: {
    title: "编辑子级分类",
    parentDisabled: true,
    subDisabled: false,
    subShow: true,
  },
})

const handleNodeClick = (data) => {}

// 添加一级分类
const handlerCategory = (type, nodeData) => {
  config.type = type
  // 删除内容，还原内容
  handlerInputValue()
}

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
      data[item] = "11"
    })
  }
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
