<template>
  <div class="wms-page-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'WMSPageLayout'
});
</script>

<style scoped>
.wms-page-layout {
  padding: 16px;
  background-color: var(--color-bg-2);
  min-height: calc(100vh - 120px);
}
</style>