<template>
  <!-- 头部区域 -->
  <el-row>
    <el-col :span="18">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="类别：">
          <el-cascader
            clearable
            v-model="requestData.categoryId"
            :options="categoryData.categoryOptions"
            :props="data.cascaderProps"
          />
        </el-form-item>
        <el-form-item label="关键字：">
          <el-select
            placeholder="请选择"
            v-model="requestData.key"
            class="width-100"
          >
            <el-option
              v-for="item in data.keywordsOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="请输入关键字"
            v-model.trim="requestData.keyword"
            class="width-180"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handlerGetList">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="6">
      <router-link to="/newsDetailed" class="pull-right">
        <el-button type="danger">新增</el-button>
      </router-link>
    </el-col>
  </el-row>
  <!-- 表格区域 -->
  <el-table
    ref="table"
    :data="data.tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column prop="title" label="标题" width="300" />
    <el-table-column prop="category_name" label="类别" />
    <el-table-column prop="createDate" label="日期" :formatter="formatDate" />
    <el-table-column prop="status" label="发布状态">
      <template #default="scope">
        <el-switch
          v-model="scope.row.status"
          :loading="scope.row.loading"
          @change="changeStatus($event, scope.row)"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="danger" size="small" @click="handlerDetailed"
          >编辑</el-button
        >
        <el-button size="small" @click="handlerDeleteConfirm(scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-row class="margin-top-30">
    <el-col :span="6">
      <el-button
        :disabled="!data.rowDataId"
        @click="handlerDeleteConfirm(data.rowDataId)"
        >批量删除</el-button
      >
    </el-col>
    <el-col :span="18">
      <el-pagination
        background
        small
        class="pull-right"
        layout="total,sizes,prev, pager, next,jumper"
        :total="data.total"
        :current-page="data.currentPage"
        :page-size="10"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handlerSizeChange"
        @current-change="handlerCurrentChange"
      />
    </el-col>
  </el-row>
</template>

<script setup>
import { getTableList, updateStatus, deleteInfo } from "@/api/info"
import { getData } from "@/utils/common"
import { categoryHook } from "@/hooks/infoHook"
import dayjs from "dayjs"
const router = useRouter()
const { proxy } = getCurrentInstance()
const { infoData: categoryData, handlerGetCategory: getList } = categoryHook()

// 接口参数
const requestData = reactive({
  pageNumber: 1,
  pageSize: 10,
  categoryId: [],
  key: "",
  keyword: "",
})

onBeforeMount(() => {
  handlerGetList()
  getList()
})

const data = reactive({
  cascaderProps: {
    label: "category_name",
    value: "id",
  },
  keywordsOptions: [
    { label: "ID", value: "id" },
    { label: "标题", value: "title" },
  ],
  tableData: [],
  currentPage: 1,
  total: 0,
  rowDataId: "",
})

const handleSelectionChange = (val) => {
  if (val && val.length) {
    const idItem = val.map((item) => item.id.toString())
    // 保存选中项id
    data.rowDataId = idItem.join()
  } else {
    data.rowDataId = ""
  }
}

const handlerSizeChange = (val) => {
  requestData.pageSize = val
  requestData.pageNumber = 1
  handlerGetList()
}

const handlerCurrentChange = (val) => {
  requestData.pageNumber = val
  handlerGetList()
}

const handlerDetailed = () => {
  router.push({ name: "NewsDetailed" })
}

const handlerGetList = () => {
  // 获取请求参数
  const request_data = formatParams()
  // 获取信息列表
  getTableList(request_data)
    .then((res) => {
      // console.log(res)
      const resData = res.data
      data.tableData = resData.data
      data.total = resData.total
    })
    .catch((err) => {
      throw new Error(`getTableList()接口错误：${err}`)
    })
}

// 格式化请求参数
const formatParams = () => {
  // 浅拷贝
  const data = Object.assign({}, requestData)
  // 处理categoryId
  if (data.categoryId.length) {
    data.categoryId = data.categoryId[data.categoryId.length - 1]
  } else {
    delete data.categoryId
  }
  // 处理key
  if (data.key && data.keyword) {
    data[data.key] = data.keyword
  }
  // 删除字段
  delete data.key
  delete data.keyword
  return data
}

// 日期格式化
const formatDate = (row) => {
  return getData({ value: row.createDate * 1000 })
  // 或
  // return dayjs(row.createDate * 1000).format("YYYY-MM-DD HH:mm:ss")
}

// 状态更新
const changeStatus = (value, data) => {
  // 加载
  data.loading = true
  data.status = !data.status
  updateStatus({ id: data.id, status: value })
    .then((res) => {
      ElMessage({ type: "success", message: res.message, duration: 800 })
      data.status = value
      data.loading = false
    })
    .catch((err) => {
      data.loading = false
      throw new Error(`updateStatus()接口错误:${err}`)
    })
}

// 删除条目
const handlerDeleteConfirm = (id) => {
  proxy.deleteConfirm({
    title: "删除",
    message: "确认删除当前数据？",
    thenFun: () => {
      return handlerDelete(id)
    },
  })
}

const handlerDelete = (id) => {
  // 调用删除条目接口
  return new Promise((resolve, reject) => {
    deleteInfo({ id })
      .then((res) => {
        ElMessage.success(res.message)
        data.rowDataId = ""
        handlerGetList()
        resolve()
      })
      .catch((err) => {
        reject()
        throw new Error("categoryDel():接口报错" + err)
      })
  })
}
</script>

<style scoped lang="scss">
.width-160 {
  width: 160px;
}

.width-100 {
  width: 100px;
}

.width-180 {
  width: 180px;
}

.el-form--inline .el-form-item {
  margin-right: 15px;
}
</style>
