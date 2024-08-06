<script setup lang="ts">
  import PermissionManager from '@/views/system/permission/components/permission-manager.vue';
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.permission']" />
    <div class="layout">
      <PermissionManager> </PermissionManager>
    </div>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
