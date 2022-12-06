<template>
  <el-menu router default-active="/console" background-color="#344a5f" text-color="#fff" active-text-color="#ffd04b">
    <template v-for="router in routers" :key="router.path">
      <template v-if="!router.hidden">
        <!-- 一级菜单没有children -->
        <el-menu-item v-if="hasOnlyChild(router.children)" :index="router.children[0].path">
          <template #title>{{ (router.children[0].meta && router.children[0].meta.title) }}</template>
        </el-menu-item>
        <!-- 子级菜单 -->
        <el-sub-menu v-else :index="router.path">
          <template #title>{{ (router.meta && router.meta.title) }}</template>
          <template v-for="child in router.children" :key="child.path">
            <el-menu-item v-if="!child.hidden" :index="child.path">{{ child.meta && child.meta.title }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>

</template>

<script setup>
const { options } = useRouter()
const routers = options.routes

// 扁平单个子级菜单
const hasOnlyChild = (children) => {
  // 不存在子路由
  if (!children) {
    return false
  }
  // 过滤掉hidden为true的路由进行后续判断
  const childRouter = children.filter(item => item.hidden ? false : true)
  // 只有一个路由
  if (childRouter.length === 1) {
    return true
  } else {
    return false
  }

}
</script>

<style scoped lang="scss">

</style>
