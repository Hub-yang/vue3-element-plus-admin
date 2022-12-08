<template>
  <!-- logo -->
  <h1 class="logo"><img :src="data.logo" alt="logo" /></h1>
  <!-- 导航 -->
  <el-menu
    :collapse="data.collapse"
    router
    :default-active="currentPath"
    background-color="#344a5f"
    text-color="#fff"
    active-text-color="#fff"
  >
    <template v-for="router in routers" :key="router.path">
      <template v-if="!router.hidden">
        <!-- 一级菜单 -->
        <el-menu-item
          v-if="hasOnlyChild(router.children)"
          :index="router.children[0].path"
        >
          <svg-icon
            :icon-name="router.meta && router.meta.icon"
            class-name="aside-menu-svg"
          />
          <template #title>{{
            router.children[0].meta && router.children[0].meta.title
          }}</template>
        </el-menu-item>
        <!-- 子级菜单 -->
        <el-sub-menu v-else :index="router.path">
          <template #title>
            <svg-icon
              :icon-name="router.meta && router.meta.icon"
              class-name="aside-menu-svg"
            />
            <span>{{ router.meta && router.meta.title }}</span>
          </template>
          <template v-for="child in router.children" :key="child.path">
            <el-menu-item v-if="!child.hidden" :index="child.path">{{
              child.meta && child.meta.title
            }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<script setup>
const { options } = useRouter()
const { state } = useStore()
const { path } = useRoute()
const routers = options.routes

const data = reactive({
  logo: computed(() =>
    state.app.collapse
      ? require("@/assets/images/logo-min.png")
      : require("@/assets/images/logo.png")
  ),
  collapse: computed(() => state.app.collapse),
})

// 扁平单个子级菜单
const hasOnlyChild = (children) => {
  // 不存在子路由
  if (!children) {
    return false
  }
  // 过滤掉hidden为true的路由进行后续判断
  const childRouter = children.filter((item) => (item.hidden ? false : true))
  // 只有一个路由
  if (childRouter.length === 1) {
    return true
  } else {
    return false
  }
}

// 监听路由变化，绑定default-active，解决刷新页面高亮丢失
const currentPath = computed(() => path)
</script>

<style scoped lang="scss">
.logo {
  padding: 20px 0;
  border-bottom: 1px solid #2d4153;

  img {
    margin: auto;
  }
}
</style>
