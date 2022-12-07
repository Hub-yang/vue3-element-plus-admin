<template>
  <el-container id="layout-container">
    <el-aside id="layout-aside" :width="collapse ? '60px' : '250px'">
      <LayoutAside />
    </el-aside>
    <el-container>
      <el-header id="layout-header" height="75px">
        <LayoutHeader />
      </el-header>
      <el-main id="layout-main">
        <LayoutMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import LayoutAside from "./components/Aside.vue"
import LayoutMain from "./components/Main.vue"
import LayoutHeader from "./components/Headerd.vue"

const { state } = useStore()
const collapse = computed(() => state.app.collapse)
</script>

<style scoped lang="scss">
#layout-container {
  height: 100vh;
}

#layout-aside {
  background-color: #344a5f;
  @include webkit(transition, all .3s ease 0s);
}

#layout-header {
  background-color: $color_white;
  position: relative;
  z-index: 10;
  // 兼容性处理
  @include webkit(box-shadow, 0 0 20px 0 rgba(0, 0, 0, .1));
}

#layout-main {
  background-color: #f7f7f7;
}
</style>
