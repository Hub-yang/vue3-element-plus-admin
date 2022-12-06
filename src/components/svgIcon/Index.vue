<template>
  <svg :class="['svg_class', className]">
    <use :href="svgIcon"></use>
  </svg>
</template>

<script setup>
const props = defineProps({
  iconName: {
    type: String,
    default: "",
  },
  className: {
    type: String,
    default: ""
  }
})

const svgIcon = computed(() => `#icon-${props.iconName}`)

</script>

<style scoped lang="scss">
.svg_class {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
