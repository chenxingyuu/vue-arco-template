<script setup lang="ts">
  import MenuManager from '@/views/system/menu/components/menu-manager.vue';
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />
    <div class="layout">
      <MenuManager> </MenuManager>
    </div>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
