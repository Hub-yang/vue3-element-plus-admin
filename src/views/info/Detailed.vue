<template>
  <el-form
    label-width="150px"
    ref="formDom"
    :model="data.field"
    :rules="data.formRules"
  >
    <el-form-item label="信息类别：" prop="categoryId">
      <el-cascader
        clearable
        v-model="data.field.categoryId"
        :options="infoData.categoryOptions"
        :props="infoData.cascaderProps"
      />
    </el-form-item>
    <el-form-item label="信息标题：" prop="title">
      <el-input v-model="data.field.title"></el-input>
    </el-form-item>
    <el-form-item label="缩略图：" prop="imageUrl">
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :on-success="handleOnSuccess"
        :on-error="handleOnError"
        :before-upload="handlerBeforeUpload"
        :http-request="handlerUpload"
      >
        <img
          v-if="data.field.imageUrl"
          :src="data.field.imageUrl"
          class="avatar"
        />
        <el-icon v-else>+</el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="发布日期：" prop="createDate">
      <el-date-picker
        v-model="data.field.createDate"
        type="datetime"
        placeholder="选择日期时间"
      ></el-date-picker>
    </el-form-item>
    <!-- 是否发布 -->
    <el-form-item label="是否发布" prop="status">
      <el-radio-group v-model="data.field.status">
        <el-radio label="1">是</el-radio>
        <el-radio label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="内容：" prop="content">
      <div ref="editor"></div>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" @click="handlerSubmitForm">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import WangEditor from "wangeditor"
import { categoryHook } from "@/hooks/infoHook"
import { uploadFile } from "@/api/common"
import { infoCreate } from "@/api/info"
import { ElMessage } from "element-plus"
import dayjs from "dayjs"

const { go } = useRouter()
const { infoData, handlerGetCategory } = categoryHook()

const editor = ref()
let editorInstance = null
onBeforeMount(() => {
  handlerGetCategory()
})
onMounted(() => {
  editorInstance = new WangEditor(editor.value)
  Object.assign(editorInstance.config, {
    onchange(value) {
      // 保存内容
      data.field.content = value
    },
  })
  editorInstance.create()
})

const formDom = ref(null)
const data = reactive({
  field: {
    categoryId: "",
    title: "",
    imageUrl: "",
    createDate: "",
    status: "1",
    content: "",
  },
  formRules: {
    categoryId: [
      { required: true, message: "分类不能为空", trigger: "change" },
    ],
    title: [{ required: true, message: "标题不能为空", trigger: "change" }],
    imageUrl: [
      { required: true, message: "缩略图不能为空", trigger: "change" },
    ],
    createDate: [
      { required: true, message: "请选择发布日期", trigger: "change" },
    ],
    content: [{ required: true, message: "内容不能为空", trigger: "change" }],
    status: [{ required: true, message: "请选择发布状态", trigger: "change" }],
  },
})

const handleOnSuccess = (response, uploadFile) => {}
const handleOnError = (error, uploadFile) => {}

const handlerBeforeUpload = (file) => {
  // 判断上床文件类型与大小，返回boolean
  const isJPGOrPNG = file.type === ("image/jpeg" || "image/png")
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isJPGOrPNG) {
    ElMessage.error("请上传JPG或PNG格式文件")
    return false
  }
  if (!isLt2M) {
    ElMessage.error("文件大小不能超过2MB!")
    return false
  }
  return isJPGOrPNG && isLt2M
}

const handlerUpload = (params) => {
  // 新建form类型参数
  const form = new FormData()
  form.append("files", params.file)
  // 调用上传接口
  uploadFile(form)
    .then((res) => {
      if (res && res.resCode === 0) {
        data.field.imageUrl = res.data.files_path
      }
    })
    .catch((err) => {
      ElMessage.error(err)
      throw new Error(`uploadFile()接口错误：${err}`)
    })
}

// 提交表单校验
const handlerSubmitForm = () => {
  formDom.value.validate((valid) => {
    if (valid) {
      // 深拷贝表单数据并格式化为入参需求格式
      const requestData = JSON.parse(JSON.stringify(data.field))
      // 格式化创建日期
      requestData.createDate = dayjs(requestData.createDate).format(
        "YYYY-MM-DD HH:mm:ss"
      )
      // 格式化categoryId为字符串
      requestData.categoryId =
        requestData.categoryId[requestData.categoryId.length - 1].toString()

      // 调用添加信息的接口
      infoCreate(requestData)
        .then((res) => {
          ElMessage.success(res.message)
          go(-1)
        })
        .catch((err) => {
          throw new Error(`infoCreate()接口错误:${err}`)
        })
    } else {
      console.log("error submit")
      return false
    }
  })
}
</script>

<style scoped lang="scss"></style>
