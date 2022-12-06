<template>
  <el-container id="layout-container">
    <el-aside id="layout-aside" width="250px">
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
</script>

<style scoped lang="scss">
#layout-container {
  height: 100vh;
}

#layout-aside {
  background-color: #344a5f;
}

#layout-header {
  background-color: #77bc99;
}

#layout-main {
  background-color: #bc77a1;
}
</style>
