<template>
  <!-- 头部区域 -->
  <el-row>
    <el-col :span="18">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="类别：">
          <el-select
            v-model="data.category"
            placeholder="请选择"
            class="width-160"
          >
            <el-option
              v-for="item in data.categoryOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-select placeholder="请选择" class="width-100"></el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入关键字" class="width-180"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger">搜索</el-button>
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
    <el-table-column prop="name" label="标题" width="500" />
    <el-table-column prop="address" label="类别" />
    <el-table-column prop="date" label="日期" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="danger" size="small" @click="handlerDetailed"
          >编辑</el-button
        >
        <el-button size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-row class="margin-top-30">
    <el-col :span="6">
      <el-button>批量删除</el-button>
    </el-col>
    <el-col :span="18">
      <el-pagination
        background
        small
        class="pull-right"
        layout="total,sizes,prev, pager, next,jumper"
        :total="100"
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
const router = useRouter()
const data = reactive({
  category: 0,
  categoryOptions: [
    { label: "人工智能", value: 0 },
    { label: "技术", value: 1 },
  ],
  tableData: [
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
  ],
  currentPage: 1,
})

const handleSelectionChange = (val) => {}

const handlerSizeChange = (val) => {}

const handlerCurrentChange = (val) => {}

const handlerDetailed = () => {
  router.push({ name: "NewsDetailed" })
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
