<template>
  <div class="container">
    Hello
    <el-button>click</el-button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
}
</script>
<style scoped lang="scss">
.container {
  // vue3深度选择器
  :deep(.el-button) {
    background-color: skyblue;
  }
}
// 组件中定义全局样式
:global(body) {
  background-color: skyblue;
}
</style>
