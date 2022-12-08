<template>
  <div class="main_content">
    <router-view />
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.main_content {
  background-color: #fff;
  padding: 20px;
  min-height: 100%;
  @include webkit(box-sizing, border-box);
}
</style>
