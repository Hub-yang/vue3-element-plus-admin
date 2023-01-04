<template>
  <el-form label-width="150px">
    <el-form-item label="信息类别：">
      <el-cascader
        clearable
        v-model="infoData.category"
        :options="infoData.categoryOptions"
        :props="infoData.cascaderProps"
      />
    </el-form-item>
    <el-form-item label="信息标题：">
      <el-input v-model="data.title"></el-input>
    </el-form-item>
    <el-form-item label="缩略图：">
      <el-upload
        class="avatar-uploader"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="data.imageUrl" :src="data.imageUrl" class="avatar" />
        <el-icon v-else>+</el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="发布日期：">
      <el-date-picker
        v-model="data.date"
        type="datetime"
        placeholder="选择日期时间"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="内容：">
      <div ref="editor"></div>
    </el-form-item>
    <el-form-item>
      <el-button type="danger">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import WangEditor from "wangeditor"
import { categoryHook } from "@/hooks/infoHook"

const { infoData, handlerGetCategory } = categoryHook()

const editor = ref()
let editorInstance = null
onBeforeMount(() => {
  handlerGetCategory()
})
onMounted(() => {
  editorInstance = new WangEditor(editor.value)
  Object.assign(editorInstance.config, {
    onchange() {
      console.log("change")
    },
  })
  editorInstance.create()
})
const data = reactive({
  title: "",
  imageUrl: "",
  date: "",
})

const handleAvatarSuccess = (response, uploadFile) => {}

const beforeAvatarUpload = (rawFile) => {
  // if (rawFile.type !== "image/jpeg") {
  //   ElMessage.error("Avatar picture must be JPG format!")
  //   return false
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   ElMessage.error("Avatar picture size can not exceed 2MB!")
  //   return false
  // }
  // return true
}
</script>

<style scoped lang="scss"></style>
