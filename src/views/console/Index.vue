<template>
  <h1>控制台</h1>
  <svg-icon :icon-name="icon" class-name="aside-menu-svg" />
</template>

<script setup>
const icon = ref("home")
setTimeout(() => {
  icon.value = "user"
}, 2000)
</script>

<style scoped lang="scss">

</style>
